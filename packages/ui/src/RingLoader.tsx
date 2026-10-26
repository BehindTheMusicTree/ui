"use client";

interface RingLoaderProps {
  size?: number;
  className?: string;
}

export default function RingLoader({ size = 24, className = "" }: RingLoaderProps) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <div
        className="animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
