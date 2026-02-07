import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const SectionCard = ({
  title,
  subtitle,
  action,
  footer,
  children,
  className,
  contentClassName,
}: SectionCardProps) => {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
        className ?? ""
      }`}
    >
      {(title || subtitle || action) && (
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <div className={`px-6 py-5 ${contentClassName ?? ""}`}>{children}</div>
      {footer ? (
        <div className="border-t border-slate-100 px-6 py-4">{footer}</div>
      ) : null}
    </section>
  );
};

export default SectionCard;
