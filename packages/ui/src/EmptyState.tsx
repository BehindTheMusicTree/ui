import * as React from "react";

import { cn } from "./class-name";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-4 py-8 text-center",
        className,
      )}
      {...props}
    >
      <p className="font-medium text-[var(--color-text)]">{title}</p>
      {description ? <p className="text-sm text-[var(--color-text-muted)]">{description}</p> : null}
      {action}
    </div>
  );
}
