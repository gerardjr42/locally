"use client";

import { MatchmakingContext } from "@/contexts/MatchmakingContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useContext, useEffect, useState } from "react";

export function MatchmakingProvider({ children }) {
  const [matchmakingResults, setMatchmakingResults] = useState({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    const userEventsChannel = supabase
      .channel("user-events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "User_Events",
        },
        (payload) => {
          setMatchmakingResults((prev) => {
            const newResults = { ...prev };
            delete newResults[payload.new.event_id];
            return newResults;
          });
        }
      )
      .subscribe();

    // ... rest of the channels setup
    return () => {
      userEventsChannel.unsubscribe();
      usersChannel.unsubscribe();
      userInterestsChannel.unsubscribe();
    };
  }, [supabase]);

  const value = {
    getMatchmakingResults: (eventId) => {
      const cached = matchmakingResults[eventId];
      if (!cached) return null;

      if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
        setMatchmakingResults((prev) => {
          const newResults = { ...prev };
          delete newResults[eventId];
          return newResults;
        });
        return null;
      }

      return cached.results;
    },
    cacheMatchmakingResults: (eventId, results) => {
      setMatchmakingResults((prev) => ({
        ...prev,
        [eventId]: {
          results,
          timestamp: Date.now(),
        },
      }));
    },
  };

  return (
    <MatchmakingContext.Provider value={value}>
      {children}
    </MatchmakingContext.Provider>
  );
}

export function useMatchmaking() {
  const context = useContext(MatchmakingContext);
  if (!context) {
    throw new Error("useMatchmaking must be used within a MatchmakingProvider");
  }
  return context;
}
