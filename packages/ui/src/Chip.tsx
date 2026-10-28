import { ReactNode } from "react";
import { cn } from "./class-name";

export interface ChipProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Chip({ href, icon, children, className }: ChipProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs text-[var(--color-text)] border border-[var(--color-border)] rounded-full transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
        className,
      )}
    >
      {icon}
      {children}
    </a>
  );
}
