// backend/models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  video: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
