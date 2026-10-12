# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 저장소 성격

"실리콘밸리 엔지니어의 Claude Code" 강의 실습 워크북을 fork한 개인 저장소다. 내용은 네 종류다.

- `Part*/…/exercises/templates/`: 학습자가 직접 채우는 빈 양식. 이 안의 `CLAUDE.md`, `.agent-rules.md`는 **실습 양식이지 이 저장소에 대한 지침이 아니다.**
- `part01-chap01 내용 정리.md`: 학습자의 강의 노트
- 독립된 Node 토이 프로젝트 두 개: `note-search/`, `part01-chap01_실습/`
- Claude Code 확장 실습물: `.claude/`(이 저장소에서 바로 동작), `plugins/`(로컬 marketplace)

루트에는 `package.json`이 없다. 명령은 각 프로젝트 폴더에서 실행한다.

## 명령어

### part01-chap01_실습 (Ch01 복습 퀴즈)
```bash
npm run lint      # eslint src
npm run build     # esbuild → dist/quiz.js (IIFE, 전역 이름 Quiz)
npm test          # vitest run
npm run check     # lint → build → test (커밋 전 훅이 이걸 실행)
npx vitest run src/quiz.test.js           # 파일 하나
npx vitest run -t "오답 다시 풀기"          # 테스트 이름으로
```
`quiz.html`은 `dist/quiz.js`를 불러오므로, 브라우저로 열기 전에 `npm run build`가 필요하다.

### note-search (마크다운 fuzzy 검색 CLI)
```bash
npm test                                  # vitest run (src/**/*.test.ts)
npm run build                             # tsc → dist/
npx vitest run src/lib/search.test.ts
```
`npm run cli`는 `src/cli/index.ts`를 가리키지만 아직 그 파일이 없다. 현재는 `src/lib/search.ts`만 있다.

## 항상 켜져 있는 훅 (`.claude/settings.json`)

- **tdd-guard** (PreToolUse: Edit|Write|MultiEdit): 테스트 파일이 같은 폴더나 `__tests__/`에 없으면 `.js/.jsx/.ts/.tsx` 구현 파일 쓰기를 거부한다. `tests/` 같은 별도 폴더는 인식하지 못한다. **새 구현 파일은 `foo.test.js`를 먼저 같은 폴더에 만든 뒤 작성한다.** 설정 파일(`*.config.*`), md, json, 테스트 파일은 통과한다.
- **pre-commit-check** (PreToolUse: Bash): 명령에 `git … commit`이 있고 `part01-chap01_실습/`에 변경이 있으면 그 폴더에서 `npm run check`를 돌린다. 실패하면 exit 2로 커밋을 막는다. 문자열 매칭이라 명령 문자열 안에 `git`과 `commit`이 함께 있으면 커밋이 아니어도 발동한다.

## part01-chap01_실습 구조

여러 파일을 봐야 보이는 연결:

- `src/questions.js`(데이터) → `src/quiz.js`(DOM 없는 순수 로직, `createSession`) → `src/main.js`(`mount(doc)`로 DOM 연결)
- `file://`로 열면 ES 모듈 스크립트가 막힌다. 그래서 esbuild IIFE 번들을 만들고 `quiz.html`에서 `Quiz.mount(document)`를 호출한다. 빌드 방식을 바꾸면 이 호출도 같이 바꿔야 한다.
- `src/main.test.js`는 jsdom 환경에서 `../quiz.html?raw`로 **실제 `quiz.html`의 `<body>`를 불러와** 화면 흐름을 테스트한다. `quiz.html`의 요소 id(`count`, `next`, `retry` 등)를 바꾸면 `main.js`와 이 테스트가 함께 깨진다.
- 문항 `q`, `options`, `explain`은 `<code>`, `<b>` 마크업을 포함하고 `innerHTML`로 렌더링된다. 신뢰된 하드코딩 데이터라는 전제다.
- 문항은 `part01-chap01 내용 정리.md`에서 출제했다. 노트 밖 지식으로 정답을 정하지 않는다.

## Claude Code 확장물

- **스킬** `.claude/skills/`: `code-review-checklist`(읽기 전용 4관점 리뷰), `md-formatter`, `junit-test-writer`
- **에이전트** `.claude/agents/`
  - `code-review-agent`: 읽기 전용이고 `code-review-checklist`를 미리 로드한다.
  - `unit-test-writer`
- "코드 리뷰해줘"는 전역 플러그인 스킬 `vizend-agent-hub:code-review`와 트리거가 겹친다. 이 저장소 리뷰에는 `code-review-checklist` 또는 `code-review-agent`를 이름으로 지정한다.
- 서브에이전트 결과는 메인에서 다시 확인한다. `code-review-agent`가 존재하지 않는 `.gitignore` 줄을 근거로 보고한 적이 있다.
- `plugins/tdd-toolkit`은 `.claude/`의 tdd-guard와 unit-test-writer를 플러그인으로 패키징한 것이다. 로컬 marketplace 이름은 `lecture-local`(`plugins/.claude-plugin/marketplace.json`)이다. `tdd-guard.sh`는 두 곳이 같고, `unit-test-writer.md`는 내용이 서로 다르다. 한쪽을 고치면 다른 쪽도 맞출지 확인한다.

## 커밋

기존 커밋 메시지는 `Part1/Ch01: <한국어 요약>` 형식이다.
