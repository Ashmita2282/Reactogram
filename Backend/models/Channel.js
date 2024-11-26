// models ---> Channel.js
import mongoose, { Schema } from "mongoose";

// Channel Schema
const channelSchema = new Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    description: { type: String },
    channelBanner: { type: String },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
