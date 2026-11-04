"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./class-name";

export type ComboboxOption = { key: string; content: ReactNode };

export type ComboboxGroup = {
  key: string;
  /** Visible heading; omit for an unlabelled group. */
  label?: ReactNode;
  options: ComboboxOption[];
};

export interface ComboboxProps {
  /** Names the input when no visible `<label>` points at `inputId`. */
  ariaLabel?: string;
  /** Lets an external `<label htmlFor>` and `aria-describedby` reach the input. */
  inputId?: string;
  describedBy?: string;
  listLabel: string;
  value: string;
  placeholder?: string;
  groups: ComboboxGroup[];
  open: boolean;
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onPick: (groupKey: string, optionKey: string) => void;
  /** Called when ArrowDown passes the last option or the list is scrolled to its end. */
  onLoadMore?: () => void;
  /** Whether ArrowDown on the last option should load more instead of wrapping to the first. */
  canLoadMore?: boolean;
  /** Announced politely to assistive technology (e.g. "3 results") and shown under the options. */
  status?: ReactNode;
  /** Shown instead of the options while nothing can be listed yet. */
  loading?: ReactNode;
  /** Shown when open with no options and not loading. Omit to keep the list closed. */
  empty?: ReactNode;
  footer?: ReactNode;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  optionClassName?: string;
}

export function Combobox({
  ariaLabel,
  inputId,
  describedBy,
  listLabel,
  value,
  placeholder,
  groups,
  open,
  onValueChange,
  onOpenChange,
  onPick,
  onLoadMore,
  canLoadMore = false,
  status,
  loading,
  empty,
  footer,
  className,
  inputClassName,
  listClassName,
  optionClassName,
}: ComboboxProps) {
  const id = useId();
  const [active, setActive] = useState(0);

  const flat = groups.flatMap((group) => group.options.map((option) => ({ group, option })));
  const hasOptions = flat.length > 0;
  const expanded = open && (hasOptions || Boolean(loading) || Boolean(empty));
  const activeIndex = Math.min(active, flat.length - 1);
  const optionId = (index: number) => `${id}-option-${index}`;

  const pick = (index: number) => {
    const entry = flat[index];
    if (entry) onPick(entry.group.key, entry.option.key);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      onOpenChange(false);
      setActive(0);
      return;
    }
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp") && hasOptions) {
      event.preventDefault();
      onOpenChange(true);
      return;
    }
    if (!expanded || !hasOptions) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      if (step === 1 && activeIndex === flat.length - 1 && canLoadMore) {
        onLoadMore?.();
        return;
      }
      setActive((activeIndex + step + flat.length) % flat.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(flat.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      pick(activeIndex);
    }
  };

  let offset = 0;

  return (
    <>
      <input
        id={inputId}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={expanded}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        aria-activedescendant={expanded && hasOptions ? optionId(activeIndex) : undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onValueChange(event.target.value);
          onOpenChange(true);
          setActive(0);
        }}
        onFocus={() => hasOptions && onOpenChange(true)}
        onBlur={() => onOpenChange(false)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm [@media(pointer:coarse)]:h-[var(--layout-touch-target)] [@media(pointer:coarse)]:text-base text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
          inputClassName
        )}
      />
      <div role="status" aria-live="polite" className="sr-only">
        {open ? status : null}
      </div>
      {expanded && (
        <div
          // Keeps focus on the input when the scrollbar or footer is pressed, so the list does not close before the click lands.
          onMouseDown={(event) => event.preventDefault()}
          className={cn(
            "absolute top-full z-10 mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg",
            className
          )}
        >
          <div
            id={`${id}-listbox`}
            role="listbox"
            aria-label={listLabel}
            aria-busy={Boolean(loading)}
            onScroll={(event) => {
              const list = event.currentTarget;
              if (canLoadMore && !loading && list.scrollHeight - list.scrollTop - list.clientHeight < 24) onLoadMore?.();
            }}
            className={cn("max-h-80 overflow-y-auto py-1", listClassName)}
          >
            {groups.map((group, groupIndex) => {
              if (group.options.length === 0) return null;
              const labelId = `${id}-group-${groupIndex}`;
              const start = offset;
              offset += group.options.length;
              return (
                <div key={group.key} role="group" aria-labelledby={group.label ? labelId : undefined}>
                  {group.label && (
                    <div
                      id={labelId}
                      role="presentation"
                      className="px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase text-[var(--color-text-muted)]"
                    >
                      {group.label}
                    </div>
                  )}
                  {group.options.map((option, index) => {
                    const flatIndex = start + index;
                    return (
                      <div
                        key={option.key}
                        id={optionId(flatIndex)}
                        role="option"
                        aria-selected={flatIndex === activeIndex}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          pick(flatIndex);
                        }}
                        className={cn(
                          "cursor-pointer px-3 py-2 text-sm text-[var(--color-text)] aria-selected:bg-[var(--color-surface-muted)] hover:bg-[var(--color-surface-muted)]",
                          optionClassName
                        )}
                      >
                        {option.content}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {loading && (
              <div className="px-3 py-2 text-sm text-[var(--color-text-muted)]">{loading}</div>
            )}
            {!hasOptions && !loading && empty && (
              <div className="px-3 py-2 text-sm text-[var(--color-text-muted)]">{empty}</div>
            )}
          </div>
          {footer}
        </div>
      )}
    </>
  );
}
