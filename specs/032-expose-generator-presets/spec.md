# Feature Specification: Expose Generator Presets

**Feature Branch**: `032-expose-generator-presets`  
**Created**: 2026-06-16  
**Status**: Draft  
**Input**: User description: "Expose hidden generator presets in the web UI and docs: chart preset with chart type picker, existing gradient route, thumbnail style parity, and honest random/pattern language."

## User Scenarios & Testing

### User Story 1 - Discover Chart Placeholders (Priority: P1)

A developer using the interactive generator can choose a chart placeholder, pick the chart type, adjust dimensions and text, preview the result, and copy a working URL.

**Why this priority**: Chart placeholders are already product behavior but are hard to discover, so exposing them creates immediate product value without new edge-generation risk.

**Independent Test**: Open the live generator, choose Chart, change chart type, and verify the preview and copied URL use the chart route and render a chart placeholder.

**Acceptance Scenarios**:

1. **Given** the developer is on the generator, **When** they choose Chart and select a chart type, **Then** the generated URL follows the documented chart pattern and the preview updates.
2. **Given** the developer customizes chart text and dimensions, **When** they copy the URL, **Then** the copied URL preserves those choices.

---

### User Story 2 - Discover Gradient Placeholders (Priority: P1)

A developer can choose the gradient preset from the generator and docs, preview a generated gradient placeholder, and copy a documented URL that works in production.

**Why this priority**: Gradient is a supported route today but is invisible to most users; documenting it improves trust and discoverability.

**Independent Test**: Select Gradient in the generator and verify the preview and docs examples resolve to the same route pattern.

**Acceptance Scenarios**:

1. **Given** the developer chooses Gradient, **When** dimensions or text change, **Then** the preview updates without switching to a different preset route.
2. **Given** the developer reads the API or docs page, **When** they find Gradient examples, **Then** the examples match the live route format.

---

### User Story 3 - Align Thumbnail Controls Across Builders (Priority: P2)

A developer using either public builder surface can choose both thumbnail theme and thumbnail style before copying the generated URL.

**Why this priority**: The worker supports style options and one builder already exposes more of the surface than another, creating inconsistent product behavior.

**Independent Test**: Compare the homepage generator and landing-page builder, choose Thumbnail in each, and verify both expose equivalent theme and style controls.

**Acceptance Scenarios**:

1. **Given** the developer selects Thumbnail on either builder, **When** they choose a theme and style, **Then** the copied URL includes both choices.
2. **Given** the developer switches away from Thumbnail and back, **When** the builder restores controls, **Then** the selected thumbnail options remain visible and usable.

---

### User Story 4 - Keep Claims Honest (Priority: P2)

A developer reading the product pages can distinguish deterministic generated patterns from external/random photo services and does not see unsupported route promises.

**Why this priority**: The roadmap called out trust risk from over-claiming random and pattern capabilities.

**Independent Test**: Review generator labels, API documentation, and docs copy for random/pattern wording and verify all claims correspond to actual working routes.

**Acceptance Scenarios**:

1. **Given** the documentation mentions random or pattern placeholders, **When** a developer reads the examples, **Then** the copy clearly describes supported behavior without promising unsupported external image fetching.
2. **Given** a feature is not exposed in the generator, **When** docs mention it, **Then** docs either provide a working route or explain the capability accurately.

## Requirements

### Functional Requirements

- **FR-001**: The primary interactive generator MUST include a Chart preset option that builds working chart placeholder URLs.
- **FR-002**: Chart controls MUST allow selection of every chart type publicly supported by the live route.
- **FR-003**: The primary interactive generator MUST include a Gradient preset option that builds working gradient placeholder URLs.
- **FR-004**: The enterprise/landing builder MUST expose Chart and Gradient options if it lists the same generator preset family as the primary builder.
- **FR-005**: All builder surfaces that expose Thumbnail MUST allow users to select both thumbnail theme and thumbnail style.
- **FR-006**: API documentation MUST include working examples for Chart and Gradient routes.
- **FR-007**: Public docs and UI labels MUST not imply unsupported external random image sourcing or unsupported pattern behavior.
- **FR-008**: Existing preset URLs for standard, square, avatar, banner, thumbnail, skeleton, blur, animated, and current pattern behavior MUST remain unchanged.
- **FR-009**: Preview image `alt` text or nearby accessible labeling MUST identify the selected placeholder type.

### Key Entities

- **Generator Preset**: A user-facing placeholder type that maps to a documented public URL route.
- **Chart Type**: A selectable chart variant supported by the chart placeholder route.
- **Thumbnail Style**: A visual treatment option for thumbnail placeholders.
- **Documentation Example**: A public URL sample shown on API/docs pages that must resolve successfully.

## Constitution Alignment

- **Public URL Truth**: All new UI and docs examples must match real, deployed route formats.
- **Edge-First Deterministic Delivery**: The feature exposes existing deterministic edge-generated placeholders and must not introduce new third-party runtime dependency.
- **Testable Behavior Before Release**: Build and tests must cover the changed builder logic or at minimum verify generated route strings.
- **Documentation and SEO Consistency**: API/docs copy must be updated in the same change as the UI.
- **Privacy, Security, and Observability**: No new tracking, auth, or user data collection is required.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A user can create and copy a chart placeholder URL from the primary builder in under 30 seconds.
- **SC-002**: A user can create and copy a gradient placeholder URL from the primary builder in under 30 seconds.
- **SC-003**: API and docs pages include Chart and Gradient examples that match working route patterns.
- **SC-004**: Automated checks pass for the modified web app and do not introduce new SEO file validation failures.

## Assumptions

- Chart and gradient generation already exist in the worker and this feature focuses on discoverability, UI wiring, and documentation.
- Random external photo sourcing is not part of this feature unless already supported by a real production route.
- The primary builder and enterprise/landing builder should stay aligned where they present the same preset catalog.
