# Story 09: Add Placeholder Image Generator Page

## Description

Semrush shows `placeholder image generator` has direct demand and strong product fit. fallback.pics should have a dedicated generator page if the product supports an interactive or example-driven generator experience.

## User Story

As a developer searching for a placeholder image generator, I want a page where I can generate and copy a working placeholder image URL.

## Acceptance Criteria

- A canonical `/placeholder-image-generator/` page exists.
- The page title, description, H1, and intro target `placeholder image generator`.
- The first screen includes a usable generator or clearly visible live URL builder.
- The generator supports size, text, background color, and text color.
- Generated URLs follow the selected public route strategy.
- The page includes copyable HTML and plain URL examples.
- The page links to Placeholder Image API, Dummy Image Generator, Docs, and API Reference.
- The page is included in the sitemap with its canonical final URL.
- The page does not duplicate the homepage or `/placeholder-image-api/` content.

## Technical Details

- Add a new entry to `apps/web/src/data/seoPages.ts` or create a dedicated Astro page if the generator requires custom interaction.
- Reuse the existing live demo or builder component if it can be embedded cleanly.
- If the existing builder is React-based, ensure useful default content still appears in server-rendered HTML.
- Add navigation or footer links only where they improve discovery.
- Update sitemap and related-page links.

## Likely Files

- `apps/web/src/data/seoPages.ts`
- `apps/web/src/pages/[...slug].astro`
- `apps/web/src/components/LiveDemoEnhanced.tsx`
- `apps/web/src/components/EnterpriseLanding.tsx`
- `apps/web/public/sitemap.xml`
- `apps/web/src/navigation.ts`

## Validation

- `/placeholder-image-generator/` returns `200` with a self-canonical URL.
- Generated sample URL returns an image response.
- The page is linked from homepage, docs, or API reference.
- The sitemap includes the page and the sitemap URL resolves directly.
- The page renders correctly on desktop and mobile.

## Out of Scope

- Adding account storage for generated images.
- Adding advanced image editing.
- Adding paid-only generator controls.

