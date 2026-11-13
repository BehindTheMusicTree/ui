"use client";

import type { ReactNode } from "react";
import { LoaderCircle, Search, X } from "lucide-react";
import { Combobox, type ComboboxProps } from "./Combobox";
import { cn } from "./class-name";
import { IconButton } from "./IconButton";
import { ICON_BUTTON_BASE } from "./icon-button-base";

const trailingActionLayouts = {
  always: { indicator: "hidden", action: "", inset: "right-1", padding: "pr-[calc(2*var(--layout-search-h))]" },
  sm: { indicator: "hidden sm:inline-flex", action: "sm:hidden", inset: "max-sm:right-1", padding: "max-sm:pr-[calc(2*var(--layout-search-h))]" },
  md: { indicator: "hidden md:inline-flex", action: "md:hidden", inset: "max-md:right-1", padding: "max-md:pr-[calc(2*var(--layout-search-h))]" },
};

export interface SearchComboboxProps
  extends Omit<ComboboxProps, "loading" | "inputClassName" | "empty" | "canLoadMore" | "onLoadMore"> {
  /** Swaps the search icon for a spinner (after a short delay) and shows `loadingLabel` in the list. */
  loading?: boolean;
  loadingLabel?: ReactNode;
  /** Shows a clear button at the end of the pill; called when it is pressed. */
  onClear?: () => void;
  clearLabel?: string;
  /** An action left of the text (e.g. a "Previous" button); the input makes room for it. */
  leading?: ReactNode;
  /** Replaces the search indicator with an interactive action. Loading remains announced in the list. */
  trailingAction?: ReactNode;
  /** Restricts the replacement to narrow screens; the search indicator returns above this breakpoint. */
  trailingActionBreakpoint?: "sm" | "md";
  className?: string;
  inputClassName?: string;
}

/** A pill-shaped search field over `Combobox`: search icon or spinner, optional clear button and leading action. */
export function SearchCombobox({
  loading = false,
  loadingLabel = "Searching…",
  onClear,
  clearLabel = "Clear search",
  leading,
  trailingAction,
  trailingActionBreakpoint,
  className,
  inputClassName,
  listClassName,
  optionClassName,
  ...combobox
}: SearchComboboxProps) {
  const trailingLayout = trailingAction ? trailingActionLayouts[trailingActionBreakpoint ?? "always"] : undefined;
  return (
    <div className={cn("relative", className)}>
      {leading && <div className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center">{leading}</div>}
      <Combobox
        {...combobox}
        loading={loading ? loadingLabel : undefined}
        inputClassName={cn(
          "h-[var(--layout-search-h)] [@media(pointer:coarse)]:h-[var(--layout-search-h)] rounded-full border-[var(--color-border)] bg-[var(--color-surface)] pr-20 text-search shadow-md transition-[padding] duration-200 ease-out motion-reduce:transition-none",
          leading ? "pl-11" : "pl-6",
          trailingLayout?.padding,
          inputClassName,
        )}
        className="z-40 rounded-xl shadow-md"
        listClassName={cn("max-h-[min(20rem,50dvh)]", listClassName)}
        optionClassName={cn("[@media(pointer:coarse)]:min-h-[var(--layout-touch-target)]", optionClassName)}
      />
      <div className={cn("absolute right-3 top-1/2 z-50 flex -translate-y-1/2 items-center", trailingLayout?.inset)}>
        <span data-loading={loading} className={cn("pointer-events-none relative p-2 text-[var(--color-text-muted)]", trailingLayout?.indicator)}>
          <Search
            aria-hidden="true"
            className={cn("h-6 w-6 transition-opacity duration-200 motion-reduce:transition-none", loading && "opacity-0")}
          />
          <LoaderCircle
            aria-hidden="true"
            className={cn(
              "absolute inset-2 h-6 w-6 transition-opacity duration-200 motion-reduce:transition-none",
              loading ? "animate-spin opacity-100 delay-300 motion-reduce:animate-none" : "opacity-0",
            )}
          />
        </span>
        {onClear && (
          <IconButton size="lg" aria-label={clearLabel} onClick={onClear}>
            <X aria-hidden="true" className="h-6 w-6" />
          </IconButton>
        )}
        {trailingAction && (
          <div className={cn("relative flex shrink-0 items-center", trailingLayout?.action)}>
            {trailingAction}
          </div>
        )}
      </div>
    </div>
  );
}

/** Round icon button sized for the `leading` slot of `SearchCombobox`. */
export const SEARCH_LEADING_BUTTON_CLASS = cn(
  ICON_BUTTON_BASE,
  "p-1.5 [@media(pointer:coarse)]:min-h-[var(--layout-touch-target)] [@media(pointer:coarse)]:min-w-[var(--layout-touch-target)]",
);
