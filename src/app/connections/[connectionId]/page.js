"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { formatDate, updateMatchConfirmation } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { StreamChat } from "stream-chat";
import { ConnectionContext } from "./layout";

export default function UserMatches() {
  const router = useRouter();
  const { user } = useUserContext();
  const params = useParams();
  const { eventInfo, matchData, setMatchData, otherUser } =
    useContext(ConnectionContext);
  const [areUsersConfirmed, setAreUsersConfirmed] = useState(false);
  const [didConnectionOccur, setDidConnectionOccur] = useState(false);
  const [isCurrentUserConfirmed, setIsCurrentUserConfirmed] = useState(false);
  const [awaitingMatchConfirmation, setAwaitingMatchConfirmation] =
    useState(false);

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

    if (matchData) {
      setAreUsersConfirmed(matchData.confirmed_together);
      setIsCurrentUserConfirmed(
        matchData[
          `user${user.user_id === matchData.user1_id ? "1" : "2"}_confirmed`
        ]
      );
      setAwaitingMatchConfirmation(
        isCurrentUserConfirmed && !matchData.confirmed_together
      );

      if (matchData.confirmed_together) {
        const eventTime = new Date(matchData.Events.event_time);
        const currentTime = new Date();

        if (currentTime > eventTime) {
          setDidConnectionOccur(true);
        }
      }
    }
  };

  useEffect(() => {
    if (user && params.connectionId) {
      checkConnectionOccurred();
    }
  }, [params.connectionId, user, matchData]);

  const handleConfirmationClick = async () => {
    if (!user || !otherUser || !params.connectionId) {
      return;
    } else {
      const updatedMatchData = await updateMatchConfirmation(
        supabase,
        params.connectionId,
        user.user_id
      );
      setMatchData(updatedMatchData);
      setIsCurrentUserConfirmed(true);
    }
  };

  console.log(awaitingMatchConfirmation);

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      <div className="w-full p-2">
        {eventInfo && (
          <div className="card bg-base-100 image-full w-full shadow-sm mb-4">
            <div className="card-image relative w-full h-full overflow-hidden rounded-xl">
              <Image
                src={eventInfo?.event_image_url}
                alt={eventInfo?.event_name}
                fill={true}
                className="object-cover"
              />
            </div>
            <div className="card-body py-4 px-6" onClick={handleViewEvent}>
              <div className="flex flex-row items-center justify-between w-full">
                <h2 className="text-md m">{eventInfo?.event_name}</h2>
                <p className="text-xs text-right">
                  {formatDate(eventInfo?.event_time)}
                </p>
              </div>
              {/* <p className="text-xs">{eventInfo?.event_details}</p> */}
              <div className="card flex items-center justify-center bg-transparent shadow-sm mb-4 p-2">
          <div className="card-body bg-transparent flex-col items-center justify-center p-2">
            <h2 className="card-title text-white text-center py-6">
              {areUsersConfirmed &&
                didConnectionOccur &&
                `You've Connected with ${otherUser?.first_name}!`}
              {areUsersConfirmed &&
                !didConnectionOccur &&
                `You're Connecting with ${otherUser?.first_name}!`}
              {!areUsersConfirmed &&
                `You've Matched with ${otherUser?.first_name}!`}
            </h2>
            <div className="card-image w-full h-full overflow-hidden flex flex-row items-center justify-evenly px-1 pt-9 pb-12">
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
            <p className="text-sm text-center text-gray-100">
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
              <div className="flex flex-row items-center justify-evenly w-full">
                <Button
                  className="w-7/8 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex justify-evenly"
                  onClick={handleChatClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 mx-3"
                    onClick={handleChatClick}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    />
                  </svg>
                </Button>
                <Button className="w-7/8 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 mx-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                </Button>
              </div>
            )}
            {!areUsersConfirmed && (
              <Button
              className="w-7/8 bg-teal-500 text-white text-sm p-4 my-2 rounded-full font-semibold flex justify-evenly"
              onClick={handleChatClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mx-3"
                onClick={handleChatClick}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
            </Button>
            )}
          </div>
        </div>
              <div className="card-actions justify-center"></div>
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
            <p className="text-sm text-gray-500 font-semibold">
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
                awaitingMatchConfirmation &&
                `Thank you for confirming! Now awaiting confirmation from ${otherUser?.first_name}.`}
              {!areUsersConfirmed &&
                !awaitingMatchConfirmation &&
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
            {!areUsersConfirmed && awaitingMatchConfirmation && (
              <Button
                className="w-1/2 bg-transparent outline text-teal-400 text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                disabled={awaitingMatchConfirmation}
              >
                You're Confirmed!
              </Button>
            )}
            {!areUsersConfirmed && !awaitingMatchConfirmation && (
              <Button
                className="w-1/2 bg-transparent outline text-teal-400 text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center"
                onClick={handleConfirmationClick}
              >
                Confirm Connection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
