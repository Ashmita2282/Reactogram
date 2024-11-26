import { useState } from "react";
import { useSelector } from "react-redux";

// Custom hook to add a video
const useAddVideo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth); // Ensure `token` is in Redux

  const addVideo = async (videoData) => {
    setLoading(true);
    setError(null);

    try {
      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        "http://localhost:4000/api/video/add-video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use token from Redux
          },
          body: JSON.stringify(videoData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video.");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error while uploading:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addVideo, loading, error };
};

export default useAddVideo;
