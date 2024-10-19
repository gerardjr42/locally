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
  const { user } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatDetails, setChatDetails] = useState(null);
  const { chatId } = params;

  console.log('chatId: ', chatId);

  useEffect(() => {
    async function fetchChatDetails() {
      const { data: chatData, error } = await supabase
        .from('Messages')
        .select('*')
        .eq('id', chatId)
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

  console.log('chatDetails:', chatDetails);

  if (!chatDetails) {
    return <div>Loading chat...</div>;
  }

  return (
    <div className="Chat">
      <NavigationBar />
      <div className="Chat-header">
        <h1>Chat with Blank</h1>
      </div>
      <div className="Chat-container">
        <ChatMessageList>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              variant={msg.user1_id === user.id ? 'sent' : 'received'}
            >
              <ChatBubbleAvatar
                fallback={msg.user1_id === user.id ? 'You' : 'User'}
              />
              <ChatBubbleMessage
                variant={msg.user1_id === user.id ? 'sent' : 'received'}
              >
                {msg.text}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatMessageList>
        <form
          className="relative rounded-lg border bg-background p-1"
          //   onSubmit={}
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
