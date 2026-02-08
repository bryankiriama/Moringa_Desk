import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import { castVote, type VoteCreateRequest } from "../../api/votes";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type VotesState = {
  status: LoadStatus;
  error: string | null;
};

const initialState: VotesState = {
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

export const castVoteItem = createAsyncThunk(
  "votes/cast",
  async (payload: VoteCreateRequest, { rejectWithValue }) => {
    try {
      return await castVote(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const votesSlice = createSlice({
  name: "votes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(castVoteItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(castVoteItem.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(castVoteItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to submit vote";
      });
  },
});

export const selectVotes = (state: RootState) => state.votes;
export default votesSlice.reducer;
