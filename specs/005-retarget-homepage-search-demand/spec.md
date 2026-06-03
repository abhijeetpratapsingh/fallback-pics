# Feature Specification: Retarget Homepage Search Demand

**Feature Branch**: `005-retarget-homepage-search-demand`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/05-retarget-homepage-for-search-demand.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Retarget Homepage Search Demand (Priority: P1)

As a developer searching for a placeholder image API, I want the fallback.pics homepage to clearly state that it generates placeholder images and fallback images so that I understand the product immediately.

**Why this priority**: The homepage is the highest-level discovery page and must align brand promise with search intent.

**Independent Test**: Build the homepage and inspect title, description, H1/hero copy, internal links, and structured data for target positioning and claim safety.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- / => 200 text/html with updated metadata
- /placeholder-image-api/ internal link
- /dummy-image-generator/ internal link
- /broken-image-fallback/ internal link
- /guides/react-image-fallback/ internal link

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Homepage title MUST include placeholder image API or a close high-intent variant.
- **FR-002**: Meta description MUST include placeholder image and fallback image language.
- **FR-003**: Above-the-fold copy MUST include placeholder image API and placeholder image generator naturally.
- **FR-004**: Hero promise “Never show broken images again” MUST remain visible.
- **FR-005**: Homepage internal links MUST point to Placeholder Image API, Dummy Image Generator, Broken Image Fallback, and React Image Fallback.
- **FR-006**: Homepage copy MUST NOT overpromise uptime, latency, or enterprise guarantees.
- **FR-007**: Structured data MUST reflect updated positioning.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: / => 200 text/html with updated metadata; /placeholder-image-api/ internal link; /dummy-image-generator/ internal link; /broken-image-fallback/ internal link; /guides/react-image-fallback/ internal link
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
