# fallback.pics SEO Action Plan

Audit date: 2026-06-03

## First 48 Hours

1. Fix soft 404 behavior.
   - Ensure unknown URLs return a real 404 status.
   - Add an Astro/Cloudflare Pages 404 page if missing.
   - Verify `https://fallback.pics/not-a-real-seo-test-page` returns 404.

2. Resolve image route strategy.
   - Decide whether short URLs like `/400x300` are production API routes.
   - If yes, route root image patterns to the Worker and verify `content-type: image/svg+xml`.
   - If no, remove short URL examples from the sitemap and docs, then standardize on `/api/v1/...`.

3. Fix canonical and sitemap URL consistency.
   - In `apps/web/src/pages/[...slug].astro`, change canonical generation to match the final trailing-slash URL, or change site routing to non-trailing-slash URLs.
   - Update `apps/web/public/sitemap.xml` so every `<loc>` is the final canonical URL.
   - Remove `/400x300`, `/square/400`, and `/avatar/200` sitemap entries unless they return real indexable content or real image responses.

4. Publish or intentionally 404 `/llms.txt`.
   - If publishing, keep it short: product summary, docs URL, API reference URL, key guides, GitHub repo, support contact.
   - If not publishing, make it return 404 instead of homepage HTML.

## Week 1

1. Retarget the homepage for search demand.
   - Suggested title direction: `Placeholder Image API for Reliable Fallback Images | fallback.pics`.
   - Keep "Never show broken images again" as hero copy, but add `placeholder image API` and `placeholder image generator` in visible above-the-fold copy.
   - Add direct internal links to `/placeholder-image-api/`, `/dummy-image-generator/`, `/broken-image-fallback/`, and `/guides/react-image-fallback/`.

2. Strengthen `/placeholder-image-api/`.
   - Make it the canonical commercial page for:
     - `placeholder image api`
     - `placeholder image`
     - `image placeholder`
     - `placeholder image generator`
   - Add a compact API comparison table against placehold.co, picsum.photos, dummyimage.com, and placeholderimage.dev.
   - Add FAQ schema for "What is a placeholder image API?", "How do I create a placeholder image URL?", and "Can I use it in HTML/React/Next.js?".

3. Strengthen `/dummy-image-generator/`.
   - Target `dummy image generator`, `dummy image`, `dummy images`, and `dummy image url`.
   - Add examples for fixed sizes, custom text, colors, avatars, and mock data.
   - Include live examples that return image responses, not screenshots only.

4. Make guides more search-actionable.
   - Add concrete code-first sections to:
     - `/guides/img-onerror-fallback/`
     - `/guides/react-image-fallback/`
     - `/guides/nextjs-image-fallback/`
   - Add HowTo schema where the page is a step-by-step implementation guide.

## Weeks 2-4

1. Build the link acquisition base.
   - Improve the GitHub README title, description, examples, and topics around `placeholder-image`, `placeholder-image-api`, `dummy-image-generator`, `cloudflare-workers`, and `svg-placeholder`.
   - Publish one technical article: `Building a Placeholder Image API on Cloudflare Workers`.
   - Submit to developer tool directories and relevant "awesome" lists.
   - Launch comparison/alternative pages only where there is a real differentiator, not generic "we are better" copy.

2. Add a dedicated generator page if the product supports it.
   - Create `/placeholder-image-generator/` if it does not exist.
   - This page should be a usable generator first, with copy second.
   - Target `placeholder image generator` and internally link it from homepage, docs, and API reference.

3. Improve trust signals.
   - Add production guarantees carefully only where true.
   - Show cache headers, content types, Cloudflare edge behavior, and privacy posture.
   - Add examples for ecommerce, SaaS dashboards, design systems, and test fixtures.

4. Clean backlink quality.
   - Do not chase low-quality SEO domains.
   - Prioritize follow links from GitHub, dev tutorials, product directories, framework examples, and real user projects.

## 30-60 Day Measurement Plan

Track weekly:

- Google Search Console impressions and clicks for:
  - `placeholder image`
  - `placeholder image api`
  - `placeholder image generator`
  - `dummy image generator`
  - `broken image placeholder`
  - `react image fallback`
  - `nextjs image fallback`
- Indexed status of SEO pages.
- Soft 404 count.
- Referring domains and follow-link count.
- Organic rankings for the five main competitors:
  - placehold.co
  - picsum.photos
  - dummyimage.com
  - placeholderimage.dev
  - placehold.net

Success targets:

- 0 soft-404 warnings for invalid routes.
- All sitemap URLs resolve directly to final canonical URLs.
- 25+ quality referring domains.
- Top 20 ranking for `placeholder image api`.
- Top 20 ranking for `placeholder image generator`.
- Top 10 ranking for at least one implementation guide query.

