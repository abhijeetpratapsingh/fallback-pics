# Research: Centralize Web Color Tokens

## Decision: Canonical tokens live in `theme.css`

Use `theme.css`, already imported by the web layout, as the one source for semantic colors.

**Rationale**: It is repo-level, already shared with the web app, and can be consumed by plain CSS and Tailwind-generated CSS through custom properties.

## Decision: Keep legacy variable names as aliases

Convert existing `--primary-*`, `--gray-*`, `--ds-*`, and gradient variables into aliases backed by canonical `--color-*` tokens.

**Rationale**: This preserves existing CSS consumers while making future theme changes happen through semantic tokens.

## Decision: Map existing Tailwind palettes to tokens

Map semantic colors and the app-used `violet`, `zinc`, `gray`, `emerald`, `blue`, `orange`, `red`, and `purple` palette keys to CSS variables.

**Rationale**: The React landing page heavily uses Tailwind palette classes. Mapping those palettes centralizes color implementation without a risky large JSX class rewrite.

## Decision: Document intentional direct colors

Allow direct values for SVG user-configurable colors, transparent overlays, shadows, gradients/pattern effects, and metadata values.

**Rationale**: These are either not theme roles or are dynamic values produced by user input or visual effects.
