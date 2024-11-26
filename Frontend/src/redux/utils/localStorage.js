import { jwtDecode } from "jwt-decode";

// Save token to local storage
export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Retrieve token from local storage and check expiry
export const getToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token || isTokenExpired(token)) {
    removeToken(); // Clear expired token
    return null;
  }
  return token;
};

// Remove token from local storage
export const removeToken = () => {
  localStorage.removeItem("authToken");
};

// Check if a JWT token is expired
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token); // Decode token to get expiry
    return Date.now() >= exp * 1000; // Check if current time is past expiry
  } catch (error) {
    console.error("Token decode error:", error.message);
    return true; // Treat decoding issues as expired
  }
};