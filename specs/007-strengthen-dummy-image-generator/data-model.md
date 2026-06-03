# Data Model: Strengthen Dummy Image Generator Page

## PublicUrl

- `path`: Public path or full URL.
- `expectedStatus`: Expected HTTP status.
- `contentType`: Expected content type where relevant.
- `canonicalUrl`: Preferred final URL for indexable HTML pages.
- `robots`: Robots directive where relevant.
- `cachePolicy`: Cache behavior for deterministic image API responses.

## SeoPageMetadata

- `title`: Browser title and social title.
- `description`: Meta and social description.
- `canonical`: Final preferred URL.
- `ogUrl`: Open Graph URL, expected to match canonical.
- `structuredDataUrl`: JSON-LD URL, expected to match canonical.

## ImageExample

- `url`: Canonical `/api/v1/...` generated image URL.
- `label`: Human-readable example label.
- `expectedContentType`: `image/svg+xml` for current generated images.
- `usageSurface`: Docs, homepage, SEO page, guide, or llms.txt.
