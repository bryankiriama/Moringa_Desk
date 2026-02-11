import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionCard from "../components/ui/SectionCard";
import { deleteAnswer, deleteFlag, deleteQuestion, listFlags, listUsers } from "../api/admin";
import type { Flag, User } from "../types";
import { formatAbsoluteTime } from "../utils/time";

const tabs = [
  { label: "Manage Tags", to: "/admin/tags" },
  { label: "Manage FAQs", to: "/admin/faqs" },
  { label: "User Management", to: "/admin/users" },
  { label: "Flags", to: "/admin/flags" },
];

const AdminFlags = () => {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const usersById = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  const reporterStats = useMemo(() => {
    const map = new Map<string, number>();
    flags.forEach((flag) => {
      map.set(flag.user_id, (map.get(flag.user_id) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([userId, count]) => ({
        userId,
        count,
        name: usersById.get(userId)?.full_name ?? `User ${userId.slice(0, 6)}`,
        email: usersById.get(userId)?.email,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [flags, usersById]);

  const loadFlags = async () => {
    setStatus("loading");
    setError(null);
    try {
      const [flagsResponse, usersResponse] = await Promise.all([
        listFlags(),
        listUsers(),
      ]);
      setFlags(flagsResponse);
      setUsers(usersResponse);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("Unable to load flagged content.");
    }
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const handleDismiss = async (flagId: string) => {
    setActionStatus(flagId);
    try {
      await deleteFlag(flagId);
      await loadFlags();
    } catch {
      setError("Failed to dismiss flag.");
    } finally {
      setActionStatus(null);
    }
  };

  const handleRemove = async (flag: Flag) => {
    setActionStatus(flag.id);
    try {
      if (flag.target_type === "question") {
        await deleteQuestion(flag.target_id);
      } else {
        await deleteAnswer(flag.target_id);
      }
      await deleteFlag(flag.id);
      await loadFlags();
    } catch {
      setError("Failed to remove content.");
    } finally {
      setActionStatus(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Flagged Content</h1>
          <p className="text-sm text-slate-500">
            Review and act on user-reported content
          </p>
        </div>
        <Badge label="Admin Access" variant="accent" />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-3 text-sm text-slate-500">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 focus-ring ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-100"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <SectionCard title="User Activity" subtitle="Top reporters by flag count">
        {reporterStats.length === 0 ? (
          <EmptyState
            title="No reports yet"
            description="User activity will appear once flags are submitted."
          />
        ) : (
          <div className="space-y-3">
            {reporterStats.map((reporter) => (
              <div
                key={reporter.userId}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {reporter.name}
                  </p>
                  {reporter.email ? (
                    <p className="text-xs text-slate-500">{reporter.email}</p>
                  ) : null}
                </div>
                <Badge label={`${reporter.count} flags`} variant="neutral" />
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Flags" subtitle="Most recent reports">
        {status === "loading" ? (
          <EmptyState title="Loading flags..." description="Please wait." />
        ) : status === "error" ? (
          <EmptyState title="Unable to load flags" description={error ?? ""} />
        ) : flags.length === 0 ? (
          <EmptyState
            title="No flagged items"
            description="When users report content, it will appear here."
          />
        ) : (
          <div className="space-y-4">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {flag.target_type.toUpperCase()} flagged
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatAbsoluteTime(flag.created_at)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Reported by{" "}
                      {usersById.get(flag.user_id)?.full_name ??
                        `User ${flag.user_id.slice(0, 6)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {flag.target_type === "question" ? (
                      <Link
                        to={`/questions/${flag.target_id}`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring"
                      >
                        View
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDismiss(flag.id)}
                      disabled={actionStatus === flag.id}
                    >
                      {actionStatus === flag.id ? "Working..." : "Dismiss"}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleRemove(flag)}
                      disabled={actionStatus === flag.id}
                    >
                      Remove content
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{flag.reason}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Target ID: {flag.target_id}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminFlags;
