"use client";

import { ReactNode } from "react";
import { cn } from "./class-name";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: ReactNode;
  "aria-label"?: string;
  disabled?: boolean;
  title?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-0.5 [@media(pointer:coarse)]:max-w-full [@media(pointer:coarse)]:overflow-x-auto",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            aria-label={option["aria-label"]}
            disabled={option.disabled}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "shrink-0 rounded px-3 py-1 text-sm [@media(pointer:coarse)]:min-h-[var(--layout-touch-target)] [@media(pointer:coarse)]:px-4 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
              selected
                ? "bg-[var(--color-surface)] font-medium text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-text-muted)] enabled:hover:text-[var(--color-text)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
