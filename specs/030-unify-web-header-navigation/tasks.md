# Tasks: Unify Web Header Navigation

**Input**: Design documents from `/specs/030-unify-web-header-navigation/`

**Prerequisites**: plan.md, spec.md, research.md, contracts/validation.md, quickstart.md

**Tests**: Header behavior is validated by source search, web build, and browser interaction checks.

## Phase 1: Setup

- [x] T001 [P] Audit current header variants and nav arrays in `apps/web/src/navigation.ts`, `apps/web/src/components/SiteHeader.astro`, and layouts/pages.
- [x] T002 [P] Confirm current mobile menu behavior and active-state matching in `SiteHeader.astro`.

## Phase 2: Implementation

- [x] T003 Replace `primaryNav` and `landingNav` with one canonical `siteNav` in `apps/web/src/navigation.ts`.
- [x] T004 Update `apps/web/src/components/SiteHeader.astro` to render desktop and mobile from `siteNav`.
- [x] T005 Add Generator href resolution for homepage `#hero-demo` and non-home `/placeholder-image-generator/`.
- [x] T006 Remove landing/docs/default header variant behavior from `SiteHeader.astro`.
- [x] T007 Remove header variant props/usages from `apps/web/src/layouts/Layout.astro`, `DocsLayout.astro`, `ContentLayout.astro`, `index.astro`, and `[...slug].astro`.
- [x] T008 Add story 30 to `specs/README.md`.

## Phase 3: Validation

- [x] T009 Run source search for removed header variant names.
- [x] T010 Run `pnpm --filter @fallback-pics/web build`.
- [x] T011 Run browser QA for desktop/mobile nav parity, active states, external links, Generator hrefs, and mobile menu close behavior.
- [x] T012 Confirm no footer, API, Worker, typography, or color-token changes beyond header needs.

## Phase 4: Completion

- [x] T013 Mark completed tasks in `specs/030-unify-web-header-navigation/tasks.md`.

## Dependencies

- Phase 2 depends on Phase 1.
- Phase 3 depends on implementation.
