import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAppDispatch } from "../app/hooks";
import { fetchNotifications } from "../features/notifications/notificationsSlice";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotifications(undefined));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        variant="admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
