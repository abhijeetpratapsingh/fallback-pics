# Tasks: Improve Trust Signals

**Input**: Design documents from `/specs/010-improve-trust-signals/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/http-validation.md, quickstart.md

**Tests**: Include scriptable checks for public behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [X] T001 Read source story `specs/10-improve-trust-signals.md` and convert it into Spec Kit artifacts in `specs/010-improve-trust-signals/`
- [X] T002 Record clarify defaults in `specs/010-improve-trust-signals/spec.md` and `specs/010-improve-trust-signals/research.md`

## Phase 2: Foundational

- [X] T003 Define affected public URLs and expected behavior in `specs/010-improve-trust-signals/contracts/http-validation.md`
- [X] T004 Define validation commands in `specs/010-improve-trust-signals/quickstart.md`

## Phase 3: User Story 1 - Improve Trust Signals (Priority: P1)

**Goal**: As a developer evaluating fallback.pics for production use, I want clear technical trust details so that I can understand caching, content types, privacy posture, and failure behavior before adopting it.

**Independent Test**: Build docs/API/privacy/homepage; verify header documentation, cache behavior, privacy wording, API errors, security headers, claim safety, and trust links.

### Implementation for User Story 1

- [X] T010 [US1] Document API response headers and error behavior
- [X] T011 [US1] Update docs trust section and privacy wording
- [X] T012 [US1] Reword unsupported homepage claims
- [X] T013 [US1] Add trust links to Docs/API/Status/Privacy/GitHub
- [X] T014 [US1] Validate docs against Worker headers and build output

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T099 Run relevant web build, Worker typecheck, Worker tests, or source checks for this story scope
- [X] T100 Review generated artifacts to ensure no scheduling projections are included

## Dependencies & Execution Order

- Setup precedes foundational validation.
- Foundational public URL contract precedes implementation.
- User Story 1 is independently testable after the listed implementation tasks.

## Parallel Opportunities

- Source content updates and validation-contract drafting can run in parallel when they touch different files.
- Final source checks can run after all implementation tasks are complete.

## Implementation Strategy

Deliver the P1 story completely, validate the changed public behavior, and keep changes scoped to the story's affected files.
