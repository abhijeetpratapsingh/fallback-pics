# Spec Kit Command Sequence: Improve Implementation Guides and Schema

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/008-improve-guides-schema
GIT_BRANCH_NAME=008-improve-guides-schema

Create a Spec Kit feature for improving fallback.pics implementation guides and schema.

Problem: The image fallback implementation guides should be code-first, visible in server-rendered HTML, and eligible for rich search understanding.

User value: Frontend developers should get practical copy-paste guidance for adding fallback.pics to HTML, React, or Next.js projects quickly.

Functional requirements:
- /guides/img-onerror-fallback/ must include a complete HTML example with onerror behavior.
- /guides/react-image-fallback/ must include a complete React component example.
- /guides/nextjs-image-fallback/ must include a complete Next.js-compatible example.
- Each guide must explain how to avoid infinite fallback loops.
- Each guide must include at least one fallback.pics URL that returns an image response.
- Each guide must link to Docs, API Reference, Placeholder Image API, and Broken Image Fallback.
- HowTo schema must be emitted for guides structured as step-by-step instructions.
- Code examples must be visible in rendered HTML and not depend on client-side hydration.

Out of scope:
- Supporting every frontend framework.
- Adding package-specific SDKs.
- Rewriting blog posts not listed in this feature.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if guide scope, HowTo schema eligibility, or required code examples are ambiguous.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan guide content updates, visible code examples, HowTo JSON-LD behavior, internal links, and validation for rendered HTML and example image URLs.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for guide coverage, code-example clarity, infinite-loop handling, HowTo schema eligibility, and internal link consistency.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for updating the HTML, React, and Next.js guides, adding schema where appropriate, validating example URLs, and checking source HTML visibility.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze guide artifacts for missing exception-flow coverage, schema conflicts, code visibility gaps, and unmapped validation tasks.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after guide scope and schema requirements are clear.
```

## Source Story

## Description

Implementation guides for image fallback behavior should be code-first and eligible for rich search understanding. The key guides are HTML `onerror`, React image fallback, and Next.js image fallback.

## User Story

As a frontend developer, I want practical implementation guides with copy-paste code so that I can add fallback.pics to HTML, React, or Next.js projects quickly.

## Acceptance Criteria

- `/guides/img-onerror-fallback/` includes a complete HTML example with `onerror` behavior.
- `/guides/react-image-fallback/` includes a complete React component example.
- `/guides/nextjs-image-fallback/` includes a complete Next.js-compatible example.
- Each guide explains how to avoid infinite fallback loops.
- Each guide includes at least one fallback.pics URL that returns an image response.
- Each guide includes links to Docs, API Reference, Placeholder Image API, and Broken Image Fallback.
- HowTo schema is emitted for guides that are structured as step-by-step instructions.
- Code examples are visible in rendered HTML and do not depend on client-side hydration.

## Technical Details

- Update guide entries in `apps/web/src/data/seoPages.ts`.
- Extend `apps/web/src/pages/[...slug].astro` or `ContentLayout.astro` to emit HowTo schema only for guide pages with steps.
- Use `CodeBlock.astro` for code examples so formatting stays consistent.
- Keep examples accurate for current API route behavior.
- Include accessible alt text and explain when fallback text should differ from the image alt text.

## Likely Files

- `apps/web/src/data/seoPages.ts`
- `apps/web/src/pages/[...slug].astro`
- `apps/web/src/layouts/ContentLayout.astro`
- `apps/web/src/components/CodeBlock.astro`

## Validation

- Render each guide and verify code examples are present in source HTML.
- Validate JSON-LD syntax for HowTo pages.
- Verify example URLs return image content.
- Verify internal links resolve to canonical final URLs.
- Verify headings are unique and descriptive.

## Out of Scope

- Supporting every frontend framework.
- Adding package-specific SDKs.
- Rewriting blog posts not listed in this story.
