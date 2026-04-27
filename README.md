# Fallback.pics - Placeholder Image API and Fallback Image Service

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abhijeetpratapsingh/fallback-pics)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Fallback.pics is a fast placeholder image API and fallback image service for developers.**

Generate dummy images, product placeholders, avatar fallbacks, banners, skeleton placeholders, and broken-image fallbacks with simple URLs. Use it in HTML, React, Next.js, ecommerce stores, dashboards, documentation, and prototypes when real images are missing or still loading.

Created and maintained by [Abhijeet Pratap Singh](https://abhijeetpratapsingh.in/).

Website: [https://fallback.pics](https://fallback.pics)

Repository: [https://github.com/abhijeetpratapsingh/fallback-pics](https://github.com/abhijeetpratapsingh/fallback-pics)

## Why Fallback.pics?

- **Placeholder image API** - Generate custom-size placeholder images from a URL.
- **Broken image fallback** - Replace failed image loads with clean fallback images.
- **Dummy image generator** - Create test images for mockups, docs, seed data, and UI development.
- **Avatar placeholder API** - Generate profile placeholders and initials-based avatar images.
- **Product image placeholders** - Keep product grids and ecommerce cards from breaking.
- **Skeleton and loading placeholders** - Show visual loading states while content loads.
- **Serverless and fast** - Built on Cloudflare Workers for edge delivery.
- **Self-hostable** - Deploy your own placeholder image service with Cloudflare.

## Quick Start

Use the hosted placeholder image API:

```html
<img
  src="https://fallback.pics/api/v1/400x300"
  alt="Placeholder image"
/>
```

Generate a custom dummy image:

```html
<img
  src="https://fallback.pics/api/v1/600x400?text=Product+Image"
  alt="Product placeholder"
/>
```

Use Fallback.pics as a broken image fallback:

```html
<img
  src="/images/product.jpg"
  onerror="this.src='https://fallback.pics/api/v1/400x300?text=Product+Image'"
  alt="Product image"
/>
```

## Placeholder Image API Examples

| Use case | URL |
| --- | --- |
| Basic placeholder image | `https://fallback.pics/api/v1/400x300` |
| Custom text placeholder | `https://fallback.pics/api/v1/400x300?text=Hello+World` |
| Custom colors | `https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF` |
| Full HD dummy image | `https://fallback.pics/api/v1/1920x1080` |
| Square placeholder | `https://fallback.pics/api/v1/square/400` |
| Avatar placeholder | `https://fallback.pics/api/v1/avatar/200?text=JD` |
| Banner placeholder | `https://fallback.pics/api/v1/banner/1200x400` |
| Skeleton placeholder | `https://fallback.pics/api/v1/skeleton/400x300` |
| Blur placeholder | `https://fallback.pics/api/v1/blur/400x300` |

## API Documentation

### Basic Image Generation

```http
GET /api/v1/{width}x{height}[.{format}]
```

| Parameter | Type | Description | Default |
| --- | --- | --- | --- |
| `width` | integer | Image width in pixels | Required |
| `height` | integer | Image height in pixels | Required |
| `format` | string | Output format such as `svg`, `png`, `jpg`, or `webp` | `svg` |

Examples:

```text
https://fallback.pics/api/v1/400x300
https://fallback.pics/api/v1/1920x1080.jpg
```

### Custom Colors

```http
GET /api/v1/{width}x{height}/{bg_color}/{text_color}
```

| Parameter | Type | Description | Default |
| --- | --- | --- | --- |
| `bg_color` | hex | Background color without `#` | `7C3AED` |
| `text_color` | hex | Text color without `#` | `FFFFFF` |

Example:

```text
https://fallback.pics/api/v1/400x300/FF5733/FFFFFF
```

### Custom Text

```http
GET /api/v1/{width}x{height}?text={custom_text}
```

| Parameter | Type | Description | Default |
| --- | --- | --- | --- |
| `text` | string | URL-encoded text to render in the image | `{width} x {height}` |

Example:

```text
https://fallback.pics/api/v1/400x300?text=Loading...
```

### Preset Placeholder Images

```http
GET /api/v1/{preset}/{size}
```

Available presets:

- `/square/{size}` - Square placeholder image
- `/avatar/{size}` - Avatar placeholder image
- `/banner/{width}x{height}` - Banner placeholder image
- `/skeleton/{width}x{height}` - Skeleton loading placeholder
- `/blur/{width}x{height}` - Blurred placeholder image

## Broken Image Fallback Examples

### HTML

```html
<img
  src="/photo.jpg"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/600x400?text=Image+Unavailable'"
  alt="Fallback image example"
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

## Comparison With Other Placeholder Image Services

Fallback.pics is in the same category as services like Placehold.co, DummyImage.com, Lorem Picsum, Fakeimg.pl, and Placeholder.com. The main difference is positioning: Fallback.pics is designed as both a developer placeholder image API and a production-friendly fallback image service.

| Service type | Best for | Fallback.pics angle |
| --- | --- | --- |
| Placehold.co-style generated placeholders | Simple dimensions, colors, text, and formats | Similar URL workflow, with stronger focus on broken image fallbacks and production use cases |
| DummyImage-style generators | Classic dummy image URLs for layouts | Modern Cloudflare Workers implementation and self-hostable TypeScript codebase |
| Lorem Picsum-style photo placeholders | Random real photos for mockups | Generated placeholders that are predictable, brandable, and safe for fallback states |
| Animal/photo placeholder sites | Fun prototype images | Professional placeholders for apps, ecommerce, dashboards, and docs |

## Deploy Your Own Placeholder Image Service

### One-Click Deploy to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abhijeetpratapsingh/fallback-pics)

### Manual Deployment

1. Clone the repository:

```bash
git clone https://github.com/abhijeetpratapsingh/fallback-pics.git
cd fallback-pics
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure Cloudflare:

```bash
cp apps/worker/wrangler.example.toml apps/worker/wrangler.toml
```

Then update `account_id`, routes, and zone settings in `apps/worker/wrangler.toml`.

4. Deploy the Worker:

```bash
pnpm deploy:worker
```

5. Deploy the Astro documentation site:

```bash
pnpm deploy:web
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- Cloudflare account
- Wrangler CLI

### Local Development

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm format
```

### Project Structure

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

- Cloudflare Workers
- TypeScript
- Astro
- React
- Tailwind CSS
- pnpm

## Related Search Terms

Fallback.pics is useful for developers searching for:

- placeholder image API
- image placeholder service
- dummy image generator
- fallback image API
- broken image fallback
- avatar placeholder API
- product image placeholder
- skeleton placeholder image
- Cloudflare Workers image generator

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Maintainer

Fallback.pics is maintained by [Abhijeet Pratap Singh](https://abhijeetpratapsingh.in/), a developer building open source tools and fast web products.

## Support

- Email: support@fallback.pics
- Issues: [GitHub Issues](https://github.com/abhijeetpratapsingh/fallback-pics/issues)
- Docs: [https://fallback.pics/docs](https://fallback.pics/docs)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- Website built with [Astro](https://astro.build/)

---

Made by the open source community.
