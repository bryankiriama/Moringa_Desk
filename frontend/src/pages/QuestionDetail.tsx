import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  acceptAnswerItem,
  createAnswerItem,
  fetchAnswers,
  selectAnswers,
} from "../features/answers/answersSlice";
import { createFlagItem, selectFlags } from "../features/flags/flagsSlice";
import {
  clearFollowError,
  fetchFollowStatus,
  followQuestionItem,
  selectFollows,
  unfollowQuestionItem,
} from "../features/follows/followsSlice";
import {
  fetchQuestionDetail,
  selectQuestions,
} from "../features/questions/questionsSlice";
import { castVoteItem, selectVotes } from "../features/votes/votesSlice";
import type { QuestionCardData, Tag } from "../types";
import { formatAbsoluteTime } from "../utils/time";

const QuestionDetail = () => {
  const { questionId } = useParams();
  const dispatch = useAppDispatch();
  const { detail, detailStatus, detailError } = useAppSelector(selectQuestions);
  const {
    items: answers,
    status: answersStatus,
    error: answersError,
    createStatus,
    createError,
    acceptStatus,
    acceptError,
  } = useAppSelector(selectAnswers);
  const { status: voteStatus, error: voteError } = useAppSelector(selectVotes);
  const { status: flagStatus, error: flagError } = useAppSelector(selectFlags);
  const { isFollowing, status: followStatus, error: followError } =
    useAppSelector(selectFollows);
  const [answerBody, setAnswerBody] = useState("");
  const isVoting = voteStatus === "loading";
  const isFlagging = flagStatus === "loading";
  const isFollowingBusy = followStatus === "loading";

  useEffect(() => {
    if (questionId) {
      dispatch(fetchQuestionDetail(questionId));
      dispatch(fetchAnswers(questionId));
      dispatch(fetchFollowStatus(questionId));
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
    meta: {
      author: detail.author_name ?? "Community Member",
      time: formatAbsoluteTime(detail.created_at),
    },
    stats: {
      answers: detail.answers_count ?? answers.length,
      views: detail.views_count ?? 0,
    },
  };

  const relatedQuestions: QuestionCardData[] = detail.related_questions.map(
    (related) => ({
      question: related,
      tags: [] as Tag[],
      meta: {
        author: related.author_name ?? "Community Member",
        time: formatAbsoluteTime(related.created_at),
      },
      stats: {
        answers: related.answers_count ?? 0,
        views: related.views_count ?? 0,
        votes: related.vote_score,
      },
      statusLabel: related.accepted_answer_id ? "Answered" : undefined,
      statusVariant: related.accepted_answer_id ? "success" : undefined,
    })
  );

  const handleSubmitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!questionId) {
      return;
    }
    try {
      await dispatch(
        createAnswerItem({ questionId, data: { body: answerBody } })
      ).unwrap();
      setAnswerBody("");
      await dispatch(fetchAnswers(questionId));
      await dispatch(fetchQuestionDetail(questionId));
    } catch {
      // errors handled in state
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!questionId) {
      return;
    }
    try {
      await dispatch(acceptAnswerItem({ questionId, answerId })).unwrap();
      await dispatch(fetchAnswers(questionId));
      await dispatch(fetchQuestionDetail(questionId));
    } catch {
      // errors handled in state
    }
  };

  const handleVoteQuestion = async (value: 1 | -1) => {
    if (!questionId) {
      return;
    }
    const scrollY = window.scrollY;
    try {
      await dispatch(
        castVoteItem({ target_type: "question", target_id: questionId, value })
      ).unwrap();
      await dispatch(fetchQuestionDetail(questionId));
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "auto" });
      });
    } catch {
      // errors handled in state
    }
  };

  const handleVoteAnswer = async (answerId: string, value: 1 | -1) => {
    if (!questionId) {
      return;
    }
    const scrollY = window.scrollY;
    try {
      await dispatch(
        castVoteItem({ target_type: "answer", target_id: answerId, value })
      ).unwrap();
      await dispatch(fetchAnswers(questionId));
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "auto" });
      });
    } catch {
      // errors handled in state
    }
  };

  const handleFlagQuestion = async () => {
    if (!questionId) {
      return;
    }
    const scrollY = window.scrollY;
    try {
      await dispatch(
        createFlagItem({
          target_type: "question",
          target_id: questionId,
          reason: "Inappropriate content",
        })
      ).unwrap();
      await dispatch(fetchQuestionDetail(questionId));
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "auto" });
      });
    } catch {
      // errors handled in state
    }
  };

  const handleFlagAnswer = async (answerId: string) => {
    if (!questionId) {
      return;
    }
    const scrollY = window.scrollY;
    try {
      await dispatch(
        createFlagItem({
          target_type: "answer",
          target_id: answerId,
          reason: "Inappropriate content",
        })
      ).unwrap();
      await dispatch(fetchAnswers(questionId));
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "auto" });
      });
    } catch {
      // errors handled in state
    }
  };

  const handleToggleFollow = async () => {
    if (!questionId) {
      return;
    }
    dispatch(clearFollowError());
    try {
      if (isFollowing) {
        await dispatch(unfollowQuestionItem(questionId)).unwrap();
      } else {
        await dispatch(followQuestionItem(questionId)).unwrap();
      }
    } catch {
      // errors handled in state
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Question Detail"
        subtitle={`Asked by ${detail.author_name ?? "Community Member"}`}
      >
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

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => handleVoteQuestion(1)}
              disabled={isVoting}
            >
              👍
              Upvote
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => handleVoteQuestion(-1)}
              disabled={isVoting}
            >
              👎
              Downvote
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleFlagQuestion}
              disabled={isFlagging}
            >
              🚩
              Flag
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleToggleFollow}
              disabled={isFollowingBusy}
            >
              ⭐
              {isFollowingBusy
                ? "Updating..."
                : isFollowing
                  ? "Unfollow"
                  : "Follow"}
            </button>
          </div>

          {followError ? (
            <p className="text-sm text-rose-600">{followError}</p>
          ) : followStatus === "succeeded" ? (
            <p className="text-sm text-emerald-600">
              {isFollowing ? "You are following this question." : "Unfollowed."}
            </p>
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>{detail.body}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Answers" subtitle={`${answers.length} answers`}>
        <div className="space-y-4">
          {answersStatus === "loading" || answersStatus === "idle" ? (
            <EmptyState title="Loading answers..." description="Fetching replies." />
          ) : answersError ? (
            <EmptyState title="Unable to load answers" description={answersError} />
          ) : answers.length === 0 ? (
            <EmptyState title="No answers yet" description="Be the first to help." />
          ) : (
            answers.map((answer) => (
              <div
                key={answer.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {answer.author_name ?? "Community Member"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatAbsoluteTime(answer.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={`${answer.vote_score} votes`} variant="neutral" />
                    {answer.is_accepted ? (
                      <Badge label="Accepted" variant="success" />
                    ) : (
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleAcceptAnswer(answer.id)}
                        disabled={acceptStatus === "loading" || isVoting || isFlagging}
                      >
                        {acceptStatus === "loading" ? "Accepting..." : "Accept answer"}
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{answer.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleVoteAnswer(answer.id, 1)}
                    disabled={isVoting}
                  >
                    👍
                    Upvote
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleVoteAnswer(answer.id, -1)}
                    disabled={isVoting}
                  >
                    👎
                    Downvote
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleFlagAnswer(answer.id)}
                    disabled={isFlagging}
                  >
                    🚩
                    Flag
                  </button>
                </div>
              </div>
            ))
          )}
          {acceptError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {acceptError}
            </p>
          ) : null}
          {voteError || flagError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {voteError ?? flagError}
            </p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Post an Answer" subtitle="Share your solution with the community">
        <form className="space-y-4" onSubmit={handleSubmitAnswer}>
          <textarea
            rows={5}
            placeholder="Write your answer here..."
            value={answerBody}
            onChange={(event) => setAnswerBody(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
          />
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white focus-ring disabled:cursor-not-allowed disabled:opacity-70"
              disabled={createStatus === "loading" || answerBody.trim().length === 0}
            >
              {createStatus === "loading" ? "Posting..." : "Post Answer"}
            </button>
          </div>
          {createError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {createError}
            </p>
          ) : null}
        </form>
      </SectionCard>

      <SectionCard title="Related Questions" subtitle="You may also find these helpful">
        {relatedQuestions.length === 0 ? (
          <EmptyState title="No related questions" description="Check back later." />
        ) : (
          <ul className="space-y-2 text-sm">
            {relatedQuestions.map((related) => (
              <li key={related.question.id}>
                <Link
                  to={`/questions/${related.question.id}`}
                  className="font-medium text-indigo-600 hover:text-indigo-500 focus-ring"
                >
                  {related.question.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
};

export default QuestionDetail;
