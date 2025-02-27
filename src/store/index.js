// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other slices if you have them
  }
});

export default store;
