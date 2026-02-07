import Badge from "../components/ui/Badge";
import SectionCard from "../components/ui/SectionCard";

const tabs = [
  { label: "Manage Tags", active: false },
  { label: "Manage FAQs", active: true },
  { label: "User Management", active: false },
];

const faqs = [
  { question: "How do I reset my password?", views: "1,234 views" },
  { question: "What are the community guidelines?", views: "987 views" },
  { question: "How does the voting system work?", views: "756 views" },
  { question: "Can I edit my questions after posting?", views: "543 views" },
];

const AdminFaqs = () => {
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
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SectionCard
        title="Frequently Asked Questions"
        subtitle="Manage common questions and answers"
        action={
          <button
            type="button"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Add FAQ
          </button>
        }
      >
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                <p className="text-xs text-slate-500">{faq.views}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <button type="button" className="text-slate-500">
                  Edit
                </button>
                <button type="button" className="text-rose-500">
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

export default AdminFaqs;
