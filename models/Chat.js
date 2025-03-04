import mongoose, { Schema } from "mongoose";

const MemberSchema = new Schema({
  user_id: { type: String, required: true }, // Consider Schema.Types.ObjectId if linking to User
  user_name: { type: String, required: true }, // Removed default: "" since required
  img_url: { type: String, default: "" },
});

const MessageSchema = new Schema({
  user_id: { type: String, required: true },
  content: { type: String, required: true },
  sent_at: { type: Date, required: true, default: Date.now }, // Changed to Date
  is_read: { type: Boolean, required: true, default: false },
});

const ChatSchema = new Schema({
  chat_type: { type: String, required: true },
  members: { type: [MemberSchema], required: true },
  created_at: { type: Date, required: true, default: Date.now },
  last_updated: { type: Date, default: Date.now }, // Fixed typo
  messages: { type: [MessageSchema], default: [] },
});

ChatSchema.index({ "members.user_id": 1 }); // Index for querying by user_id

export default mongoose.model("Chat", ChatSchema);
