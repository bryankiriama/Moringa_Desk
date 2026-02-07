import Badge from "../components/ui/Badge";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";

const trendingQuestions = [
  {
    rank: "#1",
    title: "Understanding async/await vs Promises in JavaScript",
    excerpt: "What are the key differences and when should you use each approach?",
    tags: ["JavaScript", "Async", "Promises"],
    stats: { answers: 23, views: 5623, votes: 412 },
    trendScore: 98,
    statusLabel: "Hot",
    statusVariant: "danger" as const,
  },
  {
    rank: "#2",
    title: "Best practices for React performance optimization",
    excerpt: "What practical steps help you keep a large React app fast?",
    tags: ["React", "Performance", "JavaScript"],
    stats: { answers: 18, views: 4892, votes: 356 },
    trendScore: 87,
    statusLabel: "Rising",
    statusVariant: "warning" as const,
  },
  {
    rank: "#3",
    title: "How to implement JWT authentication in Node.js",
    excerpt: "Looking for a secure JWT implementation pattern with refresh tokens.",
    tags: ["Node.js", "Authentication", "Security"],
    stats: { answers: 15, views: 4231, votes: 298 },
    trendScore: 92,
    statusLabel: "Hot",
    statusVariant: "danger" as const,
  },
  {
    rank: "#4",
    title: "PostgreSQL vs MongoDB: When to use which?",
    excerpt: "Choosing between SQL and NoSQL for a growing SaaS product.",
    tags: ["Databases", "PostgreSQL", "MongoDB"],
    stats: { answers: 21, views: 3945, votes: 267 },
    trendScore: 79,
    statusLabel: "Rising",
    statusVariant: "warning" as const,
  },
  {
    rank: "#5",
    title: "Docker multi-stage builds explained",
    excerpt: "How to reduce image size and speed up CI builds effectively.",
    tags: ["Docker", "DevOps", "Containers"],
    stats: { answers: 12, views: 3567, votes: 234 },
    trendScore: 72,
    statusLabel: "New",
    statusVariant: "info" as const,
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
                key={question.title}
                title={question.title}
                excerpt={question.excerpt}
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
