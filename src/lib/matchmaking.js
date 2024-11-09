import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function fetchTopMatches(
  userId,
  eventId,
  cacheMatchmakingResults
) {
  const supabase = createClientComponentClient();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 second timeout

    const response = await fetch("/api/matchmaking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, eventId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
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
    throw error;
  }
}
