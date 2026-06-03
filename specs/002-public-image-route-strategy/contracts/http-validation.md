# HTTP Validation Contract: Resolve Public Image Route Strategy

## Public URL Truth

/api/v1/400x300 => image/svg+xml; /400x300 => not documented or indexed; /api/v1/not-a-size => 400 API error

## Required Checks

- A documented HTML page returns the expected HTML page and self-canonical URL.
- A documented generated image URL uses `/api/v1/...` and returns `image/svg+xml`.
- Unknown web paths return a real 404 page and must not inherit homepage canonical metadata.
- Invalid API image paths return explicit API errors rather than homepage HTML.
- Sitemap entries point only to final canonical HTML URLs, not root-level image endpoints.
