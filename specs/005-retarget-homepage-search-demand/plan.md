# Implementation Plan: Retarget Homepage Search Demand

**Branch**: `005-retarget-homepage-search-demand` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-retarget-homepage-search-demand/spec.md`

## Summary

Implement homepage search demand by updating apps/web/src/pages/index.astro, apps/web/src/components/EnterpriseLanding.tsx, apps/web/src/navigation.ts and validating public URL truth.

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

- **Public URL Truth**: / => 200 text/html with updated metadata; /placeholder-image-api/ internal link; /dummy-image-generator/ internal link; /broken-image-fallback/ internal link; /guides/react-image-fallback/ internal link. Validation commands are listed in quickstart.md and contracts/http-validation.md.
- **Edge-First Delivery**: `/api/v1/...` remains the selected image route strategy. Deterministic SVG responses and immutable cache behavior are preserved.
- **Testable Behavior**: Web build/source validation covers static pages, metadata, sitemap, llms.txt, schema, and examples. Worker tests/typecheck cover API behavior where relevant.
- **Documentation and SEO Consistency**: Docs, API reference, sitemap, canonicals, examples, and trust copy are updated in the same story scope.
- **Privacy, Security, and Observability**: No secrets are added. User-supplied URL text remains excluded from external telemetry content. Public headers remain explicit.

## Project Structure

### Documentation (this feature)

```text
specs/005-retarget-homepage-search-demand/
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
