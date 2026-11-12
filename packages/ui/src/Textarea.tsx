import * as React from "react";

import { cn } from "./class-name";
import { inputBaseClassName } from "./input-base";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 3, ...props }, ref) => (
    <textarea ref={ref} rows={rows} className={cn("block min-h-20", inputBaseClassName, className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
