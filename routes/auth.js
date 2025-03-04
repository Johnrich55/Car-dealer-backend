import { Router } from "express";
import User from "../models/User.js";
const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const user = await User.findOne({
      email,
      password,
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.json({
      user_name: user.username,
      email: user.email,
      id: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({
      email,
    });
    if (userExists) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    res
      .status(201)
      .json({ user_name: user.username, email: user.email, id: user._id });
  } catch (error) {}
});

export default router;
