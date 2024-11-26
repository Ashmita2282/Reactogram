import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// API function to dislike a videos
export const likeVideo = async (videoId, userId, token, channelId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/video/${videoId}/like`,
      { userId, channelId }, // Send both userId and channelId in the body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Error liking video");
    }
  }
};

// API function to dislike a video
export const dislikeVideo = async (videoId, userId, token, channelId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/video/${videoId}/dislike`,
      { userId, channelId }, // Send both userId and channelId in the body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Error disliking video");
    }
  }
};
