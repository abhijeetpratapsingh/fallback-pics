# Spec Kit Command Sequence: Finalize Sitemap URL Consistency

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/019-finalize-sitemap-url-consistency
GIT_BRANCH_NAME=019-finalize-sitemap-url-consistency

Create a Spec Kit feature for making the fallback.pics sitemap contain only final canonical URLs.

Problem: The SEO re-audit found that the live sitemap still lists non-final URLs such as /docs, /api, /features, and /blog even though production redirects them to trailing-slash URLs. Sitemap URLs should be final 200 URLs, not redirecting aliases.

User value: Search engines should receive a clean sitemap where every listed page URL resolves directly to the canonical page without redirect hops.

Functional requirements:
- Every sitemap <loc> for an HTML page must return HTTP 200 without requiring a redirect.
- Sitemap URLs must match the canonical URL declared on the destination page.
- Redirecting URLs such as /docs, /api, /features, and /blog must be replaced with their final trailing-slash versions.
- Blog post URLs must be checked and updated if production redirects them to trailing-slash versions.
- Image sitemap entries must continue to use valid /api/v1/... image URLs.
- The sitemap must not reintroduce root image endpoint URLs such as /400x300 as indexable page URLs.
- The sitemap must remain valid XML.

Validation targets:
- https://fallback.pics/docs/
- https://fallback.pics/api/
- https://fallback.pics/features/
- https://fallback.pics/blog/
- All blog post URLs listed in sitemap.xml

Out of scope:
- Rewriting page content.
- Changing image generation behavior.
- Changing canonical strategy away from trailing-slash URLs.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only decisions that affect canonical URL style, sitemap ownership, generated versus static sitemap maintenance, or blog post URL format.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan the sitemap cleanup using the current Astro/Cloudflare Pages route behavior. Include a validation method that extracts sitemap URLs and verifies each HTML page URL returns 200 without redirects and matches its canonical tag.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for final URL consistency, canonical matching, XML validity, image sitemap safety, and redirect-free sitemap entries.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate task-level work for auditing sitemap entries, updating redirecting URLs, preserving valid /api/v1 image entries, validating XML, and adding a repeatable sitemap URL check.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the sitemap spec, plan, and tasks for canonical conflicts, missed redirecting URLs, invalid XML risk, and accidental indexing of API or root image endpoints.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the final URL style and sitemap ownership are explicit.
```

## Source Story

## Description

Update the sitemap so every listed HTML page URL is the final canonical URL and does not require a redirect.

## User Story

As a search crawler, I want sitemap URLs to resolve directly to canonical pages so that crawl signals are clean and redundant redirect hops are avoided.

## Acceptance Criteria

- `sitemap.xml` is valid XML.
- `/docs/`, `/api/`, `/features/`, and `/blog/` are listed with trailing slashes if those are the final production URLs.
- No listed HTML page URL returns `3xx`.
- Listed HTML page URLs match the page canonical tags.
- `/api/v1/...` image sitemap entries continue to return image responses.
- Root image paths such as `/400x300` are not listed as sitemap page URLs.

## Technical Details

- Review `apps/web/public/sitemap.xml` or the current sitemap generation source.
- If sitemap generation is manual, update the XML directly.
- If sitemap generation is automated, update the route data source.
- Add or document a scriptable check that reads sitemap `<loc>` values and verifies status/canonical behavior.

## Likely Files

- `apps/web/public/sitemap.xml`
- `apps/web/src/pages/`, if sitemap data is generated from page metadata
- `apps/web/scripts/`, if adding a sitemap validator
- `package.json`, if adding a validation command

## Validation

- `curl -I https://fallback.pics/docs/` returns `200`.
- `curl -I https://fallback.pics/api/` returns `200`.
- `curl -I https://fallback.pics/features/` returns `200`.
- `curl -I https://fallback.pics/blog/` returns `200`.
- A sitemap URL extraction check confirms no HTML page URL returns `3xx`.

## Out of Scope

- New landing pages.
- Content rewrites.
- API route behavior changes.
