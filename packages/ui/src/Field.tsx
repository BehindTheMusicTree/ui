import * as React from "react";

import { cn } from "./class-name";
import { FieldError } from "./FieldError";
import { Label } from "./Label";

export interface FieldProps {
  label: React.ReactNode;
  /** Control id; generated when omitted. */
  id?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  /** A single form control (Input, Select, Textarea…); it receives id, aria-describedby and aria-invalid. */
  children: React.ReactElement<Record<string, unknown>>;
}

export function Field({ label, id, hint, error, className, children }: FieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? (children.props.id as string | undefined) ?? generatedId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [children.props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={controlId}>{label}</Label>
      {React.cloneElement(children, {
        id: controlId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : children.props["aria-invalid"],
      })}
      {hint ? (
        <p id={hintId} className="text-sm text-[var(--color-text-muted)]">
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
