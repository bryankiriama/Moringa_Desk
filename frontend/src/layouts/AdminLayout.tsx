import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch } from "../app/hooks";
import { fetchNotifications } from "../features/notifications/notificationsSlice";
import AppShell from "./AppShell";

const AdminLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotifications(undefined));
  }, [dispatch]);

  return (
    <AppShell variant="admin">
      <Outlet />
    </AppShell>
  );
};

export default AdminLayout;
