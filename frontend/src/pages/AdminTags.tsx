import { useEffect, useState } from "react";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createTagItem,
  fetchAdminTags,
  selectAdmin,
} from "../features/admin/adminSlice";

const tabs = [
  { label: "Manage Tags", active: true },
  { label: "Manage FAQs", active: false },
  { label: "User Management", active: false },
];

const AdminTags = () => {
  const dispatch = useAppDispatch();
  const { tags, tagsStatus, tagsError, createTagStatus, createTagError } =
    useAppSelector(selectAdmin);
  const [tagName, setTagName] = useState("");

  const isLoading = tagsStatus === "loading" || tagsStatus === "idle";
  const isCreating = createTagStatus === "loading";

  useEffect(() => {
    dispatch(fetchAdminTags());
  }, [dispatch]);

  const handleCreateTag = async () => {
    if (!tagName.trim()) {
      return;
    }
    try {
      await dispatch(createTagItem({ name: tagName.trim() })).unwrap();
      setTagName("");
      await dispatch(fetchAdminTags());
    } catch {
      // errors handled in state
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-500">Manage platform content, users, and settings</p>
        </div>
        <Badge label="Admin Access" variant="accent" />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-3 text-sm text-slate-500">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`rounded-full px-4 py-2 ${
              tab.active
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-100"
            } focus-ring`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SectionCard title="Add New Tag" subtitle="Create tags to help categorize questions">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Enter tag name..."
            value={tagName}
            onChange={(event) => setTagName(event.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
            disabled={isCreating}
          />
          <button
            type="button"
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleCreateTag}
            disabled={isCreating}
          >
            {isCreating ? "Adding..." : "Add Tag"}
          </button>
        </div>
        {createTagError ? (
          <p className="mt-3 text-sm text-rose-600">{createTagError}</p>
        ) : null}
      </SectionCard>

      <SectionCard title="All Tags" subtitle={`${tags.length} tags total`}>
        {isLoading ? (
          <EmptyState title="Loading tags..." description="Fetching tag list." />
        ) : tagsError ? (
          <EmptyState title="Unable to load tags" description={tagsError} />
        ) : tags.length === 0 ? (
          <EmptyState
            title="No tags created"
            description="Create tags to help organize questions."
            actionLabel="Add tag"
          />
        ) : (
          <div className="space-y-4">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4"
              >
                <div className="flex items-center gap-3">
                  <TagChip label={tag.name} />
                  <span className="text-sm text-slate-500">
                    Used in N/A questions
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <button
                    type="button"
                    className="rounded-md text-slate-500 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                    disabled
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md text-rose-500 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                    disabled
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminTags;
