import Video from "../models/videoModel.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Upload a new video
export const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Access uploaded files
    const videoFile = req.files?.videoFile?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const newVideo = new Video({
      title,
      description,
      videoUrl: `/uploads/videos/${videoFile.filename}`,
      thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
      user: req.user._id,
    });

    await newVideo.save();

    res.status(201).json({
      message: " Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({
      message: "Error uploading video",
      error: error.message,
    });
  }
};

//  Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("user", "name email");
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};

//  Get single video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("user", "name email");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Error fetching video", error: error.message });
  }
};
