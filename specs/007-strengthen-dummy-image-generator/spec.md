# Feature Specification: Strengthen Dummy Image Generator Page

**Feature Branch**: `007-strengthen-dummy-image-generator`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/07-strengthen-dummy-image-generator-page.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Strengthen Dummy Image Generator Page (Priority: P1)

As a developer looking for dummy images for mockups or tests, I want a page that gives me working dummy image URLs with custom size, text, and color examples.

**Why this priority**: The page owns dummy-image search intent and must provide working examples.

**Independent Test**: Build `/dummy-image-generator/`; verify title, H1, intro, examples, FAQ, internal links, and canonical URL.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- /dummy-image-generator/ => 200 text/html self canonical
- dummy example URLs => /api/v1 image/svg+xml

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page title, H1, intro, and body copy MUST clearly target dummy image generator.
- **FR-002**: The page MUST include fixed-size, custom text, custom color, avatar, and product/card examples.
- **FR-003**: Every visible URL example MUST use `/api/v1/...` and return an image response.
- **FR-004**: The page MUST link to Placeholder Image API, API Reference, Docs, and relevant guides.
- **FR-005**: The page MUST differentiate dummy images from fallback images without duplicate content.
- **FR-006**: The page MUST include FAQ or explanatory content for common dummy-image use cases.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /dummy-image-generator/ => 200 text/html self canonical; dummy example URLs => /api/v1 image/svg+xml
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
