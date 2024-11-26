import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import errorImg from "../assets/error.png";

// Create a NotFound component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-6xl font-extrabold text-red-600">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Oops! Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-700">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Go to Homepage
      </Link>
      <img
        src={errorImg} //
        alt="Not Found"
        className="mt-6 mb-4 w-1/2 md:w-1/3 "
      />
    </div>
  );
}

export default NotFound;
