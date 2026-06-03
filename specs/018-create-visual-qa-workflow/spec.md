# Feature Specification: Create Visual QA Workflow

**Feature Branch**: `018-create-visual-qa-workflow`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/18-create-visual-qa-workflow.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Visual QA Workflow (Priority: P1)

As a maintainer, I want a repeatable visual QA workflow so that homepage, docs, generator, and mobile-menu layout regressions are caught before release.

**Why this priority**: Recent UI issues are visual and need repeatable route/viewport review.

**Independent Test**: Run the documented visual QA command; confirm it covers route/viewport matrix, screenshots, overflow checks, console checks, and mobile menu state.

**Acceptance Scenarios**:

1. **Given** the affected fallback.pics surface, **When** a maintainer or visitor uses the documented route, UI, script, or guidance, **Then** it matches the requirements without public URL, layout, accessibility, or claim-safety regressions.
2. **Given** representative desktop and mobile viewports where relevant, **When** the surface is inspected, **Then** it remains usable, contained, and free of horizontal overflow.

### Edge Cases

- /
- /placeholder-image-generator/
- /placeholder-image-api/
- /docs/
- mobile menu open state

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A documented visual QA command or workflow MUST use Playwright.
- **FR-002**: The workflow MUST cover homepage, placeholder generator, placeholder API, docs, and mobile menu open state.
- **FR-003**: The workflow MUST capture or inspect desktop and mobile viewport states.
- **FR-004**: The workflow MUST check horizontal overflow.
- **FR-005**: The workflow MUST document manual review points for screenshots.
- **FR-006**: The workflow MUST NOT require paid external services.

### Key Entities *(include if feature involves data)*

- **Public Route**: A site or API path with expected status, content type, layout, or navigation behavior.
- **Validation Command**: A documented command that can prove route, SEO, or visual behavior without paid services.
- **Responsive Surface**: A page or component that must remain usable across mobile, tablet, and desktop viewports.

## Constitution Alignment *(mandatory)*

- **Public URLs**: /; /placeholder-image-generator/; /placeholder-image-api/; /docs/; mobile menu open state
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
