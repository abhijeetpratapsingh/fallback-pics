# HTTP Validation Contract: Add Placeholder Image Generator Page

## Public URL Truth

/placeholder-image-generator/ => 200 text/html self canonical; /api/v1/800x450/7C3AED/FFFFFF?text=Placeholder+Image => image/svg+xml

## Required Checks

- A documented HTML page returns the expected HTML page and self-canonical URL.
- A documented generated image URL uses `/api/v1/...` and returns `image/svg+xml`.
- Unknown web paths return a real 404 page and must not inherit homepage canonical metadata.
- Invalid API image paths return explicit API errors rather than homepage HTML.
- Sitemap entries point only to final canonical HTML URLs, not root-level image endpoints.
