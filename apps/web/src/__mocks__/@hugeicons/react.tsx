import type { JSX } from "react";

export function HugeiconsIcon({
  className
}: {
  icon: unknown;
  className?: string;
}): JSX.Element {
  return <span className={className} data-testid="hugeicon" />;
}
