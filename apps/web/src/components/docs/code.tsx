"use client";

import { useState, type JSX } from "react";
import { cn } from "@/lib/utils";

type CodeProps = {
  code: string;
  language?: string;
  className?: string;
};

export function CodeBlock({ code, language, className }: CodeProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group relative", className)}>
      {language && (
        <div className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-widest text-muted/50 select-none">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-sm px-2 py-1 text-[11px] font-medium text-muted opacity-0 transition-opacity hover:bg-ink/10 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-sm border border-hairline bg-ink-primary p-4 pt-8 text-sm leading-relaxed text-on-dark">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <code className="rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary">
      {children}
    </code>
  );
}
