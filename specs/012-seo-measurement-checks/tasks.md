# Tasks: Add SEO Measurement Checks

**Input**: Design documents from `/specs/012-seo-measurement-checks/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/validation.md, quickstart.md

**Tests**: Include scriptable or visual checks for public behavior changes.

## Phase 1: Setup

- [X] T001 Read source story `specs/12-add-seo-measurement-checks.md` and convert it into Spec Kit artifacts in `specs/012-seo-measurement-checks/`
- [X] T002 Record clarify defaults in `specs/012-seo-measurement-checks/spec.md` and `specs/012-seo-measurement-checks/research.md`

## Phase 2: Foundational

- [X] T003 Define affected routes, files, viewports, or docs in `specs/012-seo-measurement-checks/contracts/validation.md`
- [X] T004 Define validation commands in `specs/012-seo-measurement-checks/quickstart.md`

## Phase 3: User Story 1 - Add SEO Measurement Checks (Priority: P1)

**Goal**: As a maintainer, I want repeatable SEO checks so that routing, sitemap, canonical, and image-response behavior stays correct after changes.

**Independent Test**: Run the documented SEO smoke command against a configured base URL and verify pass/fail output for route, header, sitemap, and canonical checks.

### Implementation for User Story 1

- [X] T010 [US1] Add dependency-free SEO smoke script in apps/web/scripts/seo-smoke-check.mjs
- [X] T011 [US1] Add package commands for SEO checks
- [X] T012 [US1] Document command and environment variables in README
- [X] T013 [US1] Validate script output identifies failing route conditions

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
