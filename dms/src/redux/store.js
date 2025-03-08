import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Ensure this path is correct

export const store = configureStore({
  reducer: {
    auth: authReducer, // Make sure this reducer exists
  },
});

