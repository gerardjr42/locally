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

// Cache for the USE model
let modelCache = null;

async function getModel() {
  if (!modelCache) {
    modelCache = await use.load();
  }
  return modelCache;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
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

      // Filter out null values from usersData
      const validUsersData = usersData.filter(Boolean);

      if (validUsersData.length === 0) {
        return res
          .status(404)
          .json({ error: "No valid users found for this event" });
      }

      // Prepare user data for the matchmaking algorithm
      const preparedUserData = prepareUserDataForMatchmaking(validUsersData);

      try {
        // Get cached model
        const model = await getModel();

        // Perform matchmaking using TensorFlow.js
        const topMatches = await findTopMatches(
          userId,
          preparedUserData,
          model
        );
        const top3Matches = topMatches.slice(0, 3);

        res.status(200).json({ matches: topMatches, top3Matches: top3Matches });
      } catch (tfError) {
        console.error("TensorFlow error:", tfError);
        res.status(500).json({
          error: "Error during matchmaking computation",
          details: tfError.message,
        });
      }
    } catch (error) {
      console.error("Error in matchmaking:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

async function findTopMatches(userId, userData, model) {
  const validUserData = userData.filter((user) => user && user.user_id);
  const userIndex = validUserData.findIndex((user) => user.user_id === userId);

  if (userIndex === -1) return [];

  try {
    // Process users in chunks of 10
    const chunkSize = 10;
    const chunks = [];
    for (let i = 0; i < validUserData.length; i += chunkSize) {
      chunks.push(validUserData.slice(i, i + chunkSize));
    }

    let allMatches = [];
    for (const chunk of chunks) {
      const userTexts = chunk.map((user) => {
        const icebreakerResponses =
          user.icebreaker_responses
            ?.filter((r) => r.answer)
            .map((r) => r.answer)
            .join(" ") || "";

        const interests = user.interests.join(" ");
        const bio = user.bio || "";

        return `${bio} | ${icebreakerResponses} | ${interests}`;
      });

      // Process embeddings for this chunk
      const embeddings = await model.embed(userTexts);
      const similarities = tf.tidy(() => {
        const userEmbedding = embeddings.slice([userIndex, 0], [1, -1]);
        return tf.matMul(embeddings, userEmbedding.transpose()).squeeze();
      });

      const scores = await similarities.array();
      chunk.forEach((user, i) => {
        if (user.user_id !== userId) {
          allMatches.push({
            userId: user.user_id,
            score: scores[i],
          });
        }
      });

      // Clean up tensors
      embeddings.dispose();
      similarities.dispose();
    }

    // Sort by score and return user IDs
    return allMatches
      .sort((a, b) => b.score - a.score)
      .map((match) => match.userId);
  } catch (error) {
    console.error("Error in findTopMatches:", error);
    throw error;
  }
}
