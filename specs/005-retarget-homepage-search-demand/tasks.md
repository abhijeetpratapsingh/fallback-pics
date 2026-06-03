# Tasks: Retarget Homepage Search Demand

**Input**: Design documents from `/specs/005-retarget-homepage-search-demand/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/http-validation.md, quickstart.md

**Tests**: Include scriptable checks for public behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [X] T001 Read source story `specs/05-retarget-homepage-for-search-demand.md` and convert it into Spec Kit artifacts in `specs/005-retarget-homepage-search-demand/`
- [X] T002 Record clarify defaults in `specs/005-retarget-homepage-search-demand/spec.md` and `specs/005-retarget-homepage-search-demand/research.md`

## Phase 2: Foundational

- [X] T003 Define affected public URLs and expected behavior in `specs/005-retarget-homepage-search-demand/contracts/http-validation.md`
- [X] T004 Define validation commands in `specs/005-retarget-homepage-search-demand/quickstart.md`

## Phase 3: User Story 1 - Retarget Homepage Search Demand (Priority: P1)

**Goal**: As a developer searching for a placeholder image API, I want the fallback.pics homepage to clearly state that it generates placeholder images and fallback images so that I understand the product immediately.

**Independent Test**: Build the homepage and inspect title, description, H1/hero copy, internal links, and structured data for target positioning and claim safety.

### Implementation for User Story 1

- [X] T010 [US1] Update homepage metadata and structured data
- [X] T011 [US1] Update hero/supporting copy while preserving brand promise
- [X] T012 [US1] Add visible internal links to target pages
- [X] T013 [US1] Reword unsupported latency/SLA claims as posture
- [X] T014 [US1] Run rendered-source validation

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
