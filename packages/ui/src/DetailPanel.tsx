"use client";

import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  PointerEvent,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { cn } from "./class-name";
import { IconButton } from "./IconButton";
import { PanelEdgeTab, PanelEdgeTabProps } from "./PanelEdgeTab";

const SHEET_DRAG_THRESHOLD_PX = 32;
const SCROLL_AREA = "[scrollbar-color:var(--color-text-muted)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-0 [&::-webkit-scrollbar-thumb]:bg-[var(--color-text-muted)]";

/** Whether an Escape press belongs to something else: a field being edited, a modal, or another handler. */
export function isEscapeOwnedElsewhere(event: KeyboardEvent): boolean {
  if (event.defaultPrevented) return true;
  const target = event.target;
  if (target instanceof Element && target.closest("input, textarea, select, [contenteditable]:not([contenteditable=false])")) {
    return true;
  }
  return document.querySelector('dialog[open], [role="dialog"][aria-modal="true"], [role="alertdialog"]') !== null;
}

export interface DetailPanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  onClose: () => void;
  side?: "left" | "right";
  /** Slides the panel out of view and makes it inert. */
  collapsed?: boolean;
  /** Extra header controls, rendered between the title and the close button. */
  headerActions?: ReactNode;
  /** Header controls rendered before the title (e.g. a "previous" button). */
  headerStart?: ReactNode;
  /** Header colors, for content that tints the header (e.g. a genre's fill). */
  headerAccent?: { background: string; color: string };
  hideClose?: boolean;
  /** Keeps the title for assistive tech but hides it visually. */
  hideTitle?: boolean;
  /** Grows the panel across the canvas up to the opposite column; `aside` becomes a second column. */
  expanded?: boolean;
  /** Called when Escape leaves expanded mode. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Second column shown only while `expanded`; hosts render it inside `children` otherwise. */
  aside?: ReactNode;
  /** Tab attached to the panel's inner edge; it moves with the panel when collapsed. */
  edgeTab?: Omit<PanelEdgeTabProps, "side" | "className">;
  /** Below `md` the panel becomes a bottom sheet with a drag handle. */
  sheet?: boolean;
  /** Escape leaves expanded mode first, then closes. */
  closeOnEscape?: boolean;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

/**
 * Floating card pinned to one side of its (relatively positioned) canvas, sized by the brand layout tokens.
 * The forwarded ref targets the positioned wrapper (panel plus edge tab), the box `useObscuredInset` measures.
 */
export const DetailPanel = forwardRef<HTMLDivElement, DetailPanelProps>(function DetailPanel(
  {
    title,
    onClose,
    side = "left",
    collapsed = false,
    headerActions,
    headerStart,
    headerAccent,
    hideClose = false,
    hideTitle = false,
    expanded = false,
    onExpandedChange,
    aside,
    edgeTab,
    sheet = true,
    closeOnEscape = true,
    children,
    className,
    headerClassName,
    bodyClassName,
    id,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const panelId = id ?? `detail-panel-${generatedId}`;
  const titleId = `${panelId}-title`;
  const panelRef = useRef<HTMLElement>(null);
  const isSheet = sheet && !expanded;
  const isLeft = side === "left";

  // `inert` is a boolean attribute in React 19 but an unknown string one in 18 (the peer range covers both).
  useEffect(() => {
    panelRef.current?.toggleAttribute("inert", collapsed);
  }, [collapsed]);

  // Peek covers --layout-sheet-peek of the canvas; full rises to the panel's usual top.
  const [sheetFull, setSheetFull] = useState(false);
  const grabberDragRef = useRef<{ startY: number; dragged: boolean } | null>(null);
  const onGrabberPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    grabberDragRef.current = { startY: event.clientY, dragged: false };
  };
  const onGrabberPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = grabberDragRef.current;
    if (!drag) return;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dy) < SHEET_DRAG_THRESHOLD_PX) return;
    drag.dragged = true;
    if (dy < 0) setSheetFull(true);
    else if (sheetFull) setSheetFull(false);
    else if (!hideClose) onClose();
  };
  const onGrabberClick = () => {
    const dragged = grabberDragRef.current?.dragged ?? false;
    grabberDragRef.current = null;
    if (!dragged) setSheetFull((full) => !full);
  };

  useEffect(() => {
    if (!closeOnEscape || collapsed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isEscapeOwnedElsewhere(event)) return;
      if (expanded && onExpandedChange) onExpandedChange(false);
      else if (!hideClose) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeOnEscape, collapsed, expanded, onExpandedChange, hideClose, onClose]);

  const accentStyle: CSSProperties | undefined = headerAccent
    ? { backgroundColor: headerAccent.background, color: headerAccent.color }
    : undefined;
  const hasAside = expanded && aside != null;

  return (
    <div
      ref={ref}
      data-detail-panel=""
      data-side={side}
      data-collapsed={collapsed}
      data-expanded={expanded}
      data-sheet={isSheet}
      className={cn(
        "absolute bottom-[var(--layout-gutter)] top-[var(--layout-gutter)] z-10 w-[var(--layout-detail-panel-w)] transition-transform duration-200 ease-out motion-reduce:transition-none",
        isLeft ? "left-[var(--layout-panel-edge)]" : "right-[var(--layout-panel-edge)]",
        expanded && "z-20 w-auto",
        expanded && (isLeft ? "right-[var(--layout-center-right)]" : "left-[var(--layout-center-left)]"),
        isSheet &&
          "max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:w-auto max-md:pb-[env(safe-area-inset-bottom,0px)]",
        isSheet &&
          (sheetFull
            ? "max-md:h-[calc(100%-var(--layout-gutter))]"
            : "max-md:h-[var(--layout-sheet-peek)]"),
                collapsed &&
          (isLeft
            ? "-translate-x-[calc(100%+var(--layout-panel-edge))]"
            : "translate-x-[calc(100%+var(--layout-panel-edge))]"),
        collapsed && isSheet && "max-md:translate-x-0 max-md:translate-y-full",
      )}
    >
      <aside
        aria-labelledby={titleId}
        {...rest}
        ref={panelRef}
        id={panelId}
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-surface)] text-[0.8125rem] leading-[1.45] text-[var(--color-text)] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)]",
          // Hides only the panel body once the slide-out ends, so the edge tab stays reachable to reopen it.
          "transition-[visibility] duration-200 motion-reduce:transition-none",
          collapsed && "invisible delay-200",
          isSheet && "max-md:rounded-b-none",
          className,
        )}
      >
        {isSheet && (
          <button
            type="button"
            aria-label="Resize panel"
            aria-expanded={sheetFull}
            onPointerDown={onGrabberPointerDown}
            onPointerUp={onGrabberPointerUp}
            onPointerCancel={() => (grabberDragRef.current = null)}
            onKeyDown={() => (grabberDragRef.current = null)}
            onClick={onGrabberClick}
            className="hidden h-[var(--layout-touch-target)] w-full shrink-0 cursor-grab touch-none items-center justify-center text-[var(--color-text-muted)] before:h-1 before:w-9 before:rounded-full before:bg-current before:opacity-40 before:content-[''] max-md:flex"
          />
        )}
        <header
          style={accentStyle}
          className={cn("flex shrink-0 items-center gap-2 px-6 pb-2 pt-4", headerClassName)}
        >
          {headerStart}
          <h2 id={titleId} className={cn("min-w-0 flex-1 break-words text-base font-semibold", hideTitle && "sr-only")}>
            {title}
          </h2>
          {headerActions}
          {!hideClose && (
            <IconButton aria-label="Close" onClick={onClose} style={accentStyle && { color: "inherit" }}>
              <X aria-hidden="true" className="h-4 w-4" />
            </IconButton>
          )}
        </header>
        {hasAside ? (
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto md:grid md:grid-cols-[var(--layout-panel-aside-w)_minmax(0,1fr)] md:overflow-hidden",
              SCROLL_AREA,
              bodyClassName,
            )}
          >
            <div className={cn("pb-4 md:min-h-0 md:overflow-y-auto md:border-r md:border-[var(--color-border)]", SCROLL_AREA)}>{aside}</div>
            <div className={cn("pb-4 md:min-h-0 md:overflow-y-auto", SCROLL_AREA)}>{children}</div>
          </div>
        ) : (
          <div className={cn("min-h-0 flex-1 overflow-y-auto pb-4", SCROLL_AREA, bodyClassName)}>{children}</div>
        )}
      </aside>
      {edgeTab && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            isLeft ? "left-full" : "right-full",
            isSheet && "max-md:hidden",
          )}
        >
          <PanelEdgeTab side={side} controls={panelId} {...edgeTab} />
        </div>
      )}
    </div>
  );
});
