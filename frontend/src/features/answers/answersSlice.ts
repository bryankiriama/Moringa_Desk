import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import type { Answer } from "../../types";
import {
  acceptAnswer,
  createAnswer,
  listAnswers,
  type AnswerCreateRequest,
} from "../../api/answers";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type AnswersState = {
  items: Answer[];
  status: LoadStatus;
  error: string | null;
  createStatus: LoadStatus;
  createError: string | null;
  acceptStatus: LoadStatus;
  acceptError: string | null;
  activeQuestionId: string | null;
};

const initialState: AnswersState = {
  items: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  acceptStatus: "idle",
  acceptError: null,
  activeQuestionId: null,
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

export const fetchAnswers = createAsyncThunk(
  "answers/list",
  async (questionId: string, { rejectWithValue }) => {
    try {
      return await listAnswers(questionId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createAnswerItem = createAsyncThunk(
  "answers/create",
  async (
    payload: { questionId: string; data: AnswerCreateRequest },
    { rejectWithValue }
  ) => {
    try {
      return await createAnswer(payload.questionId, payload.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const acceptAnswerItem = createAsyncThunk(
  "answers/accept",
  async (
    payload: { questionId: string; answerId: string },
    { rejectWithValue }
  ) => {
    try {
      await acceptAnswer(payload.questionId, payload.answerId);
      return payload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.activeQuestionId = action.meta.arg;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load answers";
      })
      .addCase(createAnswerItem.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createAnswerItem.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createAnswerItem.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = (action.payload as string) ?? "Failed to post answer";
      })
      .addCase(acceptAnswerItem.pending, (state) => {
        state.acceptStatus = "loading";
        state.acceptError = null;
      })
      .addCase(acceptAnswerItem.fulfilled, (state, action) => {
        state.acceptStatus = "succeeded";
        state.items = state.items.map((answer) => ({
          ...answer,
          is_accepted: answer.id === action.payload.answerId,
        }));
      })
      .addCase(acceptAnswerItem.rejected, (state, action) => {
        state.acceptStatus = "failed";
        state.acceptError =
          (action.payload as string) ?? "Failed to accept answer";
      });
  },
});

export const selectAnswers = (state: RootState) => state.answers;
export default answersSlice.reducer;
