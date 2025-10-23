// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import seed from "./seed/seedData.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Enable static access for uploaded videos/thumbnails
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connection successful");

    await seed();

    // ✅ Register all routes
    app.use("/api/auth", authRoutes);
    app.use("/api/channels", channelRoutes);
    app.use("/api/videos", videoRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/likes", likeRoutes);
    app.use("/api/profile", profileRoutes);

    // Health check
    app.get("/", (req, res) => res.send("YouTube Clone Backend is running ✅"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
  }
};

startServer();
