import { Router } from "express";
import Chat from "../models/Chat.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    const chats = await Chat.find({
      members: { $elemMatch: { user_id } },
    });
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});
router.post("/", async (req, res) => {
  try {
    const one_chat = req.body;
    console.log(req.body);

    if (!one_chat.chat_type || !one_chat.members) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields" });
    }

    // Create new chat
    const chat = new Chat({
      ...one_chat,
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error("Error creating chat:", err);
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ error: "Chat ID already exists" });
    }
    res.status(500).json({ error: "Failed to create chat" });
  }
});
router.get("/messages", async (req, res) => {
  const { chat_id } = req.query;
  const chat = await Chat.findOne({ _id: chat_id });
  res.json(chat);
});
router.get("/messages/id", async (req, res) => {
  const { message_id, chat_id } = req.query;
  const chat = await Chat.findOne({ _id: chat_id });
  const filterd = chat?.messages.filter((msg) => msg._id === message_id);
  res.json(filterd);
});
export default router;
