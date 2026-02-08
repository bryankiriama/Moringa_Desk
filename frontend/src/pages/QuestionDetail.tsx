import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchQuestionDetail,
  selectQuestions,
} from "../features/questions/questionsSlice";
import type { Answer, QuestionCardData, Tag } from "../types";

type AnswerCardData = {
  answer: Answer;
  author: string;
  time: string;
};

const QuestionDetail = () => {
  const { questionId } = useParams();
  const dispatch = useAppDispatch();
  const { detail, detailStatus, detailError } = useAppSelector(selectQuestions);

  useEffect(() => {
    if (questionId) {
      dispatch(fetchQuestionDetail(questionId));
    }
  }, [dispatch, questionId]);

  if (!questionId) {
    return <EmptyState title="Question not found" description="Missing question id." />;
  }

  if (detailStatus === "loading" || detailStatus === "idle") {
    return <EmptyState title="Loading question..." description="Fetching details." />;
  }

  if (detailStatus === "failed" || !detail) {
    return (
      <EmptyState
        title="Unable to load question"
        description={detailError ?? "Please try again later."}
      />
    );
  }

  const question: QuestionCardData = {
    question: detail,
    tags: detail.tags,
    meta: { author: "Community Member", time: "Recently" },
    stats: { answers: detail.answers.length, views: 0 },
  };

  const answers: AnswerCardData[] = detail.answers.map((answer) => ({
    answer,
    author: "Community Member",
    time: "Recently",
  }));

  const relatedQuestions: QuestionCardData[] = detail.related_questions.map(
    (related) => ({
      question: related,
      tags: [] as Tag[],
      meta: { author: "Community Member", time: "Recently" },
      stats: { answers: 0, views: 0, votes: related.vote_score },
      statusLabel: related.accepted_answer_id ? "Answered" : undefined,
      statusVariant: related.accepted_answer_id ? "success" : undefined,
    })
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Question Detail" subtitle="Asked by a community member">
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {question.question.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{question.question.body}</p>
            </div>
            {question.question.accepted_answer_id ? (
              <Badge label="Answered" variant="success" />
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <TagChip key={tag.id} label={tag.name} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Asked by {question.meta.author}</span>
            <span>•</span>
            <span>{question.meta.time}</span>
            <span>•</span>
            <span>{question.stats.views} views</span>
            <span>•</span>
            <span>{question.question.vote_score} votes</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>{detail.body}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Answers" subtitle={`${detail.answers.length} answers`}>
        <div className="space-y-4">
          {answers.length === 0 ? (
            <EmptyState title="No answers yet" description="Be the first to help." />
          ) : (
            answers.map((answer) => (
              <div
                key={answer.answer.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {answer.author}
                    </p>
                    <p className="text-xs text-slate-500">{answer.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={`${answer.answer.vote_score} votes`} variant="neutral" />
                    {answer.answer.is_accepted ? (
                      <Badge label="Accepted" variant="success" />
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{answer.answer.body}</p>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard title="Related Questions" subtitle="You may also find these helpful">
        <div className="space-y-4">
          {relatedQuestions.length === 0 ? (
            <EmptyState title="No related questions" description="Check back later." />
          ) : (
            relatedQuestions.map((related) => (
              <QuestionCard key={related.question.id} {...related} />
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export default QuestionDetail;
