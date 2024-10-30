"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { StreamChat } from "stream-chat";
import { ConnectionContext } from './layout';


export default function UserMatches() {
  const router = useRouter();
  const { user } = useUserContext();
  const params = useParams();
  const { eventInfo, matchData, otherUser } = useContext(ConnectionContext);
  const [areUsersConfirmed, setAreUsersConfirmed] = useState(false);
  const [didConnectionOccur, setDidConnectionOccur] = useState(false);


  function handleViewEvent() {
    router.push(`/experiences/${eventInfo?.event_id}`);
  }

  function handleFeedback() {
    router.push(`/connections/${params.connectionId}/survey`);
  }

  const handleChatClick = async () => {
    if (!user || !otherUser || !params.connectionId) return;

    let client;
    try {
      client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY);

      // Create users via API endpoint
      await fetch("/api/create-stream-users", {
        method: "POST",
        body: JSON.stringify({
          users: [
            {
              id: user.user_id,
              name: `${user.first_name} ${user.last_name}`,
              image: user.photo_url || "/default-avatar.png",
            },
            {
              id: otherUser.user_id,
              name: `${otherUser.first_name} ${otherUser.last_name}`,
              image: otherUser.photo_url || "/default-avatar.png",
            },
          ],
        }),
      });

      // Get token for current user
      const { token } = await fetch("/api/token", {
        method: "POST",
        body: JSON.stringify({ id: user.user_id }),
      }).then((res) => res.json());

      // Connect current user
      await client.connectUser(
        {
          id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          image: user.photo_url || "/default-avatar.png",
        },
        token
      );

      // Create channel
      const channel = client.channel("messaging", params.connectionId, {
        members: [user.user_id, otherUser.user_id],
        name: `${eventInfo?.event_name || "Event"} Chat`,
        image: eventInfo?.event_image_url || "/images/logo.png",
      });

      // Watch the channel
      await channel.watch();

      // Navigate to chat (without disconnecting)
      router.push(`/connections/chats/${params.connectionId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      if (client) {
        await client.disconnectUser();
      }
    }
  };

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
      checkConnectionOccurred();
    }
  }, [params.connectionId, user]);

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      <div className="w-full p-2">
        <div className="card flex items-center justify-center bg-base-100 shadow-sm mb-4 p-2">
          <div className="card-body flex-col items-center justify-center p-2">
            <h2 className="card-title text-gray-600">
              {areUsersConfirmed &&
                didConnectionOccur &&
                `You've made a Connection with ${otherUser?.first_name}!`}
              {areUsersConfirmed &&
                !didConnectionOccur &&
                `You'll be Connecting with ${otherUser?.first_name}!`}
              {!areUsersConfirmed &&
                `You've Matched with ${otherUser?.first_name}!`}
            </h2>
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
            <p className="text-xs text-center text-gray-500">
              {areUsersConfirmed &&
                didConnectionOccur &&
                `How was your connection with ${otherUser?.first_name} at ${eventInfo?.event_name}? We'd love to hear about it!`}
              {areUsersConfirmed &&
                !didConnectionOccur &&
                `Congrats! We hope your connection goes well and you enjoy yourselves at ${eventInfo?.event_name}!`}
              {!areUsersConfirmed &&
                `Time to introduce yourselves, coordinate your meetup, and confirm your connection!`}
            </p>
            {areUsersConfirmed && didConnectionOccur && (
              <Button
                className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                onClick={handleFeedback}
              >
                Provide Feedback
              </Button>
            )}
            {areUsersConfirmed && !didConnectionOccur && (
              <Button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
                Add To Calendar
              </Button>
            )}
            {!areUsersConfirmed && (
              <Button
                className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                onClick={handleChatClick}
              >
                Chat
              </Button>
            )}
          </div>
        </div>

        {eventInfo && (
          <div className="card bg-base-100 image-full w-full shadow-sm my-4">
            <div className="card-image relative w-full h-full overflow-hidden rounded-xl">
              <Image
                src={eventInfo?.event_image_url}
                alt={eventInfo?.event_name}
                fill={true}
                className="object-cover"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title m">{eventInfo?.event_name}</h2>
              <p className="text-xs">{formatDate(eventInfo?.event_time)}</p>
              <p className="text-xs">{eventInfo?.event_details}</p>
              <div className="card-actions justify-center">
                <Button
                  className="w-3/4 outline text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                  onClick={handleViewEvent}
                >
                  View Experience
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="collapse collapse-arrow bg-gray-100 pb-1 mb-4 shadow-sm">
          {areUsersConfirmed && didConnectionOccur && (
            <input type="checkbox" defaultChecked={false} />
          )}
          {areUsersConfirmed && !didConnectionOccur && (
            <input type="checkbox" />
          )}
          {!areUsersConfirmed && (
            <input type="checkbox" defaultChecked={true} />
          )}
          <div className="collapse-title">
            <p className="text-sm text-teal-500 font-semibold">
              {areUsersConfirmed &&
                didConnectionOccur &&
                `Connection and Experience Report`}
              {areUsersConfirmed &&
                !didConnectionOccur &&
                `Connection Confirmed!`}
              {!areUsersConfirmed && `Confirm Your Connection`}
            </p>
            <p className="text-xs text-gray-500">
              {areUsersConfirmed &&
                didConnectionOccur &&
                `Do you want to contact the Locally Team about this connection and/or experience?`}
              {areUsersConfirmed &&
                !didConnectionOccur &&
                `You and ${otherUser?.first_name} are both confirmed to connect at ${eventInfo?.event_name}!`}
              {!areUsersConfirmed &&
                `Will you be connecting with ${otherUser?.first_name} at ${eventInfo?.event_name}?`}
            </p>
          </div>
          <div className="collapse-content flex flex-row items-center justify-evenly">
            {areUsersConfirmed && didConnectionOccur && (
              <Button className="w-1/2 bg-transparent text-gray-400 outline text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
                Contact Us
              </Button>
            )}
            {areUsersConfirmed && !didConnectionOccur && (
              <Button className="w-1/2 bg-transparent text-gray-400 outline text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
                Cancel Connection
              </Button>
            )}
            {!areUsersConfirmed && (
              <Button className="w-1/2 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
                Confirm Connection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
