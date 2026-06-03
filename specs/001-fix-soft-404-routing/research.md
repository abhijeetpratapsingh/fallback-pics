# Research: Fix Soft 404 Routing

## Decision: Use existing Astro static pages and content data for web/SEO changes

**Rationale**: The affected public pages already render from Astro pages or `apps/web/src/data/seoPages.ts`, so updating that model keeps copy, metadata, examples, and schema in one static build path.

**Alternatives considered**: Creating separate client-only pages was rejected because code examples and SEO content must be visible in server-rendered HTML.

## Decision: Standardize generated image examples on `/api/v1/...`

**Rationale**: The current Worker owns `/api/v1/...`, which avoids collisions with SEO slugs and satisfies copy-paste API examples without introducing root-level route ambiguity.

**Alternatives considered**: Supporting root-level image routes was rejected for these stories because it would require broader Cloudflare route ownership changes and collision handling.

## Decision: Use trailing-slash final canonical URLs for SEO landing pages

**Rationale**: Astro static output produces directory `index.html` pages for SEO slugs, so trailing-slash canonical URLs match final rendered routes.

**Alternatives considered**: Non-trailing canonicals were rejected because they can drift from final static page URLs and sitemap behavior.
