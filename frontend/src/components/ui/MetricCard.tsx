import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: ReactNode;
  accent?: "indigo" | "emerald" | "sky" | "amber" | "slate";
  className?: string;
};

const accentStyles: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
};

const MetricCard = ({
  title,
  value,
  delta,
  deltaPositive = true,
  icon,
  accent = "indigo",
  className,
}: MetricCardProps) => {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${
        className ?? ""
      }`}
    >
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        {delta ? (
          <p
            className={`mt-2 text-xs font-medium ${
              deltaPositive ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {delta}
          </p>
        ) : null}
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          accentStyles[accent]
        }`}
      >
        {icon ?? <span className="text-sm font-semibold">%</span>}
      </div>
    </div>
  );
};

export default MetricCard;
