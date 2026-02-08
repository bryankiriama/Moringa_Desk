import { useEffect } from "react";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import NotificationItem from "../components/ui/NotificationItem";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchNotifications,
  markAllNotificationsRead,
  selectNotifications,
} from "../features/notifications/notificationsSlice";
import type { Notification, NotificationItemData, TagChipData } from "../types";

const toTitleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatMessage = (notification: Notification) => {
  const payload = notification.payload ?? {};
  const questionId =
    typeof payload.question_id === "string" ? payload.question_id : null;
  const answerId =
    typeof payload.answer_id === "string" ? payload.answer_id : null;
  const badge = typeof payload.badge === "string" ? payload.badge : null;

  if (badge) {
    return `You earned the ${badge} badge.`;
  }
  if (questionId && answerId) {
    return `Activity on question ${questionId} (answer ${answerId}).`;
  }
  if (questionId) {
    return `New activity on question ${questionId}.`;
  }
  if (answerId) {
    return `Update on answer ${answerId}.`;
  }
  return "You have new activity on MoringaDesk.";
};

const toNotificationItem = (
  notification: Notification
): NotificationItemData => {
  const title = toTitleCase(notification.type);
  return {
    notification,
    title,
    message: formatMessage(notification),
    time: new Date(notification.created_at).toLocaleString(),
    isNew: !notification.is_read,
  };
};

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, markStatus, markError } =
    useAppSelector(selectNotifications);

  useEffect(() => {
    dispatch(fetchNotifications(undefined));
  }, [dispatch]);

  const unreadCount = items.filter((notification) => !notification.is_read).length;

  const tabs: TagChipData[] = [
    { label: "All Notifications", active: true },
    { label: `Unread (${unreadCount})` },
  ];

  const notifications: NotificationItemData[] = items.map(toNotificationItem);

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
    } catch {
      // errors handled in state
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">
            You have {unreadCount} unread notifications
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 focus-ring"
        >
          Preferences
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => (
          <TagChip key={tab.label} label={tab.label} active={tab.active} />
        ))}
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="ml-auto rounded-md text-sm text-slate-500 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
          disabled={markStatus === "loading"}
        >
          {markStatus === "loading" ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <SectionCard>
        {status === "loading" || status === "idle" ? (
          <EmptyState
            title="Loading notifications..."
            description="Fetching your latest updates."
          />
        ) : error ? (
          <EmptyState title="Unable to load notifications" description={error} />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="You're all caught up"
            description="We'll let you know when new activity happens."
          />
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <NotificationItem key={item.notification.id} {...item} />
            ))}
          </div>
        )}
      </SectionCard>

      {markError ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {markError}
        </p>
      ) : null}

      <div className="flex items-center justify-end">
        <Badge label="Switch to Student View" variant="outline" />
      </div>
    </div>
  );
};

export default Notifications;
