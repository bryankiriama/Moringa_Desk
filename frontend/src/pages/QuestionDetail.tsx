import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
import { selectAuth } from "../features/auth/authSlice";
import {
  deleteAnswer,
  deleteQuestion,
  updateAnswerContent,
  updateQuestionContent,
} from "../api/admin";
import type { QuestionCardData, Tag } from "../types";
import { formatAbsoluteTime } from "../utils/time";

const QuestionDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role } = useAppSelector(selectAuth);
  const isAdmin = role === "admin";
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
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionBody, setEditQuestionBody] = useState("");
  const [adminEditError, setAdminEditError] = useState<string | null>(null);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [editAnswerId, setEditAnswerId] = useState<string | null>(null);
  const [editAnswerBody, setEditAnswerBody] = useState("");
  const [savingAnswerId, setSavingAnswerId] = useState<string | null>(null);
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

  useEffect(() => {
    if (detail && !isEditingQuestion) {
      setEditQuestionTitle(detail.title ?? "");
      setEditQuestionBody(detail.body ?? "");
    }
  }, [detail, isEditingQuestion]);

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

  const handleStartEditQuestion = () => {
    if (!detail) {
      return;
    }
    setAdminEditError(null);
    setIsEditingQuestion(true);
    setEditQuestionTitle(detail.title ?? "");
    setEditQuestionBody(detail.body ?? "");
  };

  const handleCancelEditQuestion = () => {
    setIsEditingQuestion(false);
    setAdminEditError(null);
    setEditQuestionTitle(detail?.title ?? "");
    setEditQuestionBody(detail?.body ?? "");
  };

  const handleSaveQuestion = async () => {
    if (!questionId) {
      return;
    }
    setAdminEditError(null);
    setSavingQuestion(true);
    try {
      await updateQuestionContent(questionId, {
        title: editQuestionTitle.trim(),
        body: editQuestionBody.trim(),
      });
      await dispatch(fetchQuestionDetail(questionId));
      setIsEditingQuestion(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update question.";
      setAdminEditError(message);
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionId) {
      return;
    }
    const confirmed = window.confirm("Delete this question and all related answers?");
    if (!confirmed) {
      return;
    }
    setAdminEditError(null);
    try {
      await deleteQuestion(questionId);
      navigate("/questions");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete question.";
      setAdminEditError(message);
    }
  };

  const handleStartEditAnswer = (answerId: string, body: string) => {
    setAdminEditError(null);
    setEditAnswerId(answerId);
    setEditAnswerBody(body);
  };

  const handleCancelEditAnswer = () => {
    setEditAnswerId(null);
    setEditAnswerBody("");
    setAdminEditError(null);
  };

  const handleSaveAnswer = async (answerId: string) => {
    if (!questionId) {
      return;
    }
    setAdminEditError(null);
    setSavingAnswerId(answerId);
    try {
      await updateAnswerContent(answerId, { body: editAnswerBody.trim() });
      await dispatch(fetchAnswers(questionId));
      setEditAnswerId(null);
      setEditAnswerBody("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update answer.";
      setAdminEditError(message);
    } finally {
      setSavingAnswerId(null);
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!questionId) {
      return;
    }
    const confirmed = window.confirm("Delete this answer?");
    if (!confirmed) {
      return;
    }
    setAdminEditError(null);
    try {
      await deleteAnswer(answerId);
      await dispatch(fetchAnswers(questionId));
      await dispatch(fetchQuestionDetail(questionId));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete answer.";
      setAdminEditError(message);
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
            <div className="flex-1">
              {isEditingQuestion ? (
                <div className="space-y-3">
                  <input
                    value={editQuestionTitle}
                    onChange={(event) => setEditQuestionTitle(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-ring"
                    placeholder="Question title"
                  />
                  <textarea
                    rows={4}
                    value={editQuestionBody}
                    onChange={(event) => setEditQuestionBody(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-ring"
                    placeholder="Question details"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {question.question.title}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    {question.question.body}
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {question.question.accepted_answer_id ? (
                <Badge label="Answered" variant="success" />
              ) : null}
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  {isEditingQuestion ? (
                    <>
                      <button
                        type="button"
                        className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white focus-ring disabled:opacity-60"
                        onClick={handleSaveQuestion}
                        disabled={savingQuestion || editQuestionTitle.trim().length === 0}
                      >
                        {savingQuestion ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring"
                        onClick={handleCancelEditQuestion}
                        disabled={savingQuestion}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring"
                        onClick={handleStartEditQuestion}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 focus-ring"
                        onClick={handleDeleteQuestion}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
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

          {adminEditError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {adminEditError}
            </p>
          ) : null}

          {!isEditingQuestion ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p>{detail.body}</p>
            </div>
          ) : null}
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
                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        {editAnswerId === answer.id ? (
                          <>
                            <button
                              type="button"
                              className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white focus-ring disabled:opacity-60"
                              onClick={() => handleSaveAnswer(answer.id)}
                              disabled={
                                savingAnswerId === answer.id ||
                                editAnswerBody.trim().length === 0
                              }
                            >
                              {savingAnswerId === answer.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring"
                              onClick={handleCancelEditAnswer}
                              disabled={savingAnswerId === answer.id}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring"
                              onClick={() => handleStartEditAnswer(answer.id, answer.body)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 focus-ring"
                              onClick={() => handleDeleteAnswer(answer.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
                {editAnswerId === answer.id ? (
                  <textarea
                    rows={3}
                    value={editAnswerBody}
                    onChange={(event) => setEditAnswerBody(event.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-ring"
                  />
                ) : (
                  <p className="mt-3 text-sm text-slate-600">{answer.body}</p>
                )}
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
