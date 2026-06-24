"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, JSX } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink placeholder:text-muted",
        "focus-visible:border-form-focus focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-form-focus",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: InputHTMLAttributes<HTMLTextAreaElement>): JSX.Element {
  return (
    <textarea
      className={cn(
        "min-h-[80px] w-full rounded-xs border border-hairline bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted",
        "focus-visible:border-form-focus focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-form-focus",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
