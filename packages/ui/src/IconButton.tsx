"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./class-name";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors duration-200 hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-6 w-6",
        md: "h-8 w-8",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size, type = "button", ...otherProps }, ref) => (
    <button ref={ref} type={type} className={cn(iconButtonVariants({ size }), className)} {...otherProps} />
  ),
);
IconButton.displayName = "IconButton";
