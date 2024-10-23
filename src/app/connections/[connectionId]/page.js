"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { formatDate, buildNameString } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function UserMatches() {
  const router = useRouter();
  const { user } = useUserContext();
  const params = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

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

  useEffect(() => {
    fetchEventInfo();
  }, [params.connectionId]);


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

    const otherUserId = matchData.attendee_id === user.user_id 
      ? matchData.interest_in_user_id 
      : matchData.attendee_id;
  
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
  
  useEffect(() => {
    if (user && params.connectionId) {
      fetchMatchAndUserInfo();
    }
  }, [params.connectionId, user]);

  console.log(otherUser);

  function handleViewEvent() {
    router.push(`/experiences/${eventInfo.event_id}`);
  }



  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      <div className="w-full p-4">
        {eventInfo && (
            <div className="card bg-base-100 image-full w-full shadow-xl my-4">
            <figure>
              <img
                src={eventInfo.event_image_url}
                alt={eventInfo.event_name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title m">{eventInfo.event_name}</h2>
              <p className="text-xs">{formatDate(eventInfo.event_time)}</p>
              <p className="text-xs">{eventInfo.event_details}</p>
              <div className="card-actions justify-center">
                <button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center" onClick={handleViewEvent}>View Experience</button>
              </div>
            </div>
          </div>
        )}
        <div className="collapse collapse-arrow bg-gray-100 pb-1 mb-4">
          <input type="checkbox" defaultChecked={true} />
          <div className="collapse-title">
            <p className="text-sm text-teal-700 font-semibold">
              Confirm Your Connection
            </p>
            <p className="text-xs text-gray-500">
              Will you be connecting with User at your experience?
            </p>
          </div>
          <div className="collapse-content flex flex-row items-center justify-evenly">
            <button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
