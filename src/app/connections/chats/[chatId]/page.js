// get chat id
// get user tokens for both users
// description > copy schema > ask chatgpt how to get the data from the table and integreate into messsges table. im using supbase and getstream
'use client'; // Add this line at the top to mark it as a client component
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { NavigationBar } from '@/components/navigation-bar';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import './Chat.scss';

export default function Chat() {
  return (
    <div className="Chat">
      <NavigationBar />
      <div className="Chat-header">
        <h1>
          <span>Movies in the Park chat with</span> Hudson
        </h1>
      </div>
      <div className="Chat-container">
        <ChatMessageList>
          <ChatBubble variant="sent">
            <ChatBubbleAvatar fallback="H" />
            <ChatBubbleMessage variant="sent">
              Hello, how has your day been? I hope you are doing well.
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="A" />
            <ChatBubbleMessage variant="received">
              Hi, I am doing well, thank you for asking. How can I help you
              today?
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="A" />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        </ChatMessageList>
        <div>
          <h2>Confirm my attendance</h2>
          <button>Confirm</button>
        </div>
      </div>
    </div>
  );
}
