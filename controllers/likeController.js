import Video from "../models/videoModel.js";
import Like from "../models/Like.js";
import jwt from "jsonwebtoken";

// Helper to extract user ID from Bearer token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

// Helper: find a video by ObjectId or YouTube ID
const findVideo = async (videoId) => {
  let video = null;
  if (videoId.match(/^[0-9a-fA-F]{24}$/)) {
    video = await Video.findById(videoId);
  }
  if (!video) {
    video = await Video.findOne({
      $or: [
        { videoUrl: videoId },
        { videoUrl: { $regex: videoId, $options: "i" } }
      ],
    });
  }
  return video;
};

//  Like a video
export const likeVideo = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { videoId } = req.params;
    const video = await findVideo(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    let existing = await Like.findOne({ user: userId, video: video._id });

    if (existing && existing.reaction === "like") {
      // remove like
      await existing.deleteOne();
      video.likes = Math.max(0, (video.likes || 0) - 1);
    } else {
      // remove old dislike if present
      if (existing && existing.reaction === "dislike") {
        video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
        await existing.deleteOne();
      }
      await Like.create({ user: userId, video: video._id, reaction: "like" });
      video.likes = (video.likes || 0) + 1;
    }
    await video.save();

    res.status(200).json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    console.error("likeVideo error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Dislike a video
export const dislikeVideo = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { videoId } = req.params;
    const video = await findVideo(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    let existing = await Like.findOne({ user: userId, video: video._id });

    if (existing && existing.reaction === "dislike") {
      await existing.deleteOne();
      video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
    } else {
      if (existing && existing.reaction === "like") {
        video.likes = Math.max(0, (video.likes || 0) - 1);
        await existing.deleteOne();
      }
      await Like.create({ user: userId, video: video._id, reaction: "dislike" });
      video.dislikes = (video.dislikes || 0) + 1;
    }
    await video.save();

    res.status(200).json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    console.error("dislikeVideo error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Get reactions summary
export const getReactions = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await findVideo(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json({ likes: video.likes || 0, dislikes: video.dislikes || 0 });
  } catch (error) {
    console.error("getReactions error:", error);
    res.status(500).json({ message: error.message });
  }
};
