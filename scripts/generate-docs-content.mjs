import fs from "fs";
import path from "path";

const DOCS_DIR = "effectsoup-docs-rebuild/docs";
const OUT = "apps/web/src/lib/docs/content.tsx";

const pageMap = {
  "getting-started/introduction.md": "docs/getting-started/introduction",
  "getting-started/installation.md": "docs/getting-started/installation",
  "getting-started/quickstart.md": "docs/getting-started/quickstart",
  "guides/upload-and-crop.md": "docs/guides/upload-and-crop",
  "guides/effect-controls.md": "docs/guides/effect-controls",
  "guides/exporting.md": "docs/guides/exporting",
  "guides/creating-an-effect.md": "docs/guides/creating-an-effect",
  "guides/testing-effects.md": "docs/guides/testing-effects",
  "guides/performance.md": "docs/guides/performance",
  "reference/api/core.md": "docs/api/core",
  "reference/api/presets.md": "docs/api/presets",
  "reference/api/worker.md": "docs/api/worker",
  "reference/api/meta-package.md": "docs/api/meta-package",
  "reference/editor-overview.md": "docs/reference/editor-overview",
  "reference/effects-catalog.md": "docs/reference/effects-catalog",
  "concepts/architecture.md": "docs/guides/architecture",
  "concepts/troubleshooting.md": "docs/troubleshooting",
  "concepts/faq.md": "docs/faq",
  "README.md": "docs",
};

const sectionLabels = {
  "docs": { title: "Documentation", desc: "EffectSoup documentation: getting started, guides, API reference, and concepts." },
  "docs/getting-started/introduction": { title: "What is EffectSoup?", desc: "Browser-based non-AI image effects studio" },
  "docs/getting-started/installation": { title: "Installation", desc: "npm packages, requirements, and setup" },
  "docs/getting-started/quickstart": { title: "Quickstart", desc: "First 5 minutes in the playground" },
  "docs/guides/upload-and-crop": { title: "Upload & Crop", desc: "Image loading, cropping, and zoom" },
  "docs/guides/effect-controls": { title: "Effect Controls", desc: "Intensity slider and advanced controls" },
  "docs/guides/exporting": { title: "Exporting", desc: "Format, quality, and resolution options" },
  "docs/guides/creating-an-effect": { title: "Creating an Effect", desc: "Anatomy of an EffectPreset" },
  "docs/guides/testing-effects": { title: "Testing Effects", desc: "Test conventions and best practices" },
  "docs/guides/performance": { title: "Performance", desc: "Worker, preview, and optimization tips" },
  "docs/api/core": { title: "@effectsoup/core", desc: "PixelBuffer, image primitives, and utilities" },
  "docs/api/presets": { title: "@effectsoup/presets", desc: "EffectPreset, pipeline, and lookup" },
  "docs/api/worker": { title: "@effectsoup/worker", desc: "Web Worker client and rendering" },
  "docs/api/meta-package": { title: "@effectsoup/effectsoup", desc: "All-in-one meta-package" },
  "docs/reference/editor-overview": { title: "Editor Overview", desc: "UI layout, history, undo, compare, mobile" },
  "docs/reference/effects-catalog": { title: "Effects Catalog", desc: "All 25 presets across 7 categories" },
  "docs/guides/architecture": { title: "Architecture", desc: "Monorepo structure and rendering flow" },
  "docs/troubleshooting": { title: "Troubleshooting", desc: "Common issues and solutions" },
  "docs/faq": { title: "FAQ", desc: "Frequently asked questions" },
};

function jsxStringEscape(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/\${/g, "\\${");
}

const INLINE_CODE_CLS = "rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary";

function resolveLink(href, sourceFile) {
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return href;
  const sourceDir = path.dirname("docs/" + sourceFile).split("/");
  const parts = href.replace(/\.md$/, "").split("/");
  const resolved = [...sourceDir];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }
  const resolvedFile = resolved.join("/");
  const candidate = resolvedFile.replace(/^docs\//, "");
  for (const [fpath, slug] of Object.entries(pageMap)) {
    if (fpath.replace(/\.md$/, "") === candidate) return "/" + slug;
  }
  return "/" + candidate;
}

// Convert markdown inline formatting to HTML (not JSX)
function inlineToHtml(text, sourceFile) {
  return text
    .replace(/`([^`]+)`/g, `<code class="${INLINE_CODE_CLS}">$1</code>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, url) => {
      const href = resolveLink(url, sourceFile);
      return `<a href="${href}" class="text-action-blue underline">${t}</a>`;
    });
}

function htmlAttrEsc(str) {
  return str.replace(/"/g, "&quot;");
}

function mdToJsx(md, sourceFile) {
  const lines = md.split("\n");
  const parts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (/^#\s/.test(line)) { i++; continue; }

    const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const cls = level === 2
        ? 'className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4"'
        : level === 3
          ? 'className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3"'
          : 'className="scroll-mt-20 font-medium text-ink-primary mt-6 mb-2"';
      const inner = inlineToHtml(text, sourceFile);
      if (level === 2) parts.push(`<h2 id="${id}" ${cls} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(inner)} }} />`);
      else if (level === 3) parts.push(`<h3 id="${id}" ${cls} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(inner)} }} />`);
      else parts.push(`<h4 id="${id}" ${cls} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(inner)} }} />`);
      i++; continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]); i++;
      }
      i++;
      const code = codeLines.join("\n");
      const escaped = jsxStringEscape(code);
      parts.push(`<CodeBlock code={'${escaped}'} language="${lang}" className="my-4" />`);
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(inlineToHtml(lines[i].slice(2), sourceFile)); i++;
      }
      const inner = quoteLines.join("<br/>");
      parts.push(`<Callout variant="info"><span dangerouslySetInnerHTML={{ __html: ${JSON.stringify(inner)} }} /></Callout>`);
      continue;
    }

    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[-*]\s+(.+)$/);
        if (!m) break;
        items.push(inlineToHtml(m[1], sourceFile)); i++;
      }
      const lis = items.map((li) => `<li dangerouslySetInnerHTML={{ __html: ${JSON.stringify(li)} }} />`).join("\n");
      parts.push(`<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">\n${lis}\n</ul>`);
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\d+\.\s+(.+)$/);
        if (!m) break;
        items.push(inlineToHtml(m[1], sourceFile)); i++;
      }
      const lis = items.map((li) => `<li dangerouslySetInnerHTML={{ __html: ${JSON.stringify(li)} }} />`).join("\n");
      parts.push(`<ol className="mt-2 space-y-1 text-sm text-body-muted list-decimal list-inside">\n${lis}\n</ol>`);
      continue;
    }

    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (lines[i].match(/^\|[\s:-]+\|/)) { i++; continue; }
        const cells = lines[i].split("|").slice(1, -1).map((c) => c.trim());
        rows.push(cells); i++;
      }
      if (rows.length > 0) {
        const thead = rows[0].map((c) => `<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(inlineToHtml(c, sourceFile))} }} />`).join("\n");
        const tbody = rows.slice(1).map((row) =>
          `<tr className="border-b border-hairline/50">\n${row.map((c) => `<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(inlineToHtml(c, sourceFile))} }} />`).join("\n")}\n</tr>`
        ).join("\n");
        parts.push(`<div className="my-6 overflow-x-auto">\n<table className="w-full text-sm">\n<thead><tr className="border-b border-hairline">\n${thead}\n</tr></thead>\n<tbody>\n${tbody}\n</tbody>\n</table>\n</div>`);
      }
      continue;
    }

    if (/^---+\s*$/.test(line)) { parts.push('<hr className="my-8 border-hairline" />'); i++; continue; }
    if (line.trim() === "") { i++; continue; }

    const paraLines = [];
    while (i < lines.length) {
      const l = lines[i];
      if (l.trim() === "" || /^#/.test(l) || l.startsWith("```") || l.startsWith("> ") || l.startsWith("|") || /^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l) || /^---+\s*$/.test(l)) break;
      paraLines.push(l); i++;
    }
    if (paraLines.length > 0) {
      const html = inlineToHtml(paraLines.join(" "), sourceFile);
      parts.push(`<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(html)} }} />`);
    }
  }
  return parts.join("\n\n");
}

const imports = `import type { JSX } from "react";
import { CodeBlock } from "@/components/docs/code";
import { Callout } from "@/components/docs/callout";

type PageContent = {
  title: string;
  description: string;
  component: () => JSX.Element;
};
`;

const entries = [];
for (const [filepath, slug] of Object.entries(pageMap)) {
  const fullPath = path.join(DOCS_DIR, filepath);
  if (!fs.existsSync(fullPath)) {
    console.error("Missing:", fullPath);
    continue;
  }
  const md = fs.readFileSync(fullPath, "utf-8");
  const jsx = mdToJsx(md, filepath);
  const info = sectionLabels[slug];
  entries.push(`
  "${slug}": {
    title: ${JSON.stringify(info.title)},
    description: ${JSON.stringify(info.desc)},
    component: () => (
      <>
        ${jsx}
      </>
    )
  },`);
}

const aliases = `
const aliases: Record<string, string> = {
  "docs/effects": "docs/reference/effects-catalog",
  "docs/getting-started/playground": "docs/getting-started/quickstart",
  "docs/getting-started/packages": "docs/getting-started/installation",
  "docs/playground": "docs/reference/editor-overview",
};

export function getPageContent(slug: string): PageContent | undefined {
  const target = aliases[slug] ?? slug;
  return content[target];
}`;

fs.writeFileSync(OUT, imports + "\nconst content: Record<string, PageContent> = {" + entries.join("") + "\n};\n" + aliases + "\n", "utf-8");
console.log("Generated", OUT, "with", Object.keys(pageMap).length, "pages");
