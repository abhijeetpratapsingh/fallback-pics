# fallback.pics SEO Re-Audit and Improvement Check

Audit date: 2026-06-03  
Scope: full-site SEO re-audit of `https://fallback.pics/` with comparison against the previous 2026-06-03 baseline.  
Primary market: United States desktop search.  
Data used: Semrush domain overview, organic research, keyword research, backlink analytics, live HTTP header checks, live HTML checks, sitemap review, `robots.txt`, `llms.txt`, and the previous `FULL-AUDIT-REPORT.md` baseline.

## Audit Summary

Overall rating: Good technical progress, but organic visibility has not improved yet.  
Directional SEO health score: 72/100.  
Score confidence: Medium. Semrush and live technical checks were available, but the bundled SEO scripts for PageSpeed, parser, robots, `llms.txt`, social meta, and security headers could not run because this Python environment is missing `requests` and `beautifulsoup4`.

Top improvements:

1. Unknown web paths now return a real `404` instead of homepage HTML.
2. `/llms.txt` now returns `text/plain` with product, docs, API, and core topic links.
3. Core SEO pages now use trailing-slash canonicals that match their final URLs.
4. `/placeholder-image-generator/` is live and indexable with targeted title, description, H1, examples, and internal links.
5. Homepage title and meta description now target `placeholder image API` and `placeholder image generator`.

Top remaining issues:

1. Semrush still reports only 2 US organic keywords, 0 estimated organic traffic, and no rankings for the core placeholder-image terms.
2. Sitemap still includes some non-final URLs, such as `/docs`, `/api`, `/features`, and `/blog`, which redirect to trailing-slash URLs.
3. Homepage copy still contains at least one root-style API example, `GET /800x450/18181B/FFFFFF?text=Product+Image`, while root image routes now return 404 and the canonical API route is `/api/v1/...`.
4. API, generator, and dummy-image pages include `FAQPage` JSON-LD. For a commercial developer SaaS page, this is no longer a useful Google rich-result target and should be removed or replaced with safer structured data.
5. Security headers are still incomplete on the web surface: live homepage headers show `X-Content-Type-Options` and `Referrer-Policy`, but not HSTS, CSP, or frame-ancestor protection.

## What Improved Since the Previous Audit

| Previous finding | Previous evidence | Current evidence | Status |
|---|---|---|---|
| Soft 404s | `/not-a-real-seo-test-page` returned `200 text/html` | `/not-a-real-seo-test-page` now returns `HTTP/2 404`, `cache-control: no-store` | Improved |
| Short image routes returned homepage HTML | `/400x300` and `/400x300.png` returned `200 text/html` | `/400x300` and `/400x300.png` now return `HTTP/2 404`; `/api/v1/400x300` returns `200 image/svg+xml` | Improved, strategy now appears to be `/api/v1/...` only |
| `/llms.txt` was a soft fallback | `/llms.txt` returned homepage HTML | `/llms.txt` returns `200 text/plain` with primary pages, topics, and canonical API route guidance | Improved |
| Canonicals conflicted on core SEO pages | `/placeholder-image-api/` declared non-trailing canonical | `/placeholder-image-api/`, `/placeholder-image-generator/`, `/dummy-image-generator/`, `/broken-image-fallback/`, and `/docs/` declare trailing-slash canonicals | Improved |
| Homepage was weak for search-demand terms | Title was `Fallback Image Infrastructure for Production Apps | fallback.pics` | Homepage title is `Placeholder Image API and Fallback Image Generator | fallback.pics`; meta description includes `placeholder images`, `fallback images`, `placeholder image API`, and `generator` | Improved |
| Missing generator page | `/placeholder-image-generator/` was recommended | `/placeholder-image-generator/` is live with targeted title, description, H1, examples, FAQ content, and related links | Improved |
| Sitemap included short image endpoint URLs | Prior sitemap listed `/400x300` as a URL | Current sitemap no longer lists `/400x300` as a page URL; image sitemap entries point to `/api/v1/...` | Improved |

## Current Semrush Visibility

Semrush current US snapshot for `fallback.pics`:

| Metric | Current value | Previous baseline | Change |
|---|---:|---:|---:|
| Semrush rank | 26,036,061 | 26,036,061 | No meaningful change |
| Organic keywords | 2 | 2 | No change |
| Estimated organic traffic | 0 | 0 | No change |
| Organic traffic cost | 0 | 0 | No change |
| Paid keywords | 0 | 0 | No change |
| Paid traffic | 0 | 0 | No change |

Current ranking keywords:

| Keyword | Position | Previous position | Search volume | Ranking URL | Traffic |
|---|---:|---:|---:|---|---:|
| fallback img | 27 | 27 | 210 | `https://fallback.pics/` | 0 |
| fallback image | 32 | 32 | 90 | `https://fallback.pics/` | 0 |

Historical Semrush trend remains unchanged in direction:

- 0 organic keywords through October 2025.
- 2 organic keywords in November 2025.
- Peak of 6 organic keywords in December 2025.
- 2 organic keywords by April and May 2026.
- Estimated traffic remains 0 for every available month.

Interpretation: implementation quality has improved, but Semrush has not yet observed ranking gains. That is normal if fixes were deployed recently, because crawl, indexing, and ranking updates lag production changes.

## Competitor Benchmark

Semrush still shows fallback.pics far behind the active placeholder-image market.

| Competitor | US Organic Keywords | Est. Organic Traffic | Traffic Cost | Backlinks | Ref. Domains | Follow Links |
|---|---:|---:|---:|---:|---:|---:|
| placehold.co | 1,002 | 10,868 | 22,189 | 2,379,861 | 3,531 | 2,378,312 |
| picsum.photos | 2,066 | 7,465 | 7,043 | 1,609,747 | 8,021 | 1,602,348 |
| placehold.net | 193 | 2,043 | 6,669 | 454 | 131 | 290 |
| placeholderimage.dev | 204 | 1,094 | 2,690 | 548 | 187 | 341 |
| dummyimage.com | 477 | 449 | 10 | 476,745 | 3,604 | 472,524 |
| fallback.pics | 2 | 0 | 0 | 28 | 21 | 0 |

Current SERP checks from Semrush:

- `placeholder image api`: top 20 includes placehold.co, picsum.photos, dev.me, Reddit, OpenReplay, loremipsum.io, placehold.net, placeholderimage.dev, pravatar.cc, placeholders.dev, TwicPics, Apify, and others. fallback.pics is not in the top 20.
- `placeholder image generator`: top 20 includes placehold.co, placeholderimage.dev, picsum.photos, betterbugs.io, dummyimage.com, customer.io, loremipsum.io, fpoimg.com, WebsitePlanet, TestingBot, PicPerf, and others. fallback.pics is not in the top 20.
- `dummy image generator`: top 20 includes dummyimage.com, dummy-image-generator.com, picsum.photos, placeholderimage.dev, WebsitePlanet, dummyimg.in, testdatahub.com, dummyimage.web.app, Image Elf, 24toolbox, ToolCookie, GitHub, and others. fallback.pics is not in the top 20.

## Keyword Research Snapshot

Semrush US keyword metrics remain the same core opportunity set:

| Keyword | Volume | CPC | Competition | Current fallback.pics ranking |
|---|---:|---:|---:|---|
| placeholder image | 8,100 | 4.57 | 0.00 | Not top 100 |
| image placeholder | 4,400 | 4.57 | 0.00 | Not top 100 |
| placeholder images | 1,900 | 4.57 | 0.00 | Not top 100 |
| placeholder image generator | 320 | 0.00 | 0.01 | Not top 100 |
| dummy images | 210 | 0.00 | 0.00 | Not top 100 |
| fallback img | 210 | 0.00 | 0.00 | Position 27 |
| placeholder image api | 140 | 0.00 | 0.33 | Not top 100 |
| dummy image generator | 140 | 0.00 | 0.00 | Not top 100 |
| broken image placeholder | 110 | 0.00 | 0.00 | Not top 100 |
| fallback image | 90 | 0.00 | 0.00 | Position 32 |
| image fallback | 20 | 0.00 | 0.33 | Not top 100 |
| react image fallback | 20 | 0.00 | 0.33 | Not top 100 |
| nextjs image fallback | 20 | 0.00 | 0.33 | Not top 100 |

Recommended priority remains:

1. `placeholder image API`
2. `placeholder image generator`
3. `dummy image generator`
4. `broken image fallback`
5. `react image fallback` and `nextjs image fallback`

## Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Crawlability | Pass | Confirmed | Soft 404 behavior is fixed for unknown paths. | Live `curl -I -L https://fallback.pics/not-a-real-seo-test-page` returned `HTTP/2 404` with `cache-control: no-store`. | Keep a regression check for unknown routes returning 404. |
| API routing | Pass with cleanup | Confirmed | The public strategy now appears standardized on `/api/v1/...`. | `/api/v1/400x300` returns `200 image/svg+xml`; `/400x300` and `/400x300.png` return 404. | Update every visible docs/code example to use `/api/v1/...`. |
| API routing | Warning | Confirmed | Homepage still contains one root-style API example. | Live homepage HTML contains `GET /800x450/18181B/FFFFFF?text=Product+Image`; root image routes return 404. | Change this example to `GET /api/v1/800x450/18181B/FFFFFF?text=Product+Image`. Scan all content for the same pattern. |
| Sitemap | Warning | Confirmed | Sitemap still includes redirecting non-final URLs. | Sitemap lists `https://fallback.pics/docs`, `/api`, `/features`, and `/blog`; live checks show each returns `308` to trailing-slash versions. | Make all sitemap `<loc>` values final 200 URLs, e.g. `/docs/`, `/api/`, `/features/`, `/blog/`, and trailing-slash blog posts if those routes redirect. |
| Canonicals | Pass | Confirmed | Core SEO page canonicals now match trailing-slash final URLs. | Live HTML for `/placeholder-image-api/`, `/placeholder-image-generator/`, `/dummy-image-generator/`, `/broken-image-fallback/`, and `/docs/` declares trailing-slash canonicals. | Keep canonical generation aligned with final URLs. |
| `llms.txt` | Pass | Confirmed | `llms.txt` is now real and useful. | Live `/llms.txt` returns `text/plain` and lists homepage, docs, API reference, GitHub, topic pages, and canonical API route guidance. | Keep it updated when docs/routes change. |
| Robots and AI crawling | Info | Confirmed | AI search readiness is mixed by design. | `robots.txt` allows general crawling, lists sitemap, but disallows GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, Bytespider, and CCBot. | Keep if this is the intended rights/privacy posture. Revisit only if AI crawler discovery is a growth priority. |
| Homepage on-page SEO | Pass | Confirmed | Homepage metadata now targets broader search demand. | Title: `Placeholder Image API and Fallback Image Generator | fallback.pics`; description includes `placeholder images`, `fallback images`, `placeholder image API`, and `generator`. | Keep "Never show broken images again" as brand H1, but continue reinforcing exact-match terms in supporting copy and internal links. |
| New generator page | Pass | Confirmed | Dedicated generator page is live and targeted. | `/placeholder-image-generator/` returns 200; title, description, H1, copy, examples, and links all target the generator cluster. | Build links to this page from README, docs, guides, and external developer content. |
| Structured data | Warning | Confirmed | `FAQPage` JSON-LD is present on commercial pages where Google rich results are generally restricted. | Live HTML for `/placeholder-image-api/`, `/placeholder-image-generator/`, and `/dummy-image-generator/` contains `FAQPage` schema. | Remove `FAQPage` JSON-LD. Keep visible FAQ content, and use `WebPage`, `SoftwareApplication`, `Organization`, and `BreadcrumbList` where appropriate. Do not add `HowTo` schema. |
| Security headers | Warning | Confirmed | Web pages are missing several common security headers. | Homepage headers include `X-Content-Type-Options: nosniff` and `Referrer-Policy`, but no `Strict-Transport-Security`, `Content-Security-Policy`, or frame-ancestor protection. | Add headers through Cloudflare Pages `_headers` or equivalent deployment config. |
| Backlinks | Warning | Confirmed | Authority remains too weak to compete for head terms. | Semrush backlink overview: 28 backlinks, 21 referring domains, 0 follow links, authority score 2, trust score 2. | Prioritize developer-relevant follow links from GitHub, docs, tutorials, directories, examples, and comparison content. |
| Organic visibility | Warning | Confirmed | Ranking impact has not appeared yet. | Semrush still reports 2 US organic keywords and 0 estimated traffic; current rankings are only `fallback img` position 27 and `fallback image` position 32. | Track Google Search Console weekly after deployment; do not expect Semrush movement immediately. |
| Performance | Unknown | Hypothesis | Core Web Vitals were not measured in this pass. | PageSpeed/script checks could not run because local SEO script dependencies were unavailable. | Run PageSpeed Insights or install audit dependencies before the next full technical report. |

## Score Notes

Technical SEO: 78/100  
Positive signals: real 404s, live SVG API route, correct `/llms.txt`, robots sitemap entry, core SEO canonicals fixed.  
Deficits: redirecting sitemap URLs, one incorrect root-style API example, incomplete security headers.

Content and on-page SEO: 80/100  
Positive signals: stronger homepage metadata, dedicated generator page, targeted API/dummy/broken pages, visible examples, internal links.  
Deficits: Semrush still shows no rankings for the core keyword cluster, and external authority is low.

Schema and structured data: 55/100  
Positive signals: `SoftwareApplication`, `Organization`, and `WebPage` schema are present.  
Deficits: `FAQPage` is now used on commercial pages where it is not a practical rich-result opportunity; breadcrumb structured data is not visible in checked pages.

AI search readiness: 75/100  
Positive signals: `llms.txt` exists and is product-specific.  
Deficits: robots policy blocks major AI crawlers, which may be intentional but limits AI crawler exposure.

Authority and off-site SEO: 20/100  
Positive signals: GitHub is present as a high-authority referring domain.  
Deficits: Semrush reports 0 follow links and a backlink gap of two to four orders of magnitude versus the main competitors.

## Environment Limitations

The SEO skill scripts were attempted but did not run because the local Python environment is missing required packages:

- `parse_html.py`: missing `beautifulsoup4`
- `security_headers.py`: missing `requests`
- `robots_checker.py`: missing `requests`
- `llms_txt_checker.py`: missing `requests`
- `social_meta.py`: missing `requests`

The report therefore uses Semrush data, direct `curl` header/body checks, sitemap inspection, and targeted markup extraction from the fetched live HTML.
