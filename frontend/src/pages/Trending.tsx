import Badge from "../components/ui/Badge";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import type { Question, Tag } from "../types";

type TrendingQuestion = {
  rank: string;
  trendScore: number;
  question: Question;
  tags: Tag[];
  stats: { answers: number; views: number; votes?: number };
  statusLabel?: string;
  statusVariant?: "success" | "warning" | "neutral" | "accent" | "info" | "danger";
};

const trendingQuestions: TrendingQuestion[] = [
  {
    rank: "#1",
    trendScore: 98,
    question: {
      id: "q-500",
      author_id: "u-600",
      title: "Understanding async/await vs Promises in JavaScript",
      body: "What are the key differences and when should you use each approach?",
      category: "Frontend",
      stage: "Foundation",
      accepted_answer_id: "a-700",
      created_at: "2024-01-29T12:00:00Z",
      updated_at: "2024-01-29T12:00:00Z",
      vote_score: 412,
    },
    tags: [
      {
        id: "t-js",
        name: "JavaScript",
        created_at: "2024-01-01T00:00:00Z",
      },
      { id: "t-async", name: "Async", created_at: "2024-01-01T00:00:00Z" },
      {
        id: "t-promises",
        name: "Promises",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    stats: { answers: 23, views: 5623, votes: 412 },
    statusLabel: "Hot",
    statusVariant: "danger",
  },
  {
    rank: "#2",
    trendScore: 87,
    question: {
      id: "q-501",
      author_id: "u-601",
      title: "Best practices for React performance optimization",
      body: "What practical steps help you keep a large React app fast?",
      category: "Frontend",
      stage: "Intermediate",
      accepted_answer_id: "a-701",
      created_at: "2024-01-29T10:00:00Z",
      updated_at: "2024-01-29T10:00:00Z",
      vote_score: 356,
    },
    tags: [
      { id: "t-react", name: "React", created_at: "2024-01-01T00:00:00Z" },
      {
        id: "t-perf",
        name: "Performance",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "t-js",
        name: "JavaScript",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    stats: { answers: 18, views: 4892, votes: 356 },
    statusLabel: "Rising",
    statusVariant: "warning",
  },
  {
    rank: "#3",
    trendScore: 92,
    question: {
      id: "q-502",
      author_id: "u-602",
      title: "How to implement JWT authentication in Node.js",
      body: "Looking for a secure JWT implementation pattern with refresh tokens.",
      category: "Backend",
      stage: "Intermediate",
      accepted_answer_id: "a-702",
      created_at: "2024-01-29T08:30:00Z",
      updated_at: "2024-01-29T08:30:00Z",
      vote_score: 298,
    },
    tags: [
      { id: "t-node", name: "Node.js", created_at: "2024-01-01T00:00:00Z" },
      {
        id: "t-auth",
        name: "Authentication",
        created_at: "2024-01-01T00:00:00Z",
      },
      { id: "t-sec", name: "Security", created_at: "2024-01-01T00:00:00Z" },
    ],
    stats: { answers: 15, views: 4231, votes: 298 },
    statusLabel: "Hot",
    statusVariant: "danger",
  },
  {
    rank: "#4",
    trendScore: 79,
    question: {
      id: "q-503",
      author_id: "u-603",
      title: "PostgreSQL vs MongoDB: When to use which?",
      body: "Choosing between SQL and NoSQL for a growing SaaS product.",
      category: "Databases",
      stage: "Advanced",
      accepted_answer_id: "a-703",
      created_at: "2024-01-29T06:00:00Z",
      updated_at: "2024-01-29T06:00:00Z",
      vote_score: 267,
    },
    tags: [
      {
        id: "t-db",
        name: "Databases",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "t-pg",
        name: "PostgreSQL",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "t-mongo",
        name: "MongoDB",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    stats: { answers: 21, views: 3945, votes: 267 },
    statusLabel: "Rising",
    statusVariant: "warning",
  },
  {
    rank: "#5",
    trendScore: 72,
    question: {
      id: "q-504",
      author_id: "u-604",
      title: "Docker multi-stage builds explained",
      body: "How to reduce image size and speed up CI builds effectively.",
      category: "DevOps",
      stage: "Intermediate",
      accepted_answer_id: null,
      created_at: "2024-01-29T05:00:00Z",
      updated_at: "2024-01-29T05:00:00Z",
      vote_score: 234,
    },
    tags: [
      { id: "t-docker", name: "Docker", created_at: "2024-01-01T00:00:00Z" },
      { id: "t-devops", name: "DevOps", created_at: "2024-01-01T00:00:00Z" },
      {
        id: "t-containers",
        name: "Containers",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    stats: { answers: 12, views: 3567, votes: 234 },
    statusLabel: "New",
    statusVariant: "info",
  },
];

const trendingTags = [
  { label: "React", growth: "+45%" },
  { label: "TypeScript", growth: "+38%" },
  { label: "AWS", growth: "+32%" },
  { label: "GraphQL", growth: "+28%" },
  { label: "Kubernetes", growth: "+25%" },
];

const topContributors = [
  { name: "Sarah Chen", answers: "34 answers", rep: "2456 rep" },
  { name: "Michael Johnson", answers: "28 answers", rep: "1897 rep" },
  { name: "Aisha Patel", answers: "24 answers", rep: "1640 rep" },
];

const Trending = () => {
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
            {trendingQuestions.map((question) => (
              <QuestionCard
                key={question.question.id}
                question={question.question}
                tags={question.tags}
                meta={{ author: "Community", time: "Today" }}
                stats={question.stats}
                statusLabel={question.statusLabel}
                statusVariant={question.statusVariant}
                leading={<span className="text-sm font-semibold">{question.rank}</span>}
                action={
                  <span className="text-xs font-semibold text-indigo-600">
                    {question.trendScore} trend score
                  </span>
                }
              />
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Trending Tags" subtitle="Fastest growing topics">
            <div className="space-y-3">
              {trendingTags.map((tag) => (
                <div
                  key={tag.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <TagChip label={tag.label} />
                    <span className="text-xs text-slate-500">234 questions</span>
                  </div>
                  <Badge label={tag.growth} variant="success" />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Top This Week" subtitle="Most active helpers">
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div
                  key={contributor.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {contributor.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {contributor.answers} • {contributor.rep}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Trending;
