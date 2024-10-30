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
  const [areUsersConfirmed, setAreUsersConfirmed] = useState(false);
  const [didConnectionOccur, setDidConnectionOccur] = useState(false);

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

    const otherUserId =
      matchData.attendee_id === user.user_id
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

  function handleViewEvent() {
    router.push(`/experiences/${eventInfo.event_id}`);
  }

  function handleFeedback() {
    router.push(`/connections/${params.connectionId}/survey`);
  }

  const checkConnectionOccurred = async () => {
    const { data: matchData, error: matchError } = await supabase
      .from("Event_Matches")
      .select("*, Events(event_time)")
      .eq("match_id", params.connectionId)
      .single();
  
    if (matchError) {
      console.error("Error fetching match data:", matchError);
      return;
    }
  
    if (matchData && matchData.confirmed_together) {
      const eventTime = new Date(matchData.Events.event_time);
      const currentTime = new Date();
      setAreUsersConfirmed(true);

      if (currentTime > eventTime) {
        setDidConnectionOccur(true);
      }
    }
  };
  

  useEffect(() => {
    if (user && params.connectionId) {
      fetchMatchAndUserInfo();
      checkConnectionOccurred();
    }
  }, [params.connectionId, user]);

  if (areUsersConfirmed && didConnectionOccur) {
    return (
      <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      <div className="w-full p-2">
        <div className="card flex items-center justify-center bg-base-100 shadow-sm mb-4 p-2">
          <div className="card-body flex-col items-center justify-center p-2">
            <h2 className="card-title text-gray-600">{`You'll be Connecting with ${otherUser?.first_name}!`}</h2>
            <div className="card-image w-full h-full overflow-hidden flex flex-row items-center justify-evenly px-1 py-5">
              <div className="avatar w-3/4">
                <div className="ring-primary ring-teal-500 ring-offset-base-100 w-full rounded-full ring ring-offset-2">
                  <img src={user?.photo_url} />
                </div>
              </div>
              <Image
                src="/images/fistbump.svg"
                alt="Fist Bump"
                width={50}
                height={50}
                className="mx-2"
              />
              <div className="avatar w-3/4">
                <div className="ring-primary ring-teal-500 ring-offset-base-100 w-full rounded-full ring ring-offset-2">
                  <img src={otherUser?.photo_url} />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500">{`How was your connection with ${otherUser?.first_name} at ${eventInfo.event_name}? We'd love to hear about it!`}</p>
            <button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Provide Feedback
            </button>
          </div>
        </div>

        {eventInfo && (
          <div className="card bg-base-100 image-full w-full shadow-sm my-4">
            <div className="card-image relative w-full h-full overflow-hidden rounded-xl">
              <Image
                src={eventInfo.event_image_url}
                alt={eventInfo.event_name}
                fill={true}
                className="object-cover"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title m">{eventInfo.event_name}</h2>
              <p className="text-xs">{formatDate(eventInfo.event_time)}</p>
              <p className="text-xs">{eventInfo.event_details}</p>
              <div className="card-actions justify-center">
                <button
                  className="w-3/4 outline text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                  onClick={handleViewEvent}
                >
                  View Experience
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="collapse collapse-arrow bg-gray-100 pb-1 mb-4 shadow-sm">
          <input type="checkbox"/>
          <div className="collapse-title">
            <p className="text-sm text-teal-700 font-semibold">
              Do you need help with this connection or your experience? 
            </p>
            <p className="text-xs text-gray-500">
              {`We're here to assist you. Please let us know how we can help you.`}
            </p>
          </div>
          <div className="collapse-content flex flex-row items-center justify-evenly">
            <button className="w-1/2 bg-transparent text-gray-400 outline text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Request Help
            </button>
          </div>
        </div>

      </div>
    </div>
    )
  }

  if (areUsersConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      <div className="w-full p-2">
        <div className="card flex items-center justify-center bg-base-100 shadow-sm mb-4 p-2">
          <div className="card-body flex-col items-center justify-center p-2">
            <h2 className="card-title text-gray-600">{`You'll be Connecting with ${otherUser?.first_name}!`}</h2>
            <div className="card-image w-full h-full overflow-hidden flex flex-row items-center justify-evenly px-1 py-5">
              <div className="avatar w-3/4">
                <div className="ring-primary ring-teal-500 ring-offset-base-100 w-full rounded-full ring ring-offset-2">
                  <img src={user?.photo_url} />
                </div>
              </div>
              <Image
                src="/images/fistbump.svg"
                alt="Fist Bump"
                width={50}
                height={50}
                className="mx-2"
              />
              <div className="avatar w-3/4">
                <div className="ring-primary ring-teal-500 ring-offset-base-100 w-full rounded-full ring ring-offset-2">
                  <img src={otherUser?.photo_url} />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500">{`Congrats! We hope your connection goes well and you enjoy yourselves at ${eventInfo.event_name}!`}</p>
            <button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Add To Calendar
            </button>
          </div>
        </div>

        {eventInfo && (
          <div className="card bg-base-100 image-full w-full shadow-sm my-4">
            <div className="card-image relative w-full h-full overflow-hidden rounded-xl">
              <Image
                src={eventInfo.event_image_url}
                alt={eventInfo.event_name}
                fill={true}
                className="object-cover"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title m">{eventInfo.event_name}</h2>
              <p className="text-xs">{formatDate(eventInfo.event_time)}</p>
              <p className="text-xs">{eventInfo.event_details}</p>
              <div className="card-actions justify-center">
                <button
                  className="w-3/4 outline text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                  onClick={handleViewEvent}
                >
                  View Experience
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="collapse collapse-arrow bg-gray-100 pb-1 mb-4 shadow-sm">
          <input type="checkbox"/>
          <div className="collapse-title">
            <p className="text-sm text-teal-700 font-semibold">
              Your Connection Is Confirmed!
            </p>
            <p className="text-xs text-gray-500">
              {`You ahd ${otherUser?.first_name} are confirmed to connect at the ${eventInfo?.event_name}?`}
            </p>
          </div>
          <div className="collapse-content flex flex-row items-center justify-evenly">
            <button className="w-1/2 bg-transparent text-gray-400 outline text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Cancel Connection
            </button>
          </div>
        </div>

        {/* <div className="collapse collapse-arrow bg-gray-100 pb-1 mb-4 shadow-sm">
          <input type="checkbox" />
          <div className="collapse-title">
            <p className="text-sm text-gray-400 font-semibold">
              Cancel This Match
            </p>
          </div>
          <div className="collapse-content flex flex-col items-center justify-evenly">
            <p className="text-xs text-gray-400">
              {`Are you sure you want to cancel your match with ${otherUser?.first_name} for the ${eventInfo?.event_name}?`}
            </p>
            <button className="w-1/2 outline text-gray-400 text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Cancel
            </button>
          </div>
        </div> */}
      </div>
    </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      <div className="w-full p-2">
        <div className="card flex items-center justify-center bg-base-100 shadow-sm mb-4 p-2">
          <div className="card-body flex-col items-center justify-center p-2">
            <h2 className="card-title text-gray-600">{`You've Matched with ${otherUser?.first_name}!`}</h2>
            <div className="card-image w-full h-full overflow-hidden flex flex-row items-center justify-evenly px-1 py-5">
              <div className="avatar w-3/4">
                <div className="ring-primary ring-teal-500 ring-offset-base-100 w-full rounded-full ring ring-offset-2">
                  <img src={user?.photo_url} />
                </div>
              </div>
              <Image
                src="/images/fistbump.svg"
                alt="Fist Bump"
                width={50}
                height={50}
                className="mx-2"
              />
              <div className="avatar w-3/4">
                <div className="ring-primary ring-teal-500 ring-offset-base-100 w-full rounded-full ring ring-offset-2">
                  <img src={otherUser?.photo_url} />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500">{`Time to introduce yourselves, coordinate your meetup, and confirm your connection!`}</p>
            <button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Chat
            </button>
          </div>
        </div>

        {eventInfo && (
          <div className="card bg-base-100 image-full w-full shadow-sm my-4">
            <div className="card-image relative w-full h-full overflow-hidden rounded-xl">
              <Image
                src={eventInfo.event_image_url}
                alt={eventInfo.event_name}
                fill={true}
                className="object-cover"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title m">{eventInfo.event_name}</h2>
              <p className="text-xs">{formatDate(eventInfo.event_time)}</p>
              <p className="text-xs">{eventInfo.event_details}</p>
              <div className="card-actions justify-center">
                <button
                  className="w-3/4 outline text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                  onClick={handleViewEvent}
                >
                  View Experience
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="collapse collapse-arrow bg-gray-100 pb-1 mb-4 shadow-sm">
          <input type="checkbox" defaultChecked={true} />
          <div className="collapse-title">
            <p className="text-sm text-teal-700 font-semibold">
              Confirm Your Connection
            </p>
            <p className="text-xs text-gray-500">
              {`Will you be connecting with ${otherUser?.first_name} at the ${eventInfo?.event_name}?`}
            </p>
          </div>
          <div className="collapse-content flex flex-row items-center justify-evenly">
            <button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Confirm
            </button>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-gray-100 pb-1 mb-4 shadow-sm">
          <input type="checkbox" />
          <div className="collapse-title">
            <p className="text-sm text-gray-400 font-semibold">
              Cancel This Match
            </p>
          </div>
          <div className="collapse-content flex flex-col items-center justify-evenly">
            <p className="text-xs text-gray-400">
              {`Are you sure you want to cancel your match with ${otherUser?.first_name} for the ${eventInfo?.event_name}?`}
            </p>
            <button className="w-1/2 outline text-gray-400 text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


