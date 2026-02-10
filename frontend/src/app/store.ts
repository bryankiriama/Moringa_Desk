import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import questionsReducer from "../features/questions/questionsSlice";
import answersReducer from "../features/answers/answersSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import votesReducer from "../features/votes/votesSlice";
import flagsReducer from "../features/flags/flagsSlice";
import followsReducer from "../features/follows/followsSlice";
import adminReducer from "../features/admin/adminSlice";
import meReducer from "../features/me/meSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    answers: answersReducer,
    notifications: notificationsReducer,
    votes: votesReducer,
    flags: flagsReducer,
    follows: followsReducer,
    admin: adminReducer,
    me: meReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
