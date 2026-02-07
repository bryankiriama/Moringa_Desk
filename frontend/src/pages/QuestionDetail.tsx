import Badge from "../components/ui/Badge";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";

const question = {
  title: "How to implement OAuth2 authentication in Django?",
  excerpt:
    "I need to secure a Django API using OAuth2. What are the recommended packages and configuration steps?",
  tags: ["Python", "Django", "Authentication"],
  meta: { author: "John Doe", time: "2 hours ago" },
  stats: { answers: 3, views: 124, votes: 24 },
};

const answers = [
  {
    author: "Sarah Chen",
    time: "35 minutes ago",
    votes: 12,
    accepted: true,
    body:
      "Use a dedicated OAuth2 provider such as Django OAuth Toolkit. Configure your application and add the OAuth2 endpoints, then secure your views with the provided authentication classes.",
  },
  {
    author: "Michael Johnson",
    time: "1 hour ago",
    votes: 5,
    accepted: false,
    body:
      "If you are already using DRF, consider integrating with OAuth2 libraries and follow the standard authorization code flow for frontend clients.",
  },
  {
    author: "Aisha Patel",
    time: "1 hour ago",
    votes: 3,
    accepted: false,
    body:
      "Another option is Auth0 or a hosted provider, which can simplify the token issuance and management.",
  },
];

const relatedQuestions = [
  {
    title: "How to implement custom hooks in React for data fetching?",
    excerpt:
      "Trying to create a reusable hook for API fetching. What patterns do you recommend?",
    tags: ["React", "JavaScript", "Hooks"],
    meta: { author: "Sarah Chen", time: "2 hours ago" },
    stats: { answers: 5, views: 342, votes: 24 },
    statusLabel: "Answered",
    statusVariant: "success" as const,
  },
  {
    title: "Best practices for API versioning in REST APIs",
    excerpt:
      "Should I use URL versioning, header versioning, or something else?",
    tags: ["API", "REST", "Backend"],
    meta: { author: "James Martinez", time: "1 day ago" },
    stats: { answers: 4, views: 198, votes: 15 },
  },
];

const QuestionDetail = () => {
  return (
    <div className="space-y-6">
      <SectionCard title="Question Detail" subtitle="Asked by a community member">
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{question.title}</h1>
              <p className="mt-2 text-sm text-slate-500">{question.excerpt}</p>
            </div>
            <Badge label="Answered" variant="success" />
          </div>

          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Asked by {question.meta.author}</span>
            <span>•</span>
            <span>{question.meta.time}</span>
            <span>•</span>
            <span>{question.stats.views} views</span>
            <span>•</span>
            <span>{question.stats.votes} votes</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Full question description and code snippets will appear here.
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Answers" subtitle={`${answers.length} answers`}>
        <div className="space-y-4">
          {answers.map((answer) => (
            <div
              key={`${answer.author}-${answer.time}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{answer.author}</p>
                  <p className="text-xs text-slate-500">{answer.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={`${answer.votes} votes`} variant="neutral" />
                  {answer.accepted ? <Badge label="Accepted" variant="success" /> : null}
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{answer.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Related Questions" subtitle="You may also find these helpful">
        <div className="space-y-4">
          {relatedQuestions.map((related) => (
            <QuestionCard key={related.title} {...related} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default QuestionDetail;
