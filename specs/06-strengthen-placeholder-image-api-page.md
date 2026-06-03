# Story 06: Strengthen Placeholder Image API Page

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

