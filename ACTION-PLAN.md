# fallback.pics SEO Re-Audit Action Plan

Audit date: 2026-06-03  
Context: refreshed action plan after comparing the current production site against the previous SEO baseline.

## Immediate Fixes

1. Finalize sitemap URL consistency.
   - Update `sitemap.xml` so every `<loc>` is the final URL that returns `200` without redirect.
   - Confirm these are changed from non-trailing to trailing slash where production redirects:
     - `https://fallback.pics/docs/`
     - `https://fallback.pics/api/`
     - `https://fallback.pics/features/`
     - `https://fallback.pics/blog/`
   - Check blog post URLs too. If production redirects them to trailing-slash versions, update sitemap entries to match.
   - Re-run `curl -I -L` and verify the sitemap URLs do not require redirects.

2. Remove the remaining root-style API example.
   - Current homepage HTML still contains:
     - `GET /800x450/18181B/FFFFFF?text=Product+Image`
   - Replace it with:
     - `GET /api/v1/800x450/18181B/FFFFFF?text=Product+Image`
   - Scan all web content for root image examples because `/400x300` and `/400x300.png` now correctly return 404.

3. Clean up structured data.
   - Remove `FAQPage` JSON-LD from:
     - `/placeholder-image-api/`
     - `/placeholder-image-generator/`
     - `/dummy-image-generator/`
   - Keep the visible FAQ sections for users.
   - Use safer schema types:
     - `WebPage`
     - `SoftwareApplication`
     - `Organization`
     - `BreadcrumbList`
   - Do not add `HowTo` schema.

4. Add missing security headers for web pages.
   - Add these through Cloudflare Pages `_headers` or equivalent deployment config:
     - `Strict-Transport-Security`
     - `Content-Security-Policy`
     - `frame-ancestors 'none'` in CSP, or `X-Frame-Options: DENY`
     - Keep `X-Content-Type-Options: nosniff`
     - Keep `Referrer-Policy: strict-origin-when-cross-origin`
   - Make sure CSP allows the current required scripts, fonts, Cloudflare analytics, and images.

## Next SEO Pass

1. Recheck all priority landing pages.
   - Homepage
   - `/placeholder-image-api/`
   - `/placeholder-image-generator/`
   - `/dummy-image-generator/`
   - `/broken-image-fallback/`
   - `/guides/react-image-fallback/`
   - `/guides/nextjs-image-fallback/`
   - `/guides/img-onerror-fallback/`

2. Strengthen internal links.
   - Use trailing-slash URLs consistently in nav, footer, body links, and related-page cards.
   - Link from docs and API reference to:
     - `/placeholder-image-api/`
     - `/placeholder-image-generator/`
     - `/dummy-image-generator/`
     - `/broken-image-fallback/`
   - Link from each guide back to the most relevant commercial page.

3. Improve authority signals.
   - Update the GitHub README with the exact keyword language now used on the site:
     - `placeholder image API`
     - `placeholder image generator`
     - `dummy image generator`
     - `broken image fallback`
     - `Cloudflare Workers SVG placeholder API`
   - Add GitHub repository topics for those same concepts.
   - Add working `/api/v1/...` examples to README and docs.

4. Start measurement checks.
   - Track Google Search Console weekly for:
     - `placeholder image`
     - `placeholder image api`
     - `placeholder image generator`
     - `dummy image generator`
     - `broken image placeholder`
     - `react image fallback`
     - `nextjs image fallback`
   - Track indexed status of the new generator page and fixed SEO pages.
   - Track crawl issues for soft 404s and redirects.
   - Track referring domains and follow-link count.

## Strategic Growth Work

1. Build links from developer-relevant surfaces.
   - GitHub README and examples.
   - Dev.to or engineering blog tutorial.
   - Placeholder image API comparison post.
   - Framework-specific guides for React, Next.js, Astro, and plain HTML.
   - Developer tool directories and relevant curated lists.

2. Prioritize pages by reachable demand.
   - First: `/placeholder-image-api/`
   - Second: `/placeholder-image-generator/`
   - Third: `/dummy-image-generator/`
   - Fourth: implementation guides.
   - Fifth: competitor alternative pages.

3. Re-audit after indexing catches up.
   - Semrush currently still reports 2 US organic keywords and 0 traffic.
   - Do not treat that as implementation failure yet if the deployment is recent.
   - Use Search Console as the first signal for impressions and indexing; Semrush ranking movement may lag.

## Completed Since Previous Audit

The following previous P0/P1 items are now materially improved:

- Unknown routes return `404` instead of homepage HTML.
- Root image routes no longer return homepage HTML.
- `/api/v1/400x300` still returns `200 image/svg+xml` with long-lived cache headers.
- `/llms.txt` is a real `text/plain` file.
- Core SEO page canonicals now use trailing-slash final URLs.
- Homepage metadata now targets placeholder image demand.
- `/placeholder-image-generator/` is live.
- Sitemap no longer lists `/400x300` as an indexable page URL.
