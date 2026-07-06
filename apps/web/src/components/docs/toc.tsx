"use client";

import { useEffect, useState, type JSX } from "react";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function useTableOfContents(contentSelector: string): TocItem[] {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const article = document.querySelector(contentSelector);
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];
    headings.forEach((h) => {
      if (!h.id) {
        h.id = h.textContent?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ?? "";
      }
      tocItems.push({
        id: h.id,
        text: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3
      });
    });
    setItems(tocItems);
  }, [contentSelector]);

  return items;
}

export function TableOfContents({ items }: { items: TocItem[] }): JSX.Element {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return <></>;

  return (
    <nav className="sticky top-24 w-56 shrink-0" aria-label="Table of contents">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        On this page
      </h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block transition-colors ${
                item.level === 3 ? "pl-4" : ""
              } ${
                activeId === item.id
                  ? "font-medium text-ink-primary"
                  : "text-body-muted hover:text-ink"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
