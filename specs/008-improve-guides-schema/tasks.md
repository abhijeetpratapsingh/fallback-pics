# Tasks: Improve Implementation Guides and Schema

**Input**: Design documents from `/specs/008-improve-guides-schema/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/http-validation.md, quickstart.md

**Tests**: Include scriptable checks for public behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [X] T001 Read source story `specs/08-improve-implementation-guides-and-schema.md` and convert it into Spec Kit artifacts in `specs/008-improve-guides-schema/`
- [X] T002 Record clarify defaults in `specs/008-improve-guides-schema/spec.md` and `specs/008-improve-guides-schema/research.md`

## Phase 2: Foundational

- [X] T003 Define affected public URLs and expected behavior in `specs/008-improve-guides-schema/contracts/http-validation.md`
- [X] T004 Define validation commands in `specs/008-improve-guides-schema/quickstart.md`

## Phase 3: User Story 1 - Improve Implementation Guides and Schema (Priority: P1)

**Goal**: As a frontend developer, I want practical implementation guides with copy-paste code so that I can add fallback.pics to HTML, React, or Next.js projects quickly.

**Independent Test**: Build the three guide pages; verify complete code examples, infinite-loop handling, /api/v1 URLs, internal links, and HowTo JSON-LD.

### Implementation for User Story 1

- [X] T010 [US1] Update HTML onerror guide example and loop prevention
- [X] T011 [US1] Update React guide example and reusable component
- [X] T012 [US1] Update Next.js guide example and state guard
- [X] T013 [US1] Emit HowTo JSON-LD for guides
- [X] T014 [US1] Validate source HTML code visibility and links

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
