# Tasks: Align Canonical and Sitemap URLs

**Input**: Design documents from `/specs/003-align-canonical-sitemap/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/http-validation.md, quickstart.md

**Tests**: Include scriptable checks for public behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [X] T001 Read source story `specs/03-align-canonical-and-sitemap-urls.md` and convert it into Spec Kit artifacts in `specs/003-align-canonical-sitemap/`
- [X] T002 Record clarify defaults in `specs/003-align-canonical-sitemap/spec.md` and `specs/003-align-canonical-sitemap/research.md`

## Phase 2: Foundational

- [X] T003 Define affected public URLs and expected behavior in `specs/003-align-canonical-sitemap/contracts/http-validation.md`
- [X] T004 Define validation commands in `specs/003-align-canonical-sitemap/quickstart.md`

## Phase 3: User Story 1 - Align Canonical and Sitemap URLs (Priority: P1)

**Goal**: As a search engine, I want sitemap URLs and canonical tags to resolve to the final preferred URL so fallback.pics pages consolidate ranking signals cleanly.

**Independent Test**: Build the web app and inspect sitemap, canonical tags, og:url, and JSON-LD URLs for matching trailing-slash SEO page URLs.

### Implementation for User Story 1

- [X] T010 [US1] Update SEO catch-all canonical generation to trailing slash
- [X] T011 [US1] Update sitemap loc values to final canonical URLs
- [X] T012 [US1] Remove misleading image endpoint sitemap loc values
- [X] T013 [US1] Validate rendered canonical, og:url, JSON-LD url, and sitemap locs

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
