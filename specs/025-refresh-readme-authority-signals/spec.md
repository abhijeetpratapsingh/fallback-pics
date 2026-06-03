# Feature Specification: Refresh README Authority Signals

## Source Story

Source story file: specs/25-refresh-readme-authority-signals.md

## User Value

Refresh README positioning, examples, links, route strategy, and repository-topic guidance around current developer SEO targets.

## Clarifications

- Canonical HTML page URLs use trailing slashes.
- Generated image examples use /api/v1/... as the only documented public image route.
- Validation must run locally without paid services or committed credentials.
- Changes are scoped to the active story and must avoid unsupported performance, ranking, uptime, or pricing claims.

## Functional Requirements

- Implement the source story acceptance criteria without changing unrelated behavior.
- Preserve visible user-facing content unless the story explicitly changes it.
- Preserve API image cache/CORS/content-type behavior when the story targets web pages.
- Keep generated examples copy-pasteable and route-correct.
- Provide repeatable validation where the story requests a workflow or check.

## Success Criteria

- Relevant local build and smoke commands pass.
- Story-specific scans or scripts report actionable route and field names on failure.
- No unresolved decision markers remain.
