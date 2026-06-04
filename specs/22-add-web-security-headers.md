# Spec Kit Command Sequence: Add Web Security Headers

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/022-add-web-security-headers
GIT_BRANCH_NAME=022-add-web-security-headers

Create a Spec Kit feature for adding missing production security headers to fallback.pics web pages.

Problem: The SEO re-audit confirmed that the live homepage includes X-Content-Type-Options and Referrer-Policy, but does not expose Strict-Transport-Security, Content-Security-Policy, or frame-ancestor protection on web pages.

User value: Users and crawlers should receive a production-grade web surface with safer browser defaults and clearer trust signals.

Functional requirements:
- Web HTML pages must include Strict-Transport-Security on HTTPS responses.
- Web HTML pages must include a Content-Security-Policy appropriate for current scripts, fonts, analytics, images, and styles.
- Framing must be denied using CSP frame-ancestors 'none' or X-Frame-Options: DENY.
- Existing X-Content-Type-Options: nosniff must remain.
- Existing Referrer-Policy must remain strict-origin-when-cross-origin or a stricter compatible value.
- API image routes must continue returning image responses with their current cache and CORS behavior.
- 404 pages, sitemap, robots.txt, and llms.txt must continue to return appropriate content types.

Out of scope:
- Removing current analytics without a separate product decision.
- Changing image API caching.
- Changing SEO page content.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only decisions that affect allowed analytics providers, font sources, inline script handling, or whether CSP should be report-only before enforcement.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan security header implementation for Cloudflare Pages/Astro deployment. Include CSP source inventory, web versus API route separation, and curl-based validation.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for HSTS, CSP, frame protection, existing header preservation, API route safety, content-type preservation, and browser smoke testing.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for adding deployment headers, inventorying required CSP sources, testing web pages, testing API images, and documenting validation commands.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the security header artifacts for CSP breakage risk, over-broad source allowances, missing route coverage, API response regressions, and deployment config gaps.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after current third-party script, font, analytics, and image sources are inventoried.
```

## Source Story

## Description

Add missing security headers to web page responses while preserving current image API behavior.

## User Story

As a visitor, I want fallback.pics pages to use safer browser defaults so that the production site has stronger trust and security posture.

## Acceptance Criteria

- Homepage and core HTML pages return `Strict-Transport-Security`.
- Homepage and core HTML pages return `Content-Security-Policy`.
- Homepage and core HTML pages deny framing through CSP or `X-Frame-Options`.
- `X-Content-Type-Options: nosniff` remains.
- `Referrer-Policy` remains present.
- `/api/v1/400x300` still returns `image/svg+xml` with CORS and cache headers.
- `/sitemap.xml`, `/robots.txt`, and `/llms.txt` retain correct content types.

## Technical Details

- Prefer Cloudflare Pages `_headers` or equivalent deployment config.
- CSP must account for Astro inline scripts, Google Tag Manager, Cloudflare analytics, Google Fonts, generated API images, and local assets.
- Consider `Content-Security-Policy-Report-Only` only if enforcement risk is high and the product decision supports a report-first rollout.

## Likely Files

- `apps/web/public/_headers`
- `apps/web/`, if headers are generated during build
- Cloudflare Pages deployment config, if present in repo
- `README.md`, if documenting validation commands

## Validation

- `curl -I https://fallback.pics/` shows HSTS, CSP, frame protection, nosniff, and referrer policy.
- `curl -I https://fallback.pics/placeholder-image-api/` shows the same web security headers.
- `curl -I https://fallback.pics/api/v1/400x300` still shows `content-type: image/svg+xml`.
- Browser smoke test confirms scripts, fonts, analytics, and images are not blocked by CSP.

## Out of Scope

- Security scans unrelated to response headers.
- Analytics removal.
- API cache policy changes.
