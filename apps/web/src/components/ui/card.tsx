"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, JSX } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-lg border border-card-border bg-canvas p-6 transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return <h3 className={cn("font-display text-xl font-medium tracking-tight text-ink", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>): JSX.Element {
  return <p className={cn("mt-1 text-sm text-body-muted", className)} {...props} />;
}
