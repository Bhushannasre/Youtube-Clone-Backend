import express from "express";
import { uploadVideo, getAllVideos, getVideoById } from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

//  Multer setup for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store thumbnails and videos separately
    if (file.fieldname === "thumbnail") {
      cb(null, path.join(__dirname, "../uploads/thumbnails"));
    } else {
      cb(null, path.join(__dirname, "../uploads/videos"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//  Accept both video and thumbnail fields
router.post(
  "/upload",
  protect,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

//  Get all videos
router.get("/", getAllVideos);

//  Get single video by ID
router.get("/:id", getVideoById);

export default router;
