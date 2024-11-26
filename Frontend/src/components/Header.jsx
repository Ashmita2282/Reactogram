import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUserData } from "../redux/slices/authSlice";
import logo from "../assets/logo.png";
import CreateChannelModal from "../components/CreateChannelModal";
import create from "../assets/create.png";
import UploadPopup from "./UploadPopup"

const Header = ({ onSearch, toggleSidebar, isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (token) {
      dispatch(getUserData());
    }
  }, [dispatch, token]);

  const toggleModal = () => setShowModal(!showModal);

  const hasChannel = user?.data?.channel?._id;
  const channelData = {
    channelId: user?.data?.channel?._id,
    channelName: user?.data?.channel?.channelName,
    channelBanner: user?.data?.channel?.channelBanner,
    description: user?.data?.channel?.description,
  };

  const handleClick = () => {
    if (hasChannel) {
      setShowPopup(true);
    } else {
      toggleModal();
    }
  };

  const handlePopupSubmit = () => {
    setShowPopup(false);
    // navigate(`/channel/${channelData.channelId}`, {
    //   state: channelData,
    // });
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showDropdown]);

  return (
    <header className="flex z-50 items-center justify-between h-18 bg-white p-4 fixed w-full">
      {/* Sidebar and Logo */}
      <div className="flex items-center w-[30%] ">
        <button onClick={toggleSidebar} className="pr-5 hidden lg:block">
          <FaBars size={24} className="black" />
        </button>
        <img src={logo} alt="Logo" className="h-10 w-34" />
      </div>

      {/* Search Bar */}
      <div className="lg:w-[60%] w-[70%] flex justify-center items-center">
        {/* Search Input Container */}
        <div className="flex items-center bg-gray-200 rounded-full w-[100%] lg:w-[60%] overflow-hidden">
          {/* Input Field */}
          <input
            type="text"
            className="flex-grow lg:flex px-4 py-2 text-sm bg-transparent outline-none text-gray-700"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          {/* Search Button */}
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-r-lg flex justify-center items-center"
            onClick={handleSearch}
          >
            <FaSearch className="text-gray-600 text-lg cursor-pointer" />
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      {token ? (
        <div className="hidden justify-end relative w-[40%] lg:flex items-center space-x-4">
          {hasChannel && (
            <button
              onClick={handleClick}
              className="flex flex-col justify-center items-center"
            >
              <img src={create} alt="Create" className="h-8 w-8 mr-3" />
              <span className="text-sm font-bold">Upload Video</span>
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
            className="cursor-pointer text-red-600 hover:underline rounded-full border p-2 lg:flex items-center space-x-2"
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
              className="absolute right-0 mt-44 w-64 bg-white border rounded-md shadow-lg z-50"
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
                  Home
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
                    className="text-red-600 hover:underline pl-1"
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
          className="hidden text-red-600 hover:underline rounded-full border p-2 lg:flex items-center space-x-2"
        >
          <FaUserCircle className="text-red-600 text-2xl" />
          <p className="">Sign In</p>
        </Link>
      )}
    </header>
  );
};

export default Header;
