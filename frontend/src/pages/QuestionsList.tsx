import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import QuestionCard from "../components/ui/QuestionCard";
import TagChip from "../components/ui/TagChip";
import type { QuestionCardData, TagChipData } from "../types";

const filters: TagChipData[] = [
  { label: "Newest", active: true },
  { label: "Most Votes" },
  { label: "Unanswered" },
];

const tagFilters: TagChipData[] = [
  { label: "All", active: true },
  { label: "React" },
  { label: "Python" },
  { label: "JavaScript" },
  { label: "Databases" },
  { label: "DevOps" },
  { label: "API" },
];

const questions: QuestionCardData[] = [
  {
    question: {
      id: "q-300",
      author_id: "u-400",
      title: "How to implement custom hooks in React for data fetching?",
      body:
        "I am trying to create a reusable custom hook for fetching data from an API. What are the best practices for error handling and loading states?",
      category: "Frontend",
      stage: "Intermediate",
      accepted_answer_id: "a-500",
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
      id: "q-301",
      author_id: "u-401",
      title: "Understanding PostgreSQL indexing strategies",
      body:
        "What are the differences between B-tree, Hash, and GIN indexes? When should I use each type for optimal query performance?",
      category: "Databases",
      stage: "Intermediate",
      accepted_answer_id: "a-501",
      created_at: "2024-01-29T09:00:00Z",
      updated_at: "2024-01-29T09:00:00Z",
      vote_score: 18,
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
        id: "t-perf",
        name: "Performance",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    meta: { author: "Michael Johnson", time: "5 hours ago" },
    stats: { answers: 3, views: 256, votes: 18 },
    statusLabel: "Answered",
    statusVariant: "success",
  },
  {
    question: {
      id: "q-302",
      author_id: "u-402",
      title: "Debugging memory leaks in Python applications",
      body:
        "My Python application is experiencing memory leaks. What tools and techniques can I use to identify and fix them?",
      category: "Backend",
      stage: "Advanced",
      accepted_answer_id: "a-502",
      created_at: "2024-01-29T06:00:00Z",
      updated_at: "2024-01-29T06:00:00Z",
      vote_score: 32,
    },
    tags: [
      { id: "t-python", name: "Python", created_at: "2024-01-01T00:00:00Z" },
      {
        id: "t-debug",
        name: "Debugging",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "t-perf",
        name: "Performance",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    meta: { author: "Aisha Patel", time: "8 hours ago" },
    stats: { answers: 7, views: 487, votes: 32 },
    statusLabel: "Answered",
    statusVariant: "success",
  },
];

const QuestionsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">All Questions</h1>
          <p className="text-sm text-slate-500">Browse community questions and answers</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 focus-ring"
        >
          Advanced Filters
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-500">Sort by:</span>
        {filters.map((filter) => (
          <TagChip key={filter.label} label={filter.label} active={filter.active} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Filter by tags:</span>
        {tagFilters.map((tag) => (
          <TagChip key={tag.label} label={tag.label} active={tag.active} />
        ))}
      </div>

      <div className="space-y-5">
        {questions.map((question) => (
          <QuestionCard
            key={question.question.id}
            {...question}
            leading={<span className="text-sm font-semibold">{question.stats.votes}</span>}
          />
        ))}
      </div>

      <div className="flex items-center justify-center">
        <Pagination currentPage={1} totalPages={3} />
      </div>

      <div className="flex items-center justify-end">
        <Badge label="Switch to Student View" variant="outline" />
      </div>
    </div>
  );
};

export default QuestionsList;
