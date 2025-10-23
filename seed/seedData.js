// backend/seed/seedData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/videoModel.js";
import Comment from "../models/Comment.js";
import url from "url";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("🌱 Seed skipped: DB already has users.");
      return;
    }

    const hashed = await bcrypt.hash("password123", 10);

    const user1 = await User.create({
      username: "JohnDoe",
      email: "john@example.com",
      password: hashed,
    });

    const user2 = await User.create({
      username: "JaneDoe",
      email: "jane@example.com",
      password: hashed,
    });

    const ch1 = await Channel.create({
      channelName: "Code with John",
      owner: user1._id,
      description: "Coding tutorials",
    });

    const ch2 = await Channel.create({
      channelName: "Jane's Tech",
      owner: user2._id,
      description: "Gadgets and reviews",
    });

    const v1 = await Video.create({
      title: "Learn React in 30 Minutes",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      description: "Quick React tutorial",
      channel: ch1._id,
      views: 15200,
      likes: 1023,
      category: "Education",
    });

    const v2 = await Video.create({
      title: "Build MERN App - Full Tutorial",
      videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
      description: "MERN stack tutorial",
      channel: ch1._id,
      views: 54000,
      likes: 4200,
      category: "Education",
    });

    const v3 = await Video.create({
      title: "Top 10 Tech Gadgets 2024",
      videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
      thumbnailUrl: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
      description: "Gadget reviews",
      channel: ch2._id,
      views: 8800,
      likes: 560,
      category: "Technology",
    });

    ch1.videos.push(v1._id, v2._id);
    ch2.videos.push(v3._id);
    await ch1.save();
    await ch2.save();

    await Comment.create({
      video: v1._id,
      user: user2._id,
      text: "Great video! Very helpful.",
    });

    await Comment.create({
      video: v1._id,
      user: user1._id,
      text: "Thanks for watching!",
    });

    console.log("✅ Seed completed successfully.");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    // ⚠️ Close only if this script is run directly (not when imported by server.js)
    const isMainModule = import.meta.url === url.pathToFileURL(process.argv[1]).href;
    if (isMainModule) {
      await mongoose.connection.close();
      console.log("🔒 Connection closed after manual seed.");
    }
  }
};

// Allow manual run: `node backend/seed/seedData.js`
const isMainModule = import.meta.url === url.pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  seed();
}

export default seed;
