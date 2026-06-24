"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Children, cloneElement, type ButtonHTMLAttributes, type JSX, type ReactElement, isValidElement } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-body text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink-primary text-on-primary rounded-pill px-6 py-3 hover:bg-cohere-black",
        secondary: "bg-transparent text-ink underline-offset-4 hover:underline px-0 py-2",
        outline: "bg-transparent text-ink border border-hairline rounded-pill px-5 py-2.5 hover:bg-soft-stone",
        ghost: "bg-transparent text-ink rounded-sm px-3 py-2 hover:bg-soft-stone",
        coral: "bg-coral text-on-primary rounded-pill px-5 py-2.5 hover:bg-coral-soft hover:text-ink"
      },
      size: {
        default: "h-10",
        sm: "h-8 text-xs px-4",
        lg: "h-12 text-base px-8"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, children, ...props }: ButtonProps): JSX.Element {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild && isValidElement(children)) {
    const child = Children.only(children) as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      ...props
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
