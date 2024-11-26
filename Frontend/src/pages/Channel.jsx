import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFetchVideosByChannelId } from "../hooks/useFetchVideos"; // Import your custom hook
import { useFetchDeleteVideo } from "../hooks/useFetchDeleteVideo"; // Import the delete hook
import useFetchEditVideo from "../hooks/useFetchEditVideo"; // Import the edit hook
import VideoCard from "../components/VideoCard";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import UploadPopup from "../components/UploadPopup";
import create from "../assets/create.png";
import channelIm from "../assets/channelIm.jpg";
import ChannelBanner from "../assets/ChannelBanner.jpg";

// Channel Component
const Channel = () => {
  const location = useLocation();

  const { channelId, channelName, channelBanner, description } =
    location.state || {};

  const [videos, setVideos] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const { fetchvideos, loading, error } = useFetchVideosByChannelId(channelId);

  const handlePopupSubmit = () => {
    setShowPopup(false);
    navigate(`/channel/${channelData.channelId}`, {
      state: channelData,
    });
  };

  useEffect(() => {
    if (fetchvideos) {
      setVideos(fetchvideos);
    }
  }, [fetchvideos]);

  const {
    deleteVideo,
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useFetchDeleteVideo();

  const {
    editVideo,
    loading: editLoading,
    error: editError,
  } = useFetchEditVideo();

  const [editVideoData, setEditVideoData] = useState({
    id: "",
    title: "",
    description: "",
    thumbnailUrl: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteVideo = async (videoId) => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await deleteVideo(videoId, token);

      setVideos((prevVideos) =>
        prevVideos.filter((video) => video._id !== videoId)
      );
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };

  const handleEditClick = (video) => {
    setEditVideoData({
      id: video._id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
    });
    setIsModalOpen(true); // Open the modal
  };

  const handleEditVideo = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const updatedVideo = await editVideo(editVideoData.id, {
        title: editVideoData.title,
        description: editVideoData.description,
        thumbnailUrl: editVideoData.thumbnailUrl,
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === updatedVideo._id ? updatedVideo : video
        )
      );

      setEditVideoData({
        id: "",
        title: "",
        description: "",
        thumbnailUrl: "",
      });

      setIsModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Failed to edit video:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-20 w-full z-0">
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src={channelBanner || ChannelBanner}
          alt="Channel Banner"
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex">
          <img
            src={channelIm || "defaultImage.jpg"}
            alt="Img"
            className="h-24 w-24 object-cover mr-2 border p-2 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {channelName || "Default Channel Name"}
            </h1>
            <p className="text-gray-600">
              {description || "No description provided"}
            </p>
            <button className="text-white text-sm p-2 border rounded-2xl bg-gray-900 ">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center mt-4">
          <Loading />
        </div>
      )}

      {error && <div className="text-center text-red-500 mt-4">{error}</div>}

      <div className="h-[1px] bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 my-5"></div>

      <div className="mt-6 z-0">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="relative bg-white p-4">
                {/* Video Card */}

                <Link to={`/videoPlayer/${video._id}`} key={video._id}>
                  <VideoCard video={video} />
                </Link>

                {/* Buttons Container */}
                <div className="flex z-0 justify-between items-center absolute  bottom-32 left-4 ml-40  ">
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="px-8 pr-0 rounded text-red-600  transition-all"
                  >
                    {deleteLoading ? (
                      "Deleting..."
                    ) : (
                      <i className="fa-solid fa-trash-arrow-up"></i>
                    )}
                  </button>
                  <button
                    onClick={() => handleEditClick(video)}
                    className="py-1 pr-0 text-green-600 pl-2 rounded  transition-all"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="flex flex-col items-center justify-center mt-8 space-y-6">
              {/* Animated Gradient Text */}
              <div className="text-4xl font-extrabold animate-pulse">
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  No Videos Found
                </span>
              </div>

              {/* Encouragement to Upload */}
              <div className="relative flex flex-col items-center w-full lg:w-[40%]">
                <p className="text-gray-600 text-lg mb-2">
                  Why not upload your first video?
                </p>
                <button
                  onClick={() => setShowPopup(true)}
                  className="hidden lg:flex items-center px-6 animate-bounce py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <img
                    src={create}
                    alt="Create"
                    className="h-8 w-8 mr-3 animate-spin-slow"
                  />
                  <span className="text-lg font-bold">Upload Video</span>
                </button>

                {showPopup && (
                  <UploadPopup
                    onClose={() => setShowPopup(false)}
                    onSubmit={handlePopupSubmit}
                    className="z-1000"
                  />
                )}
              </div>

              {/* Bouncing Subtle Icon */}
              <div className="mt-4">
                <svg
                  className="w-14 h-14 text-indigo-300 animate-bounce"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v4m0 0v4m0-4H8m4 0h4m4 6H4m0 0h4m-4 0v4m0-4v-4"
                  />
                </svg>
              </div>
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Video</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditVideo();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Title"
                value={editVideoData.title}
                onChange={(e) =>
                  setEditVideoData({ ...editVideoData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={editVideoData.description}
                onChange={(e) =>
                  setEditVideoData({
                    ...editVideoData,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Thumbnail URL"
                value={editVideoData.thumbnailUrl}
                onChange={(e) =>
                  setEditVideoData({
                    ...editVideoData,
                    thumbnailUrl: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
              {editError && <p className="text-red-500 mt-2">{editError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;
