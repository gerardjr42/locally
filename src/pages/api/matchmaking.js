import { createClient } from "@supabase/supabase-js";
import { spawn } from "child_process";
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

    // Run Python script
    const pythonProcess = spawn("python", [
      "src/lib/matchmaking.py",
      userId,
      JSON.stringify(preparedUserData),
    ]);

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        res.status(500).json({ error: "Python script execution failed" });
        return;
      }
      const topMatches = JSON.parse(result);
      res.status(200).json({ matches: topMatches });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
