// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
