import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

//DB configuration

export const connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB connection error:", err));
};
