import { StreamChat } from 'stream-chat';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY; // Access environment variable properly
const client = StreamChat.getInstance(API_KEY); // Use API_KEY variable

export default client;
