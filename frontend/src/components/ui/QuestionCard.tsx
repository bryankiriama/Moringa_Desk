import { Link } from "react-router-dom";

import type { QuestionCardData } from "../../types";
import Badge from "./Badge";
import TagChip from "./TagChip";

type QuestionCardProps = QuestionCardData & {
  to?: string;
  href?: string;
  className?: string;
};

const QuestionCard = ({
  question,
  tags,
  meta,
  stats,
  statusLabel,
  statusVariant = "success",
  leading,
  action,
  to,
  href,
  className,
}: QuestionCardProps) => {
  return (
    <div
      className={`block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:ring-offset-2 focus-within:ring-offset-white ${
        className ?? ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          {leading ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
              {leading}
            </div>
          ) : null}
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {to ? (
                <Link
                  to={to}
                  className="rounded-sm focus-ring"
                  aria-label={`View question: ${question.title}`}
                >
                  {question.title}
                </Link>
              ) : href ? (
                <a
                  href={href}
                  className="rounded-sm focus-ring"
                  aria-label={`View question: ${question.title}`}
                >
                  {question.title}
                </a>
              ) : (
                question.title
              )}
            </h3>
            <p className="mt-2 text-sm text-slate-500">{question.body}</p>
          </div>
        </div>
        {statusLabel ? (
          <Badge label={statusLabel} variant={statusVariant} />
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <TagChip key={tag.id} label={tag.name} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>{stats.answers} answers</span>
          <span>{stats.views} views</span>
          {typeof stats.votes === "number" ? (
            <span>{stats.votes} votes</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span>Asked by {meta.author}</span>
          <span>•</span>
          <span>{meta.time}</span>
          {action ? <span className="ml-2">{action}</span> : null}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
