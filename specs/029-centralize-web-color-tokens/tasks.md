# Tasks: Centralize Web Color Tokens

**Input**: Design documents from `/specs/029-centralize-web-color-tokens/`

**Prerequisites**: plan.md, spec.md, research.md, contracts/validation.md, quickstart.md

**Tests**: This is a visual/static implementation migration. Validation uses source audit, build, and browser checks rather than new unit tests.

## Phase 1: Setup

- [X] T001 [P] Audit raw colors and direct Tailwind palette usage in `apps/web/src`, `apps/web/tailwind.config.mjs`, and `theme.css`.
- [X] T002 [P] Confirm `theme.css` is imported by `apps/web/src/layouts/Layout.astro`.

## Phase 2: Foundation

- [X] T003 Define canonical semantic `--color-*` tokens in `theme.css`.
- [X] T004 Convert legacy `--primary-*`, `--gray-*`, `--ds-*`, and gradient variables in `theme.css` and `apps/web/src/styles/modern-ui.css` to aliases where practical.
- [X] T005 Map Tailwind semantic colors and used palette keys to `var(--color-...)` in `apps/web/tailwind.config.mjs`.

## Phase 3: Shared CSS Migration

- [X] T006 Update `apps/web/src/layouts/Layout.astro` shared background to use semantic tokens.
- [X] T007 Update `apps/web/src/styles/modern-ui.css` code, cards, and utility surfaces to use semantic token aliases.
- [X] T008 Document remaining direct colors as intentional exceptions in `specs/029-centralize-web-color-tokens/research.md`.

## Phase 4: Validation

- [X] T009 Run source audit for raw colors and palette classes.
- [X] T010 Run `pnpm --filter @fallback-pics/web build`.
- [X] T011 Run browser QA on representative pages at desktop and mobile widths.
- [X] T012 Confirm no API/Worker/function/package changes are present.

## Phase 5: Completion

- [X] T013 Mark completed tasks in `specs/029-centralize-web-color-tokens/tasks.md`.

## Dependencies

- Phase 2 depends on Phase 1.
- Phase 3 depends on the canonical tokens from Phase 2.
- Phase 4 depends on implementation completion.
