import { useState } from "react";
import { useSelector } from "react-redux";

// Custom hook to delete a video
export const useFetchDeleteVideo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useSelector((state) => state.auth); // Ensure `token` is in Redux

  const deleteVideo = async (videoId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      console.log(videoId);
      const response = await fetch(
        `http://localhost:4000/api/video/delete/${videoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the request headers
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error deleting video.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteVideo, loading, error, success };
};
