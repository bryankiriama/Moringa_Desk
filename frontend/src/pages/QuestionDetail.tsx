import Badge from "../components/ui/Badge";
import QuestionCard from "../components/ui/QuestionCard";
import SectionCard from "../components/ui/SectionCard";
import TagChip from "../components/ui/TagChip";
import type { Answer, QuestionCardData, Tag } from "../types";

const question: QuestionCardData = {
  question: {
    id: "q-400",
    author_id: "u-500",
    title: "How to implement OAuth2 authentication in Django?",
    body:
      "I need to secure a Django API using OAuth2. What are the recommended packages and configuration steps?",
    category: "Backend",
    stage: "Intermediate",
    accepted_answer_id: "a-600",
    created_at: "2024-01-30T07:30:00Z",
    updated_at: "2024-01-30T07:30:00Z",
    vote_score: 24,
  },
  tags: [
    { id: "t-python", name: "Python", created_at: "2024-01-01T00:00:00Z" },
    { id: "t-django", name: "Django", created_at: "2024-01-01T00:00:00Z" },
    {
      id: "t-auth",
      name: "Authentication",
      created_at: "2024-01-01T00:00:00Z",
    },
  ] satisfies Tag[],
  meta: { author: "John Doe", time: "2 hours ago" },
  stats: { answers: 3, views: 124 },
};

type AnswerCardData = {
  answer: Answer;
  author: string;
  time: string;
};

const answers: AnswerCardData[] = [
  {
    answer: {
      id: "a-600",
      question_id: "q-400",
      author_id: "u-501",
      body:
        "Use a dedicated OAuth2 provider such as Django OAuth Toolkit. Configure your application and add the OAuth2 endpoints, then secure your views with the provided authentication classes.",
      is_accepted: true,
      created_at: "2024-01-30T08:05:00Z",
      updated_at: "2024-01-30T08:05:00Z",
      vote_score: 12,
    },
    author: "Sarah Chen",
    time: "35 minutes ago",
  },
  {
    answer: {
      id: "a-601",
      question_id: "q-400",
      author_id: "u-502",
      body:
        "If you are already using DRF, consider integrating with OAuth2 libraries and follow the standard authorization code flow for frontend clients.",
      is_accepted: false,
      created_at: "2024-01-30T07:50:00Z",
      updated_at: "2024-01-30T07:50:00Z",
      vote_score: 5,
    },
    author: "Michael Johnson",
    time: "1 hour ago",
  },
  {
    answer: {
      id: "a-602",
      question_id: "q-400",
      author_id: "u-503",
      body:
        "Another option is Auth0 or a hosted provider, which can simplify the token issuance and management.",
      is_accepted: false,
      created_at: "2024-01-30T07:40:00Z",
      updated_at: "2024-01-30T07:40:00Z",
      vote_score: 3,
    },
    author: "Aisha Patel",
    time: "1 hour ago",
  },
];

const relatedQuestions: QuestionCardData[] = [
  {
    question: {
      id: "q-401",
      author_id: "u-400",
      title: "How to implement custom hooks in React for data fetching?",
      body: "Trying to create a reusable hook for API fetching. What patterns do you recommend?",
      category: "Frontend",
      stage: "Intermediate",
      accepted_answer_id: "a-610",
      created_at: "2024-01-29T12:00:00Z",
      updated_at: "2024-01-29T12:00:00Z",
      vote_score: 24,
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
    meta: { author: "Sarah Chen", time: "2 hours ago" },
    stats: { answers: 5, views: 342, votes: 24 },
    statusLabel: "Answered",
    statusVariant: "success",
  },
  {
    question: {
      id: "q-402",
      author_id: "u-405",
      title: "Best practices for API versioning in REST APIs",
      body: "Should I use URL versioning, header versioning, or something else?",
      category: "Backend",
      stage: "Advanced",
      accepted_answer_id: null,
      created_at: "2024-01-28T12:00:00Z",
      updated_at: "2024-01-28T12:00:00Z",
      vote_score: 15,
    },
    tags: [
      { id: "t-api", name: "API", created_at: "2024-01-01T00:00:00Z" },
      { id: "t-rest", name: "REST", created_at: "2024-01-01T00:00:00Z" },
      { id: "t-backend", name: "Backend", created_at: "2024-01-01T00:00:00Z" },
    ],
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
              <h1 className="text-2xl font-semibold text-slate-900">
                {question.question.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{question.question.body}</p>
            </div>
            <Badge label="Answered" variant="success" />
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

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>
              I&apos;m implementing OAuth2 for a Django REST API and want to follow best
              practices for production. Which libraries are most commonly used, and how
              do you handle token refresh and client credentials in a secure way?
            </p>
            <p className="mt-3">
              I&apos;ve reviewed the OAuth2 grant types and understand the flow, but I&apos;m
              unsure how to structure the settings and middleware. Any examples or
              pointers would be appreciated.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Answers" subtitle={`${answers.length} answers`}>
        <div className="space-y-4">
          {answers.map((answer) => (
            <div
              key={answer.answer.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{answer.author}</p>
                  <p className="text-xs text-slate-500">{answer.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={`${answer.answer.vote_score} votes`} variant="neutral" />
                  {answer.answer.is_accepted ? (
                    <Badge label="Accepted" variant="success" />
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{answer.answer.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Related Questions" subtitle="You may also find these helpful">
        <div className="space-y-4">
          {relatedQuestions.map((related) => (
            <QuestionCard key={related.question.id} {...related} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default QuestionDetail;
