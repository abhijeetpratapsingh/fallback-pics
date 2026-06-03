# Feature Specification: Improve Trust Signals

**Feature Branch**: `010-improve-trust-signals`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/10-improve-trust-signals.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Improve Trust Signals (Priority: P1)

As a developer evaluating fallback.pics for production use, I want clear technical trust details so that I can understand caching, content types, privacy posture, and failure behavior before adopting it.

**Why this priority**: Trust details reduce adoption risk and prevent unsupported infrastructure claims.

**Independent Test**: Build docs/API/privacy/homepage; verify header documentation, cache behavior, privacy wording, API errors, security headers, claim safety, and trust links.

**Acceptance Scenarios**:

1. **Given** the public fallback.pics site, **When** the affected public URLs are requested, **Then** their status, content type, canonical, robots, cache, or structured data behavior matches the requirements.
2. **Given** a developer or crawler reads docs, examples, sitemap, or metadata, **When** they follow a documented URL, **Then** the URL resolves to the documented final behavior without misleading homepage HTML.

### Edge Cases

- /api => headers and error behavior
- /docs => trust signals
- /privacy => no-cookie delivery posture
- https://status.fallback.pics external trust link

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Docs or API Reference MUST document response headers for image routes.
- **FR-002**: Product pages MUST show deterministic cache behavior with accurate examples.
- **FR-003**: Privacy copy MUST explain image delivery does not require cookies.
- **FR-004**: Uptime, latency, SLA, and enterprise claims MUST be safely worded unless evidence-backed.
- **FR-005**: API error behavior MUST be documented.
- **FR-006**: Security-relevant headers MUST be reviewed and documented where relevant.
- **FR-007**: Trust copy MUST link to Docs, API Reference, Status, Privacy, and GitHub.

### Key Entities *(include if feature involves data)*

- **Public URL**: A web, docs, SEO, sitemap, or image API URL whose status, content type, cache policy, canonical, robots, or example behavior must be truthful.
- **SEO Page Metadata**: Title, description, canonical URL, Open Graph URL, and structured data emitted by a page.
- **Image API Example**: A copy-paste `/api/v1/...` URL expected to return an image response.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /api => headers and error behavior; /docs => trust signals; /privacy => no-cookie delivery posture; https://status.fallback.pics external trust link
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
