import { createSlice } from "@reduxjs/toolkit";

type AdminState = Record<string, never>;

const initialState: AdminState = {};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
});

export default adminSlice.reducer;
