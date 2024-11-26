import React from "react";
import { formatDistanceToNow } from "date-fns";

const VideoCard = ({ video }) => {
  return (
    <div className="video-card z-0 bg-white shadow-md rounded-md overflow-hidden">
      {/* Thumbnail Image */}
      <img
        src={video.thumbnailUrl || "default-thumbnail.jpg"} // fallback if thumbnail is missing
        alt={video.title}
        className="w-full h-40 object-cover"
      />

      {/* Video Player */}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
        {/* Display Channel Name */}
        <p>{video.channelName}</p>
        <p className="text-sm text-gray-600">{video.description}</p>
        <p className="text-sm text-gray-600">
          {video.views.toLocaleString()} views &middot;{" "}
          <span className="text-sm text-gray-600">
            {formatDistanceToNow(video.uploadDate, { addSuffix: true })}
          </span>
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
