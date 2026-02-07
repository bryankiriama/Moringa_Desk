import type { ReactNode } from "react";

import Badge from "./Badge";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  className?: string;
};

const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center ${
        className ?? ""
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500">
        {icon ?? <span className="text-xl">◎</span>}
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {actionLabel ? <Badge label={actionLabel} variant="outline" /> : null}
    </div>
  );
};

export default EmptyState;
