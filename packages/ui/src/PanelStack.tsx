import { HTMLAttributes } from "react";
import { cn } from "./class-name";

/** A wrapper that keeps the `DetailPanel` rhythm between its children, for content that needs a root element. */
export function PanelStack({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn("flex flex-col gap-panel-gap", className)} />;
}
