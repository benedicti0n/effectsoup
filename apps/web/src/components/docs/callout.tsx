import type { JSX } from "react";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "warning" | "info";

const variantStyles: Record<CalloutVariant, string> = {
  note: "border-blue-400/30 bg-blue-50/50 text-blue-900",
  tip: "border-green-400/30 bg-green-50/50 text-green-900",
  warning: "border-amber-400/30 bg-amber-50/50 text-amber-900",
  info: "border-accent/20 bg-accent-muted/30 text-ink"
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
