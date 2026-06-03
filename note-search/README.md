# note-search

마크다운 메모를 fuzzy 검색하는 작은 CLI 토이 앱. (강의 실습용)

검색 로직은 `src/lib`에 라이브러리로, 얇은 CLI 래퍼는 `src/cli`에 둡니다.

## 개발

```bash
npm install
npm test          # vitest run
npm run cli -- search <키워드> [경로]
```

## 구조

```
src/
  lib/        # 순수 검색 로직 (단위 테스트 대상)
  cli/        # 얇은 CLI 진입점
```
