import mongoose, { Schema } from "mongoose";

const user = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  role: { type: String, require: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", user);
export default User;
