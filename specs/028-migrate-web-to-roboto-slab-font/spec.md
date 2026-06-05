# Feature Specification: Migrate Web to Roboto Slab Font

**Feature Branch**: `028-migrate-web-to-roboto-slab-font`

**Created**: 2026-06-05

**Status**: Ready for implementation

**Input**: User description: "Migrate the fallback.pics web app to Roboto Slab as the only web font, with optimized loading and a single maintainable font definition."

## User Scenarios & Testing

### User Story 1 - Consistent Web Typography (Priority: P1)

As a maintainer, I want the Astro web app to use Roboto Slab everywhere so the brand typography is consistent and easy to maintain.

**Why this priority**: This is the core user value and removes inconsistent visual presentation across pages and components.

**Independent Test**: Search `apps/web` for previous font names and hardcoded font stacks, then build the web app and inspect representative pages.

**Acceptance Scenarios**:

1. **Given** the web app source, **When** a maintainer searches for Inter, Geist Mono, JetBrains Mono, Fira Code, Arial, or legacy web font-family stacks, **Then** none remain in web UI code.
2. **Given** a page with headings, body text, code, inputs, buttons, and URLs, **When** it renders, **Then** all text uses the shared Roboto Slab stack.

---

### User Story 2 - Single Font Source of Truth (Priority: P2)

As a maintainer, I want one shared font definition consumed by global CSS, Tailwind, layouts, components, and web-generated previews.

**Why this priority**: One definition prevents future drift between CSS, Tailwind utilities, and inline/generated presentation.

**Independent Test**: Review the shared CSS custom property and verify Tailwind `sans` and `mono`, global rules, and component CSS all reference it.

**Acceptance Scenarios**:

1. **Given** the shared font variable, **When** Tailwind `font-sans` or `font-mono` utilities are used, **Then** they resolve to the same Roboto Slab stack.
2. **Given** generated SVG previews inside the web app, **When** they render preview labels, **Then** they reference Roboto Slab instead of legacy or generic-only names.

---

### User Story 3 - Optimized Compatible Loading (Priority: P3)

As a site visitor, I want the font to load predictably without duplicate imports or CSP failures.

**Why this priority**: Font loading should not slow or break the public site.

**Independent Test**: Inspect the generated HTML and browser console for one Google Fonts stylesheet request with `display=swap`, only required weights, and no CSP font errors.

**Acceptance Scenarios**:

1. **Given** the layout head, **When** the font is requested, **Then** it requests only the weights used by the site and includes `display=swap`.
2. **Given** the deployed Cloudflare Pages headers, **When** Google Fonts CSS and font files are loaded, **Then** the current CSP permits the chosen loading strategy.

### Edge Cases

- Long fallback URLs, code snippets, and generated preview labels must wrap or shrink without horizontal page overflow on mobile.
- Code blocks must remain semantically recognizable even though they use the same Roboto Slab family as the rest of the UI.
- Worker runtime SVG generation remains unchanged unless a web preview specifically embeds a font name.

## Requirements

### Functional Requirements

- **FR-001**: The web app UI MUST use Roboto Slab as its only named font family.
- **FR-002**: The web app MUST define the font stack in one shared CSS custom property consumed by global CSS and Tailwind font families.
- **FR-003**: Web UI code MUST remove named references to Inter, Geist Mono, JetBrains Mono, Fira Code, Arial, Menlo, Monaco, Segoe UI, and other hardcoded alternate font stacks except generic browser fallbacks after Roboto Slab.
- **FR-004**: Code blocks, URLs, form controls, buttons, headings, and generated web-preview SVG text MUST use the shared Roboto Slab stack.
- **FR-005**: Font loading MUST use one Google Fonts stylesheet request for Roboto Slab with `display=swap`.
- **FR-006**: The Google Fonts request MUST include only weights used by the site after the migration.
- **FR-007**: The existing CSP MUST remain compatible with Google Fonts CSS from `fonts.googleapis.com` and font files from `fonts.gstatic.com`.
- **FR-008**: The Cloudflare Worker runtime image generation MUST NOT change as part of this feature.

## Constitution Alignment

- **Public URLs**: Web pages `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, content pages, and `/404` are visually affected only. Status codes, content types, canonical tags, robots behavior, API URLs, and sitemap entries are unchanged.
- **Expected HTTP behavior**: Existing HTML routes and `/api/v1/*` behavior remain unchanged. `_headers` CSP remains explicit and compatible with the Google Fonts loading hosts.
- **Edge delivery impact**: N/A. Worker routing, generated image output, cache headers, storage, and third-party image dependencies are not changed.
- **Documentation/SEO updates**: No copy or indexed URL changes. Validation covers representative public pages.
- **Privacy/security/observability**: No new telemetry or secrets. Google Fonts hosts are already allowed by CSP; no query-string telemetry changes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: `apps/web` contains no legacy named web fonts from the acceptance criteria after migration.
- **SC-002**: The web build completes successfully.
- **SC-003**: Representative desktop and mobile renders for `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, and `/404` show no console CSP font errors.
- **SC-004**: Mobile representative pages have no document-level horizontal overflow from typography changes.

## Assumptions

- Google Fonts remains the loading mechanism for this feature rather than self-hosting.
- Roboto Slab applies to code blocks and code-like utility text because the story requires no second monospace font.
- Tailwind `font-mono` classes may remain in component markup if Tailwind maps `mono` to the same shared Roboto Slab source of truth.
