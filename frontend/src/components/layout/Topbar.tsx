import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Search, Settings2 } from "lucide-react";

import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { selectNotifications } from "../../features/notifications/notificationsSlice";

type TopbarProps = {
  onMenuClick?: () => void;
  placeholder?: string;
  title?: string;
};

const Topbar = ({ onMenuClick, placeholder, title }: TopbarProps) => {
  const { displayName, role } = useAppSelector(selectAuth);
  const { items: notifications } = useAppSelector(selectNotifications);
  const searchPlaceholder = useMemo(
    () => placeholder ?? "Search questions, tags, users...",
    [placeholder]
  );
  const resolvedName =
    displayName ?? (role === "admin" ? "Admin User" : "Student User");
  const initials = resolvedName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const unreadCount = notifications.filter((notification) => !notification.is_read)
    .length;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-ring md:hidden"
            aria-label="Open sidebar"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
          {title ? (
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          ) : null}
        </div>

        <div className="flex min-w-[200px] flex-1 items-center">
          <div className="relative w-full max-w-2xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="search"
              placeholder={searchPlaceholder}
              aria-label="Search"
              className="w-full rounded-full border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition focus-ring focus:border-indigo-300"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-ring"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Settings (coming soon)"
            title="Settings (coming soon)"
            disabled
          >
            <Settings2 className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              {initials || "U"}
            </span>
            <span>{resolvedName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
