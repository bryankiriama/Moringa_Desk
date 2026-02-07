import type { ReactNode } from "react";

import type { BadgeVariant } from "../../types";

type BadgeSize = "sm" | "md";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-600 border-emerald-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  danger: "bg-rose-50 text-rose-600 border-rose-100",
  info: "bg-sky-50 text-sky-600 border-sky-100",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
  outline: "bg-white text-slate-600 border-slate-200",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-xs px-2.5 py-1",
  md: "text-xs px-3 py-1.5",
};

const Badge = ({
  label,
  variant = "neutral",
  size = "sm",
  icon,
  className,
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className ?? ""}`}
    >
      {icon ? <span className="text-[10px]">{icon}</span> : null}
      {label}
    </span>
  );
};

export default Badge;
