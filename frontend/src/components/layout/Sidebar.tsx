import { useEffect, useRef } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PlusCircle,
  Settings,
  Tag,
  TrendingUp,
  Users,
  Lock,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectAuth } from "../../features/auth/authSlice";

type SidebarVariant = "student" | "admin";

type SidebarItem = {
  label: string;
  to?: string;
  match?: string[];
  disabledReason?: string;
  section?: boolean;
  icon?: JSX.Element;
};

type SidebarProps = {
  variant: SidebarVariant;
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

const studentItems: SidebarItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    match: ["/dashboard"],
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Questions",
    to: "/questions",
    match: ["/questions"],
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: "Ask Question",
    to: "/questions/ask",
    match: ["/questions/ask"],
    icon: <PlusCircle className="h-5 w-5" />,
  },
  {
    label: "History",
    to: "/me",
    match: ["/me"],
    icon: <Activity className="h-5 w-5" />,
  },
  {
    label: "Trending",
    to: "/trending",
    match: ["/trending"],
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Notifications",
    to: "/notifications",
    match: ["/notifications"],
    icon: <Bell className="h-5 w-5" />,
  },
];

const adminItems: SidebarItem[] = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    match: ["/admin/dashboard"],
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Questions",
    to: "/questions",
    match: ["/questions"],
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: "Ask Question",
    to: "/questions/ask",
    match: ["/questions/ask"],
    icon: <PlusCircle className="h-5 w-5" />,
  },
  {
    label: "History",
    to: "/me",
    match: ["/me"],
    icon: <Activity className="h-5 w-5" />,
  },
  {
    label: "Trending",
    to: "/trending",
    match: ["/trending"],
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Notifications",
    to: "/notifications",
    match: ["/notifications"],
    icon: <Bell className="h-5 w-5" />,
  },
  { label: "Admin", section: true },
  {
    label: "Users",
    to: "/admin/users",
    match: ["/admin/users"],
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Manage Tags",
    to: "/admin/tags",
    match: ["/admin/tags"],
    icon: <Tag className="h-5 w-5" />,
  },
  {
    label: "FAQs",
    to: "/admin/faqs",
    match: ["/admin/faqs"],
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    label: "Flags",
    to: "/admin/flags",
    match: ["/admin/flags"],
    icon: <Lock className="h-5 w-5" />,
  },
  {
    label: "Settings",
    disabledReason: "Coming soon",
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar = ({
  variant,
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) => {
  const items = variant === "admin" ? adminItems : studentItems;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { displayName, role } = useAppSelector(selectAuth);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resolvedName =
    displayName ?? (role === "admin" ? "Admin User" : "Student User");
  const initials = resolvedName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const questionDetailMatch = matchPath(
    { path: "/questions/:questionId", end: true },
    location.pathname
  );
  const isQuestionDetail =
    questionDetailMatch?.params?.questionId &&
    questionDetailMatch.params.questionId !== "ask";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const focusable = sidebarRef.current?.querySelector<HTMLElement>(
      "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
    );
    focusable?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isItemActive = (item: SidebarItem) => {
    if (!item.to) return false;
    if (item.to === "/questions") {
      return location.pathname === "/questions" || Boolean(isQuestionDetail);
    }
    const patterns = item.match ?? [item.to];
    return patterns.some((pattern) =>
      Boolean(matchPath({ path: pattern, end: true }, location.pathname))
    );
  };

  return (
    <>
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col border-r border-slate-200/80 bg-white/95 shadow-lg transition-all duration-200 md:translate-x-0 ${
          isCollapsed ? "md:w-20" : "md:w-72"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-4 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-500 text-sm font-semibold text-white shadow-sm">
                  M
                </div>
                <div className={isCollapsed ? "md:hidden" : ""}>
                  <p className="text-sm font-semibold text-slate-900">MoringaDesk</p>
                  <p className="text-xs text-slate-500">Knowledge Platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 focus-ring md:inline-flex"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-6">
            {items.map((item) => (
              <SidebarNavItem
                key={item.label}
                item={item}
                isActive={isItemActive(item)}
                isCollapsed={isCollapsed}
                onNavigate={isOpen ? onClose : undefined}
              />
            ))}
          </nav>

          <div className="border-t border-slate-200 px-4 py-4">
            <div
              className={`flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 shadow-sm ${
                isCollapsed ? "md:justify-center md:px-2" : ""
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {initials || (variant === "admin" ? "AD" : "ST")}
              </div>
              <div className={isCollapsed ? "md:hidden" : ""}>
                <p className="text-sm font-semibold text-slate-900">{resolvedName}</p>
                <p className="text-xs text-slate-500">
                  {variant === "admin" ? "Admin" : "Student"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dispatch(logout())}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus-ring ${
                isCollapsed ? "md:px-2" : ""
              }`}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className={isCollapsed ? "md:hidden" : ""}>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      ) : null}
    </>
  );
};

type SidebarNavItemProps = {
  item: SidebarItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate?: () => void;
};

const SidebarNavItem = ({
  item,
  isActive,
  isCollapsed,
  onNavigate,
}: SidebarNavItemProps) => {
  if (item.section) {
    return (
      <div
        className={`px-3 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400 ${
          isCollapsed ? "md:text-center" : ""
        }`}
      >
        {isCollapsed ? "•" : item.label}
      </div>
    );
  }

  if (!item.to) {
    const accessibleLabel = item.disabledReason
      ? `${item.label} (${item.disabledReason})`
      : item.label;
    return (
      <div
        className={`flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 ${
          isCollapsed ? "md:justify-center" : ""
        }`}
        aria-disabled="true"
        aria-label={accessibleLabel}
        title={item.disabledReason ?? "Coming soon"}
      >
        <span className="text-slate-300" aria-hidden="true">
          {item.icon ?? <Lock className="h-5 w-5" />}
        </span>
        <span className={isCollapsed ? "md:hidden" : ""}>{item.label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.label}
      title={isCollapsed ? item.label : undefined}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition focus-ring",
        isCollapsed ? "md:justify-center" : "",
        isActive
          ? "bg-indigo-50 text-indigo-600 shadow-sm"
          : "text-slate-600 hover:bg-slate-100",
      ].join(" ")}
    >
      <span className="text-slate-500" aria-hidden="true">
        {item.icon ?? <Lock className="h-5 w-5" />}
      </span>
      <span className={isCollapsed ? "md:hidden" : ""}>{item.label}</span>
    </NavLink>
  );
};

export default Sidebar;
