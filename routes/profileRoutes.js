import express from "express";
import { getUserProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", protect, getUserProfile);

export default router;
