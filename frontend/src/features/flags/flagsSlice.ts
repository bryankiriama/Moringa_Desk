import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import { createFlag, type FlagCreateRequest } from "../../api/flags";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type FlagsState = {
  status: LoadStatus;
  error: string | null;
};

const initialState: FlagsState = {
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

export const createFlagItem = createAsyncThunk(
  "flags/create",
  async (payload: FlagCreateRequest, { rejectWithValue }) => {
    try {
      return await createFlag(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const flagsSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFlagItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createFlagItem.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createFlagItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to submit flag";
      });
  },
});

export const selectFlags = (state: RootState) => state.flags;
export default flagsSlice.reducer;
