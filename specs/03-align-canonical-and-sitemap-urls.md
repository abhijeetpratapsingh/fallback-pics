# Story 03: Align Canonical and Sitemap URLs

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

