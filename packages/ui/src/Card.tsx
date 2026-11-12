import * as React from "react";

import { cn } from "./class-name";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned header slot. */
  actions?: React.ReactNode;
}

const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ title, description, actions, className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-text)]",
        className,
      )}
      {...props}
    >
      {title || description || actions ? (
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <h2 className="text-heading font-semibold">{title}</h2> : null}
            {description ? <p className="text-sm text-[var(--color-text-muted)]">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  ),
);
Card.displayName = "Card";

export { Card };
