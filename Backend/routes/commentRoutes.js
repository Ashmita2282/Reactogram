// routes/channelRoutes.js
import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  fetchComments,
} from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Add comment to a video
router.post("/add-comment/:videoId", authMiddleware, addComment);

// Fetch comments of a video
router.get("/comments/:videoId", fetchComments);

// Edit comment
router.put("/edit-comment/:commentId", authMiddleware, editComment);

// Delete comment
router.delete("/delete-comment/:commentId", authMiddleware, deleteComment);


export default router;
