# Tasks: Migrate Web to Roboto Slab Font

**Input**: Design documents from `/specs/028-migrate-web-to-roboto-slab-font/`

**Prerequisites**: plan.md, spec.md, research.md, contracts/validation.md, quickstart.md

**Tests**: This is a visual/static web typography migration. Validation uses source searches, web build, and browser visual checks rather than new unit tests because there is no new public API behavior.

**Organization**: Tasks are grouped by user story and must be completed in order where they touch the same files.

## Phase 1: Setup

**Purpose**: Confirm the current font surface and validation commands.

- [X] T001 [P] Audit current web font references in `apps/web` and `theme.css` using `rg`.
- [X] T002 [P] Confirm `_headers` CSP allows Google Fonts CSS and font files in `apps/web/public/_headers`.

---

## Phase 2: Foundational

**Purpose**: Establish the single source of truth before component updates.

- [X] T003 Define `--font-web`, `--font-sans`, and `--font-mono` as Roboto Slab aliases in `theme.css`.
- [X] T004 Update `apps/web/src/layouts/Layout.astro` to load one Roboto Slab Google Fonts stylesheet with `display=swap`, and apply the shared font variable globally.
- [X] T005 Update `apps/web/tailwind.config.mjs` so Tailwind `sans` and `mono` both consume `var(--font-web)`.

**Checkpoint**: The shared font source is available to CSS and Tailwind.

---

## Phase 3: User Story 1 - Consistent Web Typography (Priority: P1)

**Goal**: Remove named legacy font stacks from global and component CSS.

**Independent Test**: Search for legacy font names in `apps/web` and `theme.css`.

- [X] T006 [US1] Update `apps/web/src/styles/modern-ui.css` body and code styles to use the shared Roboto Slab variables.
- [X] T007 [US1] Update `apps/web/src/components/CodeBlock.astro` code label and block CSS to use the shared Roboto Slab variables.
- [X] T008 [US1] Verify no legacy font names remain in web UI source.

**Checkpoint**: Web UI CSS uses Roboto Slab only.

---

## Phase 4: User Story 2 - Single Font Source of Truth (Priority: P2)

**Goal**: Ensure component utilities and generated web previews consume the shared font decision.

**Independent Test**: Tailwind `font-mono` resolves to the shared font; generated SVG preview text names Roboto Slab.

- [X] T009 [US2] Update web-generated SVG preview font-family values in `apps/web/src/components/EnterpriseLanding.tsx` to Roboto Slab.
- [X] T010 [US2] Confirm `font-mono` usages in `apps/web/src/components/EnterpriseLanding.tsx` and `apps/web/src/components/LiveDemoEnhanced.tsx` can remain because Tailwind maps `mono` to `var(--font-web)`.

**Checkpoint**: Components and web previews resolve to one font source.

---

## Phase 5: User Story 3 - Optimized Compatible Loading (Priority: P3)

**Goal**: Validate loading, CSP, and page readability.

**Independent Test**: Build and render representative pages without font/CSP errors or mobile overflow.

- [X] T011 [US3] Confirm the Google Fonts request includes only used Roboto Slab weights and `display=swap`.
- [X] T012 [US3] Run `pnpm --filter @fallback-pics/web build`.
- [X] T013 [US3] Run visual/browser checks for `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, and `/404` at desktop and mobile widths.
- [X] T014 [US3] Confirm no document-level mobile horizontal overflow and no browser console CSP font errors.

---

## Phase 6: Polish & Cross-Cutting

- [X] T015 Mark all completed tasks in `specs/028-migrate-web-to-roboto-slab-font/tasks.md`.
- [X] T016 Review git diff for unintended Worker or route behavior changes.

## Dependencies & Execution Order

- Phase 1 can run in parallel.
- Phase 2 must complete before component and visual validation.
- User Story 1 must complete before final source-search validation.
- User Story 2 depends on Tailwind font mapping from Phase 2.
- User Story 3 depends on all implementation tasks.

## Implementation Strategy

1. Establish `--font-web` and update font loading.
2. Remove legacy named stacks from CSS and components.
3. Validate with source search, build, and browser checks.
