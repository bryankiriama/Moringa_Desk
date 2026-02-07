import { NavLink, matchPath, useLocation } from "react-router-dom";

type SidebarVariant = "student" | "admin";

type SidebarItem = {
  label: string;
  to?: string;
  match?: string[];
};

type SidebarProps = {
  variant: SidebarVariant;
  isOpen: boolean;
  onClose: () => void;
};

const studentItems: SidebarItem[] = [
  { label: "Dashboard", to: "/dashboard", match: ["/dashboard"] },
  { label: "Questions", to: "/questions", match: ["/questions"] },
  { label: "Ask Question", to: "/questions/ask", match: ["/questions/ask"] },
  { label: "Trending" },
  { label: "Notifications", to: "/notifications", match: ["/notifications"] },
];

const adminItems: SidebarItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", match: ["/admin/dashboard"] },
  { label: "Questions", to: "/questions", match: ["/questions"] },
  { label: "Ask Question", to: "/questions/ask", match: ["/questions/ask"] },
  { label: "Trending" },
  { label: "Notifications", to: "/notifications", match: ["/notifications"] },
  { label: "Users", to: "/admin/users", match: ["/admin/users"] },
  { label: "Manage Tags", to: "/admin/tags", match: ["/admin/tags"] },
  { label: "FAQs", to: "/admin/faqs", match: ["/admin/faqs"] },
  { label: "Settings" },
];

const Sidebar = ({ variant, isOpen, onClose }: SidebarProps) => {
  const items = variant === "admin" ? adminItems : studentItems;
  const location = useLocation();
  const questionDetailMatch = matchPath(
    { path: "/questions/:questionId", end: true },
    location.pathname
  );
  const isQuestionDetail =
    questionDetailMatch?.params?.questionId &&
    questionDetailMatch.params.questionId !== "ask";

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
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white shadow-sm transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
                M
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">MoringaDesk</p>
                <p className="text-xs text-slate-500">Knowledge Platform</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {items.map((item) => (
              <SidebarNavItem
                key={item.label}
                item={item}
                isActive={isItemActive(item)}
              />
            ))}
          </nav>

          <div className="border-t border-slate-200 px-4 py-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {variant === "admin" ? "AD" : "ST"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {variant === "admin" ? "Admin User" : "Student User"}
                </p>
                <p className="text-xs text-slate-500">
                  {variant === "admin" ? "Admin" : "Student"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}
    </>
  );
};

type SidebarNavItemProps = {
  item: SidebarItem;
  isActive: boolean;
};

const SidebarNavItem = ({ item, isActive }: SidebarNavItemProps) => {
  if (!item.to) {
    return (
      <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400">
        <span className="h-5 w-5 rounded-md bg-slate-200" aria-hidden="true" />
        <span>{item.label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-600 hover:bg-slate-100",
      ].join(" ")}
    >
      <span
        className="h-5 w-5 rounded-md bg-slate-200"
        aria-hidden="true"
      />
      <span>{item.label}</span>
    </NavLink>
  );
};

export default Sidebar;
