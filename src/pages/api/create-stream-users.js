import { StreamChat } from "stream-chat";

export default async function handler(req, res) {
  try {
    const { users } = JSON.parse(req.body);

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ error: "users array is required" });
    }

    const serverClient = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );

    // Create users in Stream
    await Promise.all(
      users.map((user) =>
        serverClient.upsertUser({
          id: user.id,
          name: user.name,
          image: user.image,
        })
      )
    );

    res.status(200).json({ message: "Users created successfully" });
  } catch (error) {
    console.error("Error creating users:", error);
    res.status(500).json({ error: "Failed to create users" });
  }
}
