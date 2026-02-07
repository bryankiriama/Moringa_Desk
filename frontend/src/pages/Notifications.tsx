import Badge from "../components/ui/Badge";
import NotificationItem from "../components/ui/NotificationItem";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import type { Notification } from "../types";

const tabs = [
  { label: "All Notifications", active: true },
  { label: "Unread (3)" },
];

type NotificationCardData = {
  notification: Notification;
  title: string;
  message: string;
  time: string;
  isNew?: boolean;
};

const notifications: NotificationCardData[] = [
  {
    notification: {
      id: "n-100",
      user_id: "u-700",
      type: "accepted_answer",
      payload: { answer_id: "a-600", question_id: "q-400" },
      is_read: false,
      created_at: "2024-01-30T09:00:00Z",
    },
    title: "Your answer was accepted",
    message: "Sarah Chen accepted your answer on \"How to implement OAuth2 in Django?\"",
    time: "5 minutes ago",
    isNew: true,
  },
  {
    notification: {
      id: "n-101",
      user_id: "u-700",
      type: "vote_received",
      payload: { target_type: "answer", value: 1 },
      is_read: false,
      created_at: "2024-01-30T08:00:00Z",
    },
    title: "Your answer received upvotes",
    message: "Your answer on \"React useState best practices\" received 5 new upvotes",
    time: "1 hour ago",
    isNew: true,
  },
  {
    notification: {
      id: "n-102",
      user_id: "u-700",
      type: "answer_posted",
      payload: { question_id: "q-410", answer_id: "a-612" },
      is_read: false,
      created_at: "2024-01-30T07:00:00Z",
    },
    title: "New answer on your question",
    message: "Michael Johnson answered your question \"Understanding async/await patterns\"",
    time: "2 hours ago",
    isNew: true,
  },
  {
    notification: {
      id: "n-103",
      user_id: "u-700",
      type: "new_follower",
      payload: { follower_id: "u-702" },
      is_read: true,
      created_at: "2024-01-30T06:00:00Z",
    },
    title: "New follower",
    message: "Aisha Patel started following your activity",
    time: "3 hours ago",
  },
  {
    notification: {
      id: "n-104",
      user_id: "u-700",
      type: "achievement_unlocked",
      payload: { badge: "Helpful Answer" },
      is_read: true,
      created_at: "2024-01-29T09:00:00Z",
    },
    title: "Achievement unlocked",
    message: "You earned the \"Helpful Answer\" badge for having 10 accepted answers",
    time: "1 day ago",
  },
];

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">You have 3 unread notifications</p>
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
        <button type="button" className="ml-auto rounded-md text-sm text-slate-500 focus-ring">
          Mark all as read
        </button>
      </div>

      <SectionCard>
        <div className="space-y-4">
          {notifications.map((item) => (
            <NotificationItem key={item.notification.id} {...item} />
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-end">
        <Badge label="Switch to Student View" variant="outline" />
      </div>
    </div>
  );
};

export default Notifications;
