import type { ReactNode } from "react";

type TagChipSize = "sm" | "md";

type TagChipProps = {
  label: string;
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: TagChipSize;
};

const sizeStyles: Record<TagChipSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

const TagChip = ({
  label,
  active = false,
  icon,
  onClick,
  className,
  size = "sm",
}: TagChipProps) => {
  const baseStyle = active
    ? "bg-indigo-50 text-indigo-600 border-indigo-100"
    : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition ${
        sizeStyles[size]
      } ${baseStyle} ${className ?? ""} focus-ring`}
    >
      {icon ? <span className="text-[10px]">{icon}</span> : null}
      {label}
    </button>
  );
};

export default TagChip;
