"use client";

import type { MouseEventHandler, ReactNode } from "react";

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
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] transition-colors group-hover:bg-[var(--color-border)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-focus-ring)] group-disabled:group-hover:bg-[var(--color-surface-muted)]">
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
  const hasMain = children !== undefined && children !== null && children !== false;
  if (!hasMain && !section) return null;
  return (
    <div className={`border-b border-[var(--color-border)]${className ? ` ${className}` : ""}`}>
      {hasMain && <div className="flex flex-wrap items-center gap-1 px-3.5 py-3">{children}</div>}
      {section && (
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
