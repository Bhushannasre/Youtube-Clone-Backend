// backend/models/Like.js
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  reaction: { type: String, enum: ["like", "dislike"], required: true },
}, { timestamps: true });

export default mongoose.model("Like", likeSchema);
