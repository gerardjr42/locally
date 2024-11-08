"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState } from "react";

const MatchmakingContext = createContext();

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

    const usersChannel = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Users",
        },
        () => {
          setMatchmakingResults({});
        }
      )
      .subscribe();

    const userInterestsChannel = supabase
      .channel("user-interests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "User_Interests",
        },
        () => {
          setMatchmakingResults({});
        }
      )
      .subscribe();

    return () => {
      userEventsChannel.unsubscribe();
      usersChannel.unsubscribe();
      userInterestsChannel.unsubscribe();
    };
  }, [supabase]);

  const cacheMatchmakingResults = (eventId, results) => {
    setMatchmakingResults((prev) => ({
      ...prev,
      [eventId]: {
        results,
        timestamp: Date.now(),
      },
    }));
  };

  const getMatchmakingResults = (eventId) => {
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
  };

  return (
    <MatchmakingContext.Provider
      value={{
        getMatchmakingResults,
        cacheMatchmakingResults,
      }}
    >
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
