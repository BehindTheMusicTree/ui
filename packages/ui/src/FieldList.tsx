import { ReactNode } from "react";
import { cn } from "./class-name";

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
    <dl className={cn("px-6 divide-y divide-[var(--color-border)]", className)}>
      {items.map((item) => (
        <div key={item.label} className="py-2.5">
          <dt className="text-[0.6875rem] font-semibold uppercase text-[var(--color-text-muted)]">{item.label}</dt>
          <dd className="mt-0.5 break-words text-[var(--color-text)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
