// backend/controllers/commentController.js
import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    // ✅ Create comment
    const comment = await Comment.create({
      video: videoId,
      user: req.user._id,
      text,
    });

    // ✅ Populate the 'user' field before sending response
    const populatedComment = await comment.populate("user", "username avatar");

    // ✅ Return the populated comment
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Add comment error:", err.message);
    res.status(500).json({ message: "Server error adding comment" });
  }
};


export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    // ✅ Directly fetch by videoId (string)
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Get comments error:", err.message);
    res.status(500).json({ message: "Server error fetching comments" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    comment.text = req.body.text || comment.text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("Update comment error:", err.message);
    res.status(500).json({ message: "Server error updating comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete comment error:", err.message);
    res.status(500).json({ message: "Server error deleting comment" });
  }
};

