import Badge from "../components/ui/Badge";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";

const tabs = [
  { label: "Manage Tags", active: true },
  { label: "Manage FAQs", active: false },
  { label: "User Management", active: false },
];

const tags = [
  { name: "Python", count: 234 },
  { name: "JavaScript", count: 198 },
  { name: "React", count: 165 },
  { name: "Databases", count: 143 },
  { name: "DevOps", count: 98 },
];

const AdminTags = () => {
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
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
          />
          <button
            type="button"
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white focus-ring"
          >
            Add Tag
          </button>
        </div>
      </SectionCard>

      <SectionCard title="All Tags" subtitle="5 tags total">
        <div className="space-y-4">
          {tags.map((tag) => (
            <div
              key={tag.name}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4"
            >
              <div className="flex items-center gap-3">
                <TagChip label={tag.name} />
                <span className="text-sm text-slate-500">Used in {tag.count} questions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <button type="button" className="rounded-md text-slate-500 focus-ring">
                  Edit
                </button>
                <button type="button" className="rounded-md text-rose-500 focus-ring">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminTags;
