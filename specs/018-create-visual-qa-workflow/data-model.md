# Data Model: Create Visual QA Workflow

## ValidationRoute

- `path`: Route or URL to inspect.
- `viewport`: Optional viewport for visual checks.
- `expectedStatus`: Expected status for HTTP checks.
- `expectedContentType`: Expected content type for HTTP checks.
- `manualReviewPoints`: Visual concerns to inspect in screenshot workflows.

## NavigationItem

- `label`: User-facing nav label.
- `href`: Route or external URL.
- `active`: Optional route prefix used for active state.
- `external`: Whether the link opens outside fallback.pics.

## RepositoryReference

- `targetUrl`: Canonical fallback.pics page or GitHub URL.
- `exampleUrl`: Optional `/api/v1/...` image example.
- `qualityBoundary`: Guidance preventing unsupported claims or low-quality link tactics.
