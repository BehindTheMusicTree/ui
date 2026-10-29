"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./class-name";

const buttonVariants = cva(
  "flex items-center justify-center rounded font-medium [@media(pointer:coarse)]:min-h-[var(--layout-touch-target)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/80",
        outline:
          "border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]",
        danger: "bg-[var(--color-red-600)] text-white hover:bg-[var(--color-red-700)]",
        secondary:
          "bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-300)]",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-2 py-1 text-sm",
        lg: "px-6 py-3 text-lg",
        icon: "p-2 [@media(pointer:coarse)]:min-w-[var(--layout-touch-target)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...otherProps }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...otherProps} />
  ),
);
Button.displayName = "Button";
