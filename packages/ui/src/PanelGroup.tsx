import { ReactNode } from "react";
import { cn } from "./class-name";

export interface PanelGroupProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PanelGroup({ title, children, className }: PanelGroupProps) {
  return (
    <div className={cn("py-2 first:pt-0 last:pb-0", className)}>
      <h4 className="text-xs font-medium text-[var(--color-text-muted)]">{title}</h4>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}
