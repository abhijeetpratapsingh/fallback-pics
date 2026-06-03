# Feature Specification: Add SEO Measurement Checks

**Feature Branch**: `012-seo-measurement-checks`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/12-add-seo-measurement-checks.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add SEO Measurement Checks (Priority: P1)

As a maintainer, I want repeatable SEO checks so that routing, sitemap, canonical, and image-response behavior stays correct after changes.

**Why this priority**: Soft 404s, content type drift, canonical mismatches, and sitemap regressions are high-risk repeat failures.

**Independent Test**: Run the documented SEO smoke command against a configured base URL and verify pass/fail output for route, header, sitemap, and canonical checks.

**Acceptance Scenarios**:

1. **Given** the affected fallback.pics surface, **When** a maintainer or visitor uses the documented route, UI, script, or guidance, **Then** it matches the requirements without public URL, layout, accessibility, or claim-safety regressions.
2. **Given** representative desktop and mobile viewports where relevant, **When** the surface is inspected, **Then** it remains usable, contained, and free of horizontal overflow.

### Edge Cases

- /
- /placeholder-image-api/
- /dummy-image-generator/
- /broken-image-fallback/
- /api/v1/400x300
- /api/v1/avatar/200
- /not-a-real-seo-test-page

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A local script MUST check valid web pages for expected status and content type.
- **FR-002**: A local script MUST check valid API image URLs for image content type and cache headers.
- **FR-003**: A local script MUST check unknown web paths for 404.
- **FR-004**: A sitemap check MUST verify URLs resolve directly and do not redirect.
- **FR-005**: A canonical check MUST verify selected pages declare expected final canonical URLs.
- **FR-006**: A command MUST be documented for running the checks.
- **FR-007**: The checks MUST run without paid external services.

### Key Entities *(include if feature involves data)*

- **Public Route**: A site or API path with expected status, content type, layout, or navigation behavior.
- **Validation Command**: A documented command that can prove route, SEO, or visual behavior without paid services.
- **Responsive Surface**: A page or component that must remain usable across mobile, tablet, and desktop viewports.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /; /placeholder-image-api/; /dummy-image-generator/; /broken-image-fallback/; /api/v1/400x300; /api/v1/avatar/200; /not-a-real-seo-test-page
- **Expected HTTP behavior**: Examples continue to use `/api/v1/...`; web pages remain static HTML; validation scripts define expected route behavior.
- **Edge delivery impact**: No image generation logic, storage, or third-party API dependency is introduced.
- **Documentation/SEO updates**: README, contributing guidance, package scripts, visual QA docs, content layout, navigation, and validation commands are updated within story scope.
- **Privacy/security/observability**: No secrets are introduced; validation scripts are local/configurable; link guidance excludes spammy tactics and unsupported claims.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of required representative routes or documents for this story are covered by implementation tasks and validation notes.
- **SC-002**: No affected page introduces horizontal overflow at 390px, 768px, or desktop widths where visual validation applies.
- **SC-003**: Documentation and scripts run without paid external services.
- **SC-004**: Web build and relevant local checks complete without errors after implementation.

## Assumptions

- The canonical generated image route strategy remains `/api/v1/...`.
- Visual QA is a local Playwright workflow with screenshots saved outside source by default.
- Production HTTP checks can be run after deployment using the same configurable base URL pattern.
