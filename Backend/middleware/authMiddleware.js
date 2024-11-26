// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify JWT token and authenticate user
const authMiddleware = (req, res, next) => {
  // Get token from the 'Authorization' header
  const authHeader = req.headers.authorization;

  // Check if the token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Extract token from Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object for further use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If verification fails, send unauthorized error
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
