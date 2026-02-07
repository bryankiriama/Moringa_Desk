import type { ReactNode } from "react";

import Badge from "./Badge";

type NotificationItemProps = {
  title: string;
  message: string;
  time: string;
  icon?: ReactNode;
  isNew?: boolean;
  badgeLabel?: string;
  className?: string;
};

const NotificationItem = ({
  title,
  message,
  time,
  icon,
  isNew = false,
  badgeLabel,
  className,
}: NotificationItemProps) => {
  return (
    <div
      className={`flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${
        className ?? ""
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
        {icon ?? <span className="text-lg">✓</span>}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center gap-2">
            {badgeLabel ? <Badge label={badgeLabel} variant="accent" /> : null}
            {isNew ? <Badge label="New" variant="info" /> : null}
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
        <p className="mt-2 text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
