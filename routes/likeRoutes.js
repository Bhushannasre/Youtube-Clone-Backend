import express from "express";
import { likeVideo, dislikeVideo, getReactions } from "../controllers/likeController.js";

const router = express.Router();

router.get("/:videoId", getReactions);
router.post("/like/:videoId", likeVideo);
router.post("/dislike/:videoId", dislikeVideo);


export default router;
