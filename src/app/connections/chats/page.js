"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { useUserContext } from "@/contexts/UserContext";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function UserChats() {
  const router = useRouter();
  const { user } = useUserContext();
  const [channels, setChannels] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!user?.user_id) return;

    const initializeChat = async () => {
      try {
        const client = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY
        );

        const { token } = await fetch("/api/token", {
          method: "POST",
          body: JSON.stringify({
            id: user.user_id,
          }),
        }).then((res) => res.json());

        await client.connectUser(
          {
            id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            image: user.photo_url || "/default-avatar.png",
          },
          token
        );

        const filter = { type: "messaging", members: { $in: [user.user_id] } };
        const sort = { last_message_at: -1 };

        const channels = await client.queryChannels(filter, sort);
        console.log("Fetched channels:", channels);
        setChannels(channels);
        setClient(client);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    initializeChat();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user]);

  // const handleBackClick = () => {
  //   router.push(`/connections`);
  // };

  const handleChatClick = (channelId) => {
    router.push(`/connections/chats/${channelId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={() => router.back()} />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Connections Chats</h1>
          <p className="text-gray-500">{channels.length} Active Chats</p>
        </div>

        <div className="space-y-4 bg-[#C9E9E5] p-4 rounded-lg">
          {channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => handleChatClick(channel.id)}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img
                    src={channel.data?.image || "/default-avatar.png"}
                    alt={channel.data?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{channel.data?.name}</h3>
                  <p className="text-gray-600">
                    {formatDate(channel.data?.last_message_at)}
                  </p>
                </div>
              </div>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                {channel.state.unreadCount > 0 ? "Unread" : "Read"}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
