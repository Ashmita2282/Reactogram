import { useState } from "react";
import { useChannelActions } from "../hooks/useChannelActions";
import { Link } from "react-router-dom";

// CreateChannelModal component
const CreateChannelModal = ({ showModal, toggleModal }) => {
  const [channelName, setChannelName] = useState(""); // State for channel name
  const [description, setDescription] = useState(""); // State for description
  const [channelBanner, setChannelBanner] = useState(""); // State for channel banner
  const [channelDetails, setChannelDetails] = useState(null); // State to store created channel details

  const { createChannel, error, success } = useChannelActions(); // Using custom hook for actions

  const handleCreateChannel = async () => {
    const token = localStorage.getItem("authToken"); // Fetch token from localStorage
    const createdChannel = await createChannel(
      channelName,
      description,
      channelBanner,
      token
    );

    if (createdChannel) {
      setChannelDetails(createdChannel); // Save the response data (includes channelId)
    }
  };

  

  return (
    showModal && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={toggleModal} // Close modal when clicking outside
      >
        <div
          className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
        >
          <h2 className="text-2xl font-bold mb-4">Create a Channel</h2>
          <p className="mb-4">
            To create a new channel, please enter your details below.
          </p>
          {console.log("channel id ", channelDetails)}
          {channelDetails && console.log("Channel ID:", channelDetails._id)}
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display errors */}
          {success && <p className="text-green-500">{success}</p>}{" "}
          {/* Display success */}
          <input
            type="text"
            placeholder="Channel Name"
            className="w-full p-2 border rounded mb-4"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)} // Update state
            required
          />
          <input
            type="text"
            placeholder="Channel Description"
            className="w-full p-2 border rounded mb-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update state
            required
          />
          <input
            type="text"
            placeholder="Channel Banner (Please paste an img URL here)"
            className="w-full p-2 border rounded mb-4"
            value={channelBanner}
            onChange={(e) => setChannelBanner(e.target.value)} // Update state
            required
          />
          <div className="flex justify-end">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              onClick={toggleModal} // Close modal
            >
              Cancel
            </button>
            {channelDetails ? (
              <Link
                to={`/channel/${channelDetails._id}`}
                state={{
                  channelName: channelDetails.channelName,
                  description: channelDetails.description,
                  channelBanner: channelDetails.channelBanner,
                }}
              >
                <button className="bg-red-600 text-white px-4 py-2 rounded">
                  Go to Channel
                </button>
              </Link>
            ) : (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleCreateChannel} // Create channel on click
              >
                Create
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default CreateChannelModal;
