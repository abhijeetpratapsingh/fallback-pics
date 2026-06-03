# Tasks: Create Visual QA Workflow

**Input**: Design documents from `/specs/018-create-visual-qa-workflow/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/18-create-visual-qa-workflow.md` and convert it into Spec Kit artifacts in `specs/018-create-visual-qa-workflow/`
- [X] T002 Record clarify defaults in `specs/018-create-visual-qa-workflow/spec.md` and `specs/018-create-visual-qa-workflow/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/018-create-visual-qa-workflow/contracts/validation.md`
- [X] T004 Define validation commands in `specs/018-create-visual-qa-workflow/quickstart.md`

## Phase 3: User Story 1 - Create Visual QA Workflow (Priority: P1)

**Goal**: As a maintainer, I want a repeatable visual QA workflow so that homepage, docs, generator, and mobile-menu layout regressions are caught before release.

**Independent Test**: Run the documented visual QA command; confirm it covers route/viewport matrix, screenshots, overflow checks, console checks, and mobile menu state.

### Implementation for User Story 1

- [X] T010 [US1] Add visual QA Playwright workflow script
- [X] T011 [US1] Add package commands and README documentation
- [X] T012 [US1] Cover required routes, viewports, screenshots, overflow, console, and mobile menu open state
- [X] T013 [US1] Validate missing dependency message and command behavior

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T099 Run relevant build, script, Worker, or visual validation for this story scope
- [X] T100 Review generated artifacts to ensure no scheduling projections are included

## Dependencies & Execution Order

- Setup precedes validation-contract work.
- Validation-contract work precedes implementation.
- User Story 1 is independently testable after implementation tasks.

## Parallel Opportunities

- Documentation updates and script/layout implementation can run in parallel when touching different files.

## Implementation Strategy

Deliver the P1 story completely, validate the changed behavior, and keep changes scoped to the story's affected files.
