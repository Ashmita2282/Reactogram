import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import create from "../assets/create.png";
import { logout, getUserData } from "../redux/slices/authSlice";

import {
  FaHome,
  FaFire,
  FaVideo,
  FaHeart,
  FaHistory,
  FaPlay,
  FaClock,
  FaMusic,
  FaGamepad,
  FaShoppingCart,
  FaTshirt,
  FaPodcast,
  FaNewspaper,
  FaFilm,
  FaMedal,
  FaYoutube,
  FaCog,
  FaFlag,
  FaQuestionCircle,
  FaCommentDots,
  FaUserCircle,
} from "react-icons/fa";
import CreateChannelModal from "./CreateChannelModal";
import UploadPopup from "./UploadPopup";

const Sidebar = ({ isOpen }) => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dropdownRef = useRef(null);

  const { user, token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token) {
      dispatch(getUserData());
    }
  }, [dispatch, token]);
  const hasChannel = user?.data?.channel?._id;
  const channelData = {
    channelId: user?.data?.channel?._id,
    channelName: user?.data?.channel?.channelName,
    channelBanner: user?.data?.channel?.channelBanner,
    description: user?.data?.channel?.description,
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleClick = () => {
    if (hasChannel) {
      setShowPopup(true);
    } else {
      toggleModal();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handlePopupSubmit = () => {
    setShowPopup(false);
    navigate(`/channel/${channelData.channelId}`, {
      state: channelData,
    });
  };
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`hidden z-1000 lg:block fixed mt-16 left-0 h-full z-20 bg-white shadow-md transition-all duration-300 overflow-y-auto ${
          isOpen ? "w-44" : "w-16"
        }`}
      >
        {/* Main Sections */}
        <ul className="mt-4 space-y-2 gap-2 justify-between lg:flex lg:flex-col">
          {/* Primary */}
          <li
            className={`flex items-center p-3 hover:bg-gray-200 ${
              isOpen ? "flex-row" : "flex-col"
            }`}
          >
            <FaHome className="text-xl" />
            {isOpen ? (
              <Link to="/">
                <span className="ml-3">Home</span>
              </Link>
            ) : (
              <Link to="/">
                <span className="mt-1 text-center text-sm">Home</span>
              </Link>
            )}
          </li>
          <li
            className={`flex items-center p-3 hover:bg-gray-200 ${
              isOpen ? "flex-row" : "flex-col"
            }`}
          >
            <FaFire className="text-xl" />
            {isOpen ? (
              <span className="ml-3">Shorts</span>
            ) : (
              <span className="mt-1 text-center text-sm">Shorts</span>
            )}
          </li>
          <li
            className={`flex items-center p-3 hover:bg-gray-200 ${
              isOpen ? "flex-row" : "flex-col"
            }`}
          >
            <FaVideo className="text-xl" />
            {isOpen ? (
              <span className="ml-3">Subscription</span>
            ) : (
              <span className="mt-1 text-center text-xs p-3">Subscription</span>
            )}
          </li>

          <li
            className={`flex items-center p-3 hover:bg-gray-200 ${
              isOpen ? "flex-row" : "flex-col"
            }`}
          >
            {/* User Profile Section */}
            {token ? (
              <div
                className={`flex items-center  hover:bg-gray-200 ${
                  isOpen ? "flex-row" : "flex-col"
                }`}
              >
                <img
                  src={user?.data?.profilePic || <FaUserCircle />}
                  alt="Profile"
                  className="h-8 w-8 object-cover rounded-full"
                />
                <span className="mt-1 text-center text-sm p-2">
                  {user?.data?.userName || "Sign In"}
                </span>
              </div>
            ) : (
              <Link
                to="/signin"
                className="text-red-600 hover:underline rounded-full border p-2 flex flex-col items-center "
              >
                <FaUserCircle className="text-red-600 text-2xl" />
              </Link>
            )}
            {/* <FaUserCircle className="text-xl" />
            {isOpen ? (
              <span className="ml-3">You</span>
            ) : (
              <span className="mt-1 text-center text-sm p-3">You</span>
            )} */}
          </li>

          {/* 'You' Section */}
          {isOpen && (
            <>
              <ul className="ml-8 space-y-2">
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaHistory className="text-xl" />
                  <span className="ml-3">History</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaPlay className="text-xl" />
                  <span className="ml-3">Playlists</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaClock className="text-xl" />
                  <span className="ml-3">Watch Later</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaHeart className="text-xl" />
                  <span className="ml-3">Liked Videos</span>
                </li>
              </ul>
              {/* Explore Section */}

              <li className="flex items-center p-3 hover:bg-gray-200">
                <FaFire className="text-xl" />
                {isOpen && <span className="ml-3">Explore</span>}
              </li>

              <ul className="ml-8 space-y-2">
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaFire className="text-xl" />
                  <span className="ml-3">Trending</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaShoppingCart className="text-xl" />
                  <span className="ml-3">Shopping</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaMusic className="text-xl" />
                  <span className="ml-3">Music</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaFilm className="text-xl" />
                  <span className="ml-3">Film</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaGamepad className="text-xl" />
                  <span className="ml-3">Gaming</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaNewspaper className="text-xl" />
                  <span className="ml-3">News</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaMedal className="text-xl" />
                  <span className="ml-3">Sports</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaTshirt className="text-xl" />
                  <span className="ml-3">Fashion & Beauty</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaPodcast className="text-xl" />
                  <span className="ml-3">Podcasts</span>
                </li>
              </ul>

              {/* More from YouTube */}

              <li className="flex items-center p-3 hover:bg-gray-200">
                <FaYoutube className="text-xl" />
                {isOpen && <span className="ml-3">More from YouTube</span>}
              </li>

              <ul className="ml-8 space-y-2">
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaYoutube className="text-xl" />
                  <span className="ml-3">YouTube Premium</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaYoutube className="text-xl" />
                  <span className="ml-3">YouTube Music</span>
                </li>
                <li className="flex items-center p-3 hover:bg-gray-200">
                  <FaYoutube className="text-xl" />
                  <span className="ml-3">YouTube Kids</span>
                </li>
              </ul>

              {/* Settings and Help */}
              <li className="flex items-center p-3 hover:bg-gray-200">
                <FaCog className="text-xl" />
                <span className="ml-3">Settings</span>
              </li>
              <li className="flex items-center p-3 hover:bg-gray-200">
                <FaFlag className="text-xl" />
                <span className="ml-3">Report History</span>
              </li>
              <li className="flex items-center p-3 hover:bg-gray-200">
                <FaQuestionCircle className="text-xl" />
                <span className="ml-3">Help</span>
              </li>
              <li className="flex items-center p-3 hover:bg-gray-200">
                <FaCommentDots className="text-xl" />
                <span className="ml-3">Send Feedback</span>
              </li>
            </>
          )}
        </ul>

        {/* Footer */}
        {isOpen && (
          <div className="p-3 bottom-4 left-4 right-4 text-xs text-gray-500">
            <p>
              About | Press | Copyright | Contact us | Creators | Developers
            </p>
            <p>Terms | Privacy | Policy & Safety | How YouTube works</p>
            <p>Test new features</p>
            <p className="mt-2">&copy; 2024 Google LLC</p>
          </div>
        )}
      </div>
      {/* Mobile Bottom Navigation */}
      <div className=" z-50 lg:hidden fixed bottom-0 w-full bg-white shadow-md flex justify-around py-2">
        <button className="flex flex-col items-center text-gray-600">
          <FaHome className="text-xl" />
          <Link to="/">
            <span className="ml-3">Home</span>
          </Link>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <FaFire className="text-xl" />
          <span className="text-xs">Shorts</span>
        </button>

        {/* User Profile Section */}
        {token ? (
          <div className="relative w-[40%] flex items-center space-x-4">
            {hasChannel ? (
              <button
                onClick={handleClick}
                className="flex flex-col items-center text-gray-600"
              >
                <img src={create} alt="Create" className="h-8 w-8 mr-3" />
                <span className="text-xs">Upload Video</span>
              </button>
            ) : (
              <button className="flex flex-col items-center text-gray-600">
                <FaVideo className="text-xl" />
                <span className="text-xs">Subscription</span>
              </button>
            )}
            {showPopup && (
              <UploadPopup
                onClose={() => setShowPopup(false)}
                onSubmit={handlePopupSubmit}
              />
            )}
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className="cursor-pointer"
            >
              <img
                src={user?.data?.profilePic || <FaUserCircle />}
                alt="Profile"
                className="h-8 w-8 object-cover rounded-full"
              />
            </div>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mb-2 w-64 bg-white border rounded-md shadow-lg z-50"
              >
                <div className="p-4 border-b">
                  <p className="font-semibold">{user?.data?.name || "User"}</p>
                  <p className="text-sm text-gray-600">{user?.data?.email}</p>
                </div>
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    {user?.data?.name || "User"}
                  </li>
                  {hasChannel ? (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        navigate(`/channel/${channelData.channelId}`, {
                          state: channelData,
                        })
                      }
                    >
                      Open Channel
                    </li>
                  ) : (
                    <button
                      onClick={toggleModal}
                      className="text-red-600 hover:underline"
                    >
                      Create a channel
                    </button>
                  )}
                  <CreateChannelModal
                    showModal={showModal}
                    toggleModal={toggleModal}
                  />
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("#")}
                  >
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Sign out
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signin"
            className="text-red-600 hover:underline rounded-full border p-2 flex items-center space-x-2"
          >
            <FaUserCircle className="text-red-600 text-2xl flex flex-col items-center " />
            <p className="">Sign In</p>
          </Link>
        )}
      </div>
    </>
  );
};

export default Sidebar;
