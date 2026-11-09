"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./class-name";
import { ICON_BUTTON_BASE } from "./icon-button-base";

const iconButtonVariants = cva(
  ICON_BUTTON_BASE,
  {
    variants: {
      size: {
        sm: "h-6 w-6 [@media(pointer:coarse)]:h-[var(--layout-touch-target)] [@media(pointer:coarse)]:w-[var(--layout-touch-target)]",
        md: "h-8 w-8 [@media(pointer:coarse)]:h-[var(--layout-touch-target)] [@media(pointer:coarse)]:w-[var(--layout-touch-target)]",
        lg: "h-10 w-10 [@media(pointer:coarse)]:h-[var(--layout-touch-target)] [@media(pointer:coarse)]:w-[var(--layout-touch-target)]",
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
