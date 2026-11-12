/** Shared by Input, Select and Textarea so the three controls can't diverge. */
export const inputBaseClassName =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm [@media(pointer:coarse)]:text-base text-[var(--color-text)] ring-offset-[var(--color-surface)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--color-red-600)]";

/** Single-line controls (Input, Select) share this height. */
export const inputHeightClassName = "h-10 [@media(pointer:coarse)]:h-[var(--layout-touch-target)]";
