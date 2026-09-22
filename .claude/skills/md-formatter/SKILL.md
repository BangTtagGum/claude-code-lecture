---
name: md-formatter
description: >-
  Tidy and beautify Markdown files — normalize heading levels, unify list markers and
  emphasis, align tables, add or refresh a table of contents, and restructure unformatted
  plain-text notes into proper Markdown (headings, lists, tables). Edits the file in place.
  Use whenever the user asks to clean up, format, organize, or "보기 좋게 정리" / "예쁘게 정리"
  / "마크다운 정리" / "md 정리해줘" a .md file, or hands you a messy note to organize. Korean
  lecture notes are the primary target. This is a formatting task only: preserve the original
  meaning, wording, and language exactly — change the presentation, never the content.
---

# Markdown Formatter (정리)

You make Markdown files **readable**. A lecture note that started clean often decays as it
grows — the top is tidy headings and tables, but the bottom turns into a wall of plain-text
memos with no markup. Your job is to give the whole file consistent, scannable structure
**without changing what it says**.

This is a *formatting* skill, not an editing skill. The single rule that overrides everything:
**preserve the content.** Same information, same order, same language, same terminology. You
reshape headings, lists, tables, and spacing — you never summarize, add, delete, translate, or
"improve" the substance. If you find yourself wanting to rewrite a sentence for clarity, stop:
that's not this skill's job.

By default you **edit the file in place** so the change shows up in `git diff`. The user reviews
the diff; that's the safety net.

## Step 0 — Read the whole file first, then plan

Don't format blind. Read the entire file and sort it into two kinds of regions:

- **Already-tidy regions** — proper headings, working tables, fenced code blocks. *Leave these
  almost untouched.* A small diff is a feature: it tells the user you only changed what needed
  changing. Resist the urge to re-flow paragraphs that were already fine.
- **Broken regions** — plain-text section titles with no `#`, list-like lines with no `-`,
  comparison data written as prose, inconsistent emphasis. *These are the real work.*

Then decide the document's heading skeleton: one `#` title, logical `##` sections, `###` for
their subsections. Everything else hangs off that.

## Step 1 — Normalize structure

- **Headings** — exactly one `# H1` per document. Never skip a level (no `##` jumping to
  `####`). Promote bare plain-text section titles (a lone line like `memory` or `자동화 시간 단위`
  that's clearly a heading) to the right `##`/`###`. Leave a blank line above and below each
  heading.
- **Lists** — unordered lists use `-` (convert stray `*`/`+`). Nest with 2-space indents. Use
  ordered lists (`1.`) only when the order is genuinely meaningful (steps, ranked items),
  otherwise `-`.
- **Emphasis** — pick `**bold**` for strong emphasis and use it consistently; don't leave a mix
  of `*` and `**` doing the same job. Inline code (commands, paths, file names, identifiers)
  goes in backticks.
- **Code blocks** — fence them and add a language tag inferred from the content (` ```bash `,
  ` ```json `, ` ```java `, …). If it's plain output or a path with no clear language, leave the
  fence bare. Don't tag a language you're not sure of.

## Step 2 — Turn comparison prose into tables

When a region lists several items that share the same attributes — and reads like a comparison
written as paragraphs — make it a pipe table. The classic case in these notes is a Hook / loop /
routine block describing each one's "실행 / 트리거 / 머신 / 용도" as loose lines; that is a table
trying to escape. One row per item, one column per attribute.

Pad columns with spaces for readability. Korean characters make perfect monospace alignment
impossible, so don't chase pixel-perfect columns — **consistent single-space padding inside each
cell** is the goal, not visually equal width.

Only tabularize when the data really is parallel. Don't force unrelated lines into a table.

## Step 3 — Restructure unformatted notes

This is where broken plain-text memos become Markdown. Convert a run-on memo into a heading plus
a list, exactly as written:

- Same information, same order. You are adding `#`, `-`, `**`, and table pipes — **not** rewriting.
- Do **not** condense two lines into one, drop a "redundant" line, or add a clarifying line of
  your own. If the original repeats itself, the formatted version repeats itself.
- Obvious typos that don't change meaning may be fixed (e.g. `존재하낟` → `존재한다`). Anything where
  the fix is a guess about intent — leave it alone.

When in doubt about whether something is content or formatting, treat it as content and preserve it.

## Step 4 — Table of contents

If the document has **5 or more headings**, add or refresh a TOC right under the H1. Link each
entry to its heading. If a TOC already exists, regenerate it to match the current headings rather
than leaving it stale. Short documents don't need one — skip it.

## Step 5 — Self-check, then save and report

Before finishing, review your own diff as if it were someone else's PR:

- **Content preserved?** Scan the `git diff`. Every `-` line should reappear as a `+` line with
  only formatting changed — no real information silently dropped or invented. This is the check
  that matters most.
- **Tidy regions left alone?** The parts that were already clean should show little or no diff.
- **Idempotent?** If you ran the skill again, would it want to change much? It shouldn't.

Save in place. Then tell the user in a sentence or two what you did, and explicitly call out any
region where you changed the *structure* significantly (prose → table, flat memo → nested list)
so they know where to look in the diff. If you noticed something that looks like a genuine
content error (a contradiction, a broken reference), mention it — but don't fix it as part of
formatting.

For concrete normalization rules and before/after examples, see `references/conventions.md`.
