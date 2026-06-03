# Tasks: Fix Content Page Sidebar and Code Containment

**Input**: Design documents from `/specs/014-content-page-sidebar-code-containment/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/14-fix-content-page-sidebar-code-containment.md` and convert it into Spec Kit artifacts in `specs/014-content-page-sidebar-code-containment/`
- [X] T002 Record clarify defaults in `specs/014-content-page-sidebar-code-containment/spec.md` and `specs/014-content-page-sidebar-code-containment/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/014-content-page-sidebar-code-containment/contracts/validation.md`
- [X] T004 Define validation commands in `specs/014-content-page-sidebar-code-containment/quickstart.md`

## Phase 3: User Story 1 - Fix Content Page Sidebar and Code Containment (Priority: P1)

**Goal**: As a developer reading a content page, I want examples and sidebars to stay visually separated so that code snippets are easy to scan and copy.

**Independent Test**: View representative content pages at desktop and mobile widths; confirm article/code surfaces never render under sidebar cards.

### Implementation for User Story 1

- [X] T010 [US1] Constrain shared content grid and article/sidebar widths
- [X] T011 [US1] Strengthen code block overflow behavior
- [X] T012 [US1] Preserve single-column mobile content layout
- [X] T013 [US1] Validate representative content pages for overlap and overflow

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
