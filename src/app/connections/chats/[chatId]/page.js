'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserContext } from '@/contexts/UserContext';
import { NavigationBar } from '@/components/navigation-bar';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { Button } from '@mui/material';
import { Mic, CornerDownLeft } from 'lucide-react';
import './Chat.scss';

export default function Chat({ params }) {
  const { user, loading } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatDetails, setChatDetails] = useState(null);
  const [senders, setSenders] = useState({});
  const { chatId } = params;

  // Fetch chat details by ID
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
      }
    }

    fetchChatDetails();
  }, [chatId]);

  // Fetch messages from chat details
  useEffect(() => {
    async function fetchMessages() {
      if (!chatDetails) return;

      const { data: messagesData, error } = await supabase
        .from('Messages')
        .select('*')
        .eq('chat_id', chatDetails.chat_id);

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(messagesData || []);
      }
    }

    fetchMessages();
  }, [chatDetails]);

  // Fetch user details based on messages
  useEffect(() => {
    async function fetchUserDetails() {
      if (!messages.length) return;

      const senderIds = [];
      messages.forEach((msg) => {
        if (!senderIds.includes(msg.sender_id)) {
          senderIds.push(msg.sender_id);
        }
      });

      const fetchPromises = senderIds.map(async (senderId) => {
        const { data: senderData, error: senderError } = await supabase
          .from('Users')
          .select('*')
          .eq('user_id', senderId)
          .single();

        if (senderError) {
          console.error('Error fetching sender details:', senderError);
          return null;
        } else {
          return { [senderId]: senderData };
        }
      });

      const senderDataArray = await Promise.all(fetchPromises);

      const senderMap = {};
      senderDataArray.forEach((sender) => {
        if (sender) {
          Object.assign(senderMap, sender);
        }
      });

      setSenders(senderMap);
    }

    fetchUserDetails();
  }, [messages]);

  if (loading) {
    return <div>Loading user...</div>;
  }

  if (!user) {
    return <div>Please log in to access this chat.</div>;
  }

  async function handleSendMessage() {
    if (!newMessage || !user.id) return;

    const message = {
      chat_id: chatDetails.chat_id,
      text: newMessage,
      timestamp: new Date().toISOString(),
      event_id: chatDetails.event_id,
      sender_id: user.user.id,
    };

    try {
      const { data, error } = await supabase.from('Messages').insert([message]).select();

      if (error) {
        throw error;
      }

      console.log('Message added:', newMessage);

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }

  return (
    <div className="Chat">
      <NavigationBar />
      <div className="Chat-header">
        <h1>{`Chat with ${
          messages.length > 0
            ? senders[messages[0].sender_id]?.first_name || 'Blank'
            : 'Blank'
        }`}</h1>
      </div>
      <div className="Chat-container">
        <ChatMessageList>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.message_id}
              variant={msg.sender_id === user.id ? 'sent' : 'received'}
            >
              <ChatBubbleAvatar
                fallback={
                  msg.sender_id === user.id
                    ? 'You'
                    : senders[msg.sender_id]?.first_name.slice(0, 1) || 'User'
                }
              />
              <ChatBubbleMessage
                variant={msg.sender_id === user.id ? 'sent' : 'received'}
              >
                {msg.text}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatMessageList>
        <form
          className="relative rounded-lg border bg-background p-1"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <ChatInput
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>
            <Button size="sm" className="ml-auto gap-1.5" type="submit">
              Send
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
