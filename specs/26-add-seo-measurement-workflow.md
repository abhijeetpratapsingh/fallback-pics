# Spec Kit Command Sequence: Add SEO Measurement Workflow

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/026-add-seo-measurement-workflow
GIT_BRANCH_NAME=026-add-seo-measurement-workflow

Create a Spec Kit feature for adding a repeatable SEO measurement workflow for fallback.pics.

Problem: Semrush still reports 2 US organic keywords and 0 traffic after implementation improvements. The project needs a consistent way to track indexing, query impressions, crawl issues, and authority movement without relying only on occasional manual audits.

User value: Maintainers should be able to see whether SEO fixes are producing indexing and query movement over time.

Functional requirements:
- Document a measurement workflow for Google Search Console query/page checks.
- Track target queries from the action plan.
- Track indexed status for the homepage, placeholder API page, generator page, dummy page, broken-image page, and implementation guides.
- Track crawl issues including soft 404s, redirects, and sitemap problems.
- Track referring domains, backlink count, and follow-link count from Semrush or another chosen source.
- Provide a simple local template or markdown artifact for recording measurement snapshots.
- Avoid requiring secrets in committed files.

Target queries:
- placeholder image
- placeholder image api
- placeholder image generator
- dummy image generator
- broken image placeholder
- react image fallback
- nextjs image fallback

Out of scope:
- Automating private Google Search Console access unless credentials are explicitly provided later.
- Paid reporting dashboards.
- Ranking claims without data.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if measurement should be a markdown template, script, spreadsheet export format, or a combination.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan the SEO measurement workflow, including snapshot fields, target query list, target page list, crawl issue tracking, backlink metrics, and secret-handling rules.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for measurement field completeness, target query coverage, target page coverage, crawl issue coverage, authority metrics, and no committed secrets.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for adding the measurement template or workflow, documenting data sources, adding target query/page matrices, and validating that no credentials are committed.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the SEO measurement artifacts for missing target queries, vague success signals, credential leakage risk, and unsupported ranking assumptions.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the measurement format and data sources are explicit.
```

## Source Story

## Description

Add a repeatable SEO measurement workflow to track indexing, query visibility, crawl issues, and authority movement.

## User Story

As a maintainer, I want a consistent SEO measurement workflow so that I can tell whether implemented changes are improving discovery.

## Acceptance Criteria

- Measurement workflow includes the target query list.
- Measurement workflow includes the priority page list.
- Measurement workflow includes crawl issue tracking.
- Measurement workflow includes backlink/referring-domain tracking.
- A snapshot template or equivalent artifact exists.
- The workflow does not commit private credentials.
- The workflow states that ranking and traffic claims must be backed by measured data.

## Technical Details

- Prefer markdown or CSV-friendly fields that can be copied from Search Console and Semrush.
- Include fields for date, source, query, page, impressions, clicks, average position, indexed state, crawl issue, referring domains, backlinks, and follow links.
- Keep secrets and API tokens out of the repo.

## Likely Files

- `docs/seo-measurement.md`
- `SEO-MEASUREMENT.md`
- `specs/`, if the workflow remains in planning docs
- `.gitignore`, only if local private exports are documented

## Validation

- Fill one sample row using non-secret public audit data.
- Confirm the template covers every target query and priority page.
- Confirm no credentials or private exports are committed.

## Out of Scope

- Private GSC automation.
- Paid dashboard setup.
- Making ranking claims without source data.
