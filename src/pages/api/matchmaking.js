import { createClient } from "@supabase/supabase-js";
import * as tf from "@tensorflow/tfjs";
import {
  fetchUserDataAndInterests,
  prepareUserDataForMatchmaking,
} from "../../lib/utils.js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

async function findTopMatches(userId, userData) {
  // Filter out null or undefined user data
  const validUserData = userData.filter((user) => user && user.user_id);

  const userIndex = validUserData.findIndex((user) => user.user_id === userId);
  if (userIndex === -1) return [];

  const features = tf.tensor2d(validUserData.map((user) => user.features));
  const userFeatures = features.slice([userIndex, 0], [1, -1]);

  const similarities = tf.matMul(features, userFeatures.transpose()).squeeze();
  const topIndices = await tf
    .topk(similarities, validUserData.length)
    .indices.array();

  return topIndices
    .filter((index) => index !== userIndex)
    .map((index) => validUserData[index].user_id);
}
