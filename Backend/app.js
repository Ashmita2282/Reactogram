import express from "express";
import { connect } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import video from "./routes/videoRoutes.js";
import channel from "./routes/channelRoutes.js";
import comment from "./routes/commentRoutes.js";
import cors from "cors";
const app = express();

import dotenv from "dotenv";

dotenv.config();

// Enable CORS
app.use(cors());

app.use(express.json());

// Route for authentication
app.use("/api", authRoutes);

// Route for videos
app.use("/api", video);

// Route for channels
app.use("/api", channel);

// Route for comments
app.use("/api", comment);

connect();

export { app };
