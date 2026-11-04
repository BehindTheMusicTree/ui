"use client";

import { ReactNode } from "react";
import { cn } from "./class-name";
import { floatingControlCardClassName, floatingControlCellClassName } from "./floating-control";

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
  /**
   * `floating` renders icon-only square cells in the same card as `ZoomControls`, so both
   * have identical height when placed side by side over a canvas. Each option needs an
   * `aria-label` since it has no visible text.
   */
  variant?: "default" | "floating";
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  variant = "default",
  className,
}: SegmentedControlProps<T>) {
  const floating = variant === "floating";
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        floating
          ? cn("flex w-fit gap-0.5", floatingControlCardClassName)
          : "inline-flex rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-0.5 [@media(pointer:coarse)]:max-w-full [@media(pointer:coarse)]:overflow-x-auto",
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
              "shrink-0 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
              floating
                ? cn("inline-flex items-center justify-center rounded-md", floatingControlCellClassName)
                : "rounded px-3 py-1 text-sm [@media(pointer:coarse)]:min-h-[var(--layout-touch-target)] [@media(pointer:coarse)]:px-4",
              selected
                ? cn(
                    "text-[var(--color-text)]",
                    floating
                      ? "bg-[var(--color-surface-muted)] ring-1 ring-inset ring-[var(--color-border)]"
                      : "bg-[var(--color-surface)] font-medium shadow-sm",
                  )
                : cn(
                    "text-[var(--color-text-muted)] enabled:hover:text-[var(--color-text)]",
                    floating && "enabled:hover:bg-[var(--color-surface-muted)]",
                  ),
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
