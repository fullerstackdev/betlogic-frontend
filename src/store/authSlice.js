// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../services/api";

// We'll store { token, role, email, etc. } in Redux
// so the entire app can know if we're logged in or not.

// Thunk: login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser({ email, password });
      return data; // { message, token }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk: register
export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      const data = await registerUser({ email, password, firstName, lastName });
      return data; // { message, user { ... } }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  token: localStorage.getItem("token") || null,
  role: null,    // we could store role from the token
  status: "idle",
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
    },
    setTokenAndRole(state, action) {
      const { token, role } = action.payload;
      state.token = token;
      state.role = role;
      localStorage.setItem("token", token);
    }
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(loginThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      // action.payload is { message, token }
      const { token } = action.payload;
      // We'll decode the role from the token or let user fetch it
      // For now, we store just the token
      state.token = token;
      localStorage.setItem("token", token);
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Login failed";
    });

    // register
    builder.addCase(registerThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      // we don't log them in automatically, just store success
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Register failed";
    });
  }
});

export const { logout, setTokenAndRole } = authSlice.actions;
export default authSlice.reducer;
