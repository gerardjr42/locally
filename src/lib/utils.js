import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export const buildNameString = (user) => {
  const firstName = user.first_name || "";
  const lastName = user.last_name || "";

  let nameString = `${firstName} ${lastName[0]}.`;
  return nameString;
};

export function sortExperiencesByDate(experiences, ascending = true) {
  return experiences.sort((a, b) => {
    const dateA = new Date(a.event_time);
    const dateB = new Date(b.event_time);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export async function fetchUsersForExperience(supabase, experienceId) {
  try {
    const { data, error } = await supabase
      .from("User_Events")
      .select(
        `
        user_id,
        Users (
          user_id,
          first_name,
          last_name,
          user_dob,
          photo_url
        )
      `
      )
      .eq("event_id", experienceId);

    if (error) throw error;

    return data.map((item) => item.Users);
  } catch (error) {
    console.error("Error fetching users for experience:", error);
    return [];
  }
}

export const fetchUserInterests = async (userId) => {
  if (!userId) {
    console.error("fetchUserInterests: userId is null or undefined");
    return [];
  }

  try {
    console.log("Fetching interests for userId:", userId);

    const { data, error } = await supabase
      .from("User_Interests")
      .select("interest")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching interests:", error);
      throw error;
    }

    console.log("Raw User_Interests data:", data);

    if (!data || data.length === 0) {
      console.warn(
        "fetchUserInterests: No data returned from query for userId:",
        userId
      );
      return [];
    }

    const processedInterests = data.map((item) => item.interest);

    console.log("Processed interests:", processedInterests);
    return processedInterests;
  } catch (error) {
    console.error("Error fetching user interests:", error);
    return [];
  }
};

export async function fetchUserDataAndInterests(supabase, userIds) {
  try {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      console.error("Invalid userIds provided:", userIds);
      return [];
    }

    // Single query for all users with JOIN
    const { data: usersWithInterests, error } = await supabase
      .from("Users")
      .select(
        `
        user_id,
        first_name,
        last_name,
        photo_url,
        bio,
        icebreaker_responses,
        User_Interests!inner (
          interest
        )
      `
      )
      .in("user_id", userIds);

    if (error) throw error;

    if (!usersWithInterests || usersWithInterests.length === 0) {
      console.warn("No users found for ids:", userIds);
      return [];
    }

    return usersWithInterests.map((user) => ({
      ...user,
      interests: (user.User_Interests || []).map((i) => i.interest.name),
    }));
  } catch (error) {
    console.error("Error fetching user data and interests:", error);
    return [];
  }
}

export function prepareUserDataForMatchmaking(usersData) {
  return usersData.map((user) => ({
    user_id: user.user_id,
    bio: user.bio || "",
    icebreaker_responses: user.icebreaker_responses || [],
    interests: user.interests || [],
  }));
}

function createFeatureVector(user) {
  const interestsVector = new Array(100).fill(0);
  user.interests.forEach((interest) => {
    const interestIndex = hashString(interest) % 100;
    interestsVector[interestIndex] = 1;
  });

  const ageVector = [calculateAge(user.user_dob) / 100];

  return [...interestsVector, ...ageVector];
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export async function fetchTopMatches(userId, eventId) {
  try {
    const response = await fetch("/api/matchmaking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, eventId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.matches;
  } catch (error) {
    console.error("Error fetching top matches:", error);
    return [];
  }
}

export async function updateMatchConfirmation(supabase, matchId, userId) {
  try {
    // Fetch the match
    const { data: match, error: matchError } = await supabase
      .from("Event_Matches")
      .select("*")
      .eq("match_id", matchId)
      .single();

    if (matchError) throw matchError;

    // Determine which user is confirming
    const isUser1 = match.user1_id === userId;
    const updateField = isUser1 ? "user1_confirmed" : "user2_confirmed";

    // Update the confirmation
    const { data: updatedMatch, error: updateError } = await supabase
      .from("Event_Matches")
      .update({ [updateField]: true })
      .eq("match_id", matchId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Check if both users have confirmed
    if (updatedMatch.user1_confirmed && updatedMatch.user2_confirmed) {
      // Update confirmed_together
      const { error: confirmedTogetherError } = await supabase
        .from("Event_Matches")
        .update({ confirmed_together: true })
        .eq("match_id", matchId);

      if (confirmedTogetherError) throw confirmedTogetherError;

      // Update User_Events for both users
      const { error: userEventsError } = await supabase
        .from("User_Events")
        .update({ confirmed: true })
        .eq("event_id", updatedMatch.event_id)
        .in("user_id", [updatedMatch.user1_id, updatedMatch.user2_id]);

      if (userEventsError) throw userEventsError;
    }

    return updatedMatch;
  } catch (error) {
    console.error("Error updating match confirmation:", error);
    throw error;
  }
}

export async function fetchPersonalizedEvents(supabase, userId) {
  try {
    // Fetch user's interests
    const { data: userInterests, error: interestError } = await supabase
      .from("User_Interests")
      .select("interest")
      .eq("user_id", userId);

    if (interestError) throw interestError;

    // Extract interest names
    const interests = userInterests.map((item) =>
      item.interest.name.toLowerCase()
    );

    // Fetch all events with their categories
    const { data: events, error: eventError } = await supabase
      .from("Events")
      .select(
        `
        *,
        Event_Category_Junction (
          category_id,
          Categories (
            name
          )
        )
      `
      )
      .gte("event_time", new Date().toISOString());

    if (eventError) throw eventError;

    // Score and sort events based on interest matches
    const scoredEvents = events.map((event) => {
      const eventCategories = event.Event_Category_Junction.map((junction) =>
        junction.Categories.name.toLowerCase()
      );

      // Calculate match score (number of matching interests)
      const matchScore = eventCategories.reduce((score, category) => {
        return interests.includes(category) ? score + 1 : score;
      }, 0);

      return {
        ...event,
        matchScore,
      };
    });

    // Sort by match score (highest first)
    return scoredEvents.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error("Error fetching personalized events:", error);
    return [];
  }
}
