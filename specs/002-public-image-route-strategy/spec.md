# Feature Specification: Resolve Public Image Route Strategy

**Feature Branch**: `002-public-image-route-strategy`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/02-resolve-public-image-route-strategy.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Resolve Public Image Route Strategy (Priority: P1)

As a developer using fallback.pics, I want every documented image URL to return an image response so that examples can be copied directly into real projects.

**Why this priority**: Developers copy documented URLs directly; misleading root image examples break trust.

**Independent Test**: Inspect docs, demos, sitemap, and examples; every documented generated image URL uses `/api/v1/...` and returns an image response.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- /api/v1/400x300 => image/svg+xml
- /400x300 => not documented or indexed
- /api/v1/not-a-size => 400 API error

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The canonical public image route strategy MUST be `/api/v1/...`.
- **FR-002**: Root-level short image routes MUST NOT be listed in sitemap or docs examples.
- **FR-003**: Homepage snippets and live demos MUST use `/api/v1/...` URLs.
- **FR-004**: Unsupported or unknown API image paths MUST return a clear API error response, not homepage HTML.
- **FR-005**: Deterministic image responses MUST preserve immutable cache headers.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /api/v1/400x300 => image/svg+xml; /400x300 => not documented or indexed; /api/v1/not-a-size => 400 API error
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
