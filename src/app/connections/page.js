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
      const { data, error } = await supabase
        .from('User_Events')
        .select('*, Events(*)')
        .eq('user_id', user.user_id);
  
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setUserEvents(data);
      }
    };
  
    if (user) {
      fetchEvents();
    }
  }, [user, supabase]);

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      <div className="w-full p-4 md:flex-row md:flex md:flex-wrap md:justify-between lg:px-8">
        {userEvents.map((event) => (
          <div key={event.Events.event_id} className="collapse collapse-arrow border-base-300 bg-base-200 border pb-1 mb-4">
            <input type="checkbox" />
            <div className="collapse-title text-sm font-medium text-gray-500">
              <p>{event.Events.event_name}</p>
              <p className="text-xs">{formatDate(event.Events.event_time)}</p>
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
