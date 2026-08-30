import type { ReactNode } from "react";

/**
 * The greeting block every result screen opens with: a mono eyebrow, the title
 * in the display face, and one serif line saying what the screen is for --
 * the same three-part opening the product UI uses on the landing page.
 */
export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow?: string;
  title: string;
  /** One line, in the serif face. Keep it to a sentence. */
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow && <span className="gp-label-muted">{eyebrow}</span>}
        <h1 className="gp-h1">{title}</h1>
        {children && <p className="gp-sub max-w-2xl">{children}</p>}
      </div>
      {actions && (
        <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}

/** A section heading inside a page: mono label, hairline, nothing else. */
export function SectionHeader({
  title,
  meta,
  children,
}: {
  title: string;
  /** Right-aligned count or status, in mono. */
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="gp-h2">{title}</h2>
        {meta && <span className="gp-label-muted">{meta}</span>}
      </div>
      {children && <p className="gp-body max-w-3xl">{children}</p>}
    </div>
  );
}
