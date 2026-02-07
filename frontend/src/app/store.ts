import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import questionsReducer from "../features/questions/questionsSlice";
import answersReducer from "../features/answers/answersSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    answers: answersReducer,
    notifications: notificationsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
