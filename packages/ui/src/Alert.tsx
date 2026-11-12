import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "./class-name";

const alertVariants = cva("rounded-md border px-3 py-2 text-sm", {
  variants: {
    variant: {
      info: "border-[var(--color-blue-500)] text-[var(--color-text)]",
      error: "border-[var(--color-red-600)] text-[var(--color-red-700)]",
      success: "border-[var(--color-green-600)] text-[var(--color-text)]",
    },
  },
  defaultVariants: { variant: "info" },
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ variant, className, role, ...props }, ref) => (
  <div
    ref={ref}
    role={role ?? (variant === "error" ? "alert" : "status")}
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

export { Alert, alertVariants };
