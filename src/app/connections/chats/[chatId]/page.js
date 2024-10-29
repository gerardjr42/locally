"use client";

import { useUserContext } from "@/contexts/UserContext";
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

export default function ChatPage() {
  //Add state to hold user info -> check useContext
  const { user } = useUserContext();
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  console.log("client", client);
  console.log("channel", channel);

  useEffect(() => {
    if (!user?.user_id) return;

    (async function run() {
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_API_KEY
      );
      setClient(client);

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

      const channel = client.channel("messaging", "spacejelly", {
        //we can make this unique with only two users
        /**
         * members: ['vishal', 'neil'],
         * name: 'Awesome channel about traveling'
         */
        name: "Space Jelly",
      });
      setChannel(channel);
    })();

    // return () => {
    //   if (client) {
    //     client.disconnectUser();
    //     setClient(null);
    //     setChannel(null);
    //   }
    // };
  }, [user]);

  const filters = { members: { $in: [user?.user_id] }, type: "messaging" };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 };

  return (
    <>
      {client && channel && (
        <Chat client={client}>
          {/* We use ChannelList to list all the channels the user is part of, we have to use this logic in the chat's page not [chatId].**/}
          {/* !Add this logic later */}
          {/* <ChannelList sort={sort} filters={filters} options={options} /> */}
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      )}
    </>
  );
}
