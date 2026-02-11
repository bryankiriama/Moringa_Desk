import { useEffect, useMemo, useState, type ReactNode } from "react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

type AppShellProps = {
  variant: "student" | "admin";
  children: ReactNode;
};

const COLLAPSE_KEY = "moringa_sidebar_collapsed";

const AppShell = ({ variant, children }: AppShellProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(COLLAPSE_KEY) === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(COLLAPSE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const mainPadding = useMemo(
    () => (isCollapsed ? "md:pl-24 lg:pl-24" : "md:pl-72 lg:pl-72"),
    [isCollapsed]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <Sidebar
        variant={variant}
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsMobileOpen(false)}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />
      <div className={mainPadding}>
        <Topbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
