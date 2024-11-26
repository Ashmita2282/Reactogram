import axios from "axios";

const API_URL = "http://localhost:4000/api";

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    // Improved logging for debugging
    return response.data; // Return { success, message, data: token }
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);
    throw error; // Throw error for thunk to handle
  }
};

// Function to fetch the logged-in user's data
export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Improved logging for debugging
    return response.data; // Return the entire user data object
  } catch (error) {
    console.error(
      "Fetch User Data API error:",
      error.response?.data || error.message
    );
    throw error; // Throw error for thunk to handle
  }
};
