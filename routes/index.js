import { Router } from "express";
import Chat from "../models/Chat.js";
import chatroute from "./chat.js";
import authroute from "./auth.js";
const router = Router();

router.use("/auth", authroute);
router.use("/conversations", async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
});
router.use("/chats", chatroute);

export default router;
