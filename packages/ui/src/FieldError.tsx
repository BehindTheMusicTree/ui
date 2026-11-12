import * as React from "react";

import { cn } from "./class-name";

const FieldError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-[var(--color-red-600)]", className)} {...props} />
  ),
);
FieldError.displayName = "FieldError";

export { FieldError };
