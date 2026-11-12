import { Circle, CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import * as React from "react";

import { cn } from "./class-name";

export type StepStatus = "pending" | "current" | "done" | "failed";

export interface Step {
  key: string;
  label: React.ReactNode;
  status: StepStatus;
  detail?: React.ReactNode;
}

export interface StepListProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
  steps: readonly Step[];
  /** Screen-reader text for each status; the icon alone doesn't convey it. */
  statusLabels: Record<StepStatus, string>;
}

const ICON_CLASS = "h-5 w-5 shrink-0";

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case "done":
      return <CircleCheck aria-hidden="true" className={cn(ICON_CLASS, "text-[var(--color-green-600)]")} />;
    case "current":
      return (
        <LoaderCircle
          aria-hidden="true"
          className={cn(ICON_CLASS, "animate-spin text-[var(--color-primary)] motion-reduce:animate-none")}
        />
      );
    case "failed":
      return <CircleX aria-hidden="true" className={cn(ICON_CLASS, "text-[var(--color-red-600)]")} />;
    case "pending":
      return <Circle aria-hidden="true" className={cn(ICON_CLASS, "text-[var(--color-text-muted)]")} />;
  }
}

export function StepList({ steps, statusLabels, className, ...props }: StepListProps) {
  return (
    <ol className={cn("flex flex-col gap-1", className)} {...props}>
      {steps.map(({ key, label, status, detail }) => (
        <li
          key={key}
          aria-current={status === "current" ? "step" : undefined}
          className={cn(
            "flex items-center gap-2 text-sm",
            status === "pending" ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)]",
            status === "current" && "font-medium",
          )}
        >
          <StepIcon status={status} />
          <span>
            {label}
            {detail ? <span className="ml-1 text-[var(--color-text-muted)]">({detail})</span> : null}
          </span>
          <span className="sr-only">{statusLabels[status]}</span>
        </li>
      ))}
    </ol>
  );
}
