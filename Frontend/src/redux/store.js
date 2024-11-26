import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in non-production
});

export default store;