import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import type { Question, QuestionDetail } from "../../types";
import {
  createQuestion,
  getQuestionDetail,
  listQuestions,
  type QuestionCreateRequest,
  type QuestionListParams,
} from "../../api/questions";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type QuestionsState = {
  items: Question[];
  status: LoadStatus;
  error: string | null;
  detail: QuestionDetail | null;
  detailStatus: LoadStatus;
  detailError: string | null;
  createStatus: LoadStatus;
  createError: string | null;
};

const initialState: QuestionsState = {
  items: [],
  status: "idle",
  error: null,
  detail: null,
  detailStatus: "idle",
  detailError: null,
  createStatus: "idle",
  createError: null,
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

export const fetchQuestions = createAsyncThunk(
  "questions/list",
  async (params: QuestionListParams | undefined, { rejectWithValue }) => {
    try {
      return await listQuestions(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchQuestionDetail = createAsyncThunk(
  "questions/detail",
  async (questionId: string, { rejectWithValue }) => {
    try {
      return await getQuestionDetail(questionId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createQuestionItem = createAsyncThunk(
  "questions/create",
  async (payload: QuestionCreateRequest, { rejectWithValue }) => {
    try {
      return await createQuestion(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load questions";
      })
      .addCase(fetchQuestionDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.detail = null;
      })
      .addCase(fetchQuestionDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchQuestionDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = (action.payload as string) ?? "Failed to load question";
      })
      .addCase(createQuestionItem.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createQuestionItem.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items = [action.payload, ...state.items];
      })
      .addCase(createQuestionItem.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = (action.payload as string) ?? "Failed to create question";
      });
  },
});

export const selectQuestions = (state: RootState) => state.questions;
export default questionsSlice.reducer;
