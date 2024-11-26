import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center ml-96 h-screen w-full">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
        <p className="text-lg font-bold text-red-600 top-20 mt-5 left-4">
          Loading Videos...
        </p>
      </div>
    </div>
  );
};

export default Loading;
