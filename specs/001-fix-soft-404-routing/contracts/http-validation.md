# HTTP Validation Contract: Fix Soft 404 Routing

## Public URL Truth

/not-a-real-seo-test-page => 404 text/html noindex; /placeholder-image-api/ => 200 text/html canonical self URL; /api/v1/400x300 => 200 image/svg+xml immutable cache

## Required Checks

- A documented HTML page returns the expected HTML page and self-canonical URL.
- A documented generated image URL uses `/api/v1/...` and returns `image/svg+xml`.
- Unknown web paths return a real 404 page and must not inherit homepage canonical metadata.
- Invalid API image paths return explicit API errors rather than homepage HTML.
- Sitemap entries point only to final canonical HTML URLs, not root-level image endpoints.
