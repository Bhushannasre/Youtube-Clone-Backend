// backend/routes/channelRoutes.js
import express from "express";
import { createChannel, getChannel, updateChannel, deleteChannel } from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.get("/:id", getChannel);
router.put("/:id", protect, updateChannel);
router.delete("/:id", protect, deleteChannel);

export default router;
