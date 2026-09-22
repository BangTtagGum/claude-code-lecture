# Markdown formatting conventions

Concrete rules and before/after examples for the `md-formatter` skill. These show the *shape* of
a clean result — adapt to the actual document. The golden rule still applies: **format only,
never change the content.**

## Contents
- [Normalization rules](#normalization-rules)
- [Before / after: plain title → heading](#before--after-plain-title--heading)
- [Before / after: comparison prose → table](#before--after-comparison-prose--table)
- [Before / after: run-on memo → nested list](#before--after-run-on-memo--nested-list)
- [Table of contents](#table-of-contents)
- [Do not](#do-not)

## Normalization rules

| Item | Rule | Example |
|------|------|---------|
| Heading count | One `#` H1 per document | `# part01 내용 정리` |
| Heading levels | No level skips; promote bare titles | `memory` → `## memory` |
| Heading spacing | Blank line above and below | — |
| List marker | `-` for unordered (convert `*`/`+`) | `* item` → `- item` |
| List nesting | 2-space indent per level | `  - subitem` |
| Ordered list | Only when order is meaningful | steps, rankings |
| Emphasis | `**bold**`, used consistently | `*중요*` → `**중요**` |
| Inline code | Backticks for commands/paths/identifiers | `` `~/.claude/settings.json` `` |
| Code fence | Add inferred language tag | ` ```bash `, ` ```json ` |
| Table padding | Consistent single-space padding (not pixel-perfect) | `\| a \| b \|` |
| Section divider | `---` on its own line, blank line around it | — |

## Before / after: plain title → heading

A lone line that's clearly a section title but has no markup.

**Before**
```
memory
memory는 MEMORY.md에 기억해달라고 하는 내용들이 저장된다.
프로젝트 단위는 ~/.claude/projects 하위에 프로젝트의 /memory에 존재한다.
```

**After**
```markdown
## memory

- memory는 `MEMORY.md`에 기억해달라고 하는 내용들이 저장된다.
- 프로젝트 단위는 `~/.claude/projects` 하위에 프로젝트의 `/memory`에 존재한다.
```

Note: the title became `##`, paths became inline code, lines became a list. **The words are
identical.**

## Before / after: comparison prose → table

Several items described by the same attributes, written as loose lines.

**Before**
```
Hook
이벤트(밀리초)
실행 : 로컬 세션
트리거: 도구 호출, 메시지
머신: 세션 살아야

/loop
세션 안 (분~시간)
실행: 로컬 세션
트리거 : 인터벌, 동적, loop.md
머신: 세션 살아야

/routine
영구 (시간~월)
실행: Anthropic 클라우드
트리거: cron, API, github
머신: 꺼져도 ok
```

**After**
```markdown
| 단위 | 시간 척도 | 실행 | 트리거 | 머신 |
|------|-----------|------|--------|------|
| Hook | 이벤트(밀리초) | 로컬 세션 | 도구 호출, 메시지 | 세션 살아야 |
| `/loop` | 세션 안 (분~시간) | 로컬 세션 | 인터벌, 동적, loop.md | 세션 살아야 |
| `/routine` | 영구 (시간~월) | Anthropic 클라우드 | cron, API, github | 꺼져도 ok |
```

Every cell value comes straight from the source lines — nothing added, nothing dropped.

## Before / after: run-on memo → nested list

A flat memo with implicit hierarchy.

**Before**
```
클로드 잘 사용하는 패턴들
1. 검증 미리 알리기
어떤 함수를 작성할 때 테스트 케이스를 주고 통과되는지 확인을 요청
검증 기준이 확실한 작업이면 품질 좋은 결과가 나올 확률이 높다
```

**After**
```markdown
## 클로드 잘 사용하는 패턴들

1. **검증 미리 알리기**
   - 어떤 함수를 작성할 때 테스트 케이스를 주고 통과되는지 확인을 요청
   - 검증 기준이 확실한 작업이면 품질 좋은 결과가 나올 확률이 높다
```

The numbered item is preserved as ordered (it's an enumerated pattern list); the supporting lines
become nested bullets under it.

## Table of contents

For documents with 5+ headings, place a TOC under the H1:

```markdown
# 문서 제목

## 목차
- [첫 번째 섹션](#첫-번째-섹션)
- [두 번째 섹션](#두-번째-섹션)
  - [하위 섹션](#하위-섹션)
```

Anchor links are the heading text, lowercased, spaces → hyphens, punctuation stripped. For Korean
headings, keep the Korean text in the anchor (`#첫-번째-섹션`). If a TOC already exists, rebuild it
from the current headings instead of leaving it out of sync.

## Do not

- **Do not change meaning.** Reword, summarize, "clarify" — all off limits.
- **Do not add or delete information.** No new bullets of your own, no dropping "redundant" lines.
- **Do not translate.** Korean stays Korean. Don't anglicize terms.
- **Do not over-edit tidy regions.** If a section was already well-formatted, leave it. A minimal
  diff is the goal.
- **Do not guess at code fence languages.** If unsure, leave the fence bare.
- **Do not fix ambiguous typos.** Only fix typos where the correction is unmistakable and doesn't
  change meaning.
