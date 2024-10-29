"use client";

import { useUserContext } from "@/contexts/UserContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { EmojiPicker } from "stream-chat-react/emojis";

export default function ChatPage() {
  //Add state to hold user info -> check useContext
  const { user } = useUserContext();
  const params = useParams();
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  console.log("client", client);
  console.log("channel", channel);

  useEffect(() => {
    if (!user?.user_id || !params.chatId) return;

    (async function run() {
      try {
        const client = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY
        );

        console.log("Requesting token for user_id:", user.user_id);

        const { token } = await fetch("/api/token", {
          method: "POST",
          body: JSON.stringify({
            id: user.user_id,
          }),
        }).then((res) => res.json());

        const connectedUser = await client.connectUser(
          {
            id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            image: user.photo_url || "/default-avatar.png",
          },
          token
        );
        console.log("connectedUser", connectedUser);

        // Get existing channel using chatId (match_id)
        const channel = client.channel("messaging", params.chatId);
        await channel.watch();
        console.log("Channel initialized:", channel);

        setClient(client);
        setChannel(channel);
      } catch (error) {
        console.error("Error connecting to chat:", error);
      }
    })();

    return () => {
      if (client) {
        client.disconnectUser();
        setClient(null);
        setChannel(null);
      }
    };
  }, [user, params.chatId]);

  if (!channel || !client) return <div>Loading...</div>;

  return (
    <>
      {client && channel && (
        <div className="h-screen w-full">
          <Chat client={client}>
            <Channel channel={channel} EmojiPicker={EmojiPicker}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      )}
    </>
  );
}
