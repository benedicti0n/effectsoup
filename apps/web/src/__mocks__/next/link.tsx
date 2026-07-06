import type { JSX } from "react";

export default function MockLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}): JSX.Element {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}
