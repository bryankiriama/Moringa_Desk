import { useEffect, useState, type FormEvent } from "react";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionCard from "../components/ui/SectionCard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createFaqItem,
  fetchAdminFaqs,
  selectAdmin,
} from "../features/admin/adminSlice";
import type { FAQ } from "../types";

const tabs = [
  { label: "Manage Tags", active: false },
  { label: "Manage FAQs", active: true },
  { label: "User Management", active: false },
];

const AdminFaqs = () => {
  const dispatch = useAppDispatch();
  const { faqs, faqsStatus, faqsError, createFaqStatus, createFaqError } =
    useAppSelector(selectAdmin);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const isLoading = faqsStatus === "loading" || faqsStatus === "idle";
  const isCreating = createFaqStatus === "loading";

  useEffect(() => {
    dispatch(fetchAdminFaqs());
  }, [dispatch]);

  const handleCreateFaq = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim() || !answer.trim()) {
      return;
    }
    try {
      await dispatch(
        createFaqItem({ question: question.trim(), answer: answer.trim() })
      ).unwrap();
      setQuestion("");
      setAnswer("");
      await dispatch(fetchAdminFaqs());
    } catch {
      // errors handled in state
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-500">
            Manage platform content, users, and settings
          </p>
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
            type="submit"
            form="faq-create-form"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCreating}
          >
            {isCreating ? "Adding..." : "Add FAQ"}
          </button>
        }
      >
        <form id="faq-create-form" className="mb-6 space-y-4" onSubmit={handleCreateFaq}>
          <div>
            <label className="text-sm font-medium text-slate-700">Question</label>
            <input
              type="text"
              placeholder="Enter FAQ question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
              disabled={isCreating}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Answer</label>
            <textarea
              rows={4}
              placeholder="Provide the answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
              disabled={isCreating}
            />
          </div>
          {createFaqError ? (
            <p className="text-sm text-rose-600">{createFaqError}</p>
          ) : null}
        </form>

        {isLoading ? (
          <EmptyState title="Loading FAQs..." description="Fetching FAQ entries." />
        ) : faqsError ? (
          <EmptyState title="Unable to load FAQs" description={faqsError} />
        ) : faqs.length === 0 ? (
          <EmptyState
            title="No FAQs yet"
            description="Publish answers to common questions to help new users."
            actionLabel="Add FAQ"
          />
        ) : (
          <div className="space-y-4">
            {faqs.map((faq: FAQ) => (
              <div
                key={faq.id}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                  <p className="text-xs text-slate-500">Views: N/A</p>
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

export default AdminFaqs;
