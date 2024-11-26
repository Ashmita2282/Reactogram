import { useState } from "react";
import { useSelector } from "react-redux";
import { likeVideo, dislikeVideo } from "../Api/videoApi";

const useVideoActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user and token from Redux store
  const { user, token } = useSelector((state) => state.auth);
  const channelId = user?.data?.channel?._id; // Get channelId here

  // handleLike video hook
  const handleLike = async (videoId) => {
    const userId = user?.data?._id; // Validate userId

    if (!token || !userId || !channelId) {
      alert("You need to log in to like a video.");
      return;
    }

    setLoading(true);
    try {
      const response = await likeVideo(videoId, userId, token, channelId); // Pass channelId here
      alert(response.message || "Video liked successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to like the video.");
    } finally {
      setLoading(false);
    }
  };

  // handleDislike video hook
  const handleDislike = async (videoId) => {
    const userId = user?.data?._id;

    if (!token || !userId || !channelId) {
      alert("You need to log in to dislike a video.");
      return;
    }

    setLoading(true);
    try {
      const response = await dislikeVideo(videoId, userId, token, channelId); // Pass channelId here
      alert(response.message || "Video disliked successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dislike the video.");
    } finally {
      setLoading(false);
    }
  };

  return { handleLike, handleDislike, loading, error };
};

export default useVideoActions;
