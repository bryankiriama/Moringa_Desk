import { createSlice } from "@reduxjs/toolkit";

type AnswersState = Record<string, never>;

const initialState: AnswersState = {};

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {},
});

export default answersSlice.reducer;
