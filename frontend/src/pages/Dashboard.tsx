import Badge from "../components/ui/Badge";
import MetricCard from "../components/ui/MetricCard";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import type { Question, Tag } from "../types";

const metrics = [
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

const categoryBars = [
  { label: "Python", value: 160, color: "bg-indigo-500" },
  { label: "JavaScript", value: 140, color: "bg-emerald-500" },
  { label: "Databases", value: 98, color: "bg-amber-500" },
  { label: "React", value: 86, color: "bg-teal-500" },
  { label: "Logic & Algorithms", value: 78, color: "bg-purple-500" },
  { label: "DevOps", value: 54, color: "bg-pink-500" },
];

const learningPhase = [
  { label: "Foundation", value: "31%", color: "bg-indigo-500" },
  { label: "Intermediate", value: "42%", color: "bg-emerald-500" },
  { label: "Advanced", value: "18%", color: "bg-amber-500" },
  { label: "Expert", value: "9%", color: "bg-teal-500" },
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

type QuestionCardData = {
  question: Question;
  tags: Tag[];
  meta: { author: string; time: string };
  stats: { answers: number; views: number; votes?: number };
  statusLabel?: string;
  statusVariant?: "success" | "warning" | "neutral" | "accent" | "info" | "danger";
};

const unansweredQuestions: QuestionCardData[] = [
  {
    question: {
      id: "q-100",
      author_id: "u-200",
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
      id: "q-101",
      author_id: "u-201",
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

const Dashboard = () => {
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
          <button
            type="button"
            className="rounded-full border border-white/40 px-5 py-2 text-sm font-medium focus-ring"
          >
            Explore Dashboard
          </button>
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
          <div className="grid gap-4">
            <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categoryBars.map((item) => (
                <div key={item.label} className="text-center">
                  <div
                    className={`mx-auto w-10 rounded-2xl ${item.color}`}
                    style={{ height: `${item.value / 2}px` }}
                  />
                  <p className="mt-3 text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Questions by Learning Phase"
          subtitle="Distribution across skill levels"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative h-48 w-48 rounded-full" style={{
              background:
                "conic-gradient(#6366f1 0 31%, #10b981 31% 73%, #f59e0b 73% 91%, #14b8a6 91% 100%)",
            }}>
              <div className="absolute inset-6 rounded-full bg-white" />
            </div>
            <div className="grid gap-2 text-sm text-slate-600">
              {learningPhase.map((phase) => (
                <div key={phase.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${phase.color}`} />
                  <span>{phase.label}:</span>
                  <span className="font-semibold text-slate-900">{phase.value}</span>
                </div>
              ))}
            </div>
          </div>
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
              <QuestionCard key={question.question.id} {...question} />
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

      <button
        type="button"
        className="fixed bottom-6 right-6 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm focus-ring"
      >
        Switch to Admin View
      </button>
    </div>
  );
};

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
