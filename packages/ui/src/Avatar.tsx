"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./class-name";

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-green-600)] font-semibold uppercase text-white",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-9 w-9 text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export function getInitials(label: string): string {
  const trimmed = label.trim();
  const base = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;
  const words = base.split(/[\s._-]+/).filter(Boolean);
  if (words.length === 0) return trimmed.charAt(0).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children">, VariantProps<typeof avatarVariants> {
  label: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(({ label, size, className, ...otherProps }, ref) => (
  <span ref={ref} title={label} className={cn(avatarVariants({ size }), className)} {...otherProps}>
    <span aria-hidden="true">{getInitials(label)}</span>
  </span>
));
Avatar.displayName = "Avatar";
