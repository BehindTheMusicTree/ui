"use client";

import { Children, type MouseEventHandler, type ReactNode } from "react";

export type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  /** Secondary line under the label, e.g. a playable count. */
  caption?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  title?: string;
  "aria-label"?: string;
};

export function ActionButton({ icon, label, caption, onClick, disabled, title, "aria-label": ariaLabel }: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      onClick={onClick}
      className="group flex w-16 flex-col items-center gap-1 text-center text-xs text-[var(--color-text)] focus-visible:outline-none disabled:opacity-50"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] transition-colors group-enabled:group-hover:bg-[var(--color-border)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-focus-ring)]">
        {icon}
      </span>
      {label}
      {caption !== undefined && <span className="text-[var(--color-text-muted)]">{caption}</span>}
    </button>
  );
}

export type ActionBandProps = {
  children?: ReactNode;
  /** Buttons shown in a titled section below the main row. */
  section?: { title: string; label?: string; children: ReactNode };
  className?: string;
};

export function ActionBand({ children, section, className }: ActionBandProps) {
  const hasMain = Children.toArray(children).length > 0;
  const hasSection = section !== undefined && Children.toArray(section.children).length > 0;
  if (!hasMain && !hasSection) return null;
  return (
    <div className={`border-b border-[var(--color-border)]${className ? ` ${className}` : ""}`}>
      {hasMain && <div className="flex flex-wrap items-center gap-1 px-3.5 py-3">{children}</div>}
      {hasSection && section && (
        <section
          aria-label={section.label ?? section.title}
          className={`px-3.5 py-3${hasMain ? " border-t border-[var(--color-border)]" : ""}`}
        >
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{section.title}</h3>
          <div className="flex flex-wrap items-center gap-1">{section.children}</div>
        </section>
      )}
    </div>
  );
}
