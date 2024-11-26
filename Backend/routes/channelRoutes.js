// routes/channelRoutes.js
import express from "express";
import {
  createChannel,
  getChannelById,
} from "../controllers/channelController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new channel
router.post("/create-channel", authMiddleware, createChannel);

// Get channel by id
router.get("/channel/:channelId", authMiddleware, getChannelById);

export default router;
