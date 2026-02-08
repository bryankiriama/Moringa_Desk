import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import questionsReducer from "../features/questions/questionsSlice";
import answersReducer from "../features/answers/answersSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import votesReducer from "../features/votes/votesSlice";
import flagsReducer from "../features/flags/flagsSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    answers: answersReducer,
    notifications: notificationsReducer,
    votes: votesReducer,
    flags: flagsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
