# Tasks: Polish Live Builder Interactions

**Input**: Design documents from `/specs/017-polish-live-builder-interactions/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/17-polish-live-builder-interactions.md` and convert it into Spec Kit artifacts in `specs/017-polish-live-builder-interactions/`
- [X] T002 Record clarify defaults in `specs/017-polish-live-builder-interactions/spec.md` and `specs/017-polish-live-builder-interactions/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/017-polish-live-builder-interactions/contracts/validation.md`
- [X] T004 Define validation commands in `specs/017-polish-live-builder-interactions/quickstart.md`

## Phase 3: User Story 1 - Polish Live Builder Interactions (Priority: P1)

**Goal**: As a developer testing fallback image options, I want the builder controls and copy feedback to be clear so that I can quickly create a URL and trust that it copied correctly.

**Independent Test**: Interact with preset, dimension, text, and copy controls; verify selected state, stable preview, copy feedback, keyboard access, and no layout shift.

### Implementation for User Story 1

- [X] T010 [US1] Add clearer preset visual states and compact labels
- [X] T011 [US1] Stabilize copy button width and success feedback
- [X] T012 [US1] Tighten mobile input/preview spacing
- [X] T013 [US1] Validate builder interactions and no layout shift

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
