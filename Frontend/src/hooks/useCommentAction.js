import { useSelector } from "react-redux";
import {
  addComment,
  fetchComments,
  editCommentApi,
  deleteCommentApi,
} from "../Api/commentApi";
import { useState, useEffect } from "react";

// Custom hook to handle comment actions
const useCommentAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, token } = useSelector((state) => state.auth);
  const userId = user?.data?._id; // Get userId here
  console.log("User ID:", userId);
  console.log("Token:", token);

  const handleAddComment = async (videoId, commentText) => {
    if (!token || !userId) {
      alert("You need to log in to add a comment.");
      return;
    }

    // Trim any extra spaces and check if the comment text is not empty
    const trimmedCommentText = commentText.trim();
    if (!trimmedCommentText) {
      console.error("Comment text is required.");
      alert("Comment text cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await addComment(
        videoId,
        trimmedCommentText,
        token,
        userId
      ); // Pass userId and videoId
      alert(response.message || "Comment added successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add the comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchComment = (videoId) => {
    const [comments, setComments] = useState([]); // State for comments
    const [fetchLoading, setFetchLoading] = useState(false); // State for loading
    const [fetchError, setFetchError] = useState(null); // State for error

    useEffect(() => {
      if (!videoId) return; // Ensure videoId is available

      const loadComments = async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
          const response = await fetchComments(videoId); // Fetch comments from API
          setComments(response.data); // Update comments state
        } catch (err) {
          setFetchError(
            err.response?.data?.message || "Failed to fetch comments."
          );
        } finally {
          setFetchLoading(false);
        }
      };

      loadComments();
    }, [videoId]); // Dependency array ensures effect runs when videoId changes

    return { comments, fetchLoading, fetchError };
  };

  const handleEditComment = async (commentId, newCommentText) => {
    if (!token || !userId) {
      alert("You need to log in to add a comment.");
      return;
    }

    // Trim any extra spaces and check if the comment text is not empty
    const trimmedCommentText = newCommentText.trim();
    if (!trimmedCommentText) {
      console.error("Comment text is required.");
      alert("Comment text cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await editCommentApi(
        commentId,
        trimmedCommentText,
        token,
        userId
      ); // Call the API
      alert(response.message || "Comment added successfully.");
    } catch (err) {
      console.error("Error in useEditComment:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while editing the comment."
      ); // Set error state
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!token || !userId) {
      alert("You need to log in to add a comment.");
      return;
    }

    setLoading(true);

    try {
      const response = await deleteCommentApi(commentId, token, userId); // Call the API
      alert(response.message || "Comment Deleted successfully.");
    } catch (err) {
      console.error("Error in deleteCommentApi:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while editing the comment."
      ); // Set error state
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return {
    handleAddComment,
    handleFetchComment,
    handleEditComment,
    handleDeleteComment,
    loading,
    error,
  };
};

export default useCommentAction;
