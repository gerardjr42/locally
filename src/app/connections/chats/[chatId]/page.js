"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function ChatPage() {
  //Add state to hold user info -> check useContext
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  console.log("client", client);

  useEffect(() => {
    if (!user?.id) return;

    (async function run() {
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_API_KEY
      );
      setClient(client);

      const { token } = await fetch("/api/token", {
        method: "POST",
        body: JSON.stringify({
          id: user.id,
        }),
      }).then((res) => res.json());

      const connectedUser = await client.connectUser(
        {
          id: user.id,
          name: user.id,
          image: "https://i.imgur.com/fR9Jz14.png",
        },
        token
      );
      console.log("connectedUser", connectedUser);
    })();
  }, [user.id]);

  return <div>This is the chat page</div>;
}
