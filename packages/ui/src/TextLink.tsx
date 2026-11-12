import * as React from "react";

import { cn } from "./class-name";

/** Exported so apps can style a framework link (e.g. next/link) without ui depending on it. */
export const textLinkClassName =
  "text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] rounded-sm";

const TextLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    // Content is supplied by the caller.
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a ref={ref} className={cn(textLinkClassName, className)} {...props} />
  ),
);
TextLink.displayName = "TextLink";

export { TextLink };
