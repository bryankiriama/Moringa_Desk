import { useEffect, useState, type FormEvent } from "react";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionCard from "../components/ui/SectionCard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createFaqItem,
  deleteFaqItem,
  fetchAdminFaqs,
  selectAdmin,
  updateFaqItem,
} from "../features/admin/adminSlice";
import type { FAQ } from "../types";

const tabs = [
  { label: "Manage Tags", active: false },
  { label: "Manage FAQs", active: true },
  { label: "User Management", active: false },
];

const AdminFaqs = () => {
  const dispatch = useAppDispatch();
  const {
    faqs,
    faqsStatus,
    faqsError,
    createFaqStatus,
    createFaqError,
    updateFaqStatus,
    updateFaqError,
    deleteFaqStatus,
    deleteFaqError,
  } = useAppSelector(selectAdmin);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const maxQuestionLength = 200;
  const maxAnswerLength = 500;
  const trimmedQuestion = question.trim();
  const trimmedAnswer = answer.trim();
  const isQuestionTooLong = trimmedQuestion.length > maxQuestionLength;
  const isAnswerTooLong = trimmedAnswer.length > maxAnswerLength;
  const isFaqInvalid =
    trimmedQuestion.length === 0 ||
    trimmedAnswer.length === 0 ||
    isQuestionTooLong ||
    isAnswerTooLong;

  const isLoading = faqsStatus === "loading" || faqsStatus === "idle";
  const isCreating = createFaqStatus === "loading";
  const isUpdating = updateFaqStatus === "loading";
  const isDeleting = deleteFaqStatus === "loading";

  useEffect(() => {
    dispatch(fetchAdminFaqs());
  }, [dispatch]);

  const handleCreateFaq = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFaqInvalid) {
      return;
    }
    try {
      await dispatch(
        createFaqItem({ question: trimmedQuestion, answer: trimmedAnswer })
      ).unwrap();
      setQuestion("");
      setAnswer("");
      await dispatch(fetchAdminFaqs());
    } catch {
      // errors handled in state
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleUpdateFaq = async (faqId: string) => {
    const trimmedEditQuestion = editQuestion.trim();
    const trimmedEditAnswer = editAnswer.trim();
    if (!trimmedEditQuestion || !trimmedEditAnswer) return;
    try {
      await dispatch(
        updateFaqItem({
          faqId,
          data: { question: trimmedEditQuestion, answer: trimmedEditAnswer },
        })
      ).unwrap();
      cancelEdit();
    } catch {
      // errors handled in state
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    try {
      await dispatch(deleteFaqItem(faqId)).unwrap();
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
            disabled={isCreating || isFaqInvalid}
            aria-disabled={isCreating || isFaqInvalid}
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
              maxLength={maxQuestionLength + 20}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
              disabled={isCreating}
            />
            <p className="mt-2 text-xs text-slate-500">
              Question can be up to {maxQuestionLength} characters.
            </p>
            {isQuestionTooLong ? (
              <p className="mt-1 text-xs text-rose-600">
                Question is too long. Please shorten it.
              </p>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Answer</label>
            <textarea
              rows={4}
              placeholder="Provide the answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              maxLength={maxAnswerLength + 50}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
              disabled={isCreating}
            />
            <p className="mt-2 text-xs text-slate-500">
              Answer can be up to {maxAnswerLength} characters.
            </p>
            {isAnswerTooLong ? (
              <p className="mt-1 text-xs text-rose-600">
                Answer is too long. Please shorten it.
              </p>
            ) : null}
          </div>
          {createFaqError ? (
            <p className="text-sm text-rose-600">{createFaqError}</p>
          ) : null}
        </form>
        {updateFaqError ? (
          <p className="mb-3 text-sm text-rose-600">{updateFaqError}</p>
        ) : null}
        {deleteFaqError ? (
          <p className="mb-3 text-sm text-rose-600">{deleteFaqError}</p>
        ) : null}

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
                className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4"
              >
                {editingId === faq.id ? (
                  <div className="w-full space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Question
                      </label>
                      <input
                        type="text"
                        value={editQuestion}
                        onChange={(event) => setEditQuestion(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Answer
                      </label>
                      <textarea
                        rows={3}
                        value={editAnswer}
                        onChange={(event) => setEditAnswer(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleUpdateFaq(faq.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 focus-ring"
                        onClick={cancelEdit}
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {faq.question}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <button
                        type="button"
                        className="rounded-md text-slate-500 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => startEdit(faq)}
                        disabled={isUpdating || isDeleting}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-md text-rose-500 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleDeleteFaq(faq.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminFaqs;
