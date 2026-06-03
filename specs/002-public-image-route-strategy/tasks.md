# Tasks: Resolve Public Image Route Strategy

**Input**: Design documents from `/specs/002-public-image-route-strategy/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/http-validation.md, quickstart.md

**Tests**: Include scriptable checks for public behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [X] T001 Read source story `specs/02-resolve-public-image-route-strategy.md` and convert it into Spec Kit artifacts in `specs/002-public-image-route-strategy/`
- [X] T002 Record clarify defaults in `specs/002-public-image-route-strategy/spec.md` and `specs/002-public-image-route-strategy/research.md`

## Phase 2: Foundational

- [X] T003 Define affected public URLs and expected behavior in `specs/002-public-image-route-strategy/contracts/http-validation.md`
- [X] T004 Define validation commands in `specs/002-public-image-route-strategy/quickstart.md`

## Phase 3: User Story 1 - Resolve Public Image Route Strategy (Priority: P1)

**Goal**: As a developer using fallback.pics, I want every documented image URL to return an image response so that examples can be copied directly into real projects.

**Independent Test**: Inspect docs, demos, sitemap, and examples; every documented generated image URL uses `/api/v1/...` and returns an image response.

### Implementation for User Story 1

- [X] T010 [US1] Set `/api/v1` as route strategy in spec and docs
- [X] T011 [US1] Remove root image URLs from sitemap
- [X] T012 [US1] Ensure homepage builder displays API-prefixed URLs
- [X] T013 [US1] Validate examples and API error documentation

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
