import type { ReactNode } from "react";

import type { Question, Tag } from "../../types";
import Badge from "./Badge";
import TagChip from "./TagChip";

type QuestionMeta = {
  author: string;
  time: string;
};

type QuestionStats = {
  answers: number;
  views: number;
  votes?: number;
};

type QuestionCardProps = {
  question: Question;
  tags: Tag[];
  meta: QuestionMeta;
  stats: QuestionStats;
  statusLabel?: string;
  statusVariant?: "success" | "warning" | "neutral" | "accent" | "info" | "danger";
  leading?: ReactNode;
  action?: ReactNode;
  href?: string;
  onClick?: () => void;
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
  href,
  onClick,
  className,
}: QuestionCardProps) => {
  const Wrapper: React.ElementType = href ? "a" : "div";

  return (
    <Wrapper
      href={href}
      onClick={onClick}
      className={`block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 focus-ring ${
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
              {question.title}
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
    </Wrapper>
  );
};

export default QuestionCard;
