# Tasks: Refine Mobile Homepage First Fold

**Input**: Design documents from `/specs/013-refine-mobile-homepage-first-fold/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/13-refine-mobile-homepage-first-fold.md` and convert it into Spec Kit artifacts in `specs/013-refine-mobile-homepage-first-fold/`
- [X] T002 Record clarify defaults in `specs/013-refine-mobile-homepage-first-fold/spec.md` and `specs/013-refine-mobile-homepage-first-fold/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/013-refine-mobile-homepage-first-fold/contracts/validation.md`
- [X] T004 Define validation commands in `specs/013-refine-mobile-homepage-first-fold/quickstart.md`

## Phase 3: User Story 1 - Refine Mobile Homepage First Fold (Priority: P1)

**Goal**: As a mobile visitor, I want to see the promise and the live builder quickly so that I understand what fallback.pics does before scrolling.

**Independent Test**: View `/` at 390x844 and 1440x1000; confirm builder affordance is visible on mobile, CTAs are compact, and desktop layout remains balanced.

### Implementation for User Story 1

- [X] T010 [US1] Compact mobile hero spacing and CTA grouping
- [X] T011 [US1] Convert popular links into compact horizontal chips
- [X] T012 [US1] Reduce builder card spacing on mobile while preserving desktop layout
- [X] T013 [US1] Validate first-fold builder visibility and overflow

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
