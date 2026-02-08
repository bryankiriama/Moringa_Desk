import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createQuestionItem,
  selectQuestions,
} from "../features/questions/questionsSlice";

const popularTags = [
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "Databases",
  "PostgreSQL",
  "MongoDB",
  "API",
];

const categories = ["Frontend", "Backend", "Databases", "DevOps", "Career"];
const phases = ["Foundation", "Intermediate", "Advanced", "Expert"];

const AskQuestion = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { createStatus, createError } = useAppSelector(selectQuestions);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const question = await dispatch(
        createQuestionItem({ title, body, category, stage })
      ).unwrap();
      navigate(`/questions/${question.id}`);
    } catch {
      // errors handled in state
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ask a Question</h1>
        <p className="text-sm text-slate-500">Share your question with the community.</p>
      </div>

      <SectionCard
        title="Tips for asking a great question"
        subtitle="Make your question clear and specific"
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Provide context and what you&apos;ve already tried</li>
          <li>Include relevant code snippets and error messages</li>
          <li>Use proper tags to help others find your question</li>
          <li>Be respectful and follow community guidelines</li>
        </ul>
      </SectionCard>

      <SectionCard title="Ask a Question" subtitle="Help others understand your issue">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700">Question Title</label>
            <input
              type="text"
              placeholder="e.g., How do I implement authentication in React?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
            />
            <p className="mt-2 text-xs text-slate-500">
              Be specific and imagine you&apos;re asking a question to another person.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Detailed Description</label>
            <textarea
              rows={6}
              placeholder="Provide all the details someone would need to understand and answer your question."
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
            />
            <p className="mt-2 text-xs text-slate-500">
              You can use markdown formatting for code blocks and links.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus-ring"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Learning Phase</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus-ring"
                value={stage}
                onChange={(event) => setStage(event.target.value)}
              >
                <option value="">Select learning phase</option>
                {phases.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Tags (up to 5)</label>
            <input
              type="text"
              placeholder="Search for tags..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Add up to 5 tags to help others find and answer your question.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button type="button" className="rounded-md text-sm font-medium text-slate-500 focus-ring">
              Save as Draft
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 focus-ring"
              >
                Preview
              </button>
              <button
                type="submit"
                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white focus-ring disabled:cursor-not-allowed disabled:opacity-70"
                disabled={createStatus === "loading"}
              >
                {createStatus === "loading" ? "Posting..." : "Post Question"}
              </button>
            </div>
          </div>

          {createError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {createError}
            </p>
          ) : null}
        </form>
      </SectionCard>

      <SectionCard title="Community Guidelines">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Be respectful and inclusive to all community members</li>
          <li>Avoid duplicate questions — search first before posting</li>
          <li>Don&apos;t ask for personal information or share sensitive data</li>
          <li>Follow proper formatting and use code blocks for code</li>
          <li>Accept helpful answers and upvote useful content</li>
        </ul>
      </SectionCard>
    </div>
  );
};

export default AskQuestion;
