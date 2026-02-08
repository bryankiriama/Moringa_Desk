import { useEffect } from "react";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import QuestionCard from "../components/ui/QuestionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchQuestions, selectQuestions } from "../features/questions/questionsSlice";
import type { QuestionCardData, TagChipData } from "../types";

const filters: TagChipData[] = [
  { label: "Newest", active: true },
  { label: "Most Votes" },
  { label: "Unanswered" },
];

const tagFilters: TagChipData[] = [
  { label: "All", active: true },
  { label: "React" },
  { label: "Python" },
  { label: "JavaScript" },
  { label: "Databases" },
  { label: "DevOps" },
  { label: "API" },
];

const QuestionsList = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(selectQuestions);

  useEffect(() => {
    dispatch(fetchQuestions(undefined));
  }, [dispatch]);

  const questionCards: QuestionCardData[] = items.map((question) => ({
    question,
    tags: [],
    meta: { author: "Community Member", time: "Recently" },
    stats: { answers: 0, views: 0, votes: question.vote_score },
    statusLabel: question.accepted_answer_id ? "Answered" : undefined,
    statusVariant: question.accepted_answer_id ? "success" : undefined,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">All Questions</h1>
          <p className="text-sm text-slate-500">Browse community questions and answers</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 focus-ring"
        >
          Advanced Filters
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-500">Sort by:</span>
        {filters.map((filter) => (
          <TagChip key={filter.label} label={filter.label} active={filter.active} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Filter by tags:</span>
        {tagFilters.map((tag) => (
          <TagChip key={tag.label} label={tag.label} active={tag.active} />
        ))}
      </div>

      {status === "loading" || status === "idle" ? (
        <EmptyState title="Loading questions..." description="Fetching the latest posts." />
      ) : error ? (
        <EmptyState title="Unable to load questions" description={error} />
      ) : questionCards.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="New questions will appear here once the community starts posting."
          actionLabel="Start by asking"
        />
      ) : (
        <div className="space-y-5">
          {questionCards.map((question) => (
            <QuestionCard
              key={question.question.id}
              {...question}
              leading={<span className="text-sm font-semibold">{question.stats.votes}</span>}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center">
        <Pagination currentPage={1} totalPages={3} />
      </div>

      <div className="flex items-center justify-end">
        <Badge label="Switch to Student View" variant="outline" />
      </div>
    </div>
  );
};

export default QuestionsList;
