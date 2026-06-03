# Spec Kit Command Sequence: Retarget Homepage for Search Demand

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/005-retarget-homepage-search-demand
GIT_BRANCH_NAME=005-retarget-homepage-search-demand

Create a Spec Kit feature for retargeting the fallback.pics homepage toward validated placeholder-image search demand while preserving the brand promise.

Problem: The homepage differentiates around fallback image infrastructure, but Semrush demand is larger around placeholder image, image placeholder, placeholder image API, and placeholder image generator.

User value: Developers searching for a placeholder image API should immediately understand that fallback.pics generates placeholder images and fallback images.

Functional requirements:
- The homepage title must include placeholder image API or a close high-intent variant.
- The meta description must include both placeholder image and fallback image language.
- Above-the-fold copy must include placeholder image API and placeholder image generator naturally.
- The hero promise "Never show broken images again" must remain visible.
- Homepage internal links must point to /placeholder-image-api/, /dummy-image-generator/, /broken-image-fallback/, and /guides/react-image-fallback/.
- The homepage must not overpromise uptime, latency, or enterprise guarantees beyond what the product supports.
- Structured data must remain valid and reflect the updated positioning.

Out of scope:
- Rebuilding the full homepage layout.
- Adding new pricing or account features.
- Changing visual brand direction.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if homepage positioning creates a conflict between the brand promise and the target keyword phrase. Prefer preserving the hero promise while improving metadata and supporting copy.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan homepage metadata, hero/supporting copy, internal links, structured data, and claim-safety updates. Include rendered-source and responsive visual validation.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for homepage search intent, claim safety, internal linking, structured data consistency, and copy clarity.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for homepage metadata, visible copy, internal links, structured data, claim review, and validation without changing the full visual design.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze homepage retargeting artifacts for keyword stuffing risk, unsupported claims, missing internal links, and validation gaps.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the homepage copy requirements and claim-safety checklist are complete.
```

## Source Story

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
