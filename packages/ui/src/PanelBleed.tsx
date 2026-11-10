import { HTMLAttributes } from "react";
import { cn } from "./class-name";

export interface PanelBleedProps extends HTMLAttributes<HTMLDivElement> {
  /** Re-applies the panel margin inside, to align content with the sections while the box itself spans edge to edge. */
  padded?: boolean;
}

/** Cancels the `DetailPanel` body margin so a divider, band or border touches the panel edges. */
export function PanelBleed({ padded = false, className, ...rest }: PanelBleedProps) {
  return <div {...rest} className={cn("-mx-panel-x", padded && "px-panel-x", className)} />;
}
