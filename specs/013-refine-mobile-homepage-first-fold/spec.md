# Feature Specification: Refine Mobile Homepage First Fold

**Feature Branch**: `013-refine-mobile-homepage-first-fold`

**Created**: 2026-06-03

**Status**: Implemented

**Input**: Source story converted from `specs/13-refine-mobile-homepage-first-fold.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refine Mobile Homepage First Fold (Priority: P1)

As a mobile visitor, I want to see the promise and the live builder quickly so that I understand what fallback.pics does before scrolling.

**Why this priority**: The homepage first fold must reveal the actual product experience on mobile.

**Independent Test**: View `/` at 390x844 and 1440x1000; confirm builder affordance is visible on mobile, CTAs are compact, and desktop layout remains balanced.

**Acceptance Scenarios**:

1. **Given** the affected fallback.pics surface, **When** a maintainer or visitor uses the documented route, UI, script, or guidance, **Then** it matches the requirements without public URL, layout, accessibility, or claim-safety regressions.
2. **Given** representative desktop and mobile viewports where relevant, **When** the surface is inspected, **Then** it remains usable, contained, and free of horizontal overflow.

### Edge Cases

- / at 390x844
- / at 1440x1000

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mobile first viewport MUST show brand, headline, supporting copy, primary CTA, and builder signal.
- **FR-002**: Secondary CTAs MUST remain compact.
- **FR-003**: Popular page links MUST stay visible or discoverable without a tall stack.
- **FR-004**: The first fold MUST NOT introduce horizontal overflow at 390px.
- **FR-005**: Desktop hero layout MUST preserve the two-column product-builder presentation.
- **FR-006**: The live builder MUST remain usable.

### Key Entities *(include if feature involves data)*

- **Public Route**: A site or API path with expected status, content type, layout, or navigation behavior.
- **Validation Command**: A documented command that can prove route, SEO, or visual behavior without paid services.
- **Responsive Surface**: A page or component that must remain usable across mobile, tablet, and desktop viewports.

## Constitution Alignment *(mandatory)*

- **Public URLs**: / at 390x844; / at 1440x1000
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
