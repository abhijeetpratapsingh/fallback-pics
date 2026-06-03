# SEO Measurement Workflow

Use this workflow to record whether fallback.pics SEO work is producing indexing, query, crawl, and authority movement. Do not commit private Search Console exports, API tokens, or account screenshots.

## Target Queries

- placeholder image
- placeholder image api
- placeholder image generator
- dummy image generator
- broken image placeholder
- react image fallback
- nextjs image fallback

## Priority Pages

- https://fallback.pics/
- https://fallback.pics/placeholder-image-api/
- https://fallback.pics/placeholder-image-generator/
- https://fallback.pics/dummy-image-generator/
- https://fallback.pics/broken-image-fallback/
- https://fallback.pics/guides/react-image-fallback/
- https://fallback.pics/guides/nextjs-image-fallback/
- https://fallback.pics/guides/img-onerror-fallback/

## Snapshot Fields

Copy these fields into a private spreadsheet, CSV, or issue comment when recording a measurement snapshot:

```text
date,source,query,page,impressions,clicks,average_position,indexed_state,crawl_issue,referring_domains,backlinks,follow_links,notes
2026-06-03,Semrush audit,placeholder image api,https://fallback.pics/placeholder-image-api/,unknown,unknown,unknown,unknown,technical fixes in progress,21,28,0,Public backlink gap benchmark; no private credentials used.
```

## Search Console Checks

1. Open Google Search Console for `fallback.pics`.
2. In Performance, filter each target query and record impressions, clicks, average position, and top page.
3. In Pages, inspect each priority page and record indexed state.
4. In Sitemaps and Crawl Stats, record soft 404s, redirects, sitemap errors, and notable crawl issue changes.
5. Treat any ranking or traffic statement as unverified unless it is backed by a dated source row.

## Authority Checks

Record referring domains, backlinks, and follow-link count from Semrush or another chosen backlink source. Keep the source name in the snapshot because backlink tools differ.

## Local Technical Recheck

Before recording a new measurement snapshot, run:

```bash
pnpm --filter @fallback-pics/web seo:smoke
pnpm --filter @fallback-pics/web seo:priority
```

These commands verify local technical signals only. They do not replace Search Console indexing or query data.
