'use client';

import { NavigationBar } from '@/components/navigation-bar';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
  ChannelHeader,
} from 'stream-chat-react';
import 'stream-chat-react/dist/scss/v2/index.scss';
import './matchChat.scss';

export default function MatchChat({ params }) {
  const { user, loading } = useUserContext();
  const [chatDetails, setChatDetails] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [channel, setChannel] = useState(null);
  const [client, setClient] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const { chatId } = params;

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  const fetchUserToken = async (userId) => {
    const response = await fetch('/api/getToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user token');
    }

    return data.token;
  };

  useEffect(() => {
    async function fetchChatDetails() {
      const { data: chatData, error } = await supabase
        .from('Chats')
        .select('*')
        .eq('chat_id', chatId)
        .single();

      if (error) {
        console.error('Error fetching chat details:', error);
      } else if (!chatData) {
        console.warn('No chat data found for this chatId.');
      } else {
        setChatDetails(chatData);
        setMatchId(chatData.match_id);
      }
    }

    fetchChatDetails();
  }, [chatId]);

  useEffect(() => {
    const fetchEventMatches = async (matchId) => {
      try {
        const { data, error } = await supabase
          .from('Event_Matches')
          .select('*')
          .eq('match_id', matchId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUserId(data.interest_in_user_id);
          return data;
        }
      } catch (error) {
        console.error('Error fetching event matches:', error);
      }
    };

    if (matchId) {
      fetchEventMatches(matchId);
    }
  }, [matchId]);

  useEffect(() => {
    const fetchUserName = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('Users')
          .select('first_name')
          .eq('user_id', userId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUserName(data.first_name);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error(`Error fetching user 2's name:`, error);
      }
    };

    if (userId) {
      fetchUserName(userId);
    }
  }, [userId]);

  const initializeChat = async () => {
    if (!user || !chatDetails) return;

    try {
      const userToken = await fetchUserToken(user.user_id);
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(
        { id: user.user_id, name: user.first_name },
        userToken
      );

      const channelInstance = chatClient.channel('messaging', chatId, {
        name: `Match Chat`,
      });
      await channelInstance.watch();
      setChannel(channelInstance);
      console.log('Channel:', channelInstance);
      setClient(chatClient);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      initializeChat();
    }

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user, loading, chatDetails]);

  const sendMessage = async () => {
    console.log('sendMessage called');
    if (!channel || !newMessage) return;

    const message = {
      chat_id: chatId,
      text: newMessage,
      timestamp: new Date().toISOString(),
      event_id: chatDetails.event_id || null,
      sender_id: user.user_id,
    };

    await channel.sendMessage({
      text: newMessage,
      user: {
        id: user.user_id,
        name: user.first_name,
      },
    });

    const { data, error } = await supabase.from('Messages').insert([message]);

    if (error) {
      console.error('Error inserting message into Supabase:', error);
    } else {
      console.log('Message inserted successfully:', data);
    }

    setNewMessage('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="MatchChat">
      <div className="chat-container">
        <NavigationBar />
        {channel ? (
          <Chat client={client}>
            <Channel channel={channel} sendMessage={sendMessage}>
              <Window>
                <ChannelHeader title={`Chat with ${userName}`} />
                <MessageList />
                <MessageInput
                  onChange={(e) => {
                    console.log('message', e.target.value);
                    setNewMessage(e.target.value);
                  }}
                  value={newMessage}
                  onSendMessage={sendMessage}
                  placeholder="Type a message"
                />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        ) : (
          <div>Loading chat...</div>
        )}
      </div>
    </div>
  );
}
