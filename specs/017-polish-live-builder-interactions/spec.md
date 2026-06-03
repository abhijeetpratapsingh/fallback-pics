# Feature Specification: Polish Live Builder Interactions

**Feature Branch**: `017-polish-live-builder-interactions`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/17-polish-live-builder-interactions.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Polish Live Builder Interactions (Priority: P1)

As a developer testing fallback image options, I want the builder controls and copy feedback to be clear so that I can quickly create a URL and trust that it copied correctly.

**Why this priority**: The live builder is the core product surface and must feel trustworthy and usable.

**Independent Test**: Interact with preset, dimension, text, and copy controls; verify selected state, stable preview, copy feedback, keyboard access, and no layout shift.

**Acceptance Scenarios**:

1. **Given** the affected fallback.pics surface, **When** a maintainer or visitor uses the documented route, UI, script, or guidance, **Then** it matches the requirements without public URL, layout, accessibility, or claim-safety regressions.
2. **Given** representative desktop and mobile viewports where relevant, **When** the surface is inspected, **Then** it remains usable, contained, and free of horizontal overflow.

### Edge Cases

- / builder at 390x844
- / builder at 1440x1000

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Selected preset state MUST be visually unmistakable.
- **FR-002**: Copy actions MUST show success feedback without layout shift.
- **FR-003**: Inputs MUST remain readable and touch-friendly on mobile.
- **FR-004**: Preview image MUST remain stable while values change.
- **FR-005**: Builder layout MUST NOT shift when values change.
- **FR-006**: Interaction states MUST be keyboard-accessible.

### Key Entities *(include if feature involves data)*

- **Public Route**: A site or API path with expected status, content type, layout, or navigation behavior.
- **Validation Command**: A documented command that can prove route, SEO, or visual behavior without paid services.
- **Responsive Surface**: A page or component that must remain usable across mobile, tablet, and desktop viewports.

## Constitution Alignment *(mandatory)*

- **Public URLs**: / builder at 390x844; / builder at 1440x1000
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
