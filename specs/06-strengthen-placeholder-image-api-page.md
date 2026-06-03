# Spec Kit Command Sequence: Strengthen Placeholder Image API Page

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/006-strengthen-placeholder-api-page
GIT_BRANCH_NAME=006-strengthen-placeholder-api-page

Create a Spec Kit feature for strengthening /placeholder-image-api/ as the primary commercial SEO page for fallback.pics.

Problem: The page should better target the highest-fit developer keywords with stronger exact-intent copy, richer API examples, competitor-aware comparison content, and FAQ schema.

User value: Developers evaluating placeholder image tools should see examples, capabilities, and tradeoffs clearly enough to decide whether fallback.pics fits their project.

Functional requirements:
- The page must naturally target placeholder image api, placeholder image, image placeholder, and placeholder image generator.
- The page must include live examples using the selected public image route strategy.
- The page must include a concise comparison table covering fallback.pics, placehold.co, picsum.photos, dummyimage.com, and placeholderimage.dev.
- The comparison must use factual, defensible points and avoid unsupported superiority claims.
- The page must include FAQ content for what a placeholder image API is, how to create a placeholder image URL, and whether it works in HTML, React, and Next.js.
- FAQ schema must be emitted as JSON-LD.
- The page must link to Docs, API Reference, Dummy Image Generator, Broken Image Fallback, and implementation guides.

Out of scope:
- Publishing claims about competitor uptime or performance without evidence.
- Adding paid plan or account management features.
- Creating new image generation capabilities.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if comparison scope, FAQ scope, or target keyword ownership remains ambiguous. Prefer factual comparison and no unsupported competitor claims.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan content model updates, comparison table rendering, FAQ JSON-LD, live example URLs, internal links, and validation for rendered HTML and structured data.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for commercial SEO intent, comparison claim safety, FAQ completeness, JSON-LD clarity, live examples, and internal link coverage.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for updating /placeholder-image-api/ content, comparison data, FAQ schema, live examples, internal links, and validation.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze placeholder API page artifacts for duplicate targeting, unsupported claims, missing structured-data validation, and unmapped examples.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after comparison and FAQ requirements are unambiguous and validated.
```

## Source Story

## Description

The `/placeholder-image-api/` page should become the primary commercial SEO page for the highest-fit developer keywords. It needs stronger exact-intent copy, richer API examples, competitor-aware comparison content, and FAQ schema.

## User Story

As a developer evaluating placeholder image tools, I want the Placeholder Image API page to show examples, capabilities, and tradeoffs clearly so that I can decide whether fallback.pics fits my project.

## Acceptance Criteria

- The page targets `placeholder image api`, `placeholder image`, `image placeholder`, and `placeholder image generator` naturally.
- The page includes live examples using the selected public image route strategy.
- The page includes a concise comparison table covering:
  - fallback.pics
  - placehold.co
  - picsum.photos
  - dummyimage.com
  - placeholderimage.dev
- The comparison uses factual, defensible points and avoids unsupported superiority claims.
- The page includes FAQ content for:
  - What is a placeholder image API?
  - How do I create a placeholder image URL?
  - Can I use it in HTML, React, and Next.js?
- FAQ schema is emitted as JSON-LD.
- The page links to Docs, API Reference, Dummy Image Generator, Broken Image Fallback, and implementation guides.

## Technical Details

- Update the page definition in `apps/web/src/data/seoPages.ts`.
- Extend `apps/web/src/pages/[...slug].astro` if needed to support page-level FAQ schema or comparison table content.
- Keep comparison data maintainable as structured data rather than hard-coded markup where practical.
- Use canonical final URLs in links.
- Ensure generated JSON-LD is valid JSON and does not duplicate unrelated schemas.

## Likely Files

- `apps/web/src/data/seoPages.ts`
- `apps/web/src/pages/[...slug].astro`
- `apps/web/src/components/CodeBlock.astro`
- `apps/web/src/layouts/ContentLayout.astro`

## Validation

- Render `/placeholder-image-api/` and inspect visible content for the target terms.
- Validate JSON-LD syntax in the page source.
- Verify all example image URLs return image responses.
- Verify comparison content is visible without requiring client-side interaction.
- Verify internal links resolve directly to final canonical URLs.

## Out of Scope

- Publishing claims about competitor uptime or performance without evidence.
- Adding paid plan or account management features.
- Creating new image generation capabilities.
