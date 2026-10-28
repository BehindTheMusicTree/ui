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
    <dl className={cn("px-6 py-2.5", className)}>
      {items.map((item) => (
        <div key={item.label} className="mt-2.5 first:mt-0">
          <dt className="text-[0.6875rem] font-semibold uppercase text-[var(--color-text-muted)]">{item.label}</dt>
          <dd className="mt-0.5 break-words text-[var(--color-text)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
