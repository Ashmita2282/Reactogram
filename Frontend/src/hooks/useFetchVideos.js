// import { useEffect, useState } from "react";

// export const useFetchVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/api/video");
//         if (!response.ok) {
//           if (response.status === 404) {
//             // Handle 404 silently
//             return null; // You can return or handle it gracefully
//           }
//           throw new Error(`Error: ${response.status}`);
//         }
//         const data = await response.json();
//         setVideos(data.data); // Assuming the videos are in `data.data` as per your structure
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   return { videos, loading, error };
// };

import { useEffect, useState } from "react";

export const useFetchVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/video");
        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 silently by setting an empty array
            setVideos([]);
            setError("Videos not found.");
            return; // Stop further processing
          }
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data.data); // Assuming the videos are in `data.data` as per your structure
      } catch (error) {
        // Log unexpected errors, but suppress 404 error from cluttering the console
        if (error.message !== "Error: 404") {
          console.error("Unexpected error:", error.message);
        }
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};

export const useFetchVideosbyId = (id) => {
  const [video, setVideo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/video/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 silently
            return null; // You can return or handle it gracefully
          }
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setVideo(data.data); // Assuming the video is in `data.data` as per your structure
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  return { video, loading, error };
};

import { useSelector } from "react-redux";

export const useFetchVideosByChannelId = (channelId) => {
  const [fetchvideos, setFetchvideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the token and user details from Redux store
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!channelId || !token) return; // Ensure channelId and token are available

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:4000/api/channel/${channelId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Use token from Redux store
            },
          }
        );

        const data = await response.json();
        console.log("fetching the channe video data", data);
        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 silently
            return null; // You can return or handle it gracefully
          }
          throw new Error(`Error: ${response.status}`);
        }

        if (response.ok) {
          setFetchvideos(data.data || []); // Set video data if available
        } else {
          setError(data.message || "Failed to fetch videos.");
        }
      } catch (err) {
        setError("An error occurred while fetching videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [channelId, token]);

  return { fetchvideos, loading, error };
};
