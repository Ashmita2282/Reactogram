// routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const { register, login, me } = authController;

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get logged in user
router.get("/me", authMiddleware, me);

export default router;
