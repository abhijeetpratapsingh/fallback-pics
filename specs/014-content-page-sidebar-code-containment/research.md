# Research: Fix Content Page Sidebar and Code Containment

## Decision: Keep implementation within existing Astro and repository documentation surfaces

**Rationale**: The stories refine current README, navigation, layouts, homepage builder, and validation workflows. Existing files already own these surfaces.

**Alternatives considered**: New apps or external services were rejected because the requirements call for local, repeatable, no-paid-service checks and scoped UI refinements.

## Decision: Use dependency-free SEO checks and optional Playwright visual QA

**Rationale**: Node 18+ provides built-in fetch for route checks. Playwright is appropriate for screenshots and menu interaction, but the script reports a clear missing dependency message when Playwright is not installed.

**Alternatives considered**: Paid SEO or visual regression services were rejected as out of scope.
