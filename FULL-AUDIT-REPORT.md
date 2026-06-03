# fallback.pics SEO, Competitor, and Keyword Audit

Audit date: 2026-06-03  
Primary market: United States desktop search  
Data used: Semrush domain overview, organic research, keyword research, backlink analytics, and live HTTP checks against `https://fallback.pics`.

## Executive Summary

fallback.pics has the product surface needed to compete in the placeholder image market, but it has almost no current organic footprint. Semrush reports only 2 US organic keywords, 0 estimated organic traffic, and 0 paid traffic for fallback.pics. The site is ranking only for branded or near-branded fallback terms, not for the higher-volume placeholder terms where demand exists.

The market is not huge, but it is very winnable if the technical routing issues are fixed and the site concentrates around "placeholder image", "image placeholder", "placeholder image generator", "dummy image generator", and "placeholder image API". The strongest competitors win with simple utility pages, clean API examples, exact-match intent, and strong backlink profiles.

The biggest blockers are technical:

- Non-existent web paths return `200 text/html`, creating soft-404 risk.
- Short image URLs like `/400x300` and `/400x300.png` return the homepage HTML instead of an image, while `/api/v1/400x300` works correctly.
- Several SEO pages redirect to trailing-slash URLs while their canonical tags point to non-trailing-slash URLs.
- `/llms.txt` returns the homepage HTML instead of a real `llms.txt` or 404.
- Backlink authority is weak: 28 backlinks, 21 referring domains, authority score 2, and 0 follow links reported by Semrush.

## Current Organic Visibility

Semrush current snapshot for `fallback.pics` in the US:

| Metric | Value |
|---|---:|
| Semrush rank | 26,036,061 |
| Organic keywords | 2 |
| Estimated organic traffic | 0 |
| Organic traffic cost | 0 |
| Paid keywords | 0 |
| Paid traffic | 0 |

Historical Semrush trend:

- The domain first appears with non-zero organic keyword counts in November 2025.
- It peaked at 6 organic keywords in December 2025.
- It dropped to 2 organic keywords by May 2026.
- Estimated traffic remained 0 throughout the available history.

Current ranking keywords:

| Keyword | Position | Search Volume | Ranking URL | Traffic |
|---|---:|---:|---|---:|
| fallback img | 27 | 210 | `https://fallback.pics/` | 0 |
| fallback image | 32 | 90 | `https://fallback.pics/` | 0 |

Interpretation: Google currently understands the homepage around "fallback image" terms, but not around the broader "placeholder image" market where most search volume sits.

## Competitor Benchmark

Semrush's organic competitor overlap report returned no meaningful competitors for fallback.pics because the site ranks for too few keywords. I used Semrush SERP reports for `placeholder image api` and `dummy image generator`, then benchmarked the domains that actually appear in those SERPs.

| Competitor | US Organic Keywords | Est. Organic Traffic | Traffic Cost | Backlinks | Ref. Domains | Authority Score |
|---|---:|---:|---:|---:|---:|---:|
| placehold.co | 1,002 | 10,868 | 22,189 | 2,379,792 | 3,531 | 40 |
| picsum.photos | 2,066 | 7,465 | 7,043 | 1,609,122 | 8,018 | 45 |
| placehold.net | 193 | 2,043 | 6,669 | 454 | 131 | 13 |
| placeholderimage.dev | 204 | 1,094 | 2,690 | 548 | 187 | 19 |
| dummyimage.com | 477 | 449 | 10 | 476,745 | 3,604 | 39 |
| fallback.pics | 2 | 0 | 0 | 28 | 21 | 2 |

What competitors are winning:

- placehold.co owns broad head terms: position 1 for `placeholder`, `placeholder image`, `image placeholder`, `placeholder images`, and related variants.
- picsum.photos wins the random/test image angle: position 1 for `test image`, `lorem picsum`, `picsum`, plus position 4 for `random image`.
- dummyimage.com owns the exact "dummy image" cluster: position 1 for `dummy image`, `dummy image generator`, `dummy images`, and `dummy image creator`.
- placeholderimage.dev and placehold.net rank well despite smaller backlink profiles because their domain and page targeting are exact-match for "placeholder image".

## Keyword Research

Seed keyword metrics from Semrush US:

| Keyword | Volume | CPC | Competition | Notes |
|---|---:|---:|---:|---|
| placeholder image | 8,100 | 4.57 | 0.00 | Core head term. Competitors rank with simple utility pages. |
| image placeholder | 4,400 | 4.57 | 0.00 | Same intent as above; should be covered on the main generator/API page. |
| placeholder images | 1,900 | 4.57 | 0.00 | Plural variant with meaningful volume. |
| placeholder image generator | 320 | 0.00 | 0.01 | High product fit; fallback.pics does not currently rank. |
| dummy images | 210 | 0.00 | 0.00 | Supports dummy image generator cluster. |
| placeholder image api | 140 | 0.00 | 0.33 | Best B2B/developer-fit keyword. |
| dummy image generator | 140 | 0.00 | 0.00 | Competitor-owned by dummyimage.com. |
| broken image placeholder | 110 | 0.00 | 0.00 | Lower volume, highly aligned with brand positioning. |
| fallback image | 90 | 0.00 | 0.00 | Current ranking keyword, but lower demand. |
| image fallback | 20 | 0.00 | 0.33 | Low volume but product-relevant. |

Question terms from Semrush are mostly low-volume but useful for guides and FAQ content:

| Keyword | Volume |
|---|---:|
| what is placeholder image | 50 |
| how to use placeholder image in html | 20 |
| what are placeholder images | 20 |
| what is a placeholder image | 20 |
| how to add placeholder image in html | 10 |

Recommended keyword clusters:

1. Core generator/API cluster
   - `placeholder image`
   - `image placeholder`
   - `placeholder images`
   - `placeholder image generator`
   - `placeholder image api`

2. Dummy image cluster
   - `dummy image generator`
   - `dummy image`
   - `dummy images`
   - `dummy image url`

3. Broken image/fallback cluster
   - `broken image placeholder`
   - `broken image fallback`
   - `fallback image`
   - `image fallback`
   - `react image fallback`
   - `nextjs image fallback`

4. Competitor alternative cluster
   - `placehold.co alternative`
   - `dummyimage alternative`
   - `picsum alternative`

## On-Site SEO Findings

### 1. Soft 404s Are Confirmed

Evidence: `https://fallback.pics/not-a-real-seo-test-page` returned `HTTP/2 200` and `content-type: text/html; charset=utf-8`.

Impact: Search engines may crawl and index invalid paths as duplicate homepage-like pages. This dilutes crawl quality and makes it harder for the real SEO pages to establish trust.

Fix: Add a real 404 response for unknown web paths. If using Cloudflare Pages/Astro static output, add a proper 404 page and make sure wildcard routing does not serve `index.html` for every unknown URL.

### 2. Short Image Routes Do Not Match the Advertised Product

Evidence:

- `https://fallback.pics/api/v1/400x300` returns `HTTP/2 200`, `content-type: image/svg+xml`, and `cache-control: public, max-age=31536000, immutable`.
- `https://fallback.pics/400x300` returns `HTTP/2 200`, `content-type: text/html; charset=utf-8`, and the homepage canonical.
- `https://fallback.pics/400x300.png` also returns `text/html`.
- The sitemap includes `https://fallback.pics/400x300` as a URL.

Impact: This creates a trust gap between product messaging, sitemap URLs, and actual production behavior. It also blocks rankings for utility-style searches where users expect the URL itself to generate an image.

Fix options:

- Preferred: route root image patterns like `/400x300`, `/square/400`, `/avatar/200`, and `/banner/1200x400` to the Worker while reserving web page slugs for Astro.
- Alternative: make `/api/v1/...` the only supported public API path, update all docs and sitemap entries, and do not list short image routes as indexable pages.

### 3. Canonicals Conflict With Trailing-Slash Redirects

Evidence:

- `https://fallback.pics/placeholder-image-api` returns `308` to `/placeholder-image-api/`.
- The fetched `/placeholder-image-api/` page declares canonical `https://fallback.pics/placeholder-image-api`.
- The same pattern appears on `dummy-image-generator`, `broken-image-fallback`, and `alternatives/placehold-co-alternative`.
- Source likely location: `apps/web/src/pages/[...slug].astro`, where `canonical` is built as `https://fallback.pics/${page.slug}`.

Impact: Google can resolve this, but it is an unnecessary canonical signal conflict on exactly the pages that need maximum clarity.

Fix: Choose one URL style. Given production redirects to trailing slash, set SEO page canonicals and sitemap URLs to the trailing-slash versions.

### 4. Sitemap Is Useful but Needs Cleanup

Evidence: `apps/web/public/sitemap.xml` lists 23 URLs, including SEO landing pages, guides, alternatives, blog pages, and image examples.

Issues:

- Several sitemap URLs redirect to trailing-slash versions.
- `/400x300` is listed as a sitemap URL but serves homepage HTML, not an image or useful page.
- API example URLs should not be indexed as thin HTML pages unless they serve a genuine indexable page with unique content.

Fix: Update sitemap URLs to the canonical final URLs. Remove or correct short API endpoint entries until those routes return the intended response.

### 5. `llms.txt` Is a Soft Fallback

Evidence: `https://fallback.pics/llms.txt` returns `HTTP/2 200` with `content-type: text/html; charset=utf-8`.

Impact: If AI search/GEO readiness matters, this is a poor signal. A crawler requesting `llms.txt` receives the homepage instead of a structured file or a clear 404.

Fix: Publish a real `/llms.txt` with concise product, docs, API, and support links, or return a clean 404 if not supporting it yet.

### 6. Homepage Positioning Is Strong for Brand, Weak for Search Demand

Evidence:

- Title: `Fallback Image Infrastructure for Production Apps | fallback.pics`
- H1: `Never show broken images again.`
- Semrush current rankings are `fallback img` and `fallback image`, not `placeholder image`, `placeholder image API`, or `placeholder image generator`.

Impact: The homepage differentiates the product, but it does not directly align with the largest available demand. Competitors ranking for the head terms use direct page titles and H1s around placeholder images.

Fix: Make the homepage and/or a primary product page explicitly target "placeholder image API" and "placeholder image generator" without losing the fallback positioning. Example title direction: `Placeholder Image API for Reliable Fallback Images | fallback.pics`.

### 7. Backlink Profile Is Too Weak To Compete Yet

Evidence: Semrush reports 28 backlinks from 21 referring domains, authority score 2, trust score 2, 0 follow links, and 28 nofollow links. GitHub is the strongest referring domain with 3 links; many other referring domains have very low authority scores.

Impact: The site is trying to compete against domains with 131 to 8,018 referring domains. Content and technical fixes are required, but they will not be enough without links from developer-relevant sources.

Fix: Prioritize developer distribution that creates real references: GitHub README/docs, npm/package examples if relevant, dev.to tutorials, comparison posts, webdev tool directories, "awesome" lists, Product Hunt, Hacker News, Reddit, and framework-specific fallback image examples.

## Recommended SEO Strategy

The most practical path is to own a narrow developer wedge first, then broaden:

1. Win `placeholder image API` and `placeholder image generator`.
2. Use `/dummy-image-generator/` to compete for dummy-image terms.
3. Use guides to capture implementation intent: React, Next.js, HTML `onerror`, ecommerce placeholders.
4. Use alternative pages for competitor-aware users.
5. Build links through open-source and developer education, not generic directory spam.

## Priority Findings

| Priority | Finding | Severity | Confidence |
|---|---|---|---|
| P0 | Unknown paths return 200 HTML soft 404s | High | Confirmed |
| P0 | Short image routes return homepage HTML instead of images | High | Confirmed |
| P1 | SEO page canonicals conflict with trailing-slash redirects | Medium | Confirmed |
| P1 | Sitemap includes redirecting and currently misleading endpoint URLs | Medium | Confirmed |
| P1 | Homepage search intent does not match highest-volume keywords | Medium | Confirmed |
| P1 | Backlink profile is far behind competitors | High | Confirmed |
| P2 | `llms.txt` returns homepage HTML | Low/Medium | Confirmed |
| P2 | Security headers are incomplete for a production SaaS surface | Low | Confirmed |

