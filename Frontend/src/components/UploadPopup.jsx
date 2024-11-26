import { useState } from "react";
import useAddVideo from "../hooks/useAddVideo";

const UploadPopup = ({ onClose }) => {
  const { addVideo, loading, error } = useAddVideo();

  const [videoDetails, setVideoDetails] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await addVideo(videoDetails);

    if (result?.success) {
      alert("Video uploaded successfully!");
      onClose(); // Close the popup after successful upload
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={videoDetails.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={videoDetails.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={videoDetails.thumbnailUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Video URL</label>
            <input
              type="url"
              name="videoUrl"
              value={videoDetails.videoUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={videoDetails.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPopup;
