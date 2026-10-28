"use client";

import { ReactNode, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./class-name";

export interface PanelSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function PanelSection({ title, children, defaultOpen = true, className }: PanelSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  return (
    <section className={cn("px-6 pb-2.5 border-t border-[var(--color-border)] first:border-t-0", className)}>
      <h3 className="mt-2.5">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="flex items-center justify-between w-full text-[0.6875rem] font-semibold uppercase text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
        >
          {title}
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 transition-transform duration-150", !open && "-rotate-90")}
          />
        </button>
      </h3>
      {open && (
        <div id={contentId} className="mt-1.5">
          {children}
        </div>
      )}
    </section>
  );
}
