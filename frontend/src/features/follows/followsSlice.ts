import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import type { Question } from "../../types";
import { followQuestion, listMyFollows, unfollowQuestion } from "../../api/follows";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type FollowsState = {
  isFollowing: boolean;
  status: LoadStatus;
  error: string | null;
  activeQuestionId: string | null;
  items: Question[];
  listStatus: LoadStatus;
  listError: string | null;
};

const initialState: FollowsState = {
  isFollowing: false,
  status: "idle",
  error: null,
  activeQuestionId: null,
  items: [],
  listStatus: "idle",
  listError: null,
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

export const followQuestionItem = createAsyncThunk(
  "follows/follow",
  async (questionId: string, { rejectWithValue }) => {
    try {
      await followQuestion(questionId);
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const unfollowQuestionItem = createAsyncThunk(
  "follows/unfollow",
  async (questionId: string, { rejectWithValue }) => {
    try {
      await unfollowQuestion(questionId);
      return false;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchFollowStatus = createAsyncThunk(
  "follows/status",
  async (questionId: string, { rejectWithValue }) => {
    try {
      const follows = await listMyFollows();
      return follows.some((question) => question.id === questionId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchFollowedQuestions = createAsyncThunk(
  "follows/list",
  async (_, { rejectWithValue }) => {
    try {
      return await listMyFollows();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const followsSlice = createSlice({
  name: "follows",
  initialState,
  reducers: {
    setFollowing(state, action: { payload: boolean }) {
      state.isFollowing = action.payload;
    },
    clearFollowError(state) {
      state.error = null;
    },
    clearFollowListError(state) {
      state.listError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowStatus.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.activeQuestionId = action.meta.arg;
      })
      .addCase(fetchFollowStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isFollowing = action.payload;
      })
      .addCase(fetchFollowStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ?? "Failed to load follow status";
      })
      .addCase(fetchFollowedQuestions.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchFollowedQuestions.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFollowedQuestions.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError =
          (action.payload as string) ?? "Failed to load followed questions";
      })
      .addCase(followQuestionItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(followQuestionItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isFollowing = action.payload;
      })
      .addCase(followQuestionItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to follow";
      })
      .addCase(unfollowQuestionItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(unfollowQuestionItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isFollowing = action.payload;
      })
      .addCase(unfollowQuestionItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to unfollow";
      });
  },
});

export const { clearFollowError, clearFollowListError, setFollowing } =
  followsSlice.actions;
export const selectFollows = (state: RootState) => state.follows;
export default followsSlice.reducer;
