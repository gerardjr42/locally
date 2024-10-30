"use client";

import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { useEffect, useState, createContext } from "react";

export const ConnectionContext = createContext();

export default function ConnectionLayout({ children }) {
  const { user } = useUserContext();
  const params = useParams();
  let [eventInfo, setEventInfo] = useState(null);
  let [matchData, setMatchData] = useState(null);
  let [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    fetchEventInfo();
  }, [params.connectionId]);

  useEffect(() => {
    if (user && params.connectionId) {
      fetchMatchAndUserInfo();
    }
  }, [params.connectionId, user]);

  const fetchEventInfo = async () => {
    const { data: matchData, error: matchError } = await supabase
      .from("Event_Matches")
      .select("event_id")
      .eq("match_id", params.connectionId)
      .single();

    if (matchError) {
      console.error("Error fetching match data:", matchError);
      return;
    }

    if (matchData) {
      const { data: eventData, error: eventError } = await supabase
        .from("Events")
        .select("*")
        .eq("event_id", matchData.event_id)
        .single();

      if (eventError) {
        console.error("Error fetching event data:", eventError);
      } else {
        setEventInfo(eventData);
      }
    }
  };

  const fetchMatchAndUserInfo = async () => {
    const { data: matchData, error: matchError } = await supabase
      .from("Event_Matches")
      .select("*")
      .eq("match_id", params.connectionId)
      .single();

    if (matchError) {
      console.error("Error fetching match data:", matchError);
      return;
    }

    setMatchData(matchData);

    const otherUserId =
      matchData.user1_id === user.user_id
        ? matchData.user2_id
        : matchData.user1_id;

    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("*")
      .eq("user_id", otherUserId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    } else {
      setOtherUser(userData);
    }

    fetchEventInfo();
  };

  return (
    <ConnectionContext.Provider value={{ eventInfo, matchData, otherUser }}>
      {children}
    </ConnectionContext.Provider>
  );
}
