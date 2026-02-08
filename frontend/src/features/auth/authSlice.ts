import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import { login, register } from "../../api/auth";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "../../api/client";
import type { UserRole } from "../../types";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

type AuthState = {
  token: string | null;
  role: UserRole;
  status: AuthStatus;
  error: string | null;
};

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
const storedRole = localStorage.getItem(AUTH_ROLE_KEY) as UserRole | null;

const initialState: AuthState = {
  token: storedToken,
  role: storedRole ?? "student",
  status: "idle",
  error: null,
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: Parameters<typeof login>[0], { rejectWithValue }) => {
    try {
      const response = await login(payload);
      const role = response.role ?? "student";
      localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
      localStorage.setItem(AUTH_ROLE_KEY, role);
      return { token: response.access_token, role };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: Parameters<typeof register>[0], { rejectWithValue }) => {
    try {
      const response = await register(payload);
      const role = response.role ?? "student";
      localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
      localStorage.setItem(AUTH_ROLE_KEY, role);
      return { token: response.access_token, role };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = "student";
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_ROLE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Registration failed";
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
