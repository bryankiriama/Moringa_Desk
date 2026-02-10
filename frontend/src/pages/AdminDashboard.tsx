import { useEffect, useMemo, useState } from "react";

import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import MetricCard from "../components/ui/MetricCard";
import SectionCard from "../components/ui/SectionCard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getQuestionDetail } from "../api/questions";
import {
  fetchQuestions,
  selectQuestions,
} from "../features/questions/questionsSlice";
import type { MetricCardData, QuestionDetail } from "../types";

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

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { items: questions, status: questionsStatus } =
    useAppSelector(selectQuestions);
  const [statsStatus, setStatsStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [statsError, setStatsError] = useState<string | null>(null);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [answerRate, setAnswerRate] = useState(0);
  const [questionDetails, setQuestionDetails] = useState<QuestionDetail[]>([]);

  useEffect(() => {
    if (questionsStatus === "idle") {
      dispatch(fetchQuestions(undefined));
    }
  }, [dispatch, questionsStatus]);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      if (questionsStatus !== "succeeded") return;
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
      } catch {
        if (!mounted) return;
        setStatsStatus("failed");
        setStatsError("Unable to load admin metrics.");
      }
    };
    loadStats();
    return () => {
      mounted = false;
    };
  }, [questions, questionsStatus]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach((question) => {
      map.set(question.category, (map.get(question.category) ?? 0) + 1);
    });
    const palette = [
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-sky-500",
      "bg-fuchsia-500",
      "bg-rose-500",
    ];
    return Array.from(map.entries()).map(([label, value], index) => ({
      label,
      value,
      color: palette[index % palette.length],
    }));
  }, [questions]);

  const contributors = useMemo(() => {
    const map = new Map<string, { answers: number; votes: number; name?: string }>();
    questionDetails.forEach((question) => {
      question.answers.forEach((answer) => {
        const current = map.get(answer.author_id) ?? {
          answers: 0,
          votes: 0,
          name: undefined,
        };
        map.set(answer.author_id, {
          answers: current.answers + 1,
          votes: current.votes + (answer.vote_score ?? 0),
          name: current.name ?? answer.author_name ?? undefined,
        });
      });
    });
    const palette = [
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-sky-500",
    ];
    return Array.from(map.entries())
      .map(([id, data], index) => ({
        id,
        name: data.name ?? `User ${id.slice(0, 6)}`,
        answers: data.answers,
        votes: data.votes,
        color: palette[index % palette.length],
      }))
      .sort((a, b) => b.answers - a.answers || b.votes - a.votes)
      .slice(0, 5);
  }, [questionDetails]);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Platform analytics and moderation overview
          </p>
        </div>
        <Badge label="Admin Access" variant="accent" />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <SectionCard title="Questions by Category" subtitle="Most frequent problem areas">
          {questionsStatus === "loading" ? (
            <EmptyState title="Loading categories..." description="Please wait." />
          ) : questionsStatus === "failed" ? (
            <EmptyState title="Unable to load categories" description="Try again." />
          ) : categoryData.length === 0 ? (
            <EmptyState title="No categories yet" description="Ask questions first." />
          ) : (
            <div className="space-y-3">
              {categoryData.map((item) => {
                const max = Math.max(...categoryData.map((d) => d.value));
                const width = max === 0 ? 0 : Math.round((item.value / max) * 100);
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                        />
                        <span className="font-medium text-slate-700">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900">
                        {item.value}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-white">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Top Contributors" subtitle="Most helpful community members">
          {statsStatus === "loading" ? (
            <EmptyState title="Loading contributors..." description="Please wait." />
          ) : statsStatus === "failed" ? (
            <EmptyState
              title="Unable to load contributors"
              description={statsError ?? ""}
            />
          ) : contributors.length === 0 ? (
            <EmptyState
              title="No contributors yet"
              description="Answer activity will show here."
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
                  <Badge label="Top Helper" variant="accent" />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </section>
    </div>
  );
};

export default AdminDashboard;
