import type { JSX } from "react";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "warning" | "info";

const variantStyles: Record<CalloutVariant, string> = {
  note: "border-l-action-blue/40 bg-pale-blue text-ink-primary",
  tip: "border-l-deep-green/40 bg-pale-green text-ink-primary",
  warning: "border-l-coral/40 bg-coral/5 text-ink-primary",
  info: "border-l-muted/40 bg-soft-stone/50 text-ink-primary"
};

export function Callout({
  variant = "note",
  title,
  children
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className={cn(
        "my-6 rounded-sm border-l-4 px-4 py-3 text-sm leading-relaxed",
        variantStyles[variant]
      )}
    >
      {title && <strong className="mb-1 block font-semibold">{title}</strong>}
      <div>{children}</div>
    </div>
  );
}
