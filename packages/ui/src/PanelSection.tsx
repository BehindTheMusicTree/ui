"use client";

import { ReactNode, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./class-name";
import { PANEL_LABEL_CLASS, PANEL_LABEL_CONTENT_GAP_CLASS } from "./panel-label";

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
    <section className={className}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className={cn("flex items-center justify-between w-full", PANEL_LABEL_CLASS, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]")}
        >
          {title}
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 transition-transform duration-150", !open && "-rotate-90")}
          />
        </button>
      </h3>
      {open && (
        <div id={contentId} className={cn(PANEL_LABEL_CONTENT_GAP_CLASS, "divide-y divide-[var(--color-border)]")}>
          {children}
        </div>
      )}
    </section>
  );
}
