import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchNotifications } from "../features/notifications/notificationsSlice";
import { selectAuth } from "../features/auth/authSlice";
import AppShell from "./AppShell";

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const { role } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchNotifications(undefined));
  }, [dispatch]);

  return (
    <AppShell variant={role === "admin" ? "admin" : "student"}>
      <Outlet />
    </AppShell>
  );
};

export default AppLayout;
