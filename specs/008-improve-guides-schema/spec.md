# Feature Specification: Improve Implementation Guides and Schema

**Feature Branch**: `008-improve-guides-schema`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/08-improve-implementation-guides-and-schema.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Improve Implementation Guides and Schema (Priority: P1)

As a frontend developer, I want practical implementation guides with copy-paste code so that I can add fallback.pics to HTML, React, or Next.js projects quickly.

**Why this priority**: Implementation guides convert developer intent into correct usage and should be visible to crawlers.

**Independent Test**: Build the three guide pages; verify complete code examples, infinite-loop handling, /api/v1 URLs, internal links, and HowTo JSON-LD.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- /guides/img-onerror-fallback/
- /guides/react-image-fallback/
- /guides/nextjs-image-fallback/

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: HTML onerror guide MUST include a complete HTML example.
- **FR-002**: React guide MUST include a complete React component example.
- **FR-003**: Next.js guide MUST include a complete Next.js-compatible example.
- **FR-004**: Each guide MUST explain how to avoid infinite fallback loops.
- **FR-005**: Each guide MUST include at least one `/api/v1/...` fallback.pics URL.
- **FR-006**: Each guide MUST link to Docs, API Reference, Placeholder Image API, and Broken Image Fallback.
- **FR-007**: HowTo schema MUST be emitted for step-by-step guide pages.
- **FR-008**: Code examples MUST be visible in rendered HTML without client hydration.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /guides/img-onerror-fallback/; /guides/react-image-fallback/; /guides/nextjs-image-fallback/
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
