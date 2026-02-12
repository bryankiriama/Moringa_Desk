import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionCard from "../components/ui/SectionCard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteUserItem,
  fetchAdminUsers,
  selectAdmin,
  updateUserRoleItem,
} from "../features/admin/adminSlice";
import { selectAuth } from "../features/auth/authSlice";
import type { User } from "../types";

const tabs = [
  { label: "Manage Tags", to: "/admin/tags" },
  { label: "Manage FAQs", to: "/admin/faqs" },
  { label: "User Management", to: "/admin/users" },
];

const roleVariant = (role: User["role"]) =>
  role === "admin" ? "accent" : "neutral";

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, usersStatus, usersError, updateRoleStatus, updateRoleError } =
    useAppSelector(selectAdmin);
  const { userId: currentUserId } = useAppSelector(selectAuth);
  const { deleteUserStatus, deleteUserError } = useAppSelector(selectAdmin);
  const isLoading = usersStatus === "loading" || usersStatus === "idle";
  const isUpdating = updateRoleStatus === "loading";
  const isDeleting = deleteUserStatus === "loading";
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    try {
      await dispatch(updateUserRoleItem({ userId, data: { role } })).unwrap();
      await dispatch(fetchAdminUsers());
    } catch {
      // errors handled in state
    }
  };

  const handleDelete = async (user: User) => {
    if (user.id === currentUserId) {
      return;
    }
    if (deleteConfirmId !== user.id) {
      setDeleteConfirmId(user.id);
      return;
    }
    try {
      await dispatch(deleteUserItem(user.id)).unwrap();
      await dispatch(fetchAdminUsers());
      setDeleteConfirmId(null);
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

      <SectionCard
        title="User Management"
        subtitle={`${users.length} users total`}
        action={
          <button
            type="button"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
          >
            Invite User
          </button>
        }
      >
        {isLoading ? (
          <EmptyState title="Loading users..." description="Fetching the latest users." />
        ) : usersError ? (
          <EmptyState title="Unable to load users" description={usersError} />
        ) : users.length === 0 ? (
          <EmptyState
            title="No users yet"
            description="Invited users will show up here once they accept."
            actionLabel="Invite User"
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[720px] space-y-4">
              <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 text-xs uppercase tracking-wide text-slate-400">
                <span>User</span>
                <span>Role</span>
                <span>Questions</span>
                <span>Answers</span>
                <span>Actions</span>
              </div>
              {users.map((user) => (
                <div
                  key={user.email}
                  className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] items-center gap-4 border-t border-slate-100 pt-4 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{user.full_name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Badge
                      label={user.role}
                      variant={roleVariant(user.role)}
                      className="capitalize"
                    />
                    <select
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(user.id, event.target.value as User["role"])
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus-ring"
                      disabled={isUpdating}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <span className="text-slate-600">{user.questions_count}</span>
                  <span className="text-slate-600">{user.answers_count}</span>
                  <div className="flex items-center gap-3 text-slate-400">
                    <button
                      type="button"
                      className="rounded-md text-sm text-slate-500 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                      disabled
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md text-sm text-rose-500 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDelete(user)}
                      disabled={isDeleting || user.id === currentUserId}
                    >
                      {deleteConfirmId === user.id ? "Confirm remove" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {updateRoleError ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {updateRoleError}
          </p>
        ) : null}
        {deleteUserError ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {deleteUserError}
          </p>
        ) : null}
      </SectionCard>
    </div>
  );
};

export default AdminUsers;
