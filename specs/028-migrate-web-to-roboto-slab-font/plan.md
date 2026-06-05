# Implementation Plan: Migrate Web to Roboto Slab Font

**Branch**: `028-migrate-web-to-roboto-slab-font` | **Date**: 2026-06-05 | **Spec**: `specs/028-migrate-web-to-roboto-slab-font/spec.md`

**Input**: Feature specification from `/specs/028-migrate-web-to-roboto-slab-font/spec.md`

## Summary

Migrate the Astro web app typography to a single Roboto Slab source of truth. Define `--font-web` once in shared CSS, load Roboto Slab once from Google Fonts with only used weights and `display=swap`, point Tailwind `sans` and `mono` to the same CSS variable, remove legacy named font stacks from global/component CSS, and update web-generated SVG preview font-family values without touching Worker runtime image generation.

## Technical Context

**Language/Version**: TypeScript, Astro, React islands, CSS, Tailwind CSS

**Primary Dependencies**: Astro, React, Tailwind CSS, Google Fonts CSS

**Storage**: N/A

**Testing**: `pnpm --filter @fallback-pics/web build`, repository font-reference searches, visual QA through built pages or preview server

**Target Platform**: Cloudflare Pages static web app

**Project Type**: Web app in pnpm monorepo

**Performance Goals**: One font stylesheet request, `display=swap`, and no duplicate font imports

**Constraints**: One named UI font family only; keep CSP compatible; do not change Worker runtime image generation

**Scale/Scope**: `apps/web` pages, layouts, CSS, React components, and root `theme.css` font tokens

## Constitution Check

- **Public URL Truth**: Visual-only changes to `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, content pages, and `/404`. Expected status, content type, cache policy, canonical tags, robots metadata, sitemap, and API URLs remain unchanged. Validate with web build and page renders.
- **Edge-First Delivery**: PASS. No Worker routing, image generation, cache, storage, or API dependency changes.
- **Testable Behavior**: PASS. Validate by source searches for old font names, web build, and visual/browser checks for CSP errors and mobile overflow.
- **Documentation and SEO Consistency**: PASS. No public URL or copy claims change; generated web preview text is aligned with the new UI font.
- **Privacy, Security, and Observability**: PASS. Existing CSP allows `fonts.googleapis.com` and `fonts.gstatic.com`; no telemetry or secrets change.

## Project Structure

### Documentation (this feature)

```text
specs/028-migrate-web-to-roboto-slab-font/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
├── contracts/
│   └── validation.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── layouts/Layout.astro
│   ├── styles/modern-ui.css
│   └── components/
│       ├── CodeBlock.astro
│       └── EnterpriseLanding.tsx
├── public/_headers
└── tailwind.config.mjs

theme.css
```

**Structure Decision**: Use existing Astro web app files. No new package or shared runtime module is needed because the source of truth can live in CSS and be consumed by Tailwind through CSS variables.

## Complexity Tracking

No constitution violations.
