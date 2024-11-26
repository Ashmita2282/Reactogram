import React, { useState } from "react";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners"; // Using ClipLoader from React
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { registerUser } from "../Api/registerApi"; // Importing registerUser API function

// Register Component
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      // Call registerUser from authApi.js
      const response = await registerUser(formData);

      // If registration is successful, show success alert
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: response.message,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate("/signin"); // <-- Redirect to login page after success
      });

      // Reset form fields after successful registration
      setFormData({
        name: "",
        userName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      // Show error alert if registration fails
      Swal.fire({
        icon: "error",
        title: "User with this email Or userName already exists",
        text:
          error.response && error.response.data
            ? error.response.data.error
            : "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="register-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md border border-gray-300">
        <h2 className="text-3xl font-semibold text-center text-black mb-6">
          Create Account
        </h2>

        {/* Display loading spinner */}
        {loading && (
          <div className="flex justify-center mb-4">
            <ClipLoader color="#ef4444" loading={loading} size={35} />
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            disabled={loading} // Disable button while loading
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-red-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;