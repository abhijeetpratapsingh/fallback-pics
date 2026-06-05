# Research: Unify Web Header Navigation

## Decision: One canonical `siteNav`

Use one `siteNav` array containing Generator, Docs, API, Features, Blog, GitHub, and Status.

**Rationale**: The story defaults to including Blog, GitHub, and Status simultaneously and handling responsive fit instead of variants.

## Decision: Dynamic Generator href resolution

Store Generator as `/placeholder-image-generator/` with `homeHref: '#hero-demo'`; `SiteHeader` resolves the href based on current route.

**Rationale**: This preserves homepage builder-section linking while keeping one nav source.

## Decision: Remove header variants from rendering

Keep `header={false}` support for pages that might need no header, but remove landing/docs/default nav variation.

**Rationale**: The variants were the source of drift.

## Decision: Keep CTA separate

Keep "Start using API" as the existing consistent header CTA rather than making it part of the canonical nav list.

**Rationale**: It is an action, not a nav item, and already appears consistently after unification.
