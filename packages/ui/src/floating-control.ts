/**
 * Shared chrome and geometry for controls floated over a canvas (zoom, view toggles).
 * Every such control is a card of 2rem square cells, so side-by-side controls line up.
 */
export const floatingControlCardClassName =
  "rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-[0.1875rem] drop-shadow-[0_2px_6px_rgba(24,24,27,0.16)]";

export const floatingControlCellClassName =
  "h-8 w-8 [@media(pointer:coarse)]:h-[var(--layout-touch-target)] [@media(pointer:coarse)]:w-[var(--layout-touch-target)]";

/** Selected / unselected look of a floating cell, shared by every pressed-state control. */
export function floatingControlCellStateClassName(selected: boolean): string {
  return selected
    ? "text-[var(--color-text)] bg-[var(--color-surface-muted)] ring-1 ring-inset ring-[var(--color-border)]"
    : "text-[var(--color-text-muted)] enabled:hover:text-[var(--color-text)] enabled:hover:bg-[var(--color-surface-muted)]";
}
