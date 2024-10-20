import { createClient } from "@supabase/supabase-js";
import { find_top_matches } from "../../lib/matchmaking.py";
import {
  fetchUserDataAndInterests,
  prepareUserDataForMatchmaking,
} from "../../lib/utils.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    // Fetch user data and interests from Supabase
    const usersData = await Promise.all(
      (
        await supabase
          .from("User_Events")
          .select("user_id")
          .eq("event_id", req.body.eventId)
      ).data.map((user) => fetchUserDataAndInterests(supabase, user.user_id))
    );

    // Prepare user data for the matchmaking algorithm
    const preparedUserData = prepareUserDataForMatchmaking(usersData);

    // Find top matches using the matchmaking algorithm
    const topMatches = find_top_matches(userId, preparedUserData);

    res.status(200).json({ matches: topMatches });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
