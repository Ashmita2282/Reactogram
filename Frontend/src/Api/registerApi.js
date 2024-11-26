// src/api/authApi.js

import axios from "axios";

// Register API call
export const registerUser = async (formData) => {
  const response = await axios.post(
    "http://localhost:4000/api/register",
    formData
  );
  return response.data; // { success, message, data }
};
