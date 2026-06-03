# Tasks: Fix Soft 404 Routing

**Input**: Design documents from `/specs/001-fix-soft-404-routing/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/http-validation.md, quickstart.md

**Tests**: Include scriptable checks for public behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [X] T001 Read source story `specs/01-fix-soft-404-routing.md` and convert it into Spec Kit artifacts in `specs/001-fix-soft-404-routing/`
- [X] T002 Record clarify defaults in `specs/001-fix-soft-404-routing/spec.md` and `specs/001-fix-soft-404-routing/research.md`

## Phase 2: Foundational

- [X] T003 Define affected public URLs and expected behavior in `specs/001-fix-soft-404-routing/contracts/http-validation.md`
- [X] T004 Define validation commands in `specs/001-fix-soft-404-routing/quickstart.md`

## Phase 3: User Story 1 - Fix Soft 404 Routing (Priority: P1)

**Goal**: As a search crawler or user, I want invalid URLs to return a clear not-found response so that only real fallback.pics pages are indexed and trusted.

**Independent Test**: Request an invalid web path and a valid page/API route; verify 404/noindex for the invalid page and 200 image/page behavior for valid routes.

### Implementation for User Story 1

- [X] T010 [US1] Add 404 page and noindex metadata support in apps/web/src/pages/404.astro and apps/web/src/layouts/Layout.astro
- [X] T011 [US1] Verify SEO catch-all canonical behavior in apps/web/src/pages/[...slug].astro
- [X] T012 [US1] Validate Worker API invalid-path errors and valid image responses
- [X] T013 [US1] Run web build and source checks for 404/canonical output

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
