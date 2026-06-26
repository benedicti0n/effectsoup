"use client";

import type { JSX } from "react";

export function IconButton({
  onClick,
  label,
  icon,
  disabled = false
}: {
  onClick: () => void;
  label: string;
  icon: JSX.Element;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-hairline bg-canvas px-2.5 text-sm font-medium text-ink hover:bg-soft-stone disabled:opacity-50 sm:px-3"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
