import { app } from "./app.js";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

// Enable CORS for all routes
app.use(cors());

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, (req, res) => {
  console.log("Server is started");
});
