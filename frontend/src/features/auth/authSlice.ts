import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import { getCurrentUser, login, register } from "../../api/auth";
import {
  AUTH_NAME_KEY,
  AUTH_ROLE_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_ID_KEY,
} from "../../api/client";
import type { UserRole } from "../../types";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

type AuthState = {
  token: string | null;
  role: UserRole;
  displayName: string | null;
  userId: string | null;
  status: AuthStatus;
  error: string | null;
};

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
const storedRole = localStorage.getItem(AUTH_ROLE_KEY) as UserRole | null;
const storedName = localStorage.getItem(AUTH_NAME_KEY);
const storedUserId = localStorage.getItem(AUTH_USER_ID_KEY);

const initialState: AuthState = {
  token: storedToken,
  role: storedRole ?? "student",
  displayName: storedName,
  userId: storedUserId,
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
      const nameFromEmail = payload.email.split("@")[0] || "User";
      localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
      localStorage.setItem(AUTH_ROLE_KEY, role);
      localStorage.setItem(AUTH_NAME_KEY, nameFromEmail);
      return {
        token: response.access_token,
        role,
        displayName: nameFromEmail,
        userId: null,
      };
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
      localStorage.setItem(AUTH_NAME_KEY, payload.full_name);
      return {
        token: response.access_token,
        role,
        displayName: payload.full_name,
        userId: null,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      const role = user.role ?? "student";
      localStorage.setItem(AUTH_ROLE_KEY, role);
      localStorage.setItem(AUTH_NAME_KEY, user.full_name);
      localStorage.setItem(AUTH_USER_ID_KEY, user.id);
      return { role, displayName: user.full_name, userId: user.id };
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
      state.displayName = null;
      state.userId = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_ROLE_KEY);
      localStorage.removeItem(AUTH_NAME_KEY);
      localStorage.removeItem(AUTH_USER_ID_KEY);
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
        state.displayName = action.payload.displayName;
        state.userId = action.payload.userId ?? state.userId;
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
        state.displayName = action.payload.displayName;
        state.userId = action.payload.userId ?? state.userId;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Registration failed";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.role = action.payload.role;
        state.displayName = action.payload.displayName;
        state.userId = action.payload.userId;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load user";
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
