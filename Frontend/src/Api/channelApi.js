// src/Api/channelApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// API function to create a channel
export const createChannelApi = async (data, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-channel`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data; // Return successful response
  } catch (err) {
    // Suppress console error logs
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message); // Pass backend message
    } else {
      throw new Error("Error creating channel"); // Fallback error
    }
  }
};

// Suppress default Axios error logging
axios.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => {
    // Suppress error logging to the console
    return Promise.reject(error); // Reject to handle in the code without logging
  }
);

// API function to fetch channel data by ID
export const fetchChannelDataApi = async (channelId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/channel/${channelId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; // Assuming the channel data is under `data.data`
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch channel data"
    );
  }
};

