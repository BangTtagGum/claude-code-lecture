// type: "mc"(객관식) | "ox". answer: 객관식은 보기 인덱스, OX는 true(O)/false(X)
export const QUESTIONS = [
  {
    type: "mc",
    q: "Claude가 작업을 처리하는 3단계를 순서대로 바르게 나열한 것은?",
    options: [
      "작업 수행 → 컨텍스트 수집 → 결과 검증",
      "컨텍스트 수집 → 작업 수행 → 결과 검증",
      "계획 수립 → 작업 수행 → 커밋",
      "컨텍스트 수집 → 결과 검증 → 작업 수행"
    ],
    answer: 1,
    explain: "컨텍스트 수집 → 작업 수행 → 결과 검증 순서로 돌아가요. 루프 도중에 <code>ESC</code>로 끊고 컨텍스트를 더 줄 수 있어요."
  },
  {
    type: "mc",
    q: "이전 시점으로 되돌리면서 <b>파일 변경까지 함께 복원</b>하는 명령어는?",
    options: ["<code>claude --continue</code>", "<code>claude --resume</code>", "<code>/rewind</code>", "<code>/branch</code>"],
    answer: 2,
    explain: "<code>/rewind</code>는 체크포인트 복원이에요. <code>--continue</code>는 최근 세션 잇기, <code>--resume</code>은 세션 목록에서 고르기, <code>/branch</code>는 같은 시점에서 분기하기예요."
  },
  {
    type: "ox",
    q: "각 세션은 독립적으로 시작되고, 세션 간 지속성은 MEMORY.md와 CLAUDE.md가 책임진다.",
    answer: true,
    explain: "맞아요. 세션끼리는 대화를 공유하지 않아서, 이어져야 하는 정보는 MEMORY.md와 CLAUDE.md에 둬야 해요."
  },
  {
    type: "mc",
    q: "7가지 확장 계층 중 <b>“격리된 컨텍스트 도우미”</b> 역할을 하는 것은?",
    options: ["Skills", "Subagents", "Agent Teams", "Plugins"],
    answer: 1,
    explain: "Subagents는 메인 대화와 분리된 컨텍스트에서 일해요. Skills는 재사용 워크플로우, Agent Teams는 자체 조율하는 다중 인스턴스, Plugins는 전부를 묶은 패키지예요."
  },
  {
    type: "mc",
    q: "컨텍스트 구성 요소 중 <b>컨텍스트가 커지는 가장 큰 이유</b>는?",
    options: ["시스템 프롬프트", "CLAUDE.md", "MCP 도구 정의", "대화 기록"],
    answer: 3,
    explain: "대화 기록은 매 턴 쌓여서 세션이 길어질수록 폭증해요. 그래서 한 세션에 하나의 작업만 하는 습관이 중요해요."
  },
  {
    type: "mc",
    q: "Skills는 세션 시작 시점에 무엇만 컨텍스트에 로드할까?",
    options: [
      "SKILL.md 본문 전체",
      "name과 description",
      "지원 파일(스크립트 등)까지 전부",
      "아무것도 로드하지 않음"
    ],
    answer: 1,
    explain: "평소엔 name과 description만 올라와 있다가, 자동 매칭되거나 <code>/skill-name</code>으로 호출될 때 본문과 지원 파일을 lazy load해요."
  },
  {
    type: "ox",
    q: "컨텍스트는 많이 채울수록 맥락이 풍부해져서 응답 품질이 계속 좋아진다.",
    answer: false,
    explain: "반대예요(Context Rot). 30% 정도가 적정하고, 50%를 넘으면 품질이 확 떨어지고 환각이 늘어요."
  },
  {
    type: "mc",
    q: "개인 환경변수나 작업 메모를 적고 <code>.gitignore</code>에 등록하는 파일은?",
    options: [
      "<code>~/.claude/CLAUDE.md</code>",
      "<code>프로젝트루트/CLAUDE.md</code>",
      "<code>프로젝트루트/CLAUDE.local.md</code>",
      "<code>하위폴더/CLAUDE.md</code>"
    ],
    answer: 2,
    explain: "CLAUDE.local.md는 개인 메모용이라 커밋하지 않아요. 프로젝트루트/CLAUDE.md는 팀과 공유하는 표준이에요."
  },
  {
    type: "ox",
    q: "MEMORY.md에는 기억할 내용이 전부 들어 있지 않고, 관련 md 파일의 인덱스만 들어 있다.",
    answer: true,
    explain: "맞아요. MEMORY.md는 인덱스 역할만 하고, 실제 내용은 인덱스가 가리키는 개별 파일에 있어요."
  },
  {
    type: "mc",
    q: "모든 권한을 줘서 <b>데이터를 지울 수도 있는 위험한</b> Permission Mode는?",
    options: ["Plan Mode", "Auto Mode", "Accept Edits", "Bypass"],
    answer: 3,
    explain: "Bypass는 권한 확인을 전부 건너뛰어서 위험해요. 노트에서는 Plan Mode로 시작하는 걸 가장 추천했어요."
  },
  {
    type: "ox",
    q: "CLAUDE.md에 “X 하지 마세요”라고 적으면 Hook처럼 강제로 막을 수 있다.",
    answer: false,
    explain: "CLAUDE.md는 ‘요청’이고 Hook은 ‘강제’예요. 절대 하면 안 되는 일은 Hook으로 막아야 해요."
  },
  {
    type: "mc",
    q: "<b>도구 호출 직전</b>에 실행되는 Hook 이벤트는?",
    options: ["PreToolUse", "PostToolUse", "Notification", "Stop"],
    answer: 0,
    explain: "PreToolUse는 도구 호출 직전, PostToolUse는 직후, Notification은 사용자 응답을 기다릴 때, Stop은 에이전트 턴이 끝날 때 실행돼요."
  },
  {
    type: "mc",
    q: "<b>내 컴퓨터가 꺼져 있어도</b> 정기적으로 돌아가야 하는 자동화(예: 정기 PR 리뷰)에 맞는 것은?",
    options: ["Hook", "/loop", "Routine (클라우드)", "CLAUDE.md"],
    answer: 2,
    explain: "이벤트마다 → Hook, 작업 중 → /loop, 머신이 꺼져도 → Routine이에요. Routine은 Anthropic 클라우드에서 cron, API, GitHub 트리거로 실행돼요."
  },
  {
    type: "ox",
    q: "<code>--bare</code> 플래그는 hooks, skills, plugins, MCP, CLAUDE.md 자동 로드를 건너뛰어서 재현성을 보장해준다.",
    answer: true,
    explain: "맞아요. 시작이 빠르고 매번 같은 조건에서 돌아서 파이프라인(비대화형)에 잘 맞아요."
  },
  {
    type: "mc",
    q: "Claude가 틀리고 → 고치고 → 또 틀리는 <b>‘반복 수정’</b> 실패 패턴에 빠졌을 때 권장되는 대처는?",
    options: [
      "될 때까지 같은 세션에서 수정 지시를 반복한다",
      "CLAUDE.md에 규칙을 계속 추가한다",
      "/clear 하고 더 나은 프롬프트로 새로 시작한다",
      "effort를 max로 올리고 계속 진행한다"
    ],
    answer: 2,
    explain: "실패한 시도가 쌓인 컨텍스트는 오히려 방해가 돼요. 비우고 더 구체적인 프롬프트로 다시 시작하는 게 빨라요."
  }
];
