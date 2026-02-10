import { useEffect } from "react";
import { Link } from "react-router-dom";

import EmptyState from "../components/ui/EmptyState";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMyAnswers, fetchMyQuestions, selectMe } from "../features/me/meSlice";
import type { QuestionCardData } from "../types";
import { formatAbsoluteTime } from "../utils/time";

const MyActivity = () => {
  const dispatch = useAppDispatch();
  const { questions, answers, questionsStatus, answersStatus, error } =
    useAppSelector(selectMe);

  useEffect(() => {
    dispatch(fetchMyQuestions());
    dispatch(fetchMyAnswers());
  }, [dispatch]);

  const questionCards: QuestionCardData[] = questions.map((question) => ({
    question: { ...question, vote_score: 0 },
    tags: [],
    meta: { author: "You", time: formatAbsoluteTime(question.created_at) },
    stats: { answers: 0, views: 0, votes: 0 },
    statusLabel: question.accepted_answer_id ? "Answered" : undefined,
    statusVariant: question.accepted_answer_id ? "success" : undefined,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">History</h1>
        <p className="text-sm text-slate-500">
          Your questions and answers timeline
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <SectionCard title="My Questions" subtitle="Questions you've asked">
        {questionsStatus === "loading" ? (
          <EmptyState title="Loading your questions..." description="Please wait." />
        ) : questionCards.length === 0 ? (
          <EmptyState
            title="No questions yet"
            description="Ask a question to start your history."
            actionLabel="Ask Question"
          />
        ) : (
          <div className="space-y-4">
            {questionCards.map((question) => (
              <QuestionCard
                key={question.question.id}
                {...question}
                to={`/questions/${question.question.id}`}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="My Answers" subtitle="Answers you've posted">
        {answersStatus === "loading" ? (
          <EmptyState title="Loading your answers..." description="Please wait." />
        ) : answers.length === 0 ? (
          <EmptyState
            title="No answers yet"
            description="Answer a question to show up here."
          />
        ) : (
          <div className="space-y-3">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-4"
              >
                <p className="text-sm text-slate-600">{answer.body}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{answer.is_accepted ? "Accepted" : "Pending"}</span>
                  <Link
                    to={`/questions/${answer.question_id}`}
                    className="font-medium text-indigo-600 focus-ring"
                  >
                    View Question
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default MyActivity;
