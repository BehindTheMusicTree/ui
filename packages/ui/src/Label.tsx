import * as React from "react";

import { cn } from "./class-name";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    // htmlFor is supplied by the caller (or Field); the wrapping-label pattern needs no htmlFor.
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label ref={ref} className={cn("text-sm font-medium text-[var(--color-text)]", className)} {...props} />
  ),
);
Label.displayName = "Label";

export { Label };
