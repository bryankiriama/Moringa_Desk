import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import type { Notification } from "../../types";
import {
  listNotifications,
  markAllRead,
} from "../../api/notifications";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type NotificationsState = {
  items: Notification[];
  status: LoadStatus;
  error: string | null;
  markStatus: LoadStatus;
  markError: string | null;
};

const initialState: NotificationsState = {
  items: [],
  status: "idle",
  error: null,
  markStatus: "idle",
  markError: null,
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

export const fetchNotifications = createAsyncThunk(
  "notifications/list",
  async (unreadOnly: boolean | undefined, { rejectWithValue }) => {
    try {
      return await listNotifications(unreadOnly);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      return await markAllRead();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load notifications";
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.markStatus = "loading";
        state.markError = null;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.markStatus = "succeeded";
        state.items = state.items.map((notification) => ({
          ...notification,
          is_read: true,
        }));
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.markStatus = "failed";
        state.markError =
          (action.payload as string) ?? "Failed to mark notifications";
      });
  },
});

export const selectNotifications = (state: RootState) => state.notifications;
export default notificationsSlice.reducer;
