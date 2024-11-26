import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// Function to Add comments for a specific video
export const addComment = async (videoId, commentText, token, userId) => {
  try {
    if (!videoId || typeof videoId !== "string") {
      console.error("Invalid video ID:", videoId);
      throw new Error("Invalid video ID.");
    }

    if (!commentText || !commentText.trim()) {
      console.error("Comment text is required.");
      throw new Error("Comment text cannot be empty.");
    }

    if (!userId) {
      console.error("User ID is required.");
      throw new Error("User ID is required.");
    }

    const response = await axios.post(
      `${API_BASE_URL}/add-comment/${videoId}`,
      {
        commentText: commentText,
      }, // Send only userId and commentText
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Comment added comment data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding comment:",
      error.response?.data || error.message
    );
    throw error; // Propagate the error to the caller
  }
};

// Function to fetch comments for a specific video
export const fetchComments = async (videoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments/${videoId}`);

    return response.data; // Return the response data
  } catch (err) {
    throw err; // Re-throw error for handling in the calling code
  }
};

// Function to edit comments for a specific video
export const editCommentApi = async (
  commentId,
  newCommentText,
  token,
  userId
) => {
  try {
    if (!commentId || !newCommentText) {
      throw new Error("Comment ID and text are required.");
    }

    if (!userId) {
      console.error("User ID is required.");
      throw new Error("User ID is required.");
    }
    const response = await axios.put(
      `${API_BASE_URL}/edit-comment/${commentId}`,
      {
        commentText: newCommentText,
      }, // Send only userId and commentText
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Comment edited data:", response.data);
    // If successful, return the response data
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error in editCommentApi:", error);
    throw error; // Throw error to handle it in the component or hook
  }
};

// Function to delete comments for a specific video
export const deleteCommentApi = async (commentId, token, userId) => {
  try {
    if (!commentId) {
      throw new Error("Comment ID is required.");
    }

    if (!userId) {
      console.error("User ID is required.");
      throw new Error("User ID is required.");
    }
    const response = await axios.delete(
      `${API_BASE_URL}/delete-comment/${commentId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Comment Deleted :", response.data);
    // If successful, return the response data
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw error; // Throw error to handle it in the component or hook
  }
};
