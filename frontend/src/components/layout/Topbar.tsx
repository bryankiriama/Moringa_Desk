import { useMemo } from "react";
import { Link } from "react-router-dom";

type TopbarProps = {
  onMenuClick?: () => void;
  placeholder?: string;
  title?: string;
};

const Topbar = ({ onMenuClick, placeholder, title }: TopbarProps) => {
  const searchPlaceholder = useMemo(
    () => placeholder ?? "Search questions, tags, users...",
    [placeholder]
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 focus-ring lg:hidden"
            aria-label="Open sidebar"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </button>
          {title ? (
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          ) : null}
        </div>

        <div className="flex min-w-[220px] flex-1 items-center">
          <div className="relative w-full max-w-2xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder={searchPlaceholder}
              aria-label="Search"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm focus-ring focus:border-indigo-300"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 focus-ring"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-semibold text-white">
              3
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Settings (coming soon)"
            title="Settings (coming soon)"
            disabled
          >
            <SettingsIcon />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              AU
            </span>
            <span>Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const MenuIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16" />
  </svg>
);

const BellIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
    <path d="M10.3 20a1.7 1.7 0 0 0 3.4 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M12 3v2" />
    <path d="M12 19v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M3 12h2" />
    <path d="M19 12h2" />
    <path d="M4.93 19.07l1.41-1.41" />
    <path d="M17.66 6.34l1.41-1.41" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default Topbar;
