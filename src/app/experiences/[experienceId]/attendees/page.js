"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { fetchUsersForExperience } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttendeesList() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const router = useRouter();
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [experience, setExperience] = useState({});
  const [topMatches, setTopMatches] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: experienceData } = await supabase
        .from("Events")
        .select("*")
        .eq("id", params.experienceId)
        .single();
      setExperience(experienceData);

      const users = await fetchUsersForExperience(
        supabase,
        params.experienceId
      );
      setInterestedUsers(users);
    }

    loadData();
  }, [params.experienceId]);

  const handleBackClick = () => {
    router.back();
  };

  const fetchTopMatches = async (userId) => {
    const response = await fetch("/api/matchmaking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    setTopMatches(data.matches);
  };

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await fetchTopMatches(user.id, params.experienceId);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            Explore a potential connection for {}!
          </h2>
        </div>

        <div className="space-y-4 bg-[#C9E9E5] p-4 rounded-lg">
          {topMatches.map((userId) => {
            const user = interestedUsers.find((u) => u.user_id === userId);
            if (user) {
              return (
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
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {user.first_name} {user.last_name[0]}.
                      </h3>
                    </div>
                  </div>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                    Top Match
                  </span>
                </div>
              );
            }
            return null;
          })}
          {interestedUsers
            .filter((user) => !topMatches.includes(user.user_id))
            .map((user) => (
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
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {user.first_name} {user.last_name[0]}.
                    </h3>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
