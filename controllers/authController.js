// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "Please provide all fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({ user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }, token: generateToken(user._id) });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }, token: generateToken(user._id) });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error logging in" });
  }
};

export const getMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ user: req.user });
};
