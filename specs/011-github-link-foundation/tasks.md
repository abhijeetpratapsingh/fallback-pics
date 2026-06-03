# Tasks: Improve GitHub and Link Foundation

**Input**: Design documents from `/specs/011-github-link-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/11-improve-github-and-link-foundation.md` and convert it into Spec Kit artifacts in `specs/011-github-link-foundation/`
- [X] T002 Record clarify defaults in `specs/011-github-link-foundation/spec.md` and `specs/011-github-link-foundation/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/011-github-link-foundation/contracts/validation.md`
- [X] T004 Define validation commands in `specs/011-github-link-foundation/quickstart.md`

## Phase 3: User Story 1 - Improve GitHub and Link Foundation (Priority: P1)

**Goal**: As a developer discovering fallback.pics through GitHub or technical content, I want clear examples, topics, and documentation links so that I can evaluate and reference the project accurately.

**Independent Test**: Inspect README and contributing guidance for positioning, examples, canonical links, topic suggestions, and quality boundaries.

### Implementation for User Story 1

- [X] T010 [US1] Update README positioning, examples, links, repository topics, and link-quality guidance
- [X] T011 [US1] Update CONTRIBUTING reference guidance and external reference boundaries
- [X] T012 [US1] Validate README examples use `/api/v1/...` and canonical links

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
