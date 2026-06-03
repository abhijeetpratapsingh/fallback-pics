# Implementation Plan: Improve GitHub and Link Foundation

**Branch**: `011-github-link-foundation` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-github-link-foundation/spec.md`

## Summary

Implement improve github and link foundation.

## Technical Context

**Language/Version**: TypeScript 5.x, Astro 4, React 18, Cloudflare Workers, Node 18+ scripts

**Primary Dependencies**: Astro, React islands, Tailwind CSS, Node built-in fetch, optional Playwright for visual QA

**Storage**: N/A; changes use repository docs, static site content, local scripts, and responsive component/layout CSS.

**Testing**: Astro build, Worker Vitest/typecheck where relevant, dependency-free SEO smoke checks, optional Playwright visual QA.

**Target Platform**: Cloudflare Pages for web routes and Cloudflare Workers for `/api/v1/...` image routes.

**Project Type**: pnpm monorepo with `apps/web` and `apps/worker`.

**Performance Goals**: Preserve static page rendering, no horizontal overflow, stable responsive layout, and deterministic image URL behavior.

**Constraints**: Public URLs, examples, navigation, content layout, and QA scripts must stay aligned with the `/api/v1/...` route strategy.

**Scale/Scope**: Developer docs, README/link foundation, local validation scripts, homepage builder UX, shared content layouts, and navigation.

## Constitution Check

- **Public URL Truth**: README links to https://fallback.pics/; README links to /docs, /api, /placeholder-image-api/, /placeholder-image-generator/, /dummy-image-generator/, /broken-image-fallback/.
- **Edge-First Delivery**: Existing Worker image generation remains unchanged; generated image examples keep `/api/v1/...`.
- **Testable Behavior**: Build, source checks, SEO smoke checks, and visual QA workflow cover changed behavior.
- **Documentation and SEO Consistency**: README, scripts, layout, nav, and content changes are aligned with current route strategy.
- **Privacy, Security, and Observability**: No secrets or paid external service dependencies are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/011-github-link-foundation/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── validation.md
├── checklists/
│   ├── requirements.md
│   └── story-quality.md
└── tasks.md
```

### Source Code (repository root)

```text
README.md
CONTRIBUTING.md
package.json
apps/web/package.json
apps/web/scripts/
apps/web/src/components/
apps/web/src/layouts/
apps/web/src/pages/
```

**Structure Decision**: Use the existing monorepo and Astro component/layout boundaries; keep validation scripts under `apps/web/scripts/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
