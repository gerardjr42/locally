"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { useMatchmaking } from "@/contexts/MatchmakingContext";
import { useUser } from "@/hooks/useUser";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AttendeesList() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const router = useRouter();
  const [allAttendees, setAllAttendees] = useState([]);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [experience, setExperience] = useState({});
  const [topMatches, setTopMatches] = useState([]);
  const { user, loading } = useUser();
  const { getMatchmakingResults, cacheMatchmakingResults } = useMatchmaking();

  useEffect(() => {
    const fetchData = async () => {
      if (user && !loading) {
        const cachedResults = getMatchmakingResults(params.experienceId);
        if (cachedResults) {
          setTopMatches(cachedResults.matches);
          setInterestedUsers(cachedResults.interestedUsers);
        } else {
          await fetchTopMatches(user.user_id, params.experienceId);
        }
      }
    };

    fetchData();
  }, [params.experienceId, user, loading]);

  const handleBackClick = () => {
    router.push(`/experiences/${params.experienceId}`);
  };

  const fetchTopMatches = async (userId, eventId) => {
    try {
      console.log(
        "Fetching top matches for userId:",
        userId,
        "eventId:",
        eventId
      );
      const response = await fetch("/api/matchmaking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, eventId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Top Matches:", data.matches);
      setTopMatches(data.matches);

      // Fetch interested users' data
      const interestedUsersData = await Promise.all(
        data.matches.map(async (userId) => {
          const { data: userData, error } = await supabase
            .from("Users")
            .select("user_id, first_name, last_name, user_dob, photo_url")
            .eq("user_id", userId)
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
            return null;
          }
          return userData;
        })
      );
      setInterestedUsers(interestedUsersData.filter(Boolean));
      setAllAttendees(interestedUsersData);
    } catch (error) {
      console.error("Error fetching top matches:", error);
    }
  };

  useEffect(() => {
    if (!topMatches || !interestedUsers) {
      // If data is not available, redirect back to the experience page
      router.push(`/experiences/${params.experienceId}`);
    }
  }, [topMatches, interestedUsers]);

  const memoizedTopMatches = useMemo(() => topMatches, [topMatches]);
  const memoizedInterestedUsers = useMemo(
    () => interestedUsers,
    [interestedUsers]
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Explore a potential connection!</h2>
        </div>

        <div className="space-y-4 bg-[#C9E9E5] p-4 rounded-lg">
          {memoizedInterestedUsers
            .sort((a, b) => {
              const aIndex = memoizedTopMatches.indexOf(a.user_id);
              const bIndex = memoizedTopMatches.indexOf(b.user_id);
              return aIndex - bIndex;
            })
            .map((user, index) => (
              <div
                key={user.user_id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer"
                onClick={() =>
                  router.push(
                    `/experiences/${params.experienceId}/attendees/${user.user_id}`
                  )
                }
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                    <Image
                      src={user.photo_url}
                      alt={`${user.first_name}'s profile`}
                      width={48}
                      height={48}
                      objectFit="cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {user.first_name} {user.last_name[0]}.
                    </h3>
                  </div>
                </div>
                {index < 3 && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                    Top Match
                  </span>
                )}
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
