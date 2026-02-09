import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import MetricCard from "../components/ui/MetricCard";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getQuestionDetail } from "../api/questions";
import {
  clearFollowListError,
  fetchFollowedQuestions,
  selectFollows,
} from "../features/follows/followsSlice";
import { unfollowQuestionItem } from "../features/follows/followsSlice";
import {
  fetchQuestions,
  selectQuestions,
} from "../features/questions/questionsSlice";
import type { MetricCardData, QuestionCardData, QuestionDetail } from "../types";

const ChatIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TrendIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="m3 17 6-6 4 4 7-7" />
    <path d="M14 7h7v7" />
  </svg>
);

type DashboardStatsStatus = "idle" | "loading" | "succeeded" | "failed";

type Contributor = {
  id: string;
  name: string;
  answers: number;
  votes: number;
  badge: string;
  color: string;
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { items: followedQuestions, listStatus, listError, status: followStatus } =
    useAppSelector(selectFollows);
  const {
    items: questions,
    status: questionsStatus,
    error: questionsError,
  } = useAppSelector(selectQuestions);
  const isUnfollowing = followStatus === "loading";
  const isLoadingList = listStatus === "loading" || listStatus === "idle";
  const hasFollowed = followedQuestions.length > 0;
  const [statsStatus, setStatsStatus] = useState<DashboardStatsStatus>("idle");
  const [statsError, setStatsError] = useState<string | null>(null);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [answerRate, setAnswerRate] = useState(0);
  const [questionDetails, setQuestionDetails] = useState<QuestionDetail[]>([]);

  useEffect(() => {
    dispatch(fetchFollowedQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (questionsStatus === "idle") {
      dispatch(fetchQuestions(undefined));
    }
  }, [dispatch, questionsStatus]);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      if (questionsStatus !== "succeeded") {
        return;
      }
      setStatsStatus("loading");
      setStatsError(null);
      try {
        const details = await Promise.all(
          questions.map((question) => getQuestionDetail(question.id))
        );
        if (!mounted) return;

        setQuestionDetails(details);
        const answerCount = details.reduce(
          (sum, item) => sum + item.answers.length,
          0
        );
        const questionsWithAnswers = details.filter(
          (item) => item.answers.length > 0
        ).length;

        const userIds = new Set<string>();
        questions.forEach((question) => userIds.add(question.author_id));
        details.forEach((item) =>
          item.answers.forEach((answer) => userIds.add(answer.author_id))
        );

        setTotalAnswers(answerCount);
        setActiveUsers(userIds.size);
        setAnswerRate(
          questions.length === 0
            ? 0
            : Math.round((questionsWithAnswers / questions.length) * 1000) / 10
        );
        setStatsStatus("succeeded");
      } catch (error) {
        if (!mounted) return;
        setStatsStatus("failed");
        setStatsError("Unable to load dashboard metrics.");
      }
    };

    loadStats();
    return () => {
      mounted = false;
    };
  }, [questions, questionsStatus]);

  const handleUnfollow = async (questionId: string) => {
    try {
      dispatch(clearFollowListError());
      await dispatch(unfollowQuestionItem(questionId)).unwrap();
      await dispatch(fetchFollowedQuestions());
    } catch {
      // errors handled in state
    }
  };

  const handleRetryFollowList = () => {
    dispatch(clearFollowListError());
    dispatch(fetchFollowedQuestions());
  };

  const metrics: MetricCardData[] = [
    {
      title: "Total Questions",
      value:
        questionsStatus === "succeeded"
          ? questions.length.toLocaleString()
          : "—",
      delta:
        questionsStatus === "failed"
          ? "Unavailable"
          : questionsStatus === "loading"
            ? "Loading..."
            : "Live data",
      accent: "indigo" as const,
      icon: <ChatIcon />,
    },
    {
      title: "Total Answers",
      value: statsStatus === "succeeded" ? totalAnswers.toLocaleString() : "—",
      delta:
        statsStatus === "failed"
          ? "Unavailable"
          : statsStatus === "loading"
            ? "Loading..."
            : "Live data",
      accent: "emerald" as const,
      icon: <CheckIcon />,
    },
    {
      title: "Active Users",
      value: statsStatus === "succeeded" ? activeUsers.toLocaleString() : "—",
      delta:
        statsStatus === "failed"
          ? "Unavailable"
          : statsStatus === "loading"
            ? "Loading..."
            : "Live data",
      accent: "sky" as const,
      icon: <UsersIcon />,
    },
    {
      title: "Answer Rate",
      value: statsStatus === "succeeded" ? `${answerRate}%` : "—",
      delta:
        statsStatus === "failed"
          ? "Unavailable"
          : statsStatus === "loading"
            ? "Loading..."
            : "Live data",
      accent: "amber" as const,
      icon: <TrendIcon />,
    },
  ];

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();
    questions.forEach((question) => {
      const key = question.category?.trim() || "Other";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const palette = [
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-teal-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value], index) => ({
        label,
        value,
        color: palette[index % palette.length],
      }));
  }, [questions]);

  const phaseData = useMemo(() => {
    const counts = new Map<string, number>();
    questions.forEach((question) => {
      const key = question.stage?.trim() || "Other";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const palette = [
      { label: "Foundation", color: "#6366f1" },
      { label: "Intermediate", color: "#10b981" },
      { label: "Advanced", color: "#f59e0b" },
      { label: "Expert", color: "#14b8a6" },
      { label: "Other", color: "#94a3b8" },
    ];
    const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);
    return palette
      .map((item) => {
        const value = counts.get(item.label) ?? 0;
        return {
          label: item.label,
          value,
          percent: total === 0 ? 0 : Math.round((value / total) * 1000) / 10,
          color: item.color,
        };
      })
      .filter((item) => item.value > 0 || total === 0);
  }, [questions]);

  const phaseGradient = useMemo(() => {
    let current = 0;
    const segments: string[] = [];
    phaseData.forEach((item) => {
      const start = current;
      const end = current + item.percent;
      segments.push(`${item.color} ${start}% ${end}%`);
      current = end;
    });
    if (segments.length === 0) {
      return "conic-gradient(#e2e8f0 0 100%)";
    }
    return `conic-gradient(${segments.join(", ")})`;
  }, [phaseData]);

  const contributorPalette = [
    "bg-fuchsia-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-indigo-500",
  ];

  const contributors: Contributor[] = useMemo(() => {
    const map = new Map<string, { answers: number; votes: number }>();
    questionDetails.forEach((detail) => {
      detail.answers.forEach((answer) => {
        const current = map.get(answer.author_id) ?? { answers: 0, votes: 0 };
        map.set(answer.author_id, {
          answers: current.answers + 1,
          votes: current.votes + (answer.vote_score ?? 0),
        });
      });
    });

    return Array.from(map.entries())
      .map(([id, data], index) => ({
        id,
        name: `User ${id.slice(0, 6)}`,
        answers: data.answers,
        votes: data.votes,
        badge: "Expert",
        color: contributorPalette[index % contributorPalette.length],
      }))
      .sort((a, b) => b.answers - a.answers || b.votes - a.votes)
      .slice(0, 3);
  }, [questionDetails]);

  const unansweredQuestions: QuestionCardData[] = useMemo(() => {
    return questionDetails
      .filter((detail) => detail.answers.length === 0)
      .map((detail) => ({
        question: detail,
        tags: detail.tags ?? [],
        meta: { author: `User ${detail.author_id.slice(0, 6)}`, time: "Recently" },
        stats: { answers: 0, views: 0, votes: detail.vote_score },
      }));
  }, [questionDetails]);

  const pendingCount = unansweredQuestions.length;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 p-8 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <SparkIcon />
              </div>
              <h2 className="text-2xl font-semibold">Welcome to MoringaDesk, Student!</h2>
            </div>
            <p className="mt-3 max-w-xl text-sm text-white/80">
              Join our thriving community of developers and learners. Ask questions, share
              knowledge, and grow your skills together.
            </p>
          </div>
          <Link
            to="/questions/ask"
            className="rounded-full border border-white/40 px-5 py-2 text-sm font-medium focus-ring"
          >
            Ask Question
          </Link>
        </div>
        <div className="mt-6 grid gap-4 text-sm text-white/80 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <ChatIcon />
            </div>
            <div>
              <p className="font-medium text-white">Ask Questions</p>
              <p>Get expert answers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <UsersIcon />
            </div>
            <div>
              <p className="font-medium text-white">Help Others</p>
              <p>Share your knowledge</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <TrendIcon />
            </div>
            <div>
              <p className="font-medium text-white">Earn Reputation</p>
              <p>Build your profile</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <SectionCard
          title="Questions by Category"
          subtitle="Most frequent problem areas"
        >
          {questionsStatus === "loading" ? (
            <EmptyState title="Loading categories..." description="Please wait." />
          ) : questionsStatus === "failed" ? (
            <EmptyState
              title="Unable to load categories"
              description={questionsError ?? "Please try again later."}
            />
          ) : categoryData.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Create a question to see category distribution."
            />
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-end gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {categoryData.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="mx-auto flex h-36 items-end justify-center sm:h-40">
                      <div
                        className={`w-12 rounded-2xl ${item.color}`}
                        style={{
                          height: `${
                            (item.value / Math.max(...categoryData.map((d) => d.value))) *
                            100
                          }%`,
                          minHeight: "12%",
                        }}
                      />
                    </div>
                    <p className="mt-3 text-xs font-medium text-slate-600">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-400">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Questions by Learning Phase"
          subtitle="Distribution across skill levels"
        >
          {questionsStatus === "loading" ? (
            <EmptyState title="Loading learning phases..." description="Please wait." />
          ) : questionsStatus === "failed" ? (
            <EmptyState
              title="Unable to load learning phases"
              description={questionsError ?? "Please try again later."}
            />
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div
                className="relative h-40 w-40 rounded-full sm:h-48 sm:w-48"
                style={{ background: phaseGradient }}
              >
                <div className="absolute inset-5 rounded-full bg-white sm:inset-6" />
              </div>
              <div className="grid gap-2 text-sm text-slate-600">
                {phaseData.map((phase) => (
                  <div key={phase.label} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span>{phase.label}:</span>
                    <span className="font-semibold text-slate-900">
                      {phase.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </section>

      <SectionCard title="Activity Timeline" subtitle="Questions and answers over time">
        <div className="h-64 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-r from-emerald-50 to-indigo-50" />
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Questions
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Answers
          </span>
        </div>
      </SectionCard>

      <section className="grid gap-6 xl:grid-cols-[1.3fr,1fr]">
        <SectionCard title="Top Contributors" subtitle="Most helpful community members">
          {statsStatus === "loading" ? (
            <EmptyState title="Loading contributors..." description="Please wait." />
          ) : contributors.length === 0 ? (
            <EmptyState
              title="No contributors yet"
              description="Answer a question to show up here."
            />
          ) : (
            <div className="space-y-4">
              {contributors.map((contributor) => (
                <div
                  key={contributor.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${contributor.color}`}
                    >
                      {contributor.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {contributor.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {contributor.answers} answers • {contributor.votes} votes
                      </p>
                    </div>
                  </div>
                  <Badge label={contributor.badge} variant="accent" />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Unanswered Questions"
          subtitle="Questions needing attention"
          action={
            pendingCount > 0 ? (
              <Badge label={`${pendingCount} pending`} variant="warning" />
            ) : undefined
          }
        >
          {statsStatus === "loading" ? (
            <EmptyState title="Loading questions..." description="Please wait." />
          ) : unansweredQuestions.length === 0 ? (
            <EmptyState
              title="No unanswered questions"
              description="All questions have answers."
            />
          ) : (
            <div className="space-y-4">
              {unansweredQuestions.map((question) => (
                <QuestionCard
                  key={question.question.id}
                  {...question}
                  to={`/questions/${question.question.id}`}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </section>

      <SectionCard
        title="Following"
        subtitle="Questions you are tracking"
      >
        {isLoadingList ? (
          <EmptyState
            title="Loading followed questions..."
            description="Fetching your followed list."
          />
        ) : hasFollowed ? (
          <div className="space-y-4">
            {followedQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                tags={[]}
                meta={{ author: "Community", time: "Recently" }}
                stats={{ answers: 0, views: 0, votes: question.vote_score }}
                to={`/questions/${question.id}`}
                action={
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleUnfollow(question.id)}
                    disabled={isUnfollowing}
                  >
                    {isUnfollowing ? "Updating..." : "Unfollow"}
                  </button>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No followed questions"
            description="Follow a question to track updates."
            actionLabel="Browse Questions"
          />
        )}
        {listError ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <p className="text-rose-600">{listError}</p>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleRetryFollowList}
              disabled={isLoadingList}
            >
              {isLoadingList ? "Retrying..." : "Retry"}
            </button>
          </div>
        ) : null}
      </SectionCard>

    </div>
  );
};

const SparkIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M12 2v6" />
    <path d="M12 16v6" />
    <path d="M4.93 4.93l4.24 4.24" />
    <path d="M14.83 14.83l4.24 4.24" />
    <path d="M2 12h6" />
    <path d="M16 12h6" />
    <path d="M4.93 19.07l4.24-4.24" />
    <path d="M14.83 9.17l4.24-4.24" />
  </svg>
);

export default Dashboard;
