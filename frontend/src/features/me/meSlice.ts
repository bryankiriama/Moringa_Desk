import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import type { MyAnswer, MyQuestion } from "../../types";
import { listMyAnswers, listMyQuestions } from "../../api/me";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type MeState = {
  questions: MyQuestion[];
  answers: MyAnswer[];
  questionsStatus: LoadStatus;
  answersStatus: LoadStatus;
  error: string | null;
};

const initialState: MeState = {
  questions: [],
  answers: [],
  questionsStatus: "idle",
  answersStatus: "idle",
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

export const fetchMyQuestions = createAsyncThunk(
  "me/questions",
  async (_, { rejectWithValue }) => {
    try {
      return await listMyQuestions();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchMyAnswers = createAsyncThunk(
  "me/answers",
  async (_, { rejectWithValue }) => {
    try {
      return await listMyAnswers();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyQuestions.pending, (state) => {
        state.questionsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMyQuestions.fulfilled, (state, action) => {
        state.questionsStatus = "succeeded";
        state.questions = action.payload;
      })
      .addCase(fetchMyQuestions.rejected, (state, action) => {
        state.questionsStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to load your questions";
      })
      .addCase(fetchMyAnswers.pending, (state) => {
        state.answersStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMyAnswers.fulfilled, (state, action) => {
        state.answersStatus = "succeeded";
        state.answers = action.payload;
      })
      .addCase(fetchMyAnswers.rejected, (state, action) => {
        state.answersStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to load your answers";
      });
  },
});

export const selectMe = (state: RootState) => state.me;
export default meSlice.reducer;
