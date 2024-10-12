import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

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
