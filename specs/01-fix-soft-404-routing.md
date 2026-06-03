# Story 01: Fix Soft 404 Routing

## Description

Unknown web paths currently return `200 text/html` and appear to serve the homepage shell. This creates soft-404 risk and can waste crawl budget. The web app should return a real `404` response for unknown pages while preserving valid static routes and valid API image routes.

## User Story

As a search crawler or user, I want invalid URLs to return a clear not-found response so that only real fallback.pics pages are indexed and trusted.

## Acceptance Criteria

- Requesting an unknown web path returns HTTP `404`.
- The 404 page uses the normal site layout and includes helpful links to Docs, API Reference, and the homepage.
- Valid pages continue to return HTTP `200`.
- Valid SEO landing pages continue to render normally.
- Valid API image routes continue to return image responses.
- Unknown API image paths return an API-appropriate error response rather than homepage HTML.
- No invalid path should include the homepage canonical URL.

## Technical Details

- Add or verify an Astro 404 page at `apps/web/src/pages/404.astro`.
- Review Cloudflare Pages routing so fallback-to-index behavior does not mask unknown static paths.
- If Cloudflare Pages uses `_routes.json`, create or update it so `/api/v1/*` remains handled by Worker/functions and web page routes are not over-broad.
- Confirm the catch-all route in `apps/web/src/pages/[...slug].astro` only generates paths returned by `getStaticPaths()`.
- Ensure unknown paths do not inherit homepage metadata, canonical tags, or structured data.

## Likely Files

- `apps/web/src/pages/404.astro`
- `apps/web/src/pages/[...slug].astro`
- `apps/web/public/_routes.json`, if routing config is needed
- `apps/web/src/layouts/Layout.astro`
- `apps/worker/src/index.ts`

## Validation

- `curl -I https://fallback.pics/not-a-real-seo-test-page` returns `404`.
- `curl -I https://fallback.pics/placeholder-image-api/` returns `200`.
- `curl -I https://fallback.pics/api/v1/400x300` returns `200` and `content-type: image/svg+xml`.
- The 404 page has no `index, follow` signal if the layout supports page-level robots metadata.

## Out of Scope

- Rewriting SEO page content.
- Changing image generation behavior.
- Changing analytics instrumentation beyond preserving existing events.

