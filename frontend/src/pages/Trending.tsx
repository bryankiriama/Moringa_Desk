import { useEffect, useState } from "react";

import EmptyState from "../components/ui/EmptyState";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { listTags } from "../api/admin";
import { fetchQuestions, selectQuestions } from "../features/questions/questionsSlice";
import type { QuestionCardData, Tag } from "../types";

type TrendingQuestion = QuestionCardData & { rank: string; trendScore: number };

type TagLoadStatus = "idle" | "loading" | "succeeded" | "failed";

const Trending = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(selectQuestions);
  const [tagStatus, setTagStatus] = useState<TagLoadStatus>("idle");
  const [tagError, setTagError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    dispatch(fetchQuestions(undefined));
  }, [dispatch]);

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
      } catch (err) {
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

  const trendingQuestions: TrendingQuestion[] = [...items]
    .sort((a, b) => (b.vote_score ?? 0) - (a.vote_score ?? 0))
    .slice(0, 5)
    .map((question, index) => ({
      rank: `#${index + 1}`,
      trendScore: question.vote_score ?? 0,
      question,
      tags: [],
      meta: { author: question.author_name ?? "Community", time: "Today" },
      stats: {
        answers: question.answers_count ?? 0,
        views: question.views_count ?? 0,
        votes: question.vote_score ?? 0,
      },
      statusLabel: question.accepted_answer_id ? "Answered" : undefined,
      statusVariant: question.accepted_answer_id ? "success" : undefined,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Trending Questions</h1>
        <p className="text-sm text-slate-500">
          Most popular questions and topics in the community
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <SectionCard title="Trending Now" subtitle="Most popular questions and topics">
          <div className="space-y-4">
            {status === "loading" ? (
              <EmptyState title="Loading trending questions..." description="Please wait." />
            ) : null}
            {status === "failed" ? (
              <EmptyState
                title="Unable to load trending questions"
                description={error ?? "Please try again later."}
              />
            ) : null}
            {status === "succeeded" && trendingQuestions.length === 0 ? (
              <EmptyState
                title="No trending questions yet"
                description="Be the first to ask a question."
              />
            ) : null}
            {status === "succeeded"
              ? trendingQuestions.map((question) => (
                  <QuestionCard
                    key={question.question.id}
                    question={question.question}
                    tags={question.tags}
                    meta={question.meta}
                    stats={question.stats}
                    statusLabel={question.statusLabel}
                    statusVariant={question.statusVariant}
                    to={`/questions/${question.question.id}`}
                    leading={
                      <span className="text-sm font-semibold">{question.rank}</span>
                    }
                    action={
                      <span className="text-xs font-semibold text-indigo-600">
                        {question.trendScore} trend score
                      </span>
                    }
                  />
                ))
              : null}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Trending Tags" subtitle="Fastest growing topics">
            <div className="space-y-3">
              {tagStatus === "loading" ? (
                <EmptyState title="Loading tags..." description="Please wait." />
              ) : null}
              {tagStatus === "failed" ? (
                <EmptyState title="Unable to load tags" description={tagError ?? ""} />
              ) : null}
              {tagStatus === "succeeded" && tags.length === 0 ? (
                <EmptyState title="No tags yet" description="Create a tag to get started." />
              ) : null}
              {tagStatus === "succeeded"
                ? tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <TagChip label={tag.name} />
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </SectionCard>

          <SectionCard title="Top This Week" subtitle="Most active helpers">
            <EmptyState
              title="No contributor stats yet"
              description="Contributor rankings are not available from the API."
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Trending;
