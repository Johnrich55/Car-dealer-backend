import { Router } from "express";
import jwt from "jsonwebtoken"; // Import JWT
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser"; // Import cookie parser

dotenv.config();
const router = Router();

// Middleware to parse cookies
router.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with env variable

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password (Use bcrypt for hashing)
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        user_name: user.username,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user = new User({
      username,
      email,
      role,
      password,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, email, user_name: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register" });
  }
});

// LOGOUT ROUTE
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    sameSite: "None",
    secure: true, 
  });

  res.json({ message: "Logged out successfully" });
});

export default router;
