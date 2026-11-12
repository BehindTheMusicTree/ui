import * as React from "react";

import { cn } from "./class-name";
import { inputBaseClassName, inputHeightClassName } from "./input-base";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex file:border-0 file:bg-transparent file:text-sm file:font-medium",
          inputBaseClassName,
          inputHeightClassName,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
