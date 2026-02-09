import Badge from "../components/ui/Badge";
import MetricCard from "../components/ui/MetricCard";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import type { MetricCardData, QuestionCardData } from "../types";

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

const metrics: MetricCardData[] = [
  {
    title: "Total Questions",
    value: "1,247",
    delta: "+12.5% vs last month",
    accent: "indigo" as const,
    icon: <ChatIcon />,
  },
  {
    title: "Total Answers",
    value: "3,892",
    delta: "+8.3% vs last month",
    accent: "emerald" as const,
    icon: <CheckIcon />,
  },
  {
    title: "Active Users",
    value: "542",
    delta: "+15.2% vs last month",
    accent: "sky" as const,
    icon: <UsersIcon />,
  },
  {
    title: "Answer Rate",
    value: "87.6%",
    delta: "+3.1% vs last month",
    accent: "amber" as const,
    icon: <TrendIcon />,
  },
];

const contributors = [
  {
    name: "Sarah Chen",
    answers: "234 answers",
    votes: "1,456 votes",
    badge: "Expert",
    color: "bg-fuchsia-500",
  },
  {
    name: "Michael Johnson",
    answers: "198 answers",
    votes: "1,203 votes",
    badge: "Expert",
    color: "bg-sky-500",
  },
  {
    name: "Aisha Patel",
    answers: "167 answers",
    votes: "987 votes",
    badge: "Expert",
    color: "bg-emerald-500",
  },
];

const unansweredQuestions: QuestionCardData[] = [
  {
    question: {
      id: "q-200",
      author_id: "u-300",
      title: "How to implement OAuth2 authentication in Django?",
      body: "Looking for best practices and gotchas when configuring OAuth2.",
      category: "Backend",
      stage: "Intermediate",
      accepted_answer_id: null,
      created_at: "2024-01-30T08:00:00Z",
      updated_at: "2024-01-30T08:00:00Z",
      vote_score: 12,
    },
    tags: [
      { id: "t-python", name: "Python", created_at: "2024-01-01T00:00:00Z" },
      { id: "t-django", name: "Django", created_at: "2024-01-01T00:00:00Z" },
      {
        id: "t-auth",
        name: "Authentication",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    meta: { author: "John Doe", time: "2 hours ago" },
    stats: { answers: 0, views: 24 },
    statusLabel: "High Priority",
    statusVariant: "warning",
  },
  {
    question: {
      id: "q-201",
      author_id: "u-301",
      title: "React useState not updating immediately after API call",
      body: "State changes are delayed; how to handle this correctly?",
      category: "Frontend",
      stage: "Foundation",
      accepted_answer_id: null,
      created_at: "2024-01-30T05:00:00Z",
      updated_at: "2024-01-30T05:00:00Z",
      vote_score: 4,
    },
    tags: [
      { id: "t-react", name: "React", created_at: "2024-01-01T00:00:00Z" },
      {
        id: "t-js",
        name: "JavaScript",
        created_at: "2024-01-01T00:00:00Z",
      },
      { id: "t-hooks", name: "Hooks", created_at: "2024-01-01T00:00:00Z" },
    ],
    meta: { author: "Jane Smith", time: "5 hours ago" },
    stats: { answers: 0, views: 38 },
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Platform analytics and moderation overview</p>
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
          <div className="h-64 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-indigo-50 to-emerald-50" />
        </SectionCard>
        <SectionCard title="Questions by Learning Phase" subtitle="Distribution across skill levels">
          <div className="h-64 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-amber-50 to-indigo-50" />
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
          <div className="space-y-4">
            {contributors.map((contributor) => (
              <div
                key={contributor.name}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${
                      contributor.color
                    }`}
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
                      {contributor.answers} • {contributor.votes}
                    </p>
                  </div>
                </div>
                <Badge label={contributor.badge} variant="accent" />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Unanswered Questions"
          subtitle="Questions needing attention"
          action={<Badge label="4 pending" variant="warning" />}
        >
          <div className="space-y-4">
            {unansweredQuestions.map((question) => (
              <QuestionCard
                key={question.question.id}
                {...question}
                to={`/questions/${question.question.id}`}
              />
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard
        title="Platform Health Score"
        subtitle="Overall system performance and user engagement metrics"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Engagement Score</p>
            <p className="mt-2 text-2xl font-semibold text-indigo-600">94.2</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Uptime</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">98.5%</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">User Satisfaction</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">4.8/5</p>
          </div>
        </div>
      </SectionCard>

    </div>
  );
};

export default AdminDashboard;
