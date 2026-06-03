# tdd-toolkit (plugin)

테스트 우선 개발을 강제하는 Claude Code 플러그인. 두 컴포넌트로 구성됩니다.

| 컴포넌트 | 종류 | 역할 |
|---|---|---|
| **TDD Guard** | PreToolUse hook | 대응하는 테스트 파일이 없으면 `.ts/.tsx/.js/.jsx` 구현 파일의 `Edit`/`Write`/`MultiEdit`를 거부 |
| **unit-test-writer** | agent | 프로젝트 컨벤션에 맞춰 happy path 위주의 간결한 유닛 테스트 작성 (엣지케이스 최대 3개) |

## 구조

```
tdd-toolkit/
├── .claude-plugin/plugin.json
├── hooks/
│   ├── hooks.json          # PreToolUse: Edit|Write|MultiEdit → tdd-guard.sh
│   └── tdd-guard.sh        # ${CLAUDE_PLUGIN_ROOT} 기준 실행
└── agents/
    └── unit-test-writer.md
```

## 설치 (로컬 marketplace)

```bash
# repo 루트에서
/plugin marketplace add ./plugins
/plugin install tdd-toolkit@lecture-local
```

또는 한 세션만 띄워 테스트:

```bash
claude --plugin-dir ./plugins/tdd-toolkit
```

## 동작 확인

1. 테스트 파일 없이 `src/foo.ts`를 `Write` → 훅이 거부해야 함:
   > `TDD GUARD: 'foo'에 대한 테스트 파일이 존재하지 않습니다...`
2. `src/foo.test.ts`를 먼저 만든 뒤 다시 `src/foo.ts` → 통과.
3. "foo 테스트 작성해줘" → `unit-test-writer` 에이전트 트리거.

## TDD Guard가 건너뛰는 파일

설정/문서/타입/Next.js 라우트 파일(`.json`, `.md`, `.css`, `*.config.*`, `types/*`, `page.tsx`, `layout.tsx` 등)과 테스트 파일 자체는 검사하지 않습니다. 자세한 규칙은 `hooks/tdd-guard.sh` 참고.
