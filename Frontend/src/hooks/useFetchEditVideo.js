import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useFetchEditVideo = () => {
  const token = useSelector((state) => state.auth.token); // Get token from Redux
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editVideo = async (videoId, updatedData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(
        `http://localhost:4000/api/video/edit/${videoId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("edit data",response.data);

      return response.data.video; // Return the updated video object
    } catch (err) {
      setError(err.response?.data?.message || "Error editing video");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editVideo, loading, error };
};

export default useFetchEditVideo;
