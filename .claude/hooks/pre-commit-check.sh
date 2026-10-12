#!/usr/bin/env bash
# Pre-commit Check Hook — PreToolUse[Bash]
# Claude가 git commit을 실행하기 직전에 part01-chap01_실습의 lint·build·test(npm run check)를 돌린다.
# 실패하면 exit 2로 커밋을 막고, stderr의 실패 로그를 Claude에게 넘겨 고치게 한다.
# 실습 폴더에 변경이 없는 커밋은 검사 없이 통과시킨다.

set -u

INPUT=$(cat)

if [ -z "$INPUT" ]; then
  exit 0
fi

IS_COMMIT=$(
  python3 - "$INPUT" <<'PY'
import json
import re
import sys

try:
    command = json.loads(sys.argv[1]).get("tool_input", {}).get("command", "")
except Exception:
    sys.exit(0)

# "git commit", "git -C path commit", "git add . && git commit" 모두 잡는다
if isinstance(command, str) and re.search(r"\bgit\b[^;&|\n]*\bcommit\b", command):
    print("1")
PY
)

if [ "$IS_COMMIT" != "1" ]; then
  exit 0
fi

PROJECT_ROOT=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
TARGET_REL="part01-chap01_실습"
TARGET="$PROJECT_ROOT/$TARGET_REL"

if [ -z "$(git -C "$PROJECT_ROOT" status --porcelain -- "$TARGET_REL" 2>/dev/null)" ]; then
  exit 0
fi

block() {
  echo "PRE-COMMIT CHECK: $1" >&2
  exit 2
}

command -v npm >/dev/null 2>&1 || block "npm을 찾을 수 없어 lint·build·test를 실행하지 못했습니다. Node.js 설치와 PATH를 확인하세요."
[ -d "$TARGET/node_modules" ] || block "$TARGET_REL 에 node_modules가 없습니다. 먼저 'cd $TARGET_REL && npm install'을 실행하세요."

if OUTPUT=$(cd "$TARGET" && npm run check 2>&1); then
  exit 0
fi

{
  echo "PRE-COMMIT CHECK: $TARGET_REL 의 lint·build·test 중 실패한 단계가 있어 커밋을 막았습니다."
  echo "아래 로그를 보고 원인을 고친 뒤 다시 커밋하세요. (재현: cd $TARGET_REL && npm run check)"
  echo "----- npm run check (마지막 40줄) -----"
  printf '%s\n' "$OUTPUT" | tail -n 40
} >&2
exit 2
