# Spec Kit Command Sequence: Fix Content Page Sidebar and Code Containment

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/014-content-page-sidebar-code-containment
GIT_BRANCH_NAME=014-content-page-sidebar-code-containment

Create a Spec Kit feature for fixing desktop content page layout containment on fallback.pics.

Problem: Playwright desktop screenshots at 1440x1000 show the placeholder image generator content page has a main code block extending beneath or behind the right sidebar cards. This creates a layered, unfinished visual state even though page-level horizontal overflow is 0.

User value: Developers reading examples should see code blocks, copy buttons, and sidebars as clearly separated surfaces with no overlap.

Functional requirements:
- Main article content must not render underneath sidebar cards on desktop content pages.
- Code blocks must be horizontally scrollable or wrapped inside their own article column.
- Copy buttons must remain visible and clickable without being covered by sidebar cards.
- Sidebar cards must maintain a stable width and spacing from article content.
- The fix must apply consistently to `/placeholder-image-generator/`, `/placeholder-image-api/`, and other SEO/content pages using the same template.
- Mobile layout must remain single-column with no horizontal overflow.

Visual review evidence:
- Playwright viewport: 1440x1000 on /placeholder-image-generator/
- The right sidebar visually overlaps the first guide section/code block.
- `/placeholder-image-api/` and `/docs/` showed healthier containment, so the fix should preserve those layouts.

Out of scope:
- Rewriting page content.
- Changing code example text.
- Removing sidebar content.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the intended desktop content layout is ambiguous: fixed sidebar, sticky sidebar, or non-sticky sidebar.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan layout containment changes for content pages, focusing on CSS grid widths, code-block overflow behavior, sidebar spacing, and responsive breakpoints.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a visual checklist for sidebar separation, code block containment, copy button accessibility, desktop/mobile no-overlap, and no horizontal overflow.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for auditing content layout CSS, constraining article/code widths, adjusting sidebar grid rules, and validating affected pages with Playwright screenshots.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze layout artifacts for overlap risk, breakpoint gaps, code-block regressions, and missing validation across shared content templates.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the affected content templates and breakpoints are listed.
```

## Source Story

## Description

Content pages need stronger column containment. The sidebar should never float over example code or copy controls, and long API URLs should stay inside the article surface.

## User Story

As a developer reading a content page, I want examples and sidebars to stay visually separated so that code snippets are easy to scan and copy.

## Acceptance Criteria

- `/placeholder-image-generator/` desktop screenshot shows no sidebar overlap with the first guide section.
- Long code examples stay inside the article column or provide horizontal scrolling inside the code block.
- Copy buttons are visible and not covered by other elements.
- Sidebar spacing is consistent across `/placeholder-image-generator/`, `/placeholder-image-api/`, and `/docs/`.
- Mobile screenshots remain single-column with no horizontal overflow.

## Technical Details

- Likely files:
  - `apps/web/src/pages/[...slug].astro`
  - `apps/web/src/layouts/ContentLayout.astro`
  - `apps/web/src/components/CodeBlock.astro`
  - CSS generated for content pages, depending on where layout classes are defined
- Audit `.content-body__grid`, `.content-article`, `.content-sidebar`, and code block styles.
- Use `min-width: 0` where CSS grid children need to shrink.
- Use `overflow-x: auto` on code/pre surfaces when long URL examples are unavoidable.

## Validation

- Capture Playwright screenshots at 1440x1000 and 390x844 for:
  - `/placeholder-image-generator/`
  - `/placeholder-image-api/`
  - `/docs/`
- Confirm no main content is visually covered by sidebar cards.
- Confirm no horizontal page overflow.
- Confirm copy buttons remain visible and clickable.

## Out of Scope

- Content rewriting.
- SEO metadata changes.
- API behavior changes.
