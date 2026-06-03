# Feature Specification: Fix Content Page Sidebar and Code Containment

**Feature Branch**: `014-content-page-sidebar-code-containment`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/14-fix-content-page-sidebar-code-containment.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Content Page Sidebar and Code Containment (Priority: P1)

As a developer reading a content page, I want examples and sidebars to stay visually separated so that code snippets are easy to scan and copy.

**Why this priority**: Overlapping sidebars and code blocks make developer examples feel unfinished and harder to copy.

**Independent Test**: View representative content pages at desktop and mobile widths; confirm article/code surfaces never render under sidebar cards.

**Acceptance Scenarios**:

1. **Given** the affected fallback.pics surface, **When** a maintainer or visitor uses the documented route, UI, script, or guidance, **Then** it matches the requirements without public URL, layout, accessibility, or claim-safety regressions.
2. **Given** representative desktop and mobile viewports where relevant, **When** the surface is inspected, **Then** it remains usable, contained, and free of horizontal overflow.

### Edge Cases

- /placeholder-image-generator/
- /placeholder-image-api/
- /docs/

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Main article content MUST NOT render underneath sidebar cards on desktop content pages.
- **FR-002**: Code blocks MUST be scrollable or contained inside the article column.
- **FR-003**: Copy buttons MUST remain visible and clickable.
- **FR-004**: Sidebar cards MUST maintain stable width and spacing.
- **FR-005**: The fix MUST apply consistently to shared SEO/content pages.
- **FR-006**: Mobile layout MUST remain single-column with no horizontal overflow.

### Key Entities *(include if feature involves data)*

- **Public Route**: A site or API path with expected status, content type, layout, or navigation behavior.
- **Validation Command**: A documented command that can prove route, SEO, or visual behavior without paid services.
- **Responsive Surface**: A page or component that must remain usable across mobile, tablet, and desktop viewports.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /placeholder-image-generator/; /placeholder-image-api/; /docs/
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
