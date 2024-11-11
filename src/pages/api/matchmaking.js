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

// Single promise to handle model loading
let modelPromise = null;

async function getModel() {
  if (!modelPromise) {
    // Only create the promise once
    modelPromise = use.load();
  }
  return modelPromise;
}

// Pre-warm the model when the API route is first loaded
async function prewarmModel() {
  console.log("Pre-warming Universal Sentence Encoder...");
  await getModel();
  console.log("Model ready");
}

// Call this immediately
prewarmModel().catch(console.error);

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

  let preparedUserData = null;
  try {
    const { userId, eventId } = req.body;
    console.log("Received request for userId:", userId, "eventId:", eventId);

    // Fetch user data and interests from Supabase
    const usersData = await Promise.all(
      (
        await supabase
          .from("User_Events")
          .select("user_id")
          .eq("event_id", eventId)
      ).data.map((user) => fetchUserDataAndInterests(supabase, user.user_id))
    );

    // Filter out null values and prepare data
    const validUsersData = usersData.filter(Boolean);
    if (validUsersData.length === 0) {
      return res
        .status(404)
        .json({ error: "No valid users found for this event" });
    }

    preparedUserData = prepareUserDataForMatchmaking(validUsersData);
    const topMatches = await findTopMatches(userId, preparedUserData);
    const top3Matches = topMatches.slice(0, 3);

    return res.status(200).json({ matches: topMatches, top3Matches });
  } catch (error) {
    console.error("Error in handleMatchmaking:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    // Clean up any remaining tensors
    tf.engine().startScope();
    tf.engine().endScope();
  }
}

function prepareUserText(user) {
  const icebreakerResponses =
    user.icebreaker_responses
      ?.filter((r) => r.answer)
      .map((r) => r.answer)
      .join(" ") || "";

  const interests = user.interests.join(" ");
  const bio = user.bio || "";

  return `${bio} | ${icebreakerResponses} | ${interests}`;
}

async function findTopMatches(userId, userData) {
  const BATCH_SIZE = 50;
  const validUserData = userData.filter((user) => user && user.user_id);
  const userIndex = validUserData.findIndex((user) => user.user_id === userId);

  if (userIndex === -1) return [];

  const model = await getModel();
  const currentUserText = prepareUserText(validUserData[userIndex]);
  const currentUserEmbedding = await model.embed([currentUserText]);

  let allSimilarities = [];

  // Process in batches
  for (let i = 0; i < validUserData.length; i += BATCH_SIZE) {
    const batch = validUserData.slice(i, i + BATCH_SIZE);
    const batchTexts = batch.map(prepareUserText);
    const batchEmbeddings = await model.embed(batchTexts);

    const similarities = tf.tidy(() => {
      return tf
        .matMul(batchEmbeddings, currentUserEmbedding.transpose())
        .squeeze();
    });

    const batchScores = await similarities.array();
    allSimilarities.push(
      ...batchScores.map((score, idx) => ({
        userId: batch[idx].user_id,
        score,
      }))
    );

    // Clean up tensors
    batchEmbeddings.dispose();
    similarities.dispose();
  }

  // Clean up
  currentUserEmbedding.dispose();

  // Sort and return top matches
  return allSimilarities
    .sort((a, b) => b.score - a.score)
    .filter((match) => match.userId !== userId)
    .map((match) => match.userId);
}
