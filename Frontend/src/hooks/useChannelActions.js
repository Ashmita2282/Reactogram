// src/Hooks/useChannelHooks.js
import { useState, useEffect } from "react";
import { createChannelApi, fetchChannelDataApi } from "../Api/channelApi";
import { fetchUserData } from "../redux/api/authApi";

// Hook for creating a channel
export const useChannelActions = () => {
  const [error, setError] = useState(""); // Error message
  const [success, setSuccess] = useState(""); // Success message
  const [existingChannelId, setExistingChannelId] = useState(null); // Existing channel ID

  const createChannel = async (
    channelName,
    description,
    channelBanner,
    token
  ) => {
    try {
      const data = { channelName, description, channelBanner };
      const response = await createChannelApi(data, token);

      setSuccess(response.message || "Channel created successfully"); // Set success message
      setError(""); // Clear error

      if (response.data && response.data._id) {
        setExistingChannelId(response.data._id); // Store the created channel ID
      }

      // Fetch updated user data with the populated channel ID
      const userResponse = await fetchUserData(token); // Fetch the latest user data
      if (userResponse.data && userResponse.data.channel) {
        setExistingChannelId(userResponse.data.channel._id); // Update with channel ID
      }

      return response.data; // Return the response data
    } catch (err) {
      setError(err.message); // Set error
      setSuccess(""); // Clear success
      return null; // Return null on error
    }
  };

  return {
    createChannel,
    error,
    success,
    existingChannelId,
  };
};

// Hook for fetching channel data (via channel ID)
export const useFetchChannel = (channelId, token) => {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const data = await fetchChannelDataApi(channelId, token);
        setChannel(data);
      } catch (err) {
        setError(err.message || "Failed to fetch channel.");
      } finally {
        setLoading(false);
      }
    };

    if (channelId) {
      fetchChannel();
    }
  }, [channelId, token]);

  return { channel, loading, error };
};

// Hook for fetching channel data (alternative fetch)
export const useFetchChannelData = (channelId, token) => {
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const data = await fetchChannelDataApi(channelId, token);
        setChannelData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (channelId && token) {
      fetchChannelData();
    }
  }, [channelId, token]);

  return { channelData, loading, error };
};
