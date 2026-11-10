import { ReactNode } from "react";
import { cn } from "./class-name";
import { PANEL_LABEL_CLASS, PANEL_LABEL_CONTENT_GAP_CLASS } from "./panel-label";

export interface FieldListItem {
  label: string;
  value: ReactNode;
}

export interface FieldListProps {
  items: FieldListItem[];
  className?: string;
}

export function FieldList({ items, className }: FieldListProps) {
  return (
    <dl className={cn("divide-y divide-[var(--color-border)]", className)}>
      {items.map((item) => (
        <div key={item.label} className="py-2.5">
          <dt className={PANEL_LABEL_CLASS}>{item.label}</dt>
          <dd className={cn(PANEL_LABEL_CONTENT_GAP_CLASS, "break-words text-[var(--color-text)]")}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
