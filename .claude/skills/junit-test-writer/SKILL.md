---
name: junit-test-writer
description: >-
  Write thorough JUnit 5 unit tests for Java service / business-logic classes, covering the happy
  path plus edge cases (boundaries, nulls, empty collections, exceptions, and interaction
  verification). Uses Mockito to mock dependencies and AssertJ for fluent assertions, matching the
  project's existing test conventions. Use this skill whenever the user asks to write, add, generate,
  or "fill in" unit tests for Java code — a service, a method, a class — even if they only say "테스트
  작성해줘" / "write tests" without naming JUnit or Mockito. Also trigger when the user has just written
  a Java service method and wants it covered, or asks to improve test coverage / add missing edge cases
  for an existing Java class. Default to writing the test code only; do not run the test suite unless
  the user explicitly asks.
---

# JUnit Test Writer (thorough)

You write unit tests for Java service and business-logic classes. The goal is **confidence**: after
your tests pass, a reviewer should believe the method behaves correctly not just for the obvious input,
but for the inputs that break things in production — the empty list, the null argument, the value that
sits exactly on a boundary, the dependency that throws.

This is deliberately a *thorough* style. You are not aiming for the minimum tests that prove the method
runs; you are aiming to pin down its contract. But thorough does not mean bloated — every test must
verify a distinct, meaningful behavior. A test that re-checks something an earlier test already proved
is noise, and noise is what makes test suites get deleted.

The default mode is **write only**: produce the test file(s). Do not run the suite unless the user asks.
This keeps the loop fast and avoids surprising the user with build output or failures from unrelated code.

## Step 1 — Read the project before writing

Tests that don't match the surrounding code get rejected in review no matter how correct they are. Spend
a moment learning the conventions so your output looks like it was always there:

- **Stack & versions** — confirm JUnit 5 (`org.junit.jupiter`), Mockito, and the assertion library by
  checking `build.gradle` / `pom.xml` and a couple of existing `*Test.java` files. The defaults below
  assume **JUnit 5 + Mockito + AssertJ**, but if the project clearly uses something else (Hamcrest, plain
  JUnit assertions, Spock), follow the project. Never assume — look.
- **Conventions** — test class naming (`FooServiceTest`), file location (`src/test/java/...` mirroring the
  package), display-name style (`@DisplayName`, nested `@Nested` classes, given/when/then naming), and how
  existing tests build fixtures (builders, factory methods, `@BeforeEach` setup).
- **The class under test** — its constructor dependencies (these become your `@Mock`s), each public
  method's signature, what it returns, what it throws, and any side effects (calls to repositories,
  publishers, clocks). You can only test a contract you understand.

If you genuinely can't determine the framework, ask briefly rather than guessing. But prefer reading one
more file over asking.

## Step 2 — Find the edge cases systematically

The hard part of thorough testing isn't writing assertions — it's *noticing* what to test. Don't rely on
inspiration; walk the method and let its structure tell you. For each public method, ask:

- **Branches** — every `if`, `switch`, ternary, and early return is a behavior. Each needs a test that
  takes that path.
- **Boundaries** — wherever a number, size, or date is compared (`>`, `>=`, `==`, `<`), test the value
  *on* the boundary and one step on each side. Off-by-one bugs live exactly here.
- **Collections & strings** — empty, single-element, and many-element cases often differ. If the method
  loops or filters, an empty input and an all-filtered-out input are distinct behaviors.
- **Null & absent** — null arguments, `Optional.empty()` from a dependency, a repository returning `null`
  vs. an empty list. Test what the contract says should happen (a thrown exception is a behavior worth
  asserting, not an accident).
- **Exceptions** — when a mocked dependency throws, does the method propagate, wrap, swallow, or
  translate it? Each of those is a contract you should pin down.
- **Interactions** — for a method whose job is partly to *call* something (save, publish, notify),
  asserting the return value isn't enough. Verify the dependency was called with the right arguments,
  and the right number of times, using `verify(...)`.

You won't write a test for every combination — use judgment about which paths carry real risk. But you
should be able to look at the method afterward and not find an untested branch that matters.

## Step 3 — Write the tests

Structure each test as **given / when / then** so it reads as a small story: set up the inputs and mock
behavior, invoke the method once, then assert. Keep these habits:

- **One behavior per test.** The test name states the behavior in plain language. A reader should know
  what broke from the name alone, without reading the body.
- **Mock only true dependencies** — the things passed into the constructor. Don't mock the class under
  test or value objects you can just construct. Stub only the calls a given test actually exercises;
  over-stubbing makes tests brittle and hides what's really being verified.
- **Assert with AssertJ** (`assertThat(...)`) when the project uses it — it reads well and its failure
  messages are specific. For exceptions, prefer `assertThatThrownBy(...)` / `assertThatExceptionOfType(...)`
  so you can also assert the message or type, not just that *something* threw.
- **Group related cases** with `@Nested` classes when a method has several distinct scenarios — it keeps
  a thorough suite navigable instead of a flat wall of methods. Use `@ParameterizedTest` when the same
  behavior holds across a range of inputs (several boundary values, several invalid arguments); it
  expresses "this holds for all of these" far better than copy-pasted methods.
- **Minimal, readable fixtures.** Reuse the project's builders/factories. Inline only the data each test
  needs, so the test's intent isn't buried under setup.

See `references/patterns.md` for concrete code templates — a `@Mock`/`@InjectMocks` service test skeleton,
exception assertions, parameterized boundary tests, and interaction verification. Read it when you want a
copy-paste-ready starting point.

## Step 4 — Self-check before finishing

Look over the file as if reviewing someone else's PR:

- Does every public method of interest have its happy path *and* its meaningful edge cases covered?
- Would each test actually compile and run — imports present, mock types correct, no reference to fields
  that don't exist?
- Is anything redundant — two tests proving the same thing? Cut one.
- Do the test names read as behaviors, so the suite doubles as documentation?

Then hand back the test file(s). Keep your explanation to a sentence or two: what you covered and any
edge case you deliberately left out and why. Don't run the suite unless asked — but if you noticed the
code under test looks buggy (a boundary that seems wrong, an unhandled null), say so plainly. A test
writer who spots the bug is more valuable than one who silently encodes it.
