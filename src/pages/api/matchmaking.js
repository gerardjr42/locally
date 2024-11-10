import { createClient } from "@supabase/supabase-js";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as tf from "@tensorflow/tfjs";
import {
  fetchUserDataAndInterests,
  prepareUserDataForMatchmaking,
} from "../../lib/utils.js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  maxDuration: 60, // Set to 60 seconds for Pro plan
};

let cachedModel = null;

async function getModel() {
  if (!cachedModel) {
    cachedModel = await use.load();
  }
  return cachedModel;
}

export default async function handler(req, res) {
  // Add timeout handling
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Function execution timed out"));
    }, 55000); // Set slightly below maxDuration to ensure clean response
  });

  try {
    const result = await Promise.race([
      handleMatchmaking(req, res),
      timeoutPromise,
    ]);
    return result;
  } catch (error) {
    console.error("Matchmaking error:", error);
    res
      .status(error.message === "Function execution timed out" ? 504 : 500)
      .json({ error: error.message });
  }
}

async function handleMatchmaking(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, eventId } = req.body;
  console.log("Received request for userId:", userId, "eventId:", eventId);

  // Fetch all user IDs first
  const { data: userEventData, error: userEventError } = await supabase
    .from("User_Events")
    .select("user_id")
    .eq("event_id", eventId);

  if (userEventError) {
    console.error("Error fetching user events:", userEventError);
    return res.status(500).json({ error: "Error fetching user events" });
  }

  // Get all user IDs
  const userIds = userEventData.map((user) => user.user_id);

  // Fetch user data and interests in a single query
  const usersData = await fetchUserDataAndInterests(supabase, userIds);
  console.log("Fetched user data:", usersData);

  // Filter out null values from usersData
  const validUsersData = usersData.filter(Boolean);

  if (validUsersData.length === 0) {
    return res
      .status(404)
      .json({ error: "No valid users found for this event" });
  }

  // Prepare user data for the matchmaking algorithm
  const preparedUserData = prepareUserDataForMatchmaking(validUsersData);
  console.log("Prepared user data:", preparedUserData);

  // Perform matchmaking using TensorFlow.js
  const topMatches = await findTopMatches(userId, preparedUserData);
  const top3Matches = topMatches.slice(0, 3);
  console.log("Top 3 matches:", top3Matches);

  res.status(200).json({ matches: topMatches, top3Matches: top3Matches });
}

async function findTopMatches(userId, userData) {
  const validUserData = userData.filter((user) => user && user.user_id);
  const userIndex = validUserData.findIndex((user) => user.user_id === userId);

  if (userIndex === -1) return [];

  // Use cached model
  const model = await getModel();

  // Prepare text data for each user
  const userTexts = validUserData.map((user) => {
    const icebreakerResponses =
      user.icebreaker_responses
        ?.filter((r) => r.answer)
        .map((r) => r.answer)
        .join(" ") || "";

    const interests = user.interests.join(" ");
    const bio = user.bio || "";

    // Equal weighting for all three components
    return `${bio} | ${icebreakerResponses} | ${interests}`;
  });

  // Encode all user texts
  const embeddings = await model.embed(userTexts);

  // Calculate cosine similarity between the current user and all other users
  const userEmbedding = embeddings.slice([userIndex, 0], [1, -1]);
  const similarities = tf
    .matMul(embeddings, userEmbedding.transpose())
    .squeeze();

  // Get top matches
  const topIndices = await tf
    .topk(similarities, validUserData.length)
    .indices.array();

  // Clean up tensors
  embeddings.dispose();
  userEmbedding.dispose();
  similarities.dispose();

  return topIndices
    .filter((index) => index !== userIndex)
    .map((index) => validUserData[index].user_id);
}
