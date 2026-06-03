# Spec Kit Command Sequence: Fix Soft 404 Routing

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/001-fix-soft-404-routing
GIT_BRANCH_NAME=001-fix-soft-404-routing

Create a Spec Kit feature for fixing fallback.pics soft-404 routing.

Problem: Unknown web paths currently return 200 text/html and appear to serve the homepage shell. This creates soft-404 risk, weakens crawl quality, and can cause invalid URLs to inherit homepage metadata.

User value: Search crawlers and users should receive a clear not-found response for invalid URLs so only real fallback.pics pages are indexed and trusted.

Functional requirements:
- Unknown web paths must return HTTP 404.
- The 404 page must use the normal site layout and include helpful links to Docs, API Reference, and the homepage.
- Valid pages must continue to return HTTP 200.
- Valid SEO landing pages must continue to render normally.
- Valid API image routes must continue to return image responses.
- Unknown API image paths must return an API-appropriate error response rather than homepage HTML.
- Invalid paths must not include the homepage canonical URL.

Public URL behavior:
- /not-a-real-seo-test-page should return 404.
- /placeholder-image-api/ should return 200.
- /api/v1/400x300 should return 200 and image/svg+xml.

Out of scope:
- Rewriting SEO page content.
- Changing image generation behavior.
- Changing analytics instrumentation beyond preserving existing events.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only decisions that materially affect routing ownership, 404 behavior, API error behavior, or indexability. Prefer defaults from the current Fallback.pics constitution.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan the fix using Astro/Cloudflare Pages for web 404 behavior and the Worker/API layer for API image errors. Include HTTP validation commands for web pages, SEO pages, and API image routes.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for soft-404 routing, indexability, API error behavior, canonical safety, and public URL truth.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate task-level work for adding/verifying the 404 page, route fallback behavior, API unknown-path errors, metadata safety, and HTTP validation. Include tests or scriptable checks for every public behavior change.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the soft-404 routing spec, plan, and tasks for coverage gaps, public URL truth conflicts, missing validation, and constitution violations.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after checklists are complete and analysis has no critical findings.
```

## Source Story

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
