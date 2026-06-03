# Story 07: Strengthen Dummy Image Generator Page

## Description

The `/dummy-image-generator/` page should directly compete for the dummy-image search cluster. The page needs copy and examples for `dummy image generator`, `dummy image`, `dummy images`, and `dummy image url`.

## User Story

As a developer looking for dummy images for mockups or tests, I want a page that gives me working dummy image URLs with custom size, text, and color examples.

## Acceptance Criteria

- The page title, H1, intro, and body copy clearly target `dummy image generator`.
- The page includes examples for:
  - Fixed-size dummy image
  - Custom text
  - Custom background and text color
  - Avatar-style dummy image
  - Product/card mockup image
- Every visible URL example returns an image response.
- The page includes internal links to Placeholder Image API, API Reference, Docs, and relevant guides.
- The page differentiates dummy images from fallback images without creating duplicate content.
- The page includes FAQ or explanatory content for common dummy-image use cases.

## Technical Details

- Update the `dummy-image-generator` entry in `apps/web/src/data/seoPages.ts`.
- Reuse existing content page components where possible.
- If the generic SEO page template cannot support multiple live examples cleanly, add a structured examples block to the template.
- Align all URLs with the public route strategy chosen in Story 02.
- Avoid creating multiple pages that target the same exact primary keyword.

## Likely Files

- `apps/web/src/data/seoPages.ts`
- `apps/web/src/pages/[...slug].astro`
- `apps/web/src/layouts/ContentLayout.astro`
- `apps/web/src/pages/api.astro`
- `apps/web/src/pages/docs.astro`

## Validation

- Render `/dummy-image-generator/` and inspect title, description, H1, and intro.
- Click or fetch all example URLs and verify image content types.
- Verify the page does not canonicalize to a different page.
- Verify the page links to the API reference and related SEO pages.

## Out of Scope

- Building an advanced image editor.
- Adding random stock-image functionality.
- Adding paid conversion flows.

