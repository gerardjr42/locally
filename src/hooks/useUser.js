import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        if (session?.user) {
          await getUserData(session.user.id);
        } else {
          setUser(null);
          setInterests([]);
          setUserEvents([]);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  async function getUserData(userId) {
    try {
      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (userError) throw userError;

      setUser(userData);

      const { data: interestsData, error: interestsError } = await supabase
        .from("User_Interests")
        .select("interest")
        .eq("user_id", userId);

      if (interestsError) throw interestsError;

      setInterests(interestsData.map((item) => item.interest));

      const { data: eventsData, error: eventsError } = await supabase
        .from("User_Events")
        .select(
          `
          event_id,
          Events (*)
        `
        )
        .eq("user_id", userId);

      if (eventsError) throw eventsError;

      setUserEvents(eventsData.map((item) => item.Events));
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setUser(null);
      setInterests([]);
      setUserEvents([]);
    }
  }

  return { user, interests, userEvents, loading };
}
