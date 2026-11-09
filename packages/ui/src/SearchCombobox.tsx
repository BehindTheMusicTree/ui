"use client";

import type { ReactNode } from "react";
import { LoaderCircle, Search, X } from "lucide-react";
import { Combobox, type ComboboxProps } from "./Combobox";
import { cn } from "./class-name";
import { IconButton } from "./IconButton";
import { ICON_BUTTON_BASE } from "./icon-button-base";

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
  className,
  inputClassName,
  listClassName,
  optionClassName,
  ...combobox
}: SearchComboboxProps) {
  return (
    <div className={cn("relative", className)}>
      {leading && <div className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center">{leading}</div>}
      <Combobox
        {...combobox}
        loading={loading ? loadingLabel : undefined}
        inputClassName={cn(
          "h-[var(--layout-search-h)] [@media(pointer:coarse)]:h-[var(--layout-search-h)] rounded-full border-[var(--color-border)] bg-[var(--color-surface)] pr-20 text-search shadow-md transition-[padding] duration-200 ease-out motion-reduce:transition-none",
          leading ? "pl-11" : "pl-6",
          inputClassName,
        )}
        className="z-40 rounded-xl shadow-md"
        listClassName={cn("max-h-[min(20rem,50dvh)]", listClassName)}
        optionClassName={cn("[@media(pointer:coarse)]:min-h-[var(--layout-touch-target)]", optionClassName)}
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
        <span data-loading={loading} className="pointer-events-none relative p-2 text-[var(--color-text-muted)]">
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
      </div>
    </div>
  );
}

/** Round icon button sized for the `leading` slot of `SearchCombobox`. */
export const SEARCH_LEADING_BUTTON_CLASS = cn(
  ICON_BUTTON_BASE,
  "p-1.5 [@media(pointer:coarse)]:min-h-[var(--layout-touch-target)] [@media(pointer:coarse)]:min-w-[var(--layout-touch-target)]",
);
