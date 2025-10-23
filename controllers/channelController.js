// backend/controllers/channelController.js
import Channel from "../models/Channel.js";
import Video from "../models/videoModel.js";
import User from "../models/User.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;
    if (!channelName) return res.status(400).json({ message: "Channel name required" });

    const channel = await Channel.create({
      channelName,
      description: description || "",
      channelBanner: channelBanner || "",
      owner: req.user._id
    });

    // add channel to user's channels list
    await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });

    res.status(201).json(channel);
  } catch (err) {
    console.error("Create channel error:", err.message);
    res.status(500).json({ message: "Server error creating channel" });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate({ path: "videos", options: { sort: { createdAt: -1 } } });
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    console.error("Get channel error:", err.message);
    res.status(500).json({ message: "Server error fetching channel" });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    const { channelName, description, channelBanner } = req.body;
    channel.channelName = channelName || channel.channelName;
    channel.description = description || channel.description;
    channel.channelBanner = channelBanner || channel.channelBanner;
    await channel.save();
    res.json(channel);
  } catch (err) {
    console.error("Update channel error:", err.message);
    res.status(500).json({ message: "Server error updating channel" });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    // remove videos of channel
    await Video.deleteMany({ channel: channel._id });

    // remove channel reference from user
    await User.findByIdAndUpdate(req.user._id, { $pull: { channels: channel._id } });

    await channel.remove();
    res.json({ message: "Channel deleted" });
  } catch (err) {
    console.error("Delete channel error:", err.message);
    res.status(500).json({ message: "Server error deleting channel" });
  }
};
