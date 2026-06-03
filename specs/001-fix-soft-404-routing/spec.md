# Feature Specification: Fix Soft 404 Routing

**Feature Branch**: `001-fix-soft-404-routing`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/01-fix-soft-404-routing.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Soft 404 Routing (Priority: P1)

As a search crawler or user, I want invalid URLs to return a clear not-found response so that only real fallback.pics pages are indexed and trusted.

**Why this priority**: Search quality and public URL truth are blocked when invalid URLs return homepage HTML.

**Independent Test**: Request an invalid web path and a valid page/API route; verify 404/noindex for the invalid page and 200 image/page behavior for valid routes.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- /not-a-real-seo-test-page => 404 text/html noindex
- /placeholder-image-api/ => 200 text/html canonical self URL
- /api/v1/400x300 => 200 image/svg+xml immutable cache

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Unknown web paths MUST return HTTP 404.
- **FR-002**: The 404 page MUST use the normal site layout and include links to Docs, API Reference, and homepage.
- **FR-003**: Valid pages and SEO landing pages MUST continue to return HTTP 200.
- **FR-004**: Valid `/api/v1/...` image routes MUST continue to return image responses.
- **FR-005**: Unknown API image paths MUST return API error responses rather than homepage HTML.
- **FR-006**: Invalid paths MUST NOT include the homepage canonical URL.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /not-a-real-seo-test-page => 404 text/html noindex; /placeholder-image-api/ => 200 text/html canonical self URL; /api/v1/400x300 => 200 image/svg+xml immutable cache
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
