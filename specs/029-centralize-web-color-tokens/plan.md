# Implementation Plan: Centralize Web Color Tokens

**Branch**: `029-centralize-web-color-tokens` | **Date**: 2026-06-05 | **Spec**: `specs/029-centralize-web-color-tokens/spec.md`

**Input**: Feature specification from `/specs/029-centralize-web-color-tokens/spec.md`

## Summary

Create a canonical semantic color system in `theme.css`, convert legacy global/design-system variables to aliases, map Tailwind semantic colors and existing app palette utilities to those variables, update shared CSS/layout hardcoded theme values, and validate that current visual behavior is preserved.

## Technical Context

**Language/Version**: TypeScript, Astro, React, CSS, Tailwind CSS

**Primary Dependencies**: Astro, React, Tailwind CSS

**Storage**: N/A

**Testing**: `pnpm --filter @fallback-pics/web build`, color-reference searches, browser visual QA

**Target Platform**: Cloudflare Pages static web app

**Project Type**: Web app in pnpm monorepo

**Performance Goals**: No additional runtime dependencies or client-side work

**Constraints**: Preserve visual appearance; do not change routes, content, typography, or Worker image output

**Scale/Scope**: `theme.css`, Tailwind config, shared CSS/layout/component CSS, and Spec Kit artifacts

## Constitution Check

- **Public URL Truth**: PASS. Visual implementation only; no URL, status, canonical, robots, sitemap, or API contract changes.
- **Edge-First Delivery**: PASS. Worker image API and deterministic cache behavior are unchanged.
- **Testable Behavior**: PASS. Validate by source audit, web build, and browser checks across representative pages.
- **Documentation and SEO Consistency**: PASS. No public copy changes; spec index only.
- **Privacy, Security, and Observability**: PASS. No telemetry, CSP, secrets, or external services added.

## Project Structure

```text
specs/029-centralize-web-color-tokens/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
├── contracts/
│   └── validation.md
├── checklists/
│   └── requirements.md
└── tasks.md

theme.css
apps/web/tailwind.config.mjs
apps/web/src/layouts/Layout.astro
apps/web/src/styles/modern-ui.css
```

**Structure Decision**: Use the already-imported root `theme.css` as the canonical color source and map Tailwind to CSS variables at build/runtime.

## Complexity Tracking

No constitution violations.
