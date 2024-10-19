import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  async function getUserData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userData) {
        setUser(userData);

        // Fetch user interests
        const { data: interestsData } = await supabase
          .from('User_Interests')
          .select('interest_id')
          .eq('user_id', user.id);

        if (interestsData) {
          setInterests(interestsData.map(item => item.interest_id));
        }

        // Fetch user events
        const { data: eventsData } = await supabase
          .from('User_Events')
          .select(`
            event_id,
            Events (*)
          `)
          .eq('user_id', user.id);

        if (eventsData) {
          setUserEvents(eventsData.map(item => item.Events));
        }
      }
    }
    setLoading(false);
  }

  // New function to delete user photo
  const deleteUserPhoto = async () => {
    if (user.photo_url) {
      const photoPath = user.photo_url.replace(
        "https://your-storage-bucket-url/",
        ""
      ); // Extract file path from the full URL

      const { error } = await supabase.storage
        .from("user-avatars")
        .remove([photoPath]); // Remove the old photo using its file path

      if (error) {
        console.error("Error deleting old photo:", error.message);
        // Continue with the upload even if there's an error deleting the old photo
      }
    }
  };

  // New function to upload user photo
  const uploadUserPhoto = async (file) => {
    const fileExtension = file.name.match(/\.[^.]+$/)[0]; // Extract file extension
    const uniqueFileName = `${user.user_id}${fileExtension}`; // Use user ID with the original extension

    const { data, error } = await supabase.storage
      .from("user-avatars")
      .upload(uniqueFileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return uniqueFileName; // Return the filename of the uploaded photo
  };

  useEffect(() => {
    getUserData();
  }, []);

  return { user, setUser, interests, userEvents, loading, getUserData, deleteUserPhoto, uploadUserPhoto };
}
