# Spec Kit Command Sequence: Remove FAQPage Schema

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/021-remove-faqpage-schema
GIT_BRANCH_NAME=021-remove-faqpage-schema

Create a Spec Kit feature for removing FAQPage JSON-LD from fallback.pics commercial pages while preserving visible FAQ content.

Problem: The SEO re-audit found FAQPage JSON-LD on /placeholder-image-api/, /placeholder-image-generator/, and /dummy-image-generator/. For a commercial developer SaaS site, FAQPage rich-result eligibility is restricted and the markup is not a practical SEO target.

User value: Search engines should receive clean, eligible structured data that describes fallback.pics accurately without relying on outdated or low-value rich-result markup.

Functional requirements:
- Remove FAQPage JSON-LD from commercial pages.
- Keep visible FAQ sections in the rendered pages for users.
- Preserve or improve eligible JSON-LD types such as WebPage, SoftwareApplication, Organization, and BreadcrumbList.
- Do not introduce HowTo schema.
- JSON-LD that remains on the page must be valid JSON.
- Page titles, descriptions, H1s, and visible content must not regress.

Target pages:
- /placeholder-image-api/
- /placeholder-image-generator/
- /dummy-image-generator/

Out of scope:
- Removing visible FAQ content.
- Adding unsupported schema types.
- Changing page layout beyond schema emission.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if there is a business reason to keep FAQPage JSON-LD despite limited eligibility. Default to removing JSON-LD while preserving visible FAQs.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan structured data cleanup for the target pages. Include how schema is generated, how FAQPage will be removed, and how remaining JSON-LD will be validated.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for schema eligibility, JSON validity, visible FAQ preservation, no HowTo schema, and metadata regression safety.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for locating FAQPage schema generation, removing it from target pages, preserving visible FAQ UI, validating JSON-LD, and adding a regression check.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the structured data cleanup artifacts for leftover FAQPage markup, accidental visible content removal, invalid JSON-LD, and unsupported schema additions.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after target pages and allowed schema types are explicit.
```

## Source Story

## Description

Remove `FAQPage` JSON-LD from commercial SEO pages while keeping the FAQ content visible for users.

## User Story

As a search crawler, I want structured data to use eligible schema types so that fallback.pics sends accurate and current page signals.

## Acceptance Criteria

- `/placeholder-image-api/` no longer emits `FAQPage` JSON-LD.
- `/placeholder-image-generator/` no longer emits `FAQPage` JSON-LD.
- `/dummy-image-generator/` no longer emits `FAQPage` JSON-LD.
- Visible FAQ sections still render.
- No `HowTo` schema is added.
- Remaining JSON-LD is valid.
- Page metadata and headings are unchanged unless needed for correctness.

## Technical Details

- Locate schema generation in Astro layouts, page data, or content helpers.
- Remove only structured data blocks, not user-facing FAQ sections.
- Prefer `WebPage`, `SoftwareApplication`, `Organization`, and `BreadcrumbList` where appropriate.
- Keep schema values concrete and non-placeholder.

## Likely Files

- `apps/web/src/pages/[...slug].astro`
- `apps/web/src/data/`, if page schema comes from content data
- `apps/web/src/layouts/`
- `apps/web/src/components/`

## Validation

- Fetch rendered HTML for target pages and verify `FAQPage` is absent.
- Verify visible FAQ content is still present.
- Validate JSON-LD syntax.
- Confirm page title, meta description, and H1 still match the target page.

## Out of Scope

- Removing FAQ UI.
- Adding rich-result types that are not eligible for this site.
- Rewriting commercial page copy.
