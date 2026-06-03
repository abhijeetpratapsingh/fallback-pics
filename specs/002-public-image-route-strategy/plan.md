# Implementation Plan: Resolve Public Image Route Strategy

**Branch**: `002-public-image-route-strategy` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-public-image-route-strategy/spec.md`

## Summary

Implement public image route strategy by updating apps/web/src/components/EnterpriseLanding.tsx, apps/web/src/components/LiveDemoEnhanced.tsx, apps/web/src/data/seoPages.ts and validating public URL truth.

## Technical Context

**Language/Version**: TypeScript 5.x, Astro 4, React 18, Cloudflare Workers

**Primary Dependencies**: Astro, React islands, Tailwind CSS, Cloudflare Workers runtime, Vitest

**Storage**: N/A for these stories; all changes use static content, route metadata, or deterministic Worker behavior.

**Testing**: Astro build/source checks, Worker Vitest/typecheck where API behavior is relevant, HTTP/curl validation after deployment.

**Target Platform**: Cloudflare Pages for web routes and Cloudflare Workers for `/api/v1/...` image routes.

**Project Type**: pnpm monorepo with `apps/web` and `apps/worker`.

**Performance Goals**: Preserve static page rendering and immutable cache headers for deterministic image responses.

**Constraints**: Public URLs must return truthful status, content type, canonical, robots, cache, and error behavior.

**Scale/Scope**: Public marketing/docs/SEO pages plus deterministic image API examples.

## Constitution Check

- **Public URL Truth**: /api/v1/400x300 => image/svg+xml; /400x300 => not documented or indexed; /api/v1/not-a-size => 400 API error. Validation commands are listed in quickstart.md and contracts/http-validation.md.
- **Edge-First Delivery**: `/api/v1/...` remains the selected image route strategy. Deterministic SVG responses and immutable cache behavior are preserved.
- **Testable Behavior**: Web build/source validation covers static pages, metadata, sitemap, llms.txt, schema, and examples. Worker tests/typecheck cover API behavior where relevant.
- **Documentation and SEO Consistency**: Docs, API reference, sitemap, canonicals, examples, and trust copy are updated in the same story scope.
- **Privacy, Security, and Observability**: No secrets are added. User-supplied URL text remains excluded from external telemetry content. Public headers remain explicit.

## Project Structure

### Documentation (this feature)

```text
specs/002-public-image-route-strategy/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── http-validation.md
├── checklists/
│   ├── requirements.md
│   └── story-quality.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── public/
└── src/
    ├── components/
    ├── data/
    ├── layouts/
    └── pages/

apps/worker/
└── src/
```

**Structure Decision**: Use the existing Astro web app for public pages, metadata, sitemap, static files, and content models. Use the existing Worker API for `/api/v1/...` behavior.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
