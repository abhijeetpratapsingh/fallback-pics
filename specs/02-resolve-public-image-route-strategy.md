# Story 02: Resolve Public Image Route Strategy

## Description

The site advertises simple image URLs, but root-level image paths such as `/400x300` and `/400x300.png` currently return homepage HTML. The project needs one consistent public image URL strategy: either support short root-level image routes or remove them from indexable surfaces and standardize on `/api/v1/...`.

## User Story

As a developer using fallback.pics, I want every documented image URL to return an image response so that examples can be copied directly into real projects.

## Acceptance Criteria

- A documented public image URL returns the intended image content type.
- Product examples, docs, sitemap entries, and live demos use the same public route strategy.
- If short root-level routes are supported:
  - `/400x300` returns `image/svg+xml`.
  - `/400x300.png` returns a supported image response or a documented format fallback.
  - `/square/400` returns a square image response.
  - `/avatar/200` returns an avatar image response.
- If only `/api/v1/...` routes are supported:
  - Short root-level image routes are removed from sitemap and docs examples.
  - The homepage builder and code snippets consistently use `/api/v1/...`.
- Unsupported formats return a clear error response, not homepage HTML.

## Technical Details

- Decide whether Worker routes should include `https://fallback.pics/*` for image-like path patterns or only `https://fallback.pics/api/v1/*`.
- If supporting short routes, add route matching that sends image-like paths to `apps/worker/src/index.ts`.
- Keep web page slugs from colliding with image route patterns.
- If using Cloudflare Pages functions, review `apps/web/functions/api/v1/[[catchall]].ts` and `functions/api/v1/[[catchall]].ts`.
- Update examples in React/Astro components to match the selected route strategy.
- Make sure cache headers stay `public, max-age=31536000, immutable` for deterministic image responses.

## Likely Files

- `apps/worker/src/index.ts`
- `apps/worker/src/router.ts`
- `apps/worker/wrangler.toml`
- `apps/web/src/config.ts`
- `apps/web/src/components/EnterpriseLanding.tsx`
- `apps/web/src/components/LiveDemoEnhanced.tsx`
- `apps/web/src/pages/docs.astro`
- `apps/web/src/pages/api.astro`
- `apps/web/public/sitemap.xml`

## Validation

- Verify the selected public image route returns `image/svg+xml`.
- Verify unsupported and unknown paths do not return homepage HTML.
- Verify live demo images render after the route change.
- Verify docs examples are copy-pasteable and use the selected route format.

## Out of Scope

- Building raster conversion for PNG/JPEG/WebP unless already supported.
- Adding premium API features.
- Changing product pricing or plan behavior.

