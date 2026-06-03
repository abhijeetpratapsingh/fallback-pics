# Spec Kit Command Sequence: Align Canonical and Sitemap URLs

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/003-align-canonical-sitemap
GIT_BRANCH_NAME=003-align-canonical-sitemap

Create a Spec Kit feature for aligning fallback.pics canonical URLs, redirects, structured data URLs, Open Graph URLs, and sitemap entries.

Problem: Several SEO pages redirect to trailing-slash URLs while declaring non-trailing-slash canonical URLs. The sitemap also lists URLs that redirect or serve misleading content.

User value: Search engines should see one final preferred URL per page so ranking signals consolidate cleanly.

Functional requirements:
- Every sitemap loc must resolve directly to its final canonical URL.
- SEO page canonical tags must match the actual rendered final URL.
- Open Graph og:url must match the canonical URL.
- Structured data url fields must match the canonical URL.
- No sitemap entry may point to a URL that returns homepage HTML for an image endpoint.
- Sitemap entries for pages that should not be indexed must be removed.
- Redirecting URLs must not be listed as canonical sitemap URLs.

Out of scope:
- Writing new SEO copy.
- Changing route names unless required to fix canonical consistency.
- Submitting sitemap to external tools.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only the canonical URL style if the spec does not clearly choose trailing-slash or non-trailing-slash final URLs.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan canonical, sitemap, Open Graph, and structured-data alignment. Include validation for redirect count, canonical tag, og:url, JSON-LD url, and sitemap loc values.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for canonical consistency, sitemap accuracy, redirect avoidance, structured data URL alignment, and indexability boundaries.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for canonical generation, sitemap updates, structured data URL alignment, page metadata checks, and sitemap validation.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the canonical/sitemap artifacts for terminology drift, redirect conflicts, unmapped validation tasks, and constitution issues.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the canonical style is explicit and validation tasks cover sitemap, metadata, and structured data.
```

## Source Story

## Description

Several SEO pages redirect to trailing-slash URLs while declaring non-trailing-slash canonical URLs. The sitemap also lists URLs that redirect or serve misleading content. Canonicals, redirects, and sitemap entries should all agree.

## User Story

As a search engine, I want sitemap URLs and canonical tags to resolve to the final preferred URL so that fallback.pics pages consolidate ranking signals cleanly.

## Acceptance Criteria

- Every sitemap `<loc>` resolves directly to its final canonical URL.
- SEO page canonical tags match the actual rendered final URL.
- Open Graph `og:url` matches the canonical URL.
- Structured data `url` fields match the canonical URL.
- No sitemap entry points to a URL that returns homepage HTML for an image endpoint.
- Sitemap entries for pages that should not be indexed are removed.
- Redirecting URLs are not listed as canonical sitemap URLs.

## Technical Details

- Choose the canonical URL format used by production routing.
- If production keeps trailing slashes, change canonical generation in `apps/web/src/pages/[...slug].astro` to include the trailing slash for SEO page slugs.
- Update `apps/web/public/sitemap.xml` to match canonical final URLs.
- Remove or replace endpoint examples like `/400x300`, `/square/400`, and `/avatar/200` unless those routes return intended responses.
- Confirm `ContentLayout.astro` and `Layout.astro` pass canonical values consistently to meta, Open Graph, and structured data slots.

## Likely Files

- `apps/web/src/pages/[...slug].astro`
- `apps/web/src/layouts/Layout.astro`
- `apps/web/src/layouts/ContentLayout.astro`
- `apps/web/public/sitemap.xml`
- `apps/web/src/data/seoPages.ts`
- `apps/web/src/data/blogPosts.ts`

## Validation

- Fetch each sitemap URL and verify no redirect is required.
- Inspect page source for canonical URL consistency.
- Verify `/placeholder-image-api/`, `/dummy-image-generator/`, and `/broken-image-fallback/` declare canonical URLs matching their final paths.
- Run a simple sitemap URL status check that reports status code, content type, canonical, and redirect count.

## Out of Scope

- Writing new SEO copy.
- Changing route names unless required to fix canonical consistency.
- Submitting sitemap to external tools.
