# fallback.pics SEO Action Plan

Audit date: 2026-06-05

## P0: Fix Before More SEO Publishing

1. Configure `WORKER_ORIGIN` in Cloudflare Pages production.
   - Evidence: live `/api/v1/800x450/18181B/FFFFFF?text=Product+Image` returns `WORKER_ORIGIN is not configured`.
   - Required outcome: `GET /api/v1/400x300` returns `200`, `image/svg+xml`, and cache headers.
   - Required outcome: `HEAD /api/v1/400x300` does not return `500`.

2. Add production smoke tests.
   - Test homepage returns `200 text/html`.
   - Test sitemap returns `200 application/xml`.
   - Test robots and `llms.txt` return `200 text/plain`.
   - Test generated image URL returns `200 image/svg+xml`.
   - Test unknown route returns `404`.

3. Remove root-style generated-image examples from visible copy.
   - Replace `https://fallback.pics/800x450/...` with `https://fallback.pics/api/v1/800x450/...`.
   - Replace `GET /800x450/...` with `GET /api/v1/800x450/...`.

## P1: Four-Week SEO Execution

1. Re-audit after the API fix.
   - Recheck homepage image preview.
   - Recheck sitemap image URLs.
   - Recheck OG image URL.
   - Recheck blog card images.

2. Publish the first four implementation posts.
   - Placeholder Image API: Complete URL Syntax Guide for Developers.
   - How to Fix Broken Images in HTML with `onerror`.
   - React Image Fallback Patterns.
   - Next.js Image Fallbacks Without Layout Shift.

3. Add internal links.
   - Each post should link to exactly one primary commercial page near the top.
   - Each post should include one related implementation guide link.
   - Add "Related guides" blocks from existing SEO pages back to the new posts.

4. Add measurement.
   - Track GSC queries: `placeholder image api`, `placeholder image generator`, `dummy image generator`, `img onerror fallback`, `react image fallback`, `nextjs image fallback`, `broken image fallback`.
   - Track indexed status for every new post within 7 days of publishing.

## P2: Six-Month Blog Roadmap

Publish 25 posts in this order:

1. Placeholder Image API: Complete URL Syntax Guide for Developers
2. How to Fix Broken Images in HTML with `onerror`
3. React Image Fallback Patterns: Missing Src, Failed Loads, and Placeholders
4. Next.js Image Fallbacks Without Layout Shift
5. Placeholder Image Generator vs Dummy Image Generator
6. Best Placeholder Image APIs for Developers
7. placehold.co Alternatives for Production Placeholder Images
8. DummyImage Alternatives: Modern Dummy Image URLs for Web Apps
9. Lorem Picsum vs SVG Placeholder Images
10. Product Image Placeholder Strategy for Ecommerce Catalogs
11. How to Prevent Layout Shift from Missing Images
12. Skeleton Placeholder Images: When to Use Skeletons vs Static Fallbacks
13. Avatar Placeholder Generator: Initials, Colors, and Accessibility
14. SVG Placeholder Images: Why They Are Fast, Cacheable, and Scalable
15. Cache-Control for Placeholder Images
16. Building a Self-Hosted Placeholder Image API with Cloudflare Workers
17. Placeholder Images in Storybook, Playwright, and Visual Regression Tests
18. CSS Background Image Fallbacks
19. Responsive Placeholder Images for Cards, Banners, and Grids
20. OG Image Placeholders for Blogs, Docs, and Social Sharing
21. Placeholder Images for CMS Previews and Missing Media Fields
22. Mobile App Image Fallbacks
23. Privacy-Safe Placeholder Images
24. Branded Fallback Images for SaaS Dashboards and Internal Tools
25. From Broken Image Icon to Branded Fallback: A Production Rollout Checklist

## Content Rules

- Do not publish FAQPage schema for commercial FAQ sections.
- Do not publish HowTo schema.
- Use JSON-LD only where schema is needed.
- Keep the canonical product pages as the commercial targets; blog posts support them.
- Include copy-paste code examples in every technical post.
- Include screenshots or generated examples where the topic is visual.
- Avoid putting secrets, tokens, emails, or customer data in fallback URL examples.

## Competitor Response

- Against `picsum.photos`: emphasize deterministic branded fallbacks instead of random photos.
- Against `dummyimage.com`: emphasize modern framework examples, production fallback policy, SVG output, and Cloudflare edge delivery.
- Against `MockImg` and `PlaceholdPicsum`: avoid feature-count competition; focus on production reliability and missing-media workflows.
- Against `placeholdr.dev`: emphasize non-AI speed, privacy, deterministic SVG, and no prompt-generation latency.

## Recheck Cadence

- Same day after P0 fix: generated image route smoke test.
- 7 days after publishing: GSC indexing check.
- 30 days after publishing: GSC impressions/query movement.
- Monthly: competitor SERP spot checks for the priority clusters.
- After Semrush API units are available: rerun exact keyword volume and competitor domain reports.
