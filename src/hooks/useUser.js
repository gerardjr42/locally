import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
  useEffect(() => {
    getUserData();
  }, []);

  return { user, setUser, interests, userEvents, loading, getUserData };
}