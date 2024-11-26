// controllers/videoController.js
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

// Fetch video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", " channelId  comments.userId uploadDate")
      .populate("channelId", " channelName");

    // Check if video is found
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Fetch all video
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploader", " channelId  comments.userId uploadDate")
      .populate("channelId", " channelName");

    if (videos.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No videos found.",
      });
    }

    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error("Error fetching videos:", error); // Log any errors encountered
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new video
export const addVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;
    // getting the user details from header
    const userId = req.user._id;

    // Check if the required fields are provided
    if (!title || !description || !thumbnailUrl || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, description, thumbnailUrl) are required.",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the user has a channel
    const userChannel = await Channel.findOne({ owner: userId });
    if (!userChannel) {
      return res.status(403).json({
        success: false,
        message: "You must create a channel before uploading videos.",
      });
    }

    // If the user has a channel, proceed to create a new video
    const newVideo = new Video({
      title,
      description,
      thumbnailUrl,
      category,
      videoUrl,
      channelId: userChannel._id, // Link video to the user's channel
      uploader: userId, // Set uploader to the current user's ID
    });

    userChannel.videos.push(newVideo._id);

    // Save the new video and update the user's channel
    await Promise.all([newVideo.save(), userChannel.save()]);

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully.",
      data: newVideo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like a video
export const likeVideo = async (req, res) => {
  try {
    const { userId, channelId } = req.body; // Receive both userId and channelId from the request body
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found." });
    }

    const isLiked = video.likes.some((like) => like.userId == userId);

    if (isLiked) {
      video.likes = video.likes.filter((like) => like.userId != userId);
    } else {
      video.likes.push({ userId });
      video.dislikes = video.dislikes.filter(
        (dislike) => dislike.userId != userId
      );
    }

    await video.save();

    const channel = await Channel.findById(channelId);
    if (channel) {
      const videoIndex = channel.videos.findIndex(
        (channelVideo) => channelVideo.videoId == video._id
      );
      if (videoIndex !== -1) {
        channel.videos[videoIndex].likes = video.likes.length;
        await channel.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Video liked successfully.",
      data: video,
    });
  } catch (error) {
    console.error("Error in likeVideo controller:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dislike a video
export const dislikeVideo = async (req, res) => {
  try {
    const { userId, channelId } = req.body; // Receive both userId and channelId from the request body
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found." });
    }

    const isDisliked = video.dislikes.some(
      (dislike) => dislike.userId == userId
    );

    if (isDisliked) {
      video.dislikes = video.dislikes.filter(
        (dislike) => dislike.userId != userId
      );
    } else {
      video.dislikes.push({ userId });
      video.likes = video.likes.filter((like) => like.userId != userId);
    }

    await video.save();

    const channel = await Channel.findById(channelId);
    if (channel) {
      const videoIndex = channel.videos.findIndex(
        (channelVideo) => channelVideo.videoId == video._id
      );
      if (videoIndex !== -1) {
        channel.videos[videoIndex].dislikes = video.dislikes.length;
        channel.videos[videoIndex].likes = video.likes.length;
        await channel.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Video disliked successfully.",
      data: video,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a comment to a video
export const addComment = async (req, res) => {
  try {
    const { userId, commentText, channelId } = req.body; // Receive both userId and channelId from the request body
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found." });
    }

    const newComment = { userId, commentText };
    video.comments.push(newComment);
    await video.save();

    const channel = await Channel.findById(channelId);
    if (channel) {
      const videoIndex = channel.videos.findIndex(
        (channelVideo) => channelVideo.videoId == video._id
      );
      if (videoIndex !== -1) {
        channel.videos[videoIndex].comments = video.comments.length;
        await channel.save();
      }
    }
    console.log("newComment", newComment);

    res.status(200).json({
      success: true,
      message: "Comment added successfully.",
      // data: { video, newComment },
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to fetch all comments for a given video
export const getComments = async (req, res) => {
  try {
    // Get the videoId from the URL parameters (assumes the route is /videos/:id/comments)
    const videoId = req.params.id;

    console.log;
    // Validate if the videoId is a valid ObjectId using Mongoose's Types.ObjectId method
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    // Fetch the video and its associated comments, populate the user details
    const video = await Video.findById(videoId).populate(
      "comments.userId",
      "userName"
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    // console.log("video", video);
    // Return the comments with user details
    const commentsWithUser = video.comments.map((comment) => ({
      commentText: comment.commentText, // Extract the comment text
      username: comment.userId, // Extract the username of the user who posted the comment
    }));
    console.log("commentsWithUser", commentsWithUser);

    res.status(200).json(commentsWithUser); // Send the comments as response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};

//Delete Video By id
export const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id; // Get video ID from URL params
    console.log("videoId", videoId);

    // getting the user details from header
    const userId = req.user._id;
    console.log("userId", userId);

    // Find the video to delete
    const video = await Video.findById(videoId);
    console.log("video", video);
    console.log("video", video);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    // Check if the authenticated user is the uploader
    if (video.uploader.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this video.",
      });
    }

    // Find the user's channel
    const userChannel = await Channel.findOne({ owner: userId });
    if (!userChannel) {
      return res.status(403).json({
        success: false,
        message: "You must have a channel to delete videos.",
      });
    }

    // Remove the video from the videos array in the channel
    userChannel.videos = userChannel.videos.filter(
      (id) => id.toString() !== videoId.toString()
    );

    // Save the updated channel and delete the video
    await Promise.all([userChannel.save(), Video.findByIdAndDelete(videoId)]);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit Video By ID
export const editVideo = async (req, res) => {
  try {
    const videoId = req.params.id; // Get video ID from URL params
    const { title, description, thumbnailUrl } = req.body; // Get updated video details from request body

    // getting the user details from header
    const userId = req.user._id;
    console.log("userId", userId);

    // Find the video to edit
    const video = await Video.findById(videoId);
    console.log("video", video);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    // Check if the authenticated user is the uploader
    if (video.uploader.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this video.",
      });
    }

    // Update video details
    video.title = title || video.title;
    video.description = description || video.description;
    video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;

    const updatedVideo = await video.save();

    // Update the video in the channel's video array
    const userChannel = await Channel.findOne({ owner: userId });
    if (!userChannel) {
      return res.status(404).json({
        success: false,
        message: "User channel not found.",
      });
    }

    userChannel.videos = userChannel.videos.map((vid) =>
      vid.toString() === videoId.toString() ? updatedVideo._id : vid
    );
    await userChannel.save();

    res.status(200).json({
      success: true,
      message: "Video updated successfully.",
      video: updatedVideo, // Return the updated video object
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// fetching video by channel id
export const getVideosByChannelId = async (req, res) => {
  try {
    const { id: channelId } = req.params; // Extract channel ID from URL params

    // Validate channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid channel ID.",
      });
    }

    // Fetch the authenticated user
    const user = req.user;

    // Fetch the channel details
    const channel = await Channel.findById(channelId)
      .populate("videos")
      .populate("owner", "name userName profilePic");

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found.",
      });
    }

    // Check if the logged-in user is the owner of the channel
    if (channel.owner._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this channel's videos.",
      });
    }

    // Fetch the videos associated with the channel
    const videos = await Video.find({ channelId: channel._id })
      .populate("uploader", "name userName profilePic")
      .populate("channelId", "channelName");

    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No videos found for this channel.",
      });
    }

    // Return the found videos
    res.status(200).json({
      success: true,
      data: videos,
      message: "Videos found successfully.",
    });
  } catch (error) {
    console.error("Error fetching videos by channel ID:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching videos.",
    });
  }
};
