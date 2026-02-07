import { createSlice } from "@reduxjs/toolkit";

type AuthState = Record<string, never>;

const initialState: AuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export default authSlice.reducer;
