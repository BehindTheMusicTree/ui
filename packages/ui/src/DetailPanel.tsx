"use client";

import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "./class-name";
import { IconButton } from "./IconButton";

export interface DetailPanelProps {
  title: ReactNode;
  onClose: () => void;
  side?: "left" | "right";
  /** Slides the panel out of view and makes it inert. */
  collapsed?: boolean;
  /** Extra header controls, rendered between the title and the close button. */
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

/** Floating card pinned to one side of its (relatively positioned) canvas, sized by the brand layout tokens. */
export function DetailPanel({
  title,
  onClose,
  side = "left",
  collapsed = false,
  headerActions,
  children,
  className,
  headerClassName,
  bodyClassName,
}: DetailPanelProps) {
  const ref = useRef<HTMLElement>(null);

  // `inert` is a boolean attribute in React 19 but an unknown string one in 18 (the peer range covers both).
  useEffect(() => {
    ref.current?.toggleAttribute("inert", collapsed);
  }, [collapsed]);

  return (
    <aside
      ref={ref}
      className={cn(
        "absolute bottom-[var(--layout-gutter)] top-[var(--layout-gutter)] z-10 flex w-[var(--layout-detail-panel-w)] flex-col overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-surface)] text-[0.8125rem] leading-[1.45] text-[var(--color-text)] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none",
        side === "left" ? "left-[var(--layout-gutter)]" : "right-[var(--layout-gutter)]",
        collapsed &&
          "invisible delay-[0s,200ms]",
        collapsed &&
          (side === "left"
            ? "-translate-x-[calc(100%+var(--layout-gutter))]"
            : "translate-x-[calc(100%+var(--layout-gutter))]"),
        className,
      )}
    >
      <header className={cn("flex shrink-0 items-center gap-2 px-6 pb-2 pt-4", headerClassName)}>
        <h2 className="min-w-0 flex-1 break-words text-base font-semibold">{title}</h2>
        {headerActions}
        <IconButton aria-label="Close" onClick={onClose}>
          <X aria-hidden="true" className="h-4 w-4" />
        </IconButton>
      </header>
      <div className={cn("min-h-0 flex-1 overflow-y-auto pb-4", bodyClassName)}>{children}</div>
    </aside>
  );
}
