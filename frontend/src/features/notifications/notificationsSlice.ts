import { createSlice } from "@reduxjs/toolkit";

type NotificationsState = Record<string, never>;

const initialState: NotificationsState = {};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
});

export default notificationsSlice.reducer;
