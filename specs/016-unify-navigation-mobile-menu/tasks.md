# Tasks: Unify Navigation and Mobile Menu

**Input**: Design documents from `/specs/016-unify-navigation-mobile-menu/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/16-unify-navigation-and-mobile-menu.md` and convert it into Spec Kit artifacts in `specs/016-unify-navigation-mobile-menu/`
- [X] T002 Record clarify defaults in `specs/016-unify-navigation-mobile-menu/spec.md` and `specs/016-unify-navigation-mobile-menu/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/016-unify-navigation-mobile-menu/contracts/validation.md`
- [X] T004 Define validation commands in `specs/016-unify-navigation-mobile-menu/quickstart.md`

## Phase 3: User Story 1 - Unify Navigation and Mobile Menu (Priority: P1)

**Goal**: As a visitor moving between product and documentation pages, I want navigation to feel consistent so that I can find the generator, docs, API reference, and GitHub quickly.

**Independent Test**: Open mobile and desktop navigation on key routes; confirm consistent labels, compact mobile hierarchy, accessible menu state, and no overflow.

### Implementation for User Story 1

- [X] T010 [US1] Align landing and primary navigation labels around Generator, Docs, API, Features, GitHub, and Status
- [X] T011 [US1] Refine mobile menu CTA hierarchy and open/close label state
- [X] T012 [US1] Validate keyboard-accessible header links and no overflow

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
