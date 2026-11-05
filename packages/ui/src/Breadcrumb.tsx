"use client";

import { Fragment, ReactNode, useState } from "react";
import { MdHome } from "react-icons/md";
import { cn } from "./class-name";
import { floatingControlCardClassName } from "./floating-control";

export interface BreadcrumbItem {
  id: string;
  label: ReactNode;
}

export interface BreadcrumbProps {
  /** The root crumb, drawn as a home icon; `label` is its accessible name (e.g. "All genres"). */
  home: { label: string; onSelect: () => void };
  /** The trail below home, root first; the last item is the current location. */
  items: readonly BreadcrumbItem[];
  /** Called with the id of a clicked ancestor (any item but the last). */
  onSelect: (id: string) => void;
  /** Makes the current item a button (e.g. to reopen its details); plain text otherwise. */
  onSelectCurrent?: () => void;
  /** Beyond this many ancestors, the middle of the trail collapses into a "…" button. */
  maxVisibleAncestors?: number;
  /** Ancestors nearest the current item that stay visible while collapsed. */
  ancestorsKeptWhenCollapsed?: number;
  className?: string;
}

const crumbClassName = "shrink-0 cursor-pointer border-none bg-transparent p-0 hover:underline";

/** A canvas location trail: home, the ancestors, then the current item, in a floating card.
 * Unpositioned: the caller places it over its canvas. */
export function Breadcrumb({
  home,
  items,
  onSelect,
  onSelectCurrent,
  maxVisibleAncestors = 3,
  ancestorsKeptWhenCollapsed = 2,
  className,
}: BreadcrumbProps) {
  const current = items[items.length - 1] as BreadcrumbItem | undefined;
  const ancestors = items.slice(0, -1);
  // Keyed on the current item so moving elsewhere collapses the trail again.
  const [expandedAt, setExpandedAt] = useState<string | null>(null);
  const collapsed = expandedAt !== current?.id && ancestors.length > maxVisibleAncestors;
  const visibleAncestors = collapsed ? ancestors.slice(-ancestorsKeptWhenCollapsed) : ancestors;
  const separator = <span aria-hidden="true">›</span>;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        floatingControlCardClassName,
        "box-border flex items-center gap-1 overflow-hidden whitespace-nowrap px-2.5 py-1 text-xs text-[var(--color-text-muted)]",
        className,
      )}
    >
      <button
        type="button"
        aria-label={home.label}
        title={home.label}
        onClick={home.onSelect}
        className={cn(crumbClassName, "flex items-center")}
      >
        <MdHome aria-hidden="true" size={14} />
      </button>
      {current && separator}
      {collapsed && (
        <>
          <button
            type="button"
            aria-label="Show full path"
            aria-expanded={false}
            onClick={() => setExpandedAt(current?.id ?? null)}
            className={crumbClassName}
          >
            …
          </button>
          {separator}
        </>
      )}
      {visibleAncestors.map((ancestor) => (
        <Fragment key={ancestor.id}>
          <button type="button" onClick={() => onSelect(ancestor.id)} className={crumbClassName}>
            {ancestor.label}
          </button>
          {separator}
        </Fragment>
      ))}
      {current &&
        (onSelectCurrent ? (
          <button
            type="button"
            aria-current="page"
            onClick={onSelectCurrent}
            className={cn(crumbClassName, "truncate font-semibold text-[var(--color-text)]")}
          >
            {current.label}
          </button>
        ) : (
          <span aria-current="page" className="truncate font-semibold text-[var(--color-text)]">
            {current.label}
          </span>
        ))}
    </nav>
  );
}
