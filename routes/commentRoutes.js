// backend/routes/commentRoutes.js
import express from "express";
import { addComment, getCommentsByVideo, updateComment, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:videoId", getCommentsByVideo);
router.post("/:videoId", protect, addComment);
router.put("/:id", protect, updateComment);    
router.delete("/:id", protect, deleteComment); 

export default router;
