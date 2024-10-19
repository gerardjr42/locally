import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
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
      .select(`
        user_id,
        Users (
          user_id,
          first_name,
          last_name,
          user_dob,
          photo_url
        )
      `)
      .eq("event_id", experienceId);

    if (error) throw error;

    return data.map(item => item.Users);
  } catch (error) {
    console.error("Error fetching users for experience:", error);
    return [];
  }
}

export const fetchUserInterests = async (userId) => {
  if (!userId) {
    console.error('fetchUserInterests: userId is null or undefined');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('User_Interests')
      .select(`
        interest_id,
        Interests (
          name
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    if (!data) {
      console.warn('fetchUserInterests: No data returned from query');
      return [];
    }

    return data.map(item => {
      if (!item || !item.Interests) {
        console.warn(`fetchUserInterests: Invalid item structure for interest_id: ${item?.interest_id}`);
        return null;
      }
      return {
        id: item.interest_id,
        name: item.Interests.name || 'Unknown Interest'
      };
    }).filter(Boolean); // Remove any null entries

  } catch (error) {
    console.error('Error fetching user interests:', error);
    return [];
  }
};
