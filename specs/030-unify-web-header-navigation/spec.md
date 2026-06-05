# Feature Specification: Unify Web Header Navigation

**Feature Branch**: `030-unify-web-header-navigation`

**Created**: 2026-06-05

**Status**: Ready for implementation

**Input**: User description: "Unify the fallback.pics header so every page uses the same navigation source, ordering, layout behavior, and active-state rules."

## User Scenarios & Testing

### User Story 1 - Consistent Header Everywhere (Priority: P1)

As a visitor, I want the header navigation to stay consistent as I move between pages so I can orient myself without the menu changing unexpectedly.

**Why this priority**: This is the visible user-facing problem.

**Independent Test**: Visit homepage, docs, API, features, blog, content, legal, and 404 pages and confirm desktop/mobile nav order is identical.

**Acceptance Scenarios**:

1. **Given** any public web page, **When** the header renders on desktop, **Then** it shows the same canonical nav order.
2. **Given** any public web page, **When** the mobile menu opens, **Then** it shows the same canonical nav order as desktop.

---

### User Story 2 - Single Navigation Source (Priority: P2)

As a maintainer, I want header links defined once so updates cannot drift between landing and non-landing variants.

**Why this priority**: It prevents future divergence and reduces maintenance risk.

**Independent Test**: Inspect `navigation.ts` and `SiteHeader.astro` for one header nav array and no landing-vs-primary split.

**Acceptance Scenarios**:

1. **Given** the header source, **When** a maintainer updates the canonical nav array, **Then** desktop and mobile menus update together.
2. **Given** `SiteHeader`, **When** it renders on any page, **Then** it does not choose between separate nav arrays by variant.

---

### User Story 3 - Correct Active and Link Behavior (Priority: P3)

As a visitor, I want active states, external links, mobile close behavior, and the Generator link to work correctly from every page.

**Why this priority**: Consistency must not break navigation behavior.

**Independent Test**: Validate active states, Generator link resolution, external target/rel attributes, and mobile menu interaction.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** the Generator item is clicked, **Then** it links to the live builder section.
2. **Given** a non-homepage route, **When** the Generator item is clicked, **Then** it links to `/placeholder-image-generator/`.
3. **Given** GitHub and Status links, **When** they render, **Then** they use `target="_blank"` and `rel="noopener noreferrer"`.
4. **Given** the mobile menu is open, **When** a link is clicked or Escape is pressed, **Then** the menu closes and ARIA state updates.

### Edge Cases

- Content pages under `/guides/` should keep Docs active.
- Generated SEO pages should not incorrectly mark unrelated nav items active.
- Header must avoid desktop overflow and collapse cleanly at mobile/tablet widths.

## Requirements

### Functional Requirements

- **FR-001**: The header MUST use one canonical navigation list for desktop and mobile.
- **FR-002**: The canonical list MUST include Generator, Docs, API, Features, Blog, GitHub, and Status consistently.
- **FR-003**: The header MUST derive mobile nav from the same list as desktop nav.
- **FR-004**: The header MUST preserve active-current behavior for Docs, API, Features, Blog, Generator, and guide/content mappings.
- **FR-005**: Generator MUST resolve to `#hero-demo` on the homepage and `/placeholder-image-generator/` elsewhere.
- **FR-006**: External links MUST render with `target="_blank"` and `rel="noopener noreferrer"`.
- **FR-007**: The header MUST preserve menu open/close, link-click close, Escape close, focus states, and ARIA expanded state.
- **FR-008**: The implementation MUST NOT change footer navigation, page content, API behavior, typography, or color token definitions.

## Constitution Alignment

- **Public URLs**: Header links point to existing public routes and external destinations only. No URL status/canonical/sitemap changes.
- **Expected HTTP behavior**: No route behavior changes. Header link targets use existing trailing-slash URLs.
- **Edge delivery impact**: N/A. Worker and image API behavior unchanged.
- **Documentation/SEO updates**: Spec index only; no public SEO content changes.
- **Privacy/security/observability**: External links keep safe `target`/`rel`; no telemetry or secret changes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Header source contains one canonical nav array and no separate `landingNav`.
- **SC-002**: Desktop and mobile nav labels match on representative pages.
- **SC-003**: Active states work for `/docs/`, `/api/`, `/features/`, `/blog/`, `/placeholder-image-generator/`, and guide pages.
- **SC-004**: Browser QA shows no console errors or document-level horizontal overflow on desktop and mobile.

## Assumptions

- The canonical order is Generator, Docs, API, Features, Blog, GitHub, Status.
- The existing "Start using API" CTA remains a separate consistent header action.
