import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { commentText } = req.body; // Only the comment text is required from the request body
    const { videoId } = req.params; // Extract videoId from URL parameters
    const userId = req.user._id; // Extract userId from the authMiddleware (assumes it sets `req.user`)

    // Validate input
    if (!commentText) {
      return res.status(400).json({
        success: false,
        message: "commentText is required.",
      });
    }

    // Find the video
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    // Create a new comment in the Comment collection
    const newComment = new Comment({
      userId,
      videoId,
      commentText,
    });
    await newComment.save();

    // Update the Video model with the comment's ID
    video.comments.push(newComment._id);
    await video.save();

    // Update the User model with the most recent comment
    const user = await User.findById(userId);
    if (user) {
      user.comments.push(newComment._id); // Add to comments array
      user.recentComment = newComment._id;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment.",
      error: error.message,
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log("commentId:", commentId);
    const userId = req.user._id; // Extract userId from the authMiddleware (assumes it sets `req.user`)

    // Find the comment to verify ownership
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    // Check if the logged-in user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    // Proceed to delete the comment after ownership verification
    await comment.deleteOne();

    // Update the video document to remove the comment reference
    const video = await Video.findById(comment.videoId);
    if (video) {
      video.comments = video.comments.filter(
        (commentRef) => commentRef.toString() !== commentId
      );
      await video.save();
    }

    // --- Updating the User model related to this deleted comment ---
    const user = await User.findById(comment.userId);
    console.log("user:", user);

    if (user) {
      // Remove the commentId from the user's comments array
      user.comments = user.comments.filter(
        (id) => id.toString() !== commentId.toString()
      );

      // Update the recentComment field if it matches the deleted comment
      if (user.recentComment?.toString() === commentId.toString()) {
        user.recentComment =
          user.comments.length > 0
            ? user.comments[user.comments.length - 1] // Set to the last remaining comment
            : null; // If no comments are left, set recentComment to null
      }

      await user.save();
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found for the comment.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a comment
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log("commentId:", commentId);
    const { commentText } = req.body;
    console.log("commentText:", commentText);

    const userId = req.user._id; // Extract userId from the authMiddleware (assumes it sets `req.user`)

    // Validate input
    if (!commentText) {
      return res
        .status(400)
        .json({ success: false, message: "Comment text is required." });
    }

    // Find the comment to edit
    const comment = await Comment.findById(commentId);

    // If no comment is found, return a 404 error
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    // Check if the logged-in user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this comment.",
      });
    }

    // Update the comment
    comment.commentText = commentText;
    await comment.save();

    // --- Updating the User model related to this comment ---
    const user = await User.findById(comment.userId);
    console.log("user:", user);
    if (user) {
      const commentIndex = user.comments.indexOf(commentId);
      if (commentIndex === -1) {
        // If commentId is not already in the user's comments array, add it
        user.comments.push(commentId);
      }

      // Update recent comment if applicable
      if (user.recentComment?.toString() === commentId) {
        user.recentComment = comment._id;
      }
      await user.save();
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found for the comment.",
      });
    }

    // --- Updating the Video model related to this comment ---
    const video = await Video.findById(comment.videoId);
    console.log("video:", video);
    if (video) {
      const commentIndex = video.comments.indexOf(commentId);
      if (commentIndex === -1) {
        // If commentId is not already in the video's comments array, add it
        video.comments.push(commentId);
      }
      await video.save();
    } else {
      return res.status(404).json({
        success: false,
        message: "Video not found for the comment.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment edited successfully.",
      data: comment,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in editComment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }
};

// Fetch comments for a video
export const fetchComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ videoId }).populate(
      "userId",
      "userName"
    );

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
