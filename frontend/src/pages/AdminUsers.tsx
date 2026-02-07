import Badge from "../components/ui/Badge";
import SectionCard from "../components/ui/SectionCard";

const tabs = [
  { label: "Manage Tags", active: false },
  { label: "Manage FAQs", active: false },
  { label: "User Management", active: true },
];

const users = [
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "Admin",
    questions: 45,
    answers: 234,
  },
  {
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "Moderator",
    questions: 32,
    answers: 198,
  },
  {
    name: "Aisha Patel",
    email: "aisha@example.com",
    role: "Student",
    questions: 28,
    answers: 167,
  },
  {
    name: "James Martinez",
    email: "james@example.com",
    role: "Student",
    questions: 19,
    answers: 143,
  },
];

const roleVariant = (role: string) => {
  if (role === "Admin") return "accent";
  if (role === "Moderator") return "info";
  return "neutral";
};

const AdminUsers = () => {
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

      <SectionCard
        title="User Management"
        subtitle="4 users total"
        action={
          <button
            type="button"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus-ring"
          >
            Invite User
          </button>
        }
      >
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
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Badge label={user.role} variant={roleVariant(user.role)} />
                <span className="text-slate-600">{user.questions}</span>
                <span className="text-slate-600">{user.answers}</span>
                <div className="flex items-center gap-3 text-slate-400">
                  <button type="button" className="rounded-md text-sm text-slate-500 focus-ring">
                    Edit
                  </button>
                  <button type="button" className="rounded-md text-sm text-rose-500 focus-ring">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminUsers;
