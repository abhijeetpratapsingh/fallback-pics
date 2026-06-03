<div align="center">

# Fallback.pics

**Never show broken images again.**

Fast, self-hostable placeholder images and production-friendly fallback images from simple URLs.

[Website](https://fallback.pics/) · [Docs](https://fallback.pics/docs) · [API Reference](https://fallback.pics/api) · [API Examples](#api-examples) · [Deploy](#deploy-your-own) · [Contributing](#contributing)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abhijeetpratapsingh/fallback-pics)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Built with Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

Fallback.pics is a fast **placeholder image API** and **fallback image service** for developers who do not want broken images showing up in apps, docs, prototypes, dashboards, or ecommerce pages.

Generate dummy images, avatar placeholders, product image placeholders, banners, skeleton placeholder images, and broken image fallbacks with readable URLs. The service is built as a Cloudflare Workers image generator, so placeholders can be generated at the edge and cached aggressively.

Created and maintained by [Abhijeet Pratap Singh](https://abhijeetpratapsingh.in/).

## Quick Start

Use a canonical API URL as a placeholder image:

```html
<img src="https://fallback.pics/api/v1/400x300" alt="Placeholder image" />
```

Add custom text:

```html
<img
  src="https://fallback.pics/api/v1/600x400?text=Product+Image"
  alt="Product placeholder"
/>
```

Use it as a fallback when an image fails:

```html
<img
  src="/images/product.jpg"
  alt="Product image"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/600x400?text=Image+Unavailable'"
/>
```

Use the same route strategy in React:

```tsx
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const fallbackSrc = "https://fallback.pics/api/v1/600x400?text=Product+Image";

  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallbackSrc;
      }}
    />
  );
}
```

Use it in Next.js when you want a generated SVG URL:

```tsx
import Image from "next/image";

export function ProductPlaceholder() {
  return (
    <Image
      src="https://fallback.pics/api/v1/600x400?text=Product+Image"
      width={600}
      height={400}
      alt="Product image placeholder"
      unoptimized
    />
  );
}
```

## API Examples

Fallback.pics uses readable URLs, so you can drop placeholders directly into HTML, React, Next.js, Markdown, CMS content, test data, and product catalogs. Start with a size, then add text, colors, or presets when you need more control.

| Need | URL |
| --- | --- |
| Basic placeholder | `https://fallback.pics/api/v1/400x300` |
| Custom text | `https://fallback.pics/api/v1/400x300?text=Hello+World` |
| Custom colors | `https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF` |
| Full HD image | `https://fallback.pics/api/v1/1920x1080` |
| Square | `https://fallback.pics/api/v1/square/400` |
| Avatar initials | `https://fallback.pics/api/v1/avatar/200?text=JD` |
| Banner | `https://fallback.pics/api/v1/banner/1200x400` |
| Skeleton loader | `https://fallback.pics/api/v1/skeleton/400x300` |
| Blur placeholder | `https://fallback.pics/api/v1/blur/400x300` |

## Why Use Fallback.pics?

| Feature | What it gives you |
| --- | --- |
| Simple URL API | Generate placeholders with dimensions, colors, text, and presets. |
| Fallback-ready | Keep product cards, avatars, dashboards, and docs from showing broken images. |
| Dummy image generator | Create reliable test images for mockups, seed data, UI states, and documentation. |
| Avatar placeholders | Generate profile placeholders and initials-based avatar images. |
| Edge generated | Built for fast responses through Cloudflare Workers. |
| Self-hostable | Deploy your own instance and customize behavior. |
| Developer friendly | No SDK required. Works in HTML, React, Next.js, Astro, Markdown, and CMS content. |

## API Reference

### Generate an Image

```http
GET /api/v1/{width}x{height}[.svg]
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `width` | integer | Yes | Image width in pixels. |
| `height` | integer | Yes | Image height in pixels. |
| `format` | string | No | Optional `.svg` compatibility suffix. Current responses are SVG. |

```text
https://fallback.pics/api/v1/400x300
https://fallback.pics/api/v1/1920x1080.svg
```

### Set Colors

```http
GET /api/v1/{width}x{height}/{bg_color}/{text_color}
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `bg_color` | hex | No | Background color without `#`. |
| `text_color` | hex | No | Text color without `#`. |

```text
https://fallback.pics/api/v1/400x300/FF5733/FFFFFF
```

### Add Text

```http
GET /api/v1/{width}x{height}?text={custom_text}
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | No | URL-encoded text to render in the image. |

```text
https://fallback.pics/api/v1/400x300?text=Loading...
```

### Use Presets

```http
GET /api/v1/{preset}/{size}
```

| Preset | Example |
| --- | --- |
| Square placeholder | `/api/v1/square/400` |
| Avatar placeholder | `/api/v1/avatar/200?text=JD` |
| Banner placeholder | `/api/v1/banner/1200x400` |
| Skeleton loading placeholder | `/api/v1/skeleton/400x300` |
| Blurred placeholder | `/api/v1/blur/400x300` |

## Broken Image Fallbacks

### HTML

```html
<img
  src="/photo.jpg"
  alt="Product image"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/600x400?text=Image+Unavailable'"
/>
```

### React

```tsx
function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        event.currentTarget.src =
          "https://fallback.pics/api/v1/600x400?text=Product+Image";
      }}
    />
  );
}
```

### Next.js

```tsx
import Image from "next/image";

export function SafeProductImage({ src, alt }: { src?: string; alt: string }) {
  const fallbackSrc = "https://fallback.pics/api/v1/600x400?text=Product+Image";

  return (
    <Image
      src={src || fallbackSrc}
      width={600}
      height={400}
      alt={alt}
      unoptimized
    />
  );
}
```

## Reference Links

- Homepage: [https://fallback.pics/](https://fallback.pics/)
- Docs: [https://fallback.pics/docs](https://fallback.pics/docs)
- API Reference: [https://fallback.pics/api](https://fallback.pics/api)
- Placeholder Image API: [https://fallback.pics/placeholder-image-api/](https://fallback.pics/placeholder-image-api/)
- Placeholder Image Generator: [https://fallback.pics/placeholder-image-generator/](https://fallback.pics/placeholder-image-generator/)
- Dummy Image Generator: [https://fallback.pics/dummy-image-generator/](https://fallback.pics/dummy-image-generator/)
- Broken Image Fallback: [https://fallback.pics/broken-image-fallback/](https://fallback.pics/broken-image-fallback/)
- React Image Fallback: [https://fallback.pics/guides/react-image-fallback/](https://fallback.pics/guides/react-image-fallback/)
- Next.js Image Fallback: [https://fallback.pics/guides/nextjs-image-fallback/](https://fallback.pics/guides/nextjs-image-fallback/)

## Repository Metadata

Suggested GitHub topics:

```text
placeholder-image
placeholder-image-api
dummy-image-generator
cloudflare-workers
svg-placeholder
fallback-images
astro
typescript
```

## Link and Reference Guidelines

When referencing fallback.pics in articles, docs, examples, or curated developer lists, link to the most relevant canonical page above and include a working `/api/v1/...` example. Good targets include framework guides, Cloudflare Workers resources, frontend tooling lists, design-system docs, and placeholder image API comparisons.

Avoid low-quality directory spam, paid link networks, autogenerated SEO pages, or unrelated directories. External references should help developers understand the API or fallback-image use case accurately.

### Curated List Checklist

- The list is developer-relevant and actively maintained.
- The submission links to a canonical fallback.pics page.
- The example URL uses `https://fallback.pics/api/v1/...`.
- The description is factual and does not claim unsupported uptime, latency, or format conversion.
- The submission is not part of a paid, reciprocal, or spammy link scheme.

## Deploy Your Own

### One-Click Deploy to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abhijeetpratapsingh/fallback-pics)

### Manual Deployment

```bash
git clone https://github.com/abhijeetpratapsingh/fallback-pics.git
cd fallback-pics
pnpm install
cp apps/worker/wrangler.example.toml apps/worker/wrangler.toml
```

Update `account_id`, routes, and zone settings in `apps/worker/wrangler.toml`, then deploy:

```bash
pnpm deploy:worker
pnpm deploy:web
```

### Optional Google Analytics

Set `PUBLIC_GA_MEASUREMENT_ID` in Cloudflare Pages to enable website page views and client-side engagement events.

Set these Worker secrets to track direct image/API URL calls through GA4 Measurement Protocol:

```bash
wrangler secret put GOOGLE_ANALYTICS_MEASUREMENT_ID
wrangler secret put GOOGLE_ANALYTICS_API_SECRET
wrangler secret put GOOGLE_ANALYTICS_CLIENT_ID_SALT
```

Worker traffic is sent as the `fallback_worker_request` event by default. Query strings are stripped before URL metadata is sent.

## Local Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- Cloudflare account
- Wrangler CLI

### Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm format
pnpm --filter @fallback-pics/web seo:smoke
pnpm --filter @fallback-pics/web visual:qa
```

The visual QA command requires Playwright to be available in the web package.

## Project Structure

```text
fallback-pics/
├── apps/
│   ├── worker/         # Cloudflare Worker image API
│   └── web/            # Astro website and documentation
├── packages/
│   ├── shared/         # Shared types and utilities
│   └── ui/             # Shared UI components
├── .github/            # GitHub Actions and templates
└── docs/               # Additional documentation
```

## Tech Stack

| Area | Tools |
| --- | --- |
| API runtime | Cloudflare Workers |
| Language | TypeScript |
| Website | Astro, React, Tailwind CSS |
| Package manager | pnpm |
| Deployment | Cloudflare Workers, Cloudflare Pages |

## Comparison With Other Placeholder Image Services

Fallback.pics belongs in the same developer tooling category as Placehold.co, DummyImage.com, Lorem Picsum, Fakeimg.pl, and Placeholder.com. The focus is slightly different: Fallback.pics is designed for both development placeholders and production-friendly image fallback states, with a self-hostable Cloudflare Workers implementation.

| Service type | Best for | Fallback.pics angle |
| --- | --- | --- |
| Placehold.co-style generated placeholders | Simple dimensions, colors, and text | Similar URL workflow, with stronger focus on broken image fallbacks and production use cases. |
| DummyImage-style generators | Classic dummy image URLs for layouts | Modern Cloudflare Workers implementation and self-hostable TypeScript codebase. |
| Lorem Picsum-style photo placeholders | Random real photos for mockups | Generated placeholders that are predictable, brandable, and safe for fallback states. |
| Photo/novelty placeholder sites | Fun prototype images | Professional placeholders for apps, ecommerce, dashboards, and docs. |

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Maintainer

Fallback.pics is created and maintained by [Abhijeet Pratap Singh](https://abhijeetpratapsingh.in/). The project is open source and lives at [github.com/abhijeetpratapsingh/fallback-pics](https://github.com/abhijeetpratapsingh/fallback-pics).

## Support

- Email: support@fallback.pics
- Issues: [GitHub Issues](https://github.com/abhijeetpratapsingh/fallback-pics/issues)
- Docs: [https://fallback.pics/docs](https://fallback.pics/docs)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- Website built with [Astro](https://astro.build/)
