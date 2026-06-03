# Story 05: Retarget Homepage for Search Demand

## Description

The homepage currently differentiates fallback.pics around "fallback image infrastructure", but Semrush demand is larger around "placeholder image", "image placeholder", "placeholder image API", and "placeholder image generator". The homepage should preserve the brand promise while making the core search intent explicit above the fold and in metadata.

## User Story

As a developer searching for a placeholder image API, I want the fallback.pics homepage to clearly state that it generates placeholder images and fallback images so that I understand the product immediately.

## Acceptance Criteria

- The homepage title includes `placeholder image API` or a close high-intent variant.
- The meta description includes both placeholder image and fallback image language.
- Above-the-fold copy includes `placeholder image API` and `placeholder image generator` naturally.
- The hero promise "Never show broken images again" remains visible.
- Homepage internal links point to:
  - `/placeholder-image-api/`
  - `/dummy-image-generator/`
  - `/broken-image-fallback/`
  - `/guides/react-image-fallback/`
- The homepage does not overpromise uptime, latency, or enterprise guarantees beyond what the product supports.
- Structured data remains valid and reflects the updated positioning.

## Technical Details

- Update homepage metadata in `apps/web/src/pages/index.astro`.
- Update hero and supporting copy in `apps/web/src/components/EnterpriseLanding.tsx`.
- Keep homepage design stable; avoid adding large marketing sections if existing page sections can be improved.
- Add direct text links where they fit naturally in existing product, developer, or footer sections.
- Keep target terms readable and avoid keyword stuffing.

## Likely Files

- `apps/web/src/pages/index.astro`
- `apps/web/src/components/EnterpriseLanding.tsx`
- `apps/web/src/components/SiteFooter.astro`
- `apps/web/src/navigation.ts`

## Validation

- Inspect rendered homepage source for updated title, description, H1, and internal links.
- Verify the page still renders cleanly on mobile and desktop.
- Verify all added internal links resolve to final canonical URLs.
- Verify no homepage route changes cause API routes to break.

## Out of Scope

- Rebuilding the full homepage layout.
- Adding new pricing or account features.
- Changing visual brand direction.

