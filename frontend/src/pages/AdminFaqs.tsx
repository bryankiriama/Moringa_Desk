import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionCard from "../components/ui/SectionCard";
import type { FAQ } from "../types";

const tabs = [
  { label: "Manage Tags", active: false },
  { label: "Manage FAQs", active: true },
  { label: "User Management", active: false },
];

type FAQRow = FAQ & { views: string };

const faqs: FAQRow[] = [
  {
    id: "f-100",
    question: "How do I reset my password?",
    answer: "Use the reset link on the login screen and follow the email steps.",
    created_by: "u-700",
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
    views: "1,234 views",
  },
  {
    id: "f-101",
    question: "What are the community guidelines?",
    answer: "Be respectful, avoid duplicate questions, and include clear context.",
    created_by: "u-700",
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
    views: "987 views",
  },
  {
    id: "f-102",
    question: "How does the voting system work?",
    answer: "Upvotes increase visibility and help highlight helpful answers.",
    created_by: "u-700",
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
    views: "756 views",
  },
  {
    id: "f-103",
    question: "Can I edit my questions after posting?",
    answer: "Yes. Use the edit action to update details or add clarity.",
    created_by: "u-700",
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
    views: "543 views",
  },
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
            } focus-ring`}
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
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus-ring"
          >
            Add FAQ
          </button>
        }
      >
        {faqs.length === 0 ? (
          <EmptyState
            title="No FAQs yet"
            description="Publish answers to common questions to help new users."
            actionLabel="Add FAQ"
          />
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                  <p className="text-xs text-slate-500">{faq.views}</p>
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
        )}
      </SectionCard>
    </div>
  );
};

export default AdminFaqs;
