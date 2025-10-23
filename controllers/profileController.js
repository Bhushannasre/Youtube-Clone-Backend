import User from "../models/User.js";
import Video from "../models/videoModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch user's uploaded videos
    const videos = await Video.find({ channel: user.channel }).sort({ createdAt: -1 });

    res.status(200).json({ user, videos });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
