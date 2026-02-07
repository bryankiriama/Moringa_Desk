import Badge from "../components/ui/Badge";
import NotificationItem from "../components/ui/NotificationItem";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";

const tabs = [
  { label: "All Notifications", active: true },
  { label: "Unread (3)" },
];

const notifications = [
  {
    title: "Your answer was accepted",
    message: "Sarah Chen accepted your answer on \"How to implement OAuth2 in Django?\"",
    time: "5 minutes ago",
    isNew: true,
  },
  {
    title: "Your answer received upvotes",
    message: "Your answer on \"React useState best practices\" received 5 new upvotes",
    time: "1 hour ago",
    isNew: true,
  },
  {
    title: "New answer on your question",
    message: "Michael Johnson answered your question \"Understanding async/await patterns\"",
    time: "2 hours ago",
    isNew: true,
  },
  {
    title: "New follower",
    message: "Aisha Patel started following your activity",
    time: "3 hours ago",
  },
  {
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
            <NotificationItem key={item.title} {...item} />
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
