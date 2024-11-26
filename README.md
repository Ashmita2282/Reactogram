# YouTube Clone

A full-stack YouTube clone built using the **MERN stack** (MongoDB, Express, React, and Node.js). This application allows users to view, upload, and interact with videos, manage channels, and comment on videos. The project is designed to mimic key features of YouTube while exploring real-world web development challenges.

## Features

### Frontend

- **Home Page**:
  - Video thumbnails displayed in a responsive grid layout.
  - Filter videos by category and search by title.
  - Sidebar toggle for easier navigation.
- **Authentication**:
  - User sign-up and login with JWT-based secure session handling.
  - Displays the user’s name upon login.
- **Video Player**:
  - Embedded video player with title, description, and channel info.
  - Like and dislike functionality.
  - Add, edit, and delete comments.
- **Channel Page**:
  - Users can create, edit, or delete videos after creating a channel.
  - View all videos under a specific channel.

### Backend

- **User Authentication**:
  - Token-based login and sign-up endpoints.
- **Video Management**:
  - CRUD operations for videos and comments.
- **Channel Management**:
  - Endpoints for creating and managing channels.
- **Database**:
  - MongoDB collections for users, videos, channels, and comments.

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- MongoDB (local or MongoDB Atlas)
- A modern web browser

### Challenges and Solutions

JWT Authentication:
Challenge: Securing endpoints without impacting performance.
Solution: Implement middleware to validate tokens and handle expired tokens gracefully.
Video Filtering:
Challenge: Handling complex filtering and searching on large datasets.
Solution: Use indexed fields in MongoDB and server-side filtering for efficient searches.
Frontend-Backend Integration:
Challenge: Ensuring seamless communication between React and Express.
Solution: Standardize API responses and implement global error handling.
Responsive Design:
Challenge: Maintaining usability across devices.
Solution: Use Tailwind CSS utilities and test extensively on different devices.
Data Relationships:
Challenge: Managing relationships between users, channels, and videos.
Solution: Use a hybrid approach with embedded documents and references for scalability. 6. All the functionality works but reflect after the hard reloading

### Github Link : https://github.com/Ashmita2282/Youtube_clone
