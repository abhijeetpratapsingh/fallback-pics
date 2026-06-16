# Feature Specification: Improve Features Page UI

**Feature Branch**: `033-improve-features-page-ui`  
**Created**: 2026-06-16  
**Status**: Draft  
**Input**: User request: "Apply recommendations" for improving `https://fallback.pics/features/` UI.

## User Scenarios & Testing

### User Story 1 - Understand Product Breadth Immediately (Priority: P1)

A developer visiting the features page can see multiple real fallback surfaces in the first viewport, including product placeholders, chart placeholders, gradients, thumbnails, avatars, and loading states.

**Why this priority**: The current page looks documentation-like and undersells the product breadth.

**Independent Test**: Open `/features/` and verify the hero includes a multi-surface visual, not only one thumbnail preview.

**Acceptance Scenarios**:

1. **Given** a visitor lands on `/features/`, **When** they view the hero, **Then** the page shows multiple live placeholder examples.
2. **Given** the visitor scans the hero, **When** they inspect the visible examples, **Then** chart and gradient capabilities are represented.

---

### User Story 2 - Scan Presets by Importance (Priority: P1)

A developer can quickly identify the most valuable presets and still browse the full preset catalog.

**Why this priority**: Uniform cards make all features feel equally important and obscure high-value capabilities.

**Independent Test**: Review the presets section and verify key presets receive stronger visual weight while all supported public presets are listed.

**Acceptance Scenarios**:

1. **Given** the visitor reaches Presets, **When** they scan the section, **Then** high-value presets such as Thumbnail, Chart, Gradient, and Animated are visually emphasized.
2. **Given** the visitor reads the preset count and cards, **When** they compare them to live product routes, **Then** the count and examples match supported routes.

---

### User Story 3 - Read Trust Signals Without Friction (Priority: P2)

A developer can understand key platform guarantees from a compact status strip and capability cards that match the content type.

**Why this priority**: The page currently mixes image previews with non-image API contract claims, reducing clarity.

**Independent Test**: Review the platform and capabilities sections and verify metrics are compact and non-image claims use code/status visuals.

**Acceptance Scenarios**:

1. **Given** a capability is visual, **When** it is shown, **Then** it uses a live image preview.
2. **Given** a capability is protocol or error behavior, **When** it is shown, **Then** it uses a code/status treatment instead of a misleading image preview.

## Requirements

### Functional Requirements

- **FR-001**: The features page hero MUST show a multi-surface product visual using live fallback URLs.
- **FR-002**: The preset catalog MUST include Chart and Gradient.
- **FR-003**: The preset count and SEO copy MUST match the visible preset catalog.
- **FR-004**: The feature page MUST not claim unsupported behavior such as active retina scaling unless implemented on live routes.
- **FR-005**: The metrics/status presentation MUST be compact and scannable on desktop and mobile.
- **FR-006**: Capability cards for API headers and error behavior MUST use non-image visual treatments.
- **FR-007**: The page MUST retain working links to generator, docs, API reference, showcase, and relevant guides.

### Key Entities

- **Hero Preview**: A first-viewport group of live generated images that demonstrates product breadth.
- **Preset Card**: A linked live route example for a supported public preset.
- **Capability Card**: A feature explanation with either a visual preview or a protocol/status preview.

## Constitution Alignment

- **Public URL Truth**: All examples must resolve as live production routes.
- **Documentation and SEO Consistency**: Feature copy, visible examples, metadata, and structured data must agree.
- **Testable Behavior Before Release**: Build and SEO file checks must pass before merge.
- **Privacy, Security, and Observability**: The page must avoid introducing new tracking or user data collection.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The hero shows at least five distinct fallback surfaces.
- **SC-002**: The preset grid includes Chart and Gradient with working URLs.
- **SC-003**: The page no longer mentions “nine preset routes” or retina behavior unless backed by live behavior.
- **SC-004**: Web build and SEO generated file checks pass.

## Assumptions

- This feature changes only the public web page presentation and copy, not worker route behavior.
- The current route limit is treated as 5000px because the active worker accepts dimensions above 4000px.
