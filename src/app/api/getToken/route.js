import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

export async function POST(req) {
  const { userId } = await req.json();
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  if (!apiSecret) {
    return NextResponse.json(
      { error: 'API secret is missing' },
      { status: 500 }
    );
  }

  const client = StreamChat.getInstance(apiKey, apiSecret);
  const token = client.createToken(userId);

  return NextResponse.json({ token });
}
