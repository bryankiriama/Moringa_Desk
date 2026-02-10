import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionCard from "../components/ui/SectionCard";
import { deleteAnswer, deleteFlag, deleteQuestion, listFlags } from "../api/admin";
import type { Flag } from "../types";
import { formatAbsoluteTime } from "../utils/time";

const AdminFlags = () => {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const loadFlags = async () => {
    setStatus("loading");
    setError(null);
    try {
      const response = await listFlags();
      setFlags(response);
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
