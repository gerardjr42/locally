import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function fetchTopMatches(
  userId,
  eventId,
  cacheMatchmakingResults
) {
  const supabase = createClientComponentClient();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 65000); // 65 seconds timeout

  try {
    const response = await fetch("/api/matchmaking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, eventId }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 504) {
        throw new Error("Matchmaking timeout - please try again");
      }
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    if (!data.matches) {
      throw new Error("Invalid response format: missing matches");
    }

    const interestedUsersData = await Promise.all(
      data.matches.map(async (userId) => {
        const { data: userData, error } = await supabase
          .from("Users")
          .select("user_id, first_name, last_name, user_dob, photo_url")
          .eq("user_id", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return null;
        }
        return userData;
      })
    );

    const results = {
      matches: data.matches,
      interestedUsers: interestedUsersData.filter(Boolean),
    };

    if (cacheMatchmakingResults) {
      cacheMatchmakingResults(eventId, results);
    }

    return results;
  } catch (error) {
    console.error("Error in fetchTopMatches:", error);
    if (error.name === "AbortError") {
      throw new Error("Request timed out - please try again");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
