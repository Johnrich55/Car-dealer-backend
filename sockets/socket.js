import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";
import { v4 as uuid4 } from "uuid";

export default function socketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  /// server --> client

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    socket.on("sendMessage", async (mes) => {
      const { user_id, content, chat_id } = mes;
      const updatedChat = await Chat.findOneAndUpdate(
        { _id: chat_id },
        {
          $push: {
            messages: {
              id: uuid4(),
              user_id,
              content,
              sent_at: new Date(),
              is_read: false,
            },
          },
          $set: { last_updated: new Date() },
        },
        { new: true, runValidators: true }
      );
      console.log(updatedChat);
      io.emit("receiveMessage", mes);
    });

    socket.on("readMessage", async ({ message_id, chat_id, user_id }) => {
      // const chat = await Chat.findOne({ _id: chat_id });
      // if (!mongoose.Types.ObjectId.isValid(chat_id)) {
      //   console.log("Invalid chat_id:", chat_id);
      // }
      // if (!chat) {
      //   console.log("the is not chat with id");
      // }
      // const message = chat?.messages.find(
      //   (msg) => msg._id.toString() === message_id
      // );
      // if (!message) {
      //   console.log(
      //     `Message with id ${message_id} not found in chat ${chat_id}`
      //   );
      // }
      const updatedChat = await Chat.findOneAndUpdate(
        { _id: chat_id, "messages._id": message_id },
        { $set: { "messages.$.is_read": true } }
      );

      if (!updatedChat) {
        throw new Error("Chat or message not found");
      }
      const unreadCount = 0;

      io.emit("unRead", { chat_id, message_id, unreads: unreadCount });
    });

    socket.on("typing", (msg) => {
      const { chat_id } = msg;
      io.to(chat_id).emit("typing", msg);
    });
  });

  return io;
}
