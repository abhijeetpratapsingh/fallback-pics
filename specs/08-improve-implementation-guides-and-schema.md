# Story 08: Improve Implementation Guides and Schema

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

