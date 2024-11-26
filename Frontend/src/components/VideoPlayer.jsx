import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchVideos } from "../hooks/useFetchVideos";
import VideoList from "./VideoList";
import useVideoActions from "../hooks/useVideoActions";
import useCommentAction from "../hooks/useCommentAction";

const VideoPlayer = () => {
  const { id } = useParams();
  const { handleLike, handleDislike, loading, error } = useVideoActions();
  const {
    handleAddComment,
    handleFetchComment,
    handleEditComment,
    handleDeleteComment, // Import delete functionality
    loading: commentLoading,
    error: commentError,
  } = useCommentAction();
  const { comments, fetchLoading, fetchError } = handleFetchComment(id);

  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [actionError, setActionError] = useState("");
  const [commentText, setCommentText] = useState("");

  // State for editing comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    if (fetchError) console.error(fetchError);
  }, [fetchError]);

  const { videos } = useFetchVideos();
  const selectedVideo = videos.find((video) => video._id === id);

  const getEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  useEffect(() => {
    if (selectedVideo) {
      setHasFetchedData(true);
    }
  }, [selectedVideo]);

  const handleError = (error) => {
    setActionError(
      error.message || "An error occurred while processing your request."
    );
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) {
      alert("Comment text cannot be empty.");
      return;
    }
    handleAddComment(selectedVideo._id, commentText);
    setCommentText("");
  };

  const startEditing = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
  };

  const saveEditComment = async () => {
    if (!editCommentText.trim()) {
      alert("Comment text cannot be empty.");
      return;
    }
    try {
      await handleEditComment(editingCommentId, editCommentText);
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (err) {
      console.error("Error while saving comment edit:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:mt-16 bg-gray-50 mt-16">
      {/* Left Section - Video Player */}
      <div className="lg:w-2/3 w-full bg-white border-b lg:border-r lg:border-gray-300 shadow-lg">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-red-500 text-lg">Loading video...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-red-500 text-lg">Error: {error}</p>
          </div>
        ) : selectedVideo ? (
          <div className="p-5 rounded">
            {/* Video Player */}
            <iframe
              width="100%"
              height="450"
              src={getEmbedUrl(selectedVideo.videoUrl)}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
            <p className="mt-2 text-center text-gray-600">
              If the video doesn't play,{" "}
              <a
                href={selectedVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 underline"
              >
                watch it on YouTube
              </a>
              .
            </p>

            {/* Video Details */}
            <div className="mt-5">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedVideo.title}
              </h2>
              <p className="text-gray-700 mt-2">{selectedVideo.description}</p>
              <p className="text-gray-500 text-sm mt-1">
                Channel:{" "}
                <span className="text-red-500 font-medium">
                  {selectedVideo.channelId.channelName}
                </span>
              </p>

              {/* Like & Dislike Section */}
              <div className="flex items-center mt-5 space-x-6">
                <button
                  onClick={async () => {
                    try {
                      await handleLike(selectedVideo._id);
                    } catch (err) {
                      handleError(err);
                    }
                  }}
                  className="flex items-center bg-red-500 text-white px-5 py-2 rounded-full shadow hover:bg-red-600"
                >
                  👍 Like
                </button>
                <span className="text-gray-700 font-semibold">
                  {selectedVideo.likes?.length || 0}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await handleDislike(selectedVideo._id);
                    } catch (err) {
                      handleError(err);
                    }
                  }}
                  className="flex items-center bg-gray-300 text-gray-700 px-5 py-2 rounded-full shadow hover:bg-gray-400"
                >
                  👎 Dislike
                </button>
                <span className="text-gray-700 font-semibold">
                  {selectedVideo.dislikes?.length || 0}
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-900">Comments</h3>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="mt-3 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-red-500"
              />
              <button
                onClick={handleCommentSubmit}
                className="mt-3 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Post Comment
              </button>
              {commentError && (
                <p className="mt-3 text-red-500">{commentError}</p>
              )}
              <div className="mt-5 space-y-4">
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-100 p-4 rounded-lg shadow-sm"
                    >
                      <p className="font-semibold">
                        {comment.userId.userName}:
                      </p>
                      {editingCommentId === comment._id ? (
                        <div>
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                          />
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={saveEditComment}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1">{comment.commentText}</p>
                      )}
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() =>
                            startEditing(comment._id, comment.commentText)
                          }
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center mt-8 space-y-4">
                    {/* Decorative Icon */}
                    <div className="text-indigo-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-16 h-16 animate-pulse"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 15l4-4 4 4m-4-4v8m-8-5a9 9 0 0118 0v3a9 9 0 01-18 0v-3z"
                        />
                      </svg>
                    </div>

                    {/* Gradient Text */}
                    <p className="text-2xl font-semibold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                      No comments available.
                    </p>

                    {/* Encouragement to Add Comments */}
                    <p className="text-gray-600 text-center text-lg">
                      Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Right Section - Video List */}
      <div className="lg:w-1/3 w-full p-5 bg-gray-50">
        <h3 className="text-2xl pl-3 pt-4 font-semibold text-gray-900">
          More Videos
        </h3>
        <VideoList videos={videos} isVerticalLayout />
      </div>
    </div>
  );
};

export default VideoPlayer;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useFetchVideos } from "../hooks/useFetchVideos";
// import VideoList from "./VideoList";
// import useVideoActions from "../hooks/useVideoActions";
// import useCommentAction from "../hooks/useCommentAction";

// const VideoPlayer = () => {
//   const { id } = useParams();
//   const { handleLike, handleDislike, loading, error } = useVideoActions();
//   const {
//     handleAddComment,
//     handleFetchComment,
//     handleEditComment,
//     handleDeleteComment, // Import delete functionality
//     loading: commentLoading,
//     error: commentError,
//   } = useCommentAction();
//   const { comments, fetchLoading, fetchError } = handleFetchComment(id);

//   const [hasFetchedData, setHasFetchedData] = useState(false);
//   const [actionError, setActionError] = useState("");
//   const [commentText, setCommentText] = useState("");

//   // State for editing comments
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editCommentText, setEditCommentText] = useState("");

//   useEffect(() => {
//     if (fetchError) console.error(fetchError);
//   }, [fetchError]);

//   const { videos } = useFetchVideos();
//   const selectedVideo = videos.find((video) => video._id === id);

//   const getEmbedUrl = (url) => {
//     const videoId = url.split("v=")[1]?.split("&")[0];
//     return `https://www.youtube.com/embed/${videoId}`;
//   };

//   useEffect(() => {
//     if (selectedVideo) {
//       setHasFetchedData(true);
//     }
//   }, [selectedVideo]);

//   const handleError = (error) => {
//     setActionError(
//       error.message || "An error occurred while processing your request."
//     );
//   };

//   const handleCommentSubmit = () => {
//     if (!commentText.trim()) {
//       alert("Comment text cannot be empty.");
//       return;
//     }
//     handleAddComment(selectedVideo._id, commentText);
//     setCommentText("");
//   };

//   const startEditing = (commentId, currentText) => {
//     setEditingCommentId(commentId);
//     setEditCommentText(currentText);
//   };

//   const saveEditComment = async () => {
//     if (!editCommentText.trim()) {
//       alert("Comment text cannot be empty.");
//       return;
//     }
//     try {
//       await handleEditComment(editingCommentId, editCommentText);
//       setEditingCommentId(null);
//       setEditCommentText("");
//     } catch (err) {
//       console.error("Error while saving comment edit:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row lg:mt-2 ">
//       {/* Left Section - Video Player */}
//       <div className="lg:w-2/3 w-full lg:mt-26 p-5 bg-white border-b lg:border-r lg:border-gray-300">
//         {loading && <p className="text-red-500">Loading video...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}
//         {!loading && !error && selectedVideo && (
//           <div>
//             <iframe
//               width="100%"
//               height="400"
//               src={getEmbedUrl(selectedVideo.videoUrl)}
//               frameBorder="0"
//               allow="autoplay; encrypted-media; picture-in-picture"
//               allowFullScreen
//               className="rounded-lg shadow-md"
//               onError={() =>
//                 console.error("Embedding restricted for this video.")
//               }
//             ></iframe>
//             <p className="mt-2 text-center text-gray-600">
//               If the video doesn't play,{" "}
//               <a
//                 href={selectedVideo.videoUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-red-500 underline"
//               >
//                 (watch it on YouTube)
//               </a>
//               .
//             </p>
//           </div>
//         )}

//         {!loading && !error && selectedVideo && (
//           <div className="mt-5">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               {selectedVideo.title}
//             </h2>
//             <p className="text-gray-600">{selectedVideo.description}</p>
//             <p className="text-red-500">
//               {selectedVideo.channelId.channelName}
//             </p>

//             <div className="flex mt-4 space-x-4">
//               <button
//                 onClick={async () => {
//                   try {
//                     await handleLike(selectedVideo._id);
//                   } catch (err) {
//                     handleError(err);
//                   }
//                 }}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
//               >
//                 👍 Like
//               </button>
//               <span className="text-gray-700">
//                 {selectedVideo.likes?.length || 0}
//               </span>
//               <button
//                 onClick={async () => {
//                   try {
//                     await handleDislike(selectedVideo._id);
//                   } catch (err) {
//                     handleError(err);
//                   }
//                 }}
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
//               >
//                 👎 Dislike
//               </button>
//               <span className="text-gray-700">
//                 {selectedVideo.dislikes?.length || 0}
//               </span>
//             </div>

//             {actionError && <p className="mt-4 text-red-500">{actionError}</p>}
//           </div>
//         )}

//         {!loading && !error && selectedVideo && (
//           <div className="mt-5">
//             <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
//             <textarea
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               placeholder="Add a comment..."
//               className="mt-2 w-full p-2 border rounded-lg focus:outline-red-500"
//             />
//             <button
//               onClick={handleCommentSubmit}
//               className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//             >
//               Post Comment
//             </button>
//             {commentError && (
//               <p className="mt-2 text-red-500">{commentError}</p>
//             )}
//             <div className="mt-4">
//               {comments && comments.length > 0 ? (
//                 comments.map((comment) => (
//                   <div key={comment._id} className="comment">
//                     <p>
//                       <strong>{comment.userId.userName}</strong>:
//                     </p>
//                     {editingCommentId === comment._id ? (
//                       <div>
//                         <textarea
//                           value={editCommentText}
//                           onChange={(e) => setEditCommentText(e.target.value)}
//                           className="mt-2 w-full p-2 border rounded-lg"
//                         />
//                         <button
//                           onClick={saveEditComment}
//                           className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={() => setEditingCommentId(null)}
//                           className="mt-2 ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <p>{comment.commentText}</p>
//                     )}
//                     <div className="flex mt-2 space-x-4">
//                       <button
//                         onClick={() =>
//                           startEditing(comment._id, comment.commentText)
//                         }
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteComment(comment._id)}
//                         className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No comments available.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Right Section - Video List */}
//       {/* <div className="lg:w-1/3 flex flex-col text-center w-full p-5 bg-gray-100">
//         <h3 className="text-lg font-semibold text-gray-900">More Videos</h3>

//         <VideoList videos={videos} />

//       </div> */}

//       <div className="flex flex-col lg:flex-row">
//         {/* Right Section - Video List */}
//         <div className="lg:w-1/3 flex flex-col text-center w-full p-5 bg-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             More Videos
//           </h3>

//           {/* Render VideoList with vertical layout */}
//           <VideoList videos={videos} isVerticalLayout />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;
