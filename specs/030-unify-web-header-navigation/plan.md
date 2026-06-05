# Implementation Plan: Unify Web Header Navigation

**Branch**: `030-unify-web-header-navigation` | **Date**: 2026-06-05 | **Spec**: `specs/030-unify-web-header-navigation/spec.md`

**Input**: Feature specification from `/specs/030-unify-web-header-navigation/spec.md`

## Summary

Replace the split `primaryNav`/`landingNav` header model with one canonical `siteNav` list used by desktop and mobile menus. Resolve the Generator link dynamically so homepage navigation still targets `#hero-demo`, while all other routes use `/placeholder-image-generator/`. Remove header variant plumbing from layouts/pages and validate active states, external links, responsive fit, and mobile menu behavior.

## Technical Context

**Language/Version**: Astro, TypeScript, CSS

**Primary Dependencies**: Existing Astro components and navigation module

**Storage**: N/A

**Testing**: `pnpm --filter @fallback-pics/web build`, browser QA

**Target Platform**: Cloudflare Pages static web app

**Project Type**: Web app in pnpm monorepo

**Performance Goals**: No new runtime dependencies

**Constraints**: Do not change footer, content, API behavior, typography, or color token definitions

**Scale/Scope**: `apps/web/src/navigation.ts`, `SiteHeader.astro`, layout/page header props, and Spec Kit artifacts

## Constitution Check

- **Public URL Truth**: PASS. Header links target existing routes/external URLs only.
- **Edge-First Delivery**: PASS. Worker/API behavior unchanged.
- **Testable Behavior**: PASS. Validate build, desktop/mobile route checks, active states, and mobile menu interaction.
- **Documentation and SEO Consistency**: PASS. No public content/canonical/sitemap changes.
- **Privacy, Security, and Observability**: PASS. External links keep safe target/rel; analytics labels remain.

## Project Structure

```text
specs/030-unify-web-header-navigation/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
├── contracts/
│   └── validation.md
├── checklists/
│   └── requirements.md
└── tasks.md

apps/web/src/navigation.ts
apps/web/src/components/SiteHeader.astro
apps/web/src/layouts/Layout.astro
apps/web/src/layouts/DocsLayout.astro
apps/web/src/layouts/ContentLayout.astro
apps/web/src/pages/index.astro
apps/web/src/pages/[...slug].astro
```

**Structure Decision**: Keep nav data in `navigation.ts`; keep rendering logic in `SiteHeader.astro`.

## Complexity Tracking

No constitution violations.
