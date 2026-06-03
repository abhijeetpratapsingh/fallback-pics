# Feature Specification: Strengthen Placeholder Image API Page

**Feature Branch**: `006-strengthen-placeholder-api-page`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/06-strengthen-placeholder-image-api-page.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Strengthen Placeholder Image API Page (Priority: P1)

As a developer evaluating placeholder image tools, I want the Placeholder Image API page to show examples, capabilities, and tradeoffs clearly so that I can decide whether fallback.pics fits my project.

**Why this priority**: This is the primary commercial SEO page for the highest-fit developer query cluster.

**Independent Test**: Build `/placeholder-image-api/`; verify target terms, live examples, comparison table, FAQ content/schema, and internal links are visible in server-rendered HTML.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- /placeholder-image-api/ => 200 text/html self canonical
- example URLs => /api/v1 image/svg+xml

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST target placeholder image api, placeholder image, image placeholder, and placeholder image generator naturally.
- **FR-002**: The page MUST include live examples using `/api/v1/...` URLs.
- **FR-003**: The page MUST include a concise factual comparison covering fallback.pics, placehold.co, picsum.photos, dummyimage.com, and placeholderimage.dev.
- **FR-004**: The page MUST include FAQ content and FAQ JSON-LD.
- **FR-005**: The page MUST link to Docs, API Reference, Dummy Image Generator, Broken Image Fallback, and implementation guides.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /placeholder-image-api/ => 200 text/html self canonical; example URLs => /api/v1 image/svg+xml
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
