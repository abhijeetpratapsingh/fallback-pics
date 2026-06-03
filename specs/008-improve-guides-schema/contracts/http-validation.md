# HTTP Validation Contract: Improve Implementation Guides and Schema

## Public URL Truth

/guides/img-onerror-fallback/; /guides/react-image-fallback/; /guides/nextjs-image-fallback/

## Required Checks

- A documented HTML page returns the expected HTML page and self-canonical URL.
- A documented generated image URL uses `/api/v1/...` and returns `image/svg+xml`.
- Unknown web paths return a real 404 page and must not inherit homepage canonical metadata.
- Invalid API image paths return explicit API errors rather than homepage HTML.
- Sitemap entries point only to final canonical HTML URLs, not root-level image endpoints.
