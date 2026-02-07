import { createSlice } from "@reduxjs/toolkit";

type QuestionsState = Record<string, never>;

const initialState: QuestionsState = {};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
});

export default questionsSlice.reducer;
