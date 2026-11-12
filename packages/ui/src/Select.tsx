import * as React from "react";

import { cn } from "./class-name";
import { inputBaseClassName, inputHeightClassName } from "./input-base";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn("block", inputBaseClassName, inputHeightClassName, className)} {...props}>
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export { Select };
