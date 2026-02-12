import { useEffect, useMemo, useState } from "react";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import QuestionCard from "../components/ui/QuestionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { listTags } from "../api/questions";
import { createFlagItem, selectFlags } from "../features/flags/flagsSlice";
import { fetchQuestions, selectQuestions } from "../features/questions/questionsSlice";
import { castVoteItem, selectVotes } from "../features/votes/votesSlice";
import { formatAbsoluteTime } from "../utils/time";
import type { QuestionCardData, Tag, TagChipData } from "../types";

const filters: TagChipData[] = [
  { label: "Newest", active: true },
  { label: "Most Votes" },
  { label: "Unanswered" },
];

type TagLoadStatus = "idle" | "loading" | "succeeded" | "failed";

const QuestionsList = () => {
  const PAGE_SIZE = 10;
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(selectQuestions);
  const { status: voteStatus, error: voteError } = useAppSelector(selectVotes);
  const { status: flagStatus, error: flagError } = useAppSelector(selectFlags);
  const isVoting = voteStatus === "loading";
  const isFlagging = flagStatus === "loading";
  const [tagStatus, setTagStatus] = useState<TagLoadStatus>("idle");
  const [tagError, setTagError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const loadTags = async () => {
      setTagStatus("loading");
      setTagError(null);
      try {
        const response = await listTags();
        if (mounted) {
          setTags(response);
          setTagStatus("succeeded");
        }
      } catch {
        if (mounted) {
          setTagStatus("failed");
          setTagError("Unable to load tags");
        }
      }
    };
    loadTags();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeTag === "All") {
      dispatch(fetchQuestions(undefined));
    } else {
      dispatch(fetchQuestions({ tag: activeTag }));
    }
  }, [activeTag, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTag, items.length]);

  const tagFilters: TagChipData[] = useMemo(() => {
    const base = [{ label: "All", active: activeTag === "All" }];
    const dynamic = tags.map((tag) => ({
      label: tag.name,
      active: tag.name === activeTag,
    }));
    return [...base, ...dynamic];
  }, [activeTag, tags]);

  const handleVote = async (questionId: string, value: 1 | -1) => {
    const scrollY = window.scrollY;
    try {
      await dispatch(
        castVoteItem({ target_type: "question", target_id: questionId, value })
      ).unwrap();
      await dispatch(fetchQuestions(undefined));
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "auto" });
      });
    } catch {
      // errors handled in state
    }
  };

  const handleFlag = async (questionId: string) => {
    const scrollY = window.scrollY;
    try {
      await dispatch(
        createFlagItem({
          target_type: "question",
          target_id: questionId,
          reason: "Inappropriate content",
        })
      ).unwrap();
      await dispatch(fetchQuestions(undefined));
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "auto" });
      });
    } catch {
      // errors handled in state
    }
  };

  const renderActions = (questionId: string) => (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => handleVote(questionId, 1)}
        disabled={isVoting}
      >
        👍
        Upvote
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => handleVote(questionId, -1)}
        disabled={isVoting}
      >
        👎
        Downvote
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => handleFlag(questionId)}
        disabled={isFlagging}
      >
        🚩
        Flag
      </button>
    </span>
  );

  const questionCards: QuestionCardData[] = items.map((question) => ({
    question,
    tags: [],
    meta: {
      author: question.author_name ?? "Community Member",
      time: formatAbsoluteTime(question.created_at),
    },
    stats: {
      answers: question.answers_count ?? 0,
      views: question.views_count ?? 0,
      votes: question.vote_score,
    },
    statusLabel: question.accepted_answer_id ? "Answered" : undefined,
    statusVariant: question.accepted_answer_id ? "success" : undefined,
    action: renderActions(question.id),
  }));

  const totalPages = Math.max(1, Math.ceil(questionCards.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedCards = questionCards.slice(startIndex, startIndex + PAGE_SIZE);

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
        {tagStatus === "loading" ? (
          <span className="text-xs text-slate-400">Loading tags...</span>
        ) : null}
        {tagStatus === "failed" ? (
          <span className="text-xs text-rose-500">{tagError}</span>
        ) : null}
        {tagStatus === "succeeded"
          ? tagFilters.map((tag) => (
              <TagChip
                key={tag.label}
                label={tag.label}
                active={tag.active}
                onClick={() => setActiveTag(tag.label)}
              />
            ))
          : null}
      </div>

      {status === "loading" || status === "idle" ? (
        <EmptyState title="Loading questions..." description="Fetching the latest posts." />
      ) : error ? (
        <EmptyState title="Unable to load questions" description={error} />
      ) : questionCards.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="New questions will appear here once the community starts posting."
          actionLabel="Start Asking"
        />
      ) : (
        <div className="space-y-5">
          {paginatedCards.map((question) => (
            <QuestionCard
              key={question.question.id}
              {...question}
              to={`/questions/${question.question.id}`}
              leading={<span className="text-sm font-semibold">{question.stats.votes}</span>}
            />
          ))}
        </div>
      )}

      {voteError || flagError ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {voteError ?? flagError}
        </p>
      ) : null}

      {questionCards.length > PAGE_SIZE ? (
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : null}

    </div>
  );
};

export default QuestionsList;
