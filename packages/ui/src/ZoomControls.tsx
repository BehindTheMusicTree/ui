"use client";

import { ReactNode } from "react";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "./class-name";
import { IconButton } from "./IconButton";

export interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  orientation?: "horizontal" | "vertical";
  /** Rendered before the buttons, inside the same card. */
  leading?: ReactNode;
  className?: string;
}

/** Zoom in / zoom out / fit-to-frame buttons. Unpositioned: the caller places it over its canvas. */
export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onFit,
  canZoomIn = true,
  canZoomOut = true,
  orientation = "vertical",
  leading,
  className,
}: ZoomControlsProps) {
  return (
    <div
      role="group"
      aria-label="Zoom controls"
      className={cn(
        "flex w-fit gap-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-[0.1875rem] drop-shadow-[0_2px_6px_rgba(24,24,27,0.16)]",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
    >
      {leading}
      <IconButton aria-label="Zoom in" className="rounded-md" disabled={!canZoomIn} onClick={onZoomIn}>
        <ZoomIn aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" />
      </IconButton>
      <IconButton aria-label="Zoom out" className="rounded-md" disabled={!canZoomOut} onClick={onZoomOut}>
        <ZoomOut aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" />
      </IconButton>
      <IconButton aria-label="Fit to frame" className="rounded-md" onClick={onFit}>
        <Maximize aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" />
      </IconButton>
    </div>
  );
}
