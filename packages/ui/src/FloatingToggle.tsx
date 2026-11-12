"use client";

import { ReactNode } from "react";
import { cn } from "./class-name";
import {
  floatingControlCardClassName,
  floatingControlCellClassName,
  floatingControlCellStateClassName,
} from "./floating-control";

export interface FloatingToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  /** Icon shown in the cell. */
  children: ReactNode;
  "aria-label": string;
  disabled?: boolean;
  title?: string;
  className?: string;
}

/**
 * Single-cell floating card holding an on/off icon button: the toggle counterpart of the
 * `floating` `SegmentedControl`. Unpositioned: the caller places it over its canvas.
 */
export function FloatingToggle({
  pressed,
  onPressedChange,
  children,
  "aria-label": ariaLabel,
  disabled,
  title,
  className,
}: FloatingToggleProps) {
  return (
    <div className={cn("flex w-fit", floatingControlCardClassName, className)}>
      <button
        type="button"
        aria-pressed={pressed}
        aria-label={ariaLabel}
        disabled={disabled}
        title={title}
        onClick={() => onPressedChange(!pressed)}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
          floatingControlCellClassName,
          floatingControlCellStateClassName(pressed),
        )}
      >
        {children}
      </button>
    </div>
  );
}
