// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StreamChat } from "stream-chat";

export default function handler(req, res) {
  try {
    const { id } = JSON.parse(req.body);

    if (!id) {
      console.error("Missing id in request body:", req.body);
      return res.status(400).json({ error: "id is required" });
    }

    // Log the values being used
    console.log("Generating token for id:", id);
    console.log("Using API key:", process.env.NEXT_PUBLIC_STREAM_API_KEY);
    console.log(
      "Using API secret:",
      process.env.STREAM_API_SECRET ? "exists" : "missing"
    );

    const serverClient = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );

    const token = serverClient.createToken(id);

    if (!token) {
      throw new Error("Token generation failed");
    }

    console.log("Token generated successfully", token);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({
      error: "Failed to generate token",
      details: error.message,
      id: req.body.id,
    });
  }
}
