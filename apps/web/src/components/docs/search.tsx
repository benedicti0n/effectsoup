"use client";

import { useState, useCallback, useEffect, useRef, type JSX } from "react";
import Link from "next/link";
import { searchDocs, type SearchResult } from "@/lib/docs/search";
import { cn } from "@/lib/utils";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setResults(searchDocs(query));
    setSelected(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && results[selected]) {
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, selected, onClose]
  );

  if (!open) return <></>;

  const typeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "effect": return "Effect";
      case "api": return "API";
      default: return "Page";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/60 pt-[20vh]" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-sm border border-hairline bg-canvas shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Search documentation"
      >
        <div className="flex items-center border-b border-hairline px-4">
          <svg className="h-4 w-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search docs, effects, API..."
            className="flex-1 bg-transparent px-3 py-3.5 text-sm text-ink placeholder-muted outline-none"
          />
          <kbd className="hidden shrink-0 rounded-sm border border-hairline px-1.5 py-0.5 text-[11px] text-muted sm:inline">
            ESC
          </kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
            {results.map((result, i) => (
              <li key={`${result.slug}-${i}`} role="option" aria-selected={i === selected}>
                <Link
                  href={`/${result.slug}`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                    i === selected ? "bg-soft-stone" : "hover:bg-soft-stone"
                  )}
                >
                  <span className="shrink-0 rounded-sm border border-hairline px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                    {typeLabel(result.type)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink">{result.title}</div>
                    <div className="truncate text-xs text-body-muted">{result.description}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-body-muted">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
