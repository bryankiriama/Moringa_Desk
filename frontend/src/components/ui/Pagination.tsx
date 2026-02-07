import type { ReactNode } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
  renderLabel?: (page: number) => ReactNode;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  renderLabel,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={`flex items-center justify-center gap-2 ${className ?? ""}`}>
      <PageButton
        label="Previous"
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(currentPage - 1)}
      />
      {pages.map((page) => (
        <PageButton
          key={page}
          label={renderLabel ? renderLabel(page) : page}
          active={page === currentPage}
          onClick={() => onPageChange?.(page)}
        />
      ))}
      <PageButton
        label="Next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
      />
    </div>
  );
};

type PageButtonProps = {
  label: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const PageButton = ({ label, active, disabled, onClick }: PageButtonProps) => {
  return (
    <button
      type="button"
      className={`min-w-[44px] rounded-xl border px-3 py-2 text-sm font-medium transition focus-ring ${
        active
          ? "border-indigo-500 bg-indigo-500 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Pagination;
