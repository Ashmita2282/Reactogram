import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice"; // Import the login async thunk
import { useNavigate } from "react-router-dom"; // To navigate after successful login
import Swal from "sweetalert2"; // Import SweetAlert2

// Login Component
const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth); // Access loading and error states from Redux

  // Handle input changes for credentials
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Show loading spinner while logging in
    Swal.fire({
      title: "Logging in...",
      text: "Please wait while we log you in.",
      didOpen: () => {
        Swal.showLoading(); // Show loading spinner
      },
      allowOutsideClick: false, // Prevent closing while loading
    });

    dispatch(login(credentials)) // Dispatch login action with user credentials
      .unwrap()
      .then(() => {
        // Successfully logged in
        Swal.close(); // Close the loading spinner
        navigate("/"); // Redirect to home or dashboard after successful login
      })
      .catch((err) => {
        // Login failed, show error
        Swal.close(); // Close the loading spinner
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err?.message || "An unexpected error occurred.",
        });
      });
  };

  return (
    <div className="login-container  flex flex-col items-center mt-0 ml-0 justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md border border-gray-300">
        <h2 className="text-3xl font-semibold text-center text-black mb-6">
          Welcome Back
        </h2>
        {error && (
          <p className="text-center text-red-500 mb-4">
            {error.message || "An error occurred."}
          </p>
        )}
        {/* Display error message if any */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Email or Username"
              value={credentials.identifier}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
              onChange={(e) =>
                setCredentials({ ...credentials, identifier: e.target.value })
              }
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-red-600 hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
