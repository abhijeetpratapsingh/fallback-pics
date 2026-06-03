# Tasks: Refine Mobile Content Page Readability

**Input**: Design documents from `/specs/015-mobile-content-page-readability/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/15-refine-mobile-content-page-readability.md` and convert it into Spec Kit artifacts in `specs/015-mobile-content-page-readability/`
- [X] T002 Record clarify defaults in `specs/015-mobile-content-page-readability/spec.md` and `specs/015-mobile-content-page-readability/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/015-mobile-content-page-readability/contracts/validation.md`
- [X] T004 Define validation commands in `specs/015-mobile-content-page-readability/quickstart.md`

## Phase 3: User Story 1 - Refine Mobile Content Page Readability (Priority: P1)

**Goal**: As a mobile developer, I want content pages to be easy to scan so that I can reach the relevant example or documentation section quickly.

**Independent Test**: View `/placeholder-image-generator/`, `/placeholder-image-api/`, and `/docs/` at 390x844 and desktop; confirm mobile H1s are readable and first practical content appears sooner.

### Implementation for User Story 1

- [X] T010 [US1] Reduce mobile content H1 scale and hero spacing
- [X] T011 [US1] Constrain preview card size on mobile
- [X] T012 [US1] Preserve desktop content typography
- [X] T013 [US1] Validate mobile readability and no clipping

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
