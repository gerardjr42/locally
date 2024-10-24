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
  const { data, error } = await supabase
    .from("User_Interests")
    .select(
      `
      interest_id,
      Interests (
        name
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user interests:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.interest_id,
    name: item.Interests.name,
  }));
};

// Matchmaking Fetch User Data and Interests
export async function fetchUserDataAndInterests(supabase, userId) {
  try {
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select(
        "user_id, first_name, last_name, photo_url, bio, icebreaker_responses"
      )
      .eq("user_id", userId)
      .single();

    if (userError) throw userError;

    const { data: interestData, error: interestError } = await supabase
      .from("User_Interests")
      .select("interest")
      .eq("user_id", userId);

    if (interestError) throw interestError;

    const interests = interestData.map((item) => item.interest.name);

    return {
      ...userData,
      interests,
    };
  } catch (error) {
    console.error("Error fetching user data and interests:", error);
    return null;
  }
}

// Convert User Data to Text for Matchmaking
export function prepareUserDataForMatchmaking(usersData) {
  return usersData.map((user) => ({
    user_id: user.user_id,
    features: createFeatureVector(user),
  }));
}

function createFeatureVector(user) {
  const interestsVector = new Array(100).fill(0); // Assuming 100 possible interests
  user.interests.forEach((interest) => {
    const interestIndex = hashString(interest) % 100;
    interestsVector[interestIndex] = 1;
  });

  const ageVector = [calculateAge(user.user_dob) / 100]; // Normalize age

  return [...interestsVector, ...ageVector];
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
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
