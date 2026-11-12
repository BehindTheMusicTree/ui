import * as React from "react";

import { cn } from "./class-name";

export interface PageProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  /** Keeps the h1 for assistive tech but hides it (e.g. a canvas page with its own chrome). */
  visuallyHiddenTitle?: boolean;
  /** Document layout only; ignored by `canvas`. */
  description?: React.ReactNode;
  /** Header slot, right-aligned next to the title. Document layout only; ignored by `canvas`. */
  actions?: React.ReactNode;
  /** Document layout only; `canvas` always fills its container. */
  width?: "default" | "narrow" | "full";
  /** `document` scrolls in a centred column; `canvas` fills the viewport for maps and trees. */
  layout?: "document" | "canvas";
}

const widthClassName = {
  default: "max-w-[var(--layout-page-max-w)]",
  narrow: "max-w-[var(--layout-page-max-w-narrow)]",
  full: "max-w-none",
} as const;

export function Page({
  title,
  visuallyHiddenTitle = false,
  description,
  actions,
  width = "default",
  layout = "document",
  className,
  children,
  ...props
}: PageProps) {
  const heading = (
    <h1 className={cn("text-title font-semibold text-[var(--color-text)]", visuallyHiddenTitle && "sr-only")}>{title}</h1>
  );

  if (layout === "canvas") {
    return (
      <main className={cn("flex h-full min-h-0 w-full flex-1 flex-col", className)} {...props}>
        {heading}
        {children}
      </main>
    );
  }

  return (
    <main
      className={cn(
        "h-full w-full flex-1 overflow-y-auto px-[var(--layout-gutter)] pb-[var(--layout-gutter)] pt-[var(--layout-band-top)]",
        className,
      )}
      {...props}
    >
      <div className={cn("mx-auto flex w-full flex-col gap-[var(--layout-panel-gap)]", widthClassName[width])}>
        {visuallyHiddenTitle && !description && !actions ? (
          heading
        ) : (
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {heading}
              {description ? <p className="text-sm text-[var(--color-text-muted)]">{description}</p> : null}
            </div>
            {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
          </header>
        )}
        {children}
      </div>
    </main>
  );
}
