import mongoose, { Schema } from "mongoose";

const user = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  role: { type: String, require: true },
  password: { type: String, required: true },
  searchHistory: [
    {
      brand: String,
      model: String,
      location: String,
      year: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", user);
export default User;
