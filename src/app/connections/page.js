"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserMatches() {
  const router = useRouter();
  const { user } = useUserContext();
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: userEventsData, error: userEventsError } = await supabase
        .from("User_Events")
        .select("*, Events(*)")
        .eq("user_id", user.user_id);

      if (userEventsError) {
        console.error("Error fetching events:", userEventsError);
        return;
      }

      const eventsWithMatches = await Promise.all(
        userEventsData.map(async (event) => {
          const { data: matchesData, error: matchesError } = await supabase
            .from("Event_Matches")
            .select("*")
            .eq("event_id", event.Events.event_id)
            .or(`user1_id.eq.${user.user_id},user2_id.eq.${user.user_id}`)
            .eq("mutual_interest", true);

          if (matchesError) {
            console.error("Error fetching matches:", matchesError);
            return event;
          }

          const matches = await Promise.all(
            matchesData.map(async (match) => {
              const otherUserId =
                match.user1_id === user.user_id
                  ? match.user2_id
                  : match.user1_id;
              const { data: userData, error: userError } = await supabase
                .from("Users")
                .select("user_id, first_name, last_name, photo_url")
                .eq("user_id", otherUserId)
                .single();

              if (userError) {
                console.error("Error fetching user data:", userError);
                return null;
              }

              return {
                match_id: match.match_id,
                other_user_id: userData.user_id,
                other_user_photo_url: userData.photo_url,
                other_user_first_name: userData.first_name,
                other_user_last_name: userData.last_name,
                is_mutual: match.mutual_interest,
                is_confirmed: match.confirmed_together,
              };
            })
          );

          return {
            ...event,
            matches: matches.filter(Boolean),
          };
        })
      );

      setUserEvents(eventsWithMatches);
    };
    if (user) {
      fetchEvents();
    }
  }, [user, supabase]);

  console.log(userEvents);

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar handleBackClick={() => router.back()} />

      <div className="w-full flex flex-row px-4 mx-1 mt-3.5 justify-between lg:px-8">
        <h1 className="text-left text-lg font-extrabold lg:text-2xl">
          Experiences & Connections
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 lg:size-8 cursor-pointer"
          // onClick={handleSortClick}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
      </div>

      <div className="w-full p-4 md:flex-row md:flex md:flex-wrap md:justify-between lg:px-8">
        {userEvents.map((event) => (
          <div
            key={event.Events.event_id}
            className="collapse collapse-arrow bg-gray-100 pb-1 mb-4"
          >
            <input type="checkbox" defaultChecked={true} />
            <div className="collapse-title">
              <p className="text-sm text-teal-700 font-semibold">
                {event.Events.event_name}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(event.Events.event_time)}
              </p>
            </div>
            <div className="collapse-content flex flex-row items-center justify-evenly">
              {event.matches && event.matches.length > 0 ? (
                event.matches.map((match) => (
                  <div key={match.match_id} className="flex-shrink-0 w-20">
                    <div className="relative mb-1">
                      <div
                        className="rounded-full overflow-hidden w-20 h-20 cursor-pointer"
                        onClick={() =>
                          router.push(`/connections/${match.match_id}`)
                        }
                      >
                        <Image
                          src={match.other_user_photo_url}
                          alt={`${match.other_user_first_name} ${match.other_user_last_name[0]}.`}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      {match.is_confirmed && (
                        <span className="absolute top-0 right-0 bg-teal-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px]">
                          Confirmed
                        </span>
                      )}

                      {!match.is_confirmed && match.is_mutual && (
                        <span className="absolute top-0 right-0 bg-teal-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px]">
                          Matched
                        </span>
                      )}
                    </div>
                    <p className="text-center text-xs">
                      {match.other_user_first_name}{" "}
                      {match.other_user_last_name[0]}.
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-3">
                  <p className="text-center text-sm font-semibold text-teal-600">
                    No matches yet? No worries!
                  </p>
                  <p className="text-xs text-teal-600 text-center">
                    Check out other interested users who might be your match!
                  </p>
                  <button
                    className="w-3/4 outline bg-transparent text-teal-700 text-sm p-2 my-2 rounded-full font-semibold flex items-center justify-center"
                    onClick={() =>
                      router.push(
                        `/experiences/${event.Events.event_id}/attendees`
                      )
                    }
                  >
                    Browse Interested Users
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-3 px-10 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="gray"
          className="size-6 mb-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>

        <p className="text-center w-3/4 text-gray-500 text-xs mb-2">
          There&apos;s always more people to meet and places to go!
        </p>
        <button
          className="w-3/4 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
          onClick={() => router.push(`/experiences/`)}
        >
          Find More Experiences
        </button>
      </div>
    </div>
  );
}
