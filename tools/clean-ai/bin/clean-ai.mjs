#!/usr/bin/env node

// Removes low-value AI-generated comments from the codebase.
// Also replaces em dashes and curly quotes (common AI writing patterns).
//
// Patterns targeted:
//   JSX:  {/* Description */}
//   JS:   /* Description */
//   HTML: <!-- Description -->
//   Em dash: word — word → word - word
//   Double hyphen: word -- word → word - word
//   Curly quotes: "word" / "word" → "word"
//
// Skips:
//   - Comments that contain TODO, FIXME, HACK, NOTE, WARN
//
// Usage:
//   node remove-ai-comments.mjs                       # scan cwd
//   node remove-ai-comments.mjs ./src                 # scan specific dir
//   node remove-ai-comments.mjs --write               # apply changes
//   node remove-ai-comments.mjs ./src --write         # apply to specific dir

import { readFileSync, writeFileSync, lstatSync } from "node:fs";
import { resolve, relative } from "node:path";
import { glob } from "node:fs/promises";

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const positional = args.filter((a) => !a.startsWith("--"));
const ROOT = resolve(positional[0] || ".");

// Patterns that indicate a useful comment (skip removal)
const USEFUL = /\b(TODO|FIXME|HACK|NOTE|WARN|eslint-disable|oxlint-ignore|prettier-ignore|highlight-next-line)\b/i;

// Collect all target files (skip node_modules, dist, .git)
const SKIP_PATTERNS = [/[/\\]node_modules[/\\]/, /[/\\]dist[/\\]/, /[/\\]\.git[/\\]/];
const files = [];
for await (const f of glob(ROOT + "/**/*.{ts,tsx,js,jsx,astro,vue,svelte,md}")) {
  if (SKIP_PATTERNS.some((p) => p.test(f))) continue;
  files.push(f);
}

let totalRemoved = 0;
const changes = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  try {
    if (!lstatSync(file).isFile()) continue;
  } catch { continue; }
  let content = readFileSync(file, "utf-8");
  const original = content;

  // 1. Remove JSX comments: {/* ... */}
  content = content.replace(/^\s*\{\/\*\s*(.+?)\s*\*\/\}\s*$/gm, (match, text) => {
    if (USEFUL.test(text)) return match;
    totalRemoved++;
    return "";
  });

  // 2. Remove JS/CSS comments: /* ... */
  content = content.replace(/^\s*\/\*\s*(.+?)\s*\*\/\s*$/gm, (match, text) => {
    if (USEFUL.test(text)) return match;
    totalRemoved++;
    return "";
  });

  // 3. Remove HTML comments: <!-- ... -->
  content = content.replace(/^\s*<!--\s*(.+?)\s*-->\s*$/gm, (match, text) => {
    if (USEFUL.test(text)) return match;
    totalRemoved++;
    return "";
  });

  // 4. Replace em dashes with hyphens (AI overuse pattern)
  let dashCount = 0;
  content = content.replace(/ — /g, () => { dashCount++; return " - "; });
  totalRemoved += dashCount;

  // 5. Replace double hyphens used as em dashes
  let doubleDashCount = 0;
  content = content.replace(/ -- /g, () => { doubleDashCount++; return " - "; });
  totalRemoved += doubleDashCount;

  // 6. Replace curly quotes with straight quotes
  let quoteCount = 0;
  content = content.replace(/[\u201C\u201D]/g, () => { quoteCount++; return '"'; });
  content = content.replace(/[\u2018\u2019]/g, () => { quoteCount++; return "'"; });
  totalRemoved += quoteCount;

  // 7. Clean up resulting double-blank lines
  content = content.replace(/\n{3,}/g, "\n\n");

  if (content !== original) {
    changes.push({ file: rel, diff: countDiff(original, content) });
    if (WRITE) {
      writeFileSync(file, content, "utf-8");
    }
  }
}

function countDiff(before, after) {
  const removed = before.split("\n").length - after.split("\n").length;
  return `${removed} lines removed`;
}

console.log(`\n${WRITE ? "APPLIED" : "DRY RUN"} — ${totalRemoved} changes across ${changes.length} files\n`);
for (const c of changes) {
  console.log(`  ${WRITE ? "✓" : "○"} ${c.file} (${c.diff})`);
}
if (!WRITE && changes.length > 0) {
  console.log("\nRun with --write to apply changes.");
}
