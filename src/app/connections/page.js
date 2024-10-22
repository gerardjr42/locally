"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDate, buildNameString } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function UserMatches() {
  const router = useRouter();
  const { user } = useUserContext();
  const [userEvents, setUserEvents] = useState([]);
 

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: userEventsData, error: userEventsError } = await supabase
        .from('User_Events')
        .select('*, Events(*)')
        .eq('user_id', user.user_id);

      if (userEventsError) {
        console.error('Error fetching events:', userEventsError);
        return;
      }

      const eventsWithMatches = await Promise.all(userEventsData.map(async (event) => {
        const { data: matchesData, error: matchesError } = await supabase
          .from('Event_Matches')
          .select('*')
          .eq('event_id', event.Events.event_id)
          .or(`attendee_id.eq.${user.user_id},interest_in_user_id.eq.${user.user_id}`)
          .eq('mutual_interest', true);

        if (matchesError) {
          console.error('Error fetching matches:', matchesError);
          return event;
        }

        const matches = await Promise.all(matchesData.map(async (match) => {
          const otherUserId = match.attendee_id === user.user_id ? match.interest_in_user_id : match.attendee_id;
          const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('user_id, first_name, last_name, photo_url')
            .eq('user_id', otherUserId)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return null;
          }

          return {
            match_id: match.id,
            other_user_id: userData.user_id,
            other_user_photo_url: userData.photo_url,
            other_user_first_name: userData.first_name,
            other_user_last_name: userData.last_name,
            is_mutual: match.mutual_interest,
            is_confirmed: match.is_confirmed
          };
        }));

        return {
          ...event,
          matches: matches.filter(Boolean)
        };
      }));

      setUserEvents(eventsWithMatches);
    };  
    if (user) {
      fetchEvents();
    }
  }, [user, supabase]);
  
  console.log(userEvents);

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />

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
          <div key={event.Events.event_id} className="collapse collapse-arrow bg-gray-100 pb-1 mb-4">
            <input type="checkbox" defaultChecked={true}/>
            <div className="collapse-title text-sm text-gray-500 font-semibold">
              <p>{event.Events.event_name}</p>
              <p className="text-xs text-gray-400">{formatDate(event.Events.event_time)}</p>
            </div>
            <div className="collapse-content flex flex-row items-center justify-evenly">
              {/* Render matched users here */}
              {/* You can add logic to display matched users for each event */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
