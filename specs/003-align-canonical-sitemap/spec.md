# Feature Specification: Align Canonical and Sitemap URLs

**Feature Branch**: `003-align-canonical-sitemap`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/03-align-canonical-and-sitemap-urls.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Align Canonical and Sitemap URLs (Priority: P1)

As a search engine, I want sitemap URLs and canonical tags to resolve to the final preferred URL so fallback.pics pages consolidate ranking signals cleanly.

**Why this priority**: Canonical drift and redirecting sitemap entries weaken crawl quality.

**Independent Test**: Build the web app and inspect sitemap, canonical tags, og:url, and JSON-LD URLs for matching trailing-slash SEO page URLs.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- /placeholder-image-api/ canonical self URL
- /dummy-image-generator/ canonical self URL
- /broken-image-fallback/ canonical self URL

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every sitemap loc for an SEO page MUST use the final trailing-slash canonical URL.
- **FR-002**: SEO page canonical tags MUST match the rendered final URL.
- **FR-003**: Open Graph og:url MUST match the canonical URL.
- **FR-004**: Structured data url fields MUST match the canonical URL.
- **FR-005**: Sitemap entries MUST NOT point to root-level image endpoints or non-indexed pages.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /placeholder-image-api/ canonical self URL; /dummy-image-generator/ canonical self URL; /broken-image-fallback/ canonical self URL
- **Expected HTTP behavior**: Public web URLs return truthful 200/404 HTML behavior; image API URLs use `/api/v1/...`; invalid API requests return explicit errors; SEO pages use self-canonical final URLs.
- **Edge delivery impact**: Deterministic SVG image generation and immutable cache headers are preserved; no storage, raster conversion, or third-party image dependency is introduced.
- **Documentation/SEO updates**: Site pages, sitemap, examples, metadata, JSON-LD, docs, API reference, or llms.txt are updated within the owning story.
- **Privacy/security/observability**: Query strings and user text remain treated as sensitive URL data; no secrets are introduced; CORS, content type, cache, and security headers remain explicit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of affected documented public URLs have a defined expected status and content type in this spec or quickstart validation.
- **SC-002**: 100% of affected sitemap and canonical URLs use final preferred URLs with no misleading root-level image endpoint entries.
- **SC-003**: 100% of visible image examples in affected pages use the selected `/api/v1/...` route strategy.
- **SC-004**: Web build and relevant scriptable checks complete without introducing public URL truth regressions.

## Assumptions

- The canonical image route strategy is `/api/v1/...`; root-level short image routes are not documented or indexed.
- SEO landing page final canonical URLs use trailing slashes.
- Validation against production-specific status codes is performed with curl after deployment; local build validates generated source and static assets.
