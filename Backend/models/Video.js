// models/Video.js
import mongoose, { Schema } from "mongoose";

// Define schema for video data
const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
      // default: "https://youtu.be/tBgNpc39FJk?t=15",
    }, // URL for the video file
    description: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel", // Reference to the uploader's channel
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who uploaded the video
      required: true,
    },
    views: {
      type: Number,
      default: 150,
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to users who liked the video
        },
      },
    ],
    dislikes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to users who disliked the video
        },
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to comments on the video
      },
    ],
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      default: "All",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
