# Fallback.pics - Open Source Placeholder Image Service

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abhijeetpratapsingh/fallback-pics)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> Never show broken images again. A lightning-fast, developer-friendly placeholder image service that provides instant fallback images for web development.

## Features

- ⚡ **Lightning Fast** - Images generated at the edge in <50ms
- 🎨 **Fully Customizable** - Colors, text, formats, and sizes
- 🚀 **Developer Friendly** - Simple URL API, no authentication needed
- 🌍 **Global CDN** - Served from 200+ Cloudflare edge locations
- 💪 **Always Available** - 99.9% uptime with edge computing
- 🔒 **Privacy First** - No tracking, no cookies, no data collection
- 📦 **Self-Hostable** - Deploy your own instance with one click

## Quick Start

### Use the Public Service

Simply use our hosted service at `https://fallback.pics`:

```html
<!-- Basic usage -->
<img src="https://fallback.pics/400x300" alt="Placeholder">

<!-- With custom colors -->
<img src="https://fallback.pics/400x300/7C3AED/FFFFFF" alt="Placeholder">

<!-- With custom text -->
<img src="https://fallback.pics/400x300?text=Product+Image" alt="Product">
```

### Deploy Your Own Instance

#### Option 1: One-Click Deploy to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abhijeetpratapsingh/fallback-pics)

#### Option 2: Manual Deployment

1. **Clone the repository**
```bash
git clone https://github.com/abhijeetpratapsingh/fallback-pics.git
cd fallback-pics
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure Cloudflare**
```bash
# Copy the example config
cp apps/worker/wrangler.example.toml apps/worker/wrangler.toml

# Edit with your account details
# Update: account_id, route, and zone_id
```

4. **Deploy the worker**
```bash
pnpm deploy:worker
```

5. **(Optional) Deploy the documentation site**
```bash
pnpm deploy:web
```

## API Documentation

### Basic Image Generation

```
GET /{width}x{height}[.{format}]
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| width | integer | Image width in pixels | Required |
| height | integer | Image height in pixels | Required |
| format | string | Output format (svg, png, jpg, webp) | svg |

**Examples:**
- `https://fallback.pics/400x300` - 400x300 SVG
- `https://fallback.pics/1920x1080.jpg` - Full HD JPEG

### Custom Colors

```
GET /{width}x{height}/{bg_color}/{text_color}
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| bg_color | hex | Background color (without #) | 7C3AED |
| text_color | hex | Text color (without #) | FFFFFF |

**Example:**
- `https://fallback.pics/400x300/FF5733/FFFFFF` - Orange background, white text

### Custom Text

```
GET /{width}x{height}?text={custom_text}
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| text | string | Custom text (URL encoded) | {width} × {height} |

**Example:**
- `https://fallback.pics/400x300?text=Loading...` - Shows "Loading..."

### Presets

```
GET /{preset}/{size}
```

Available presets:
- `/square/{size}` - Square image
- `/avatar/{size}` - Avatar placeholder
- `/banner/{width}x{height}` - Banner image
- `/skeleton/{width}x{height}` - Skeleton loader
- `/blur/{width}x{height}` - Blurred placeholder

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- Cloudflare account (free tier works)
- Wrangler CLI

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Format code
pnpm format

# Lint code
pnpm lint
```

### Project Structure

```
fallback-pics/
├── apps/
│   ├── worker/         # Cloudflare Worker (image generation)
│   └── web/           # Documentation website (Astro)
├── packages/
│   ├── shared/        # Shared types and utilities
│   └── ui/           # Shared UI components
├── .github/          # GitHub Actions and templates
└── docs/            # Additional documentation
```

## Configuration

### Environment Variables

Create `.env` files based on the examples:

```bash
# Worker configuration
cp apps/worker/.env.example apps/worker/.env

# Web configuration  
cp apps/web/.env.example apps/web/.env
```

### Worker Configuration (wrangler.toml)

```toml
name = "fallback-pics"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "fallback.pics/*", zone_name = "fallback.pics" }
]

[env.staging]
routes = [
  { pattern = "staging.fallback.pics/*", zone_name = "fallback.pics" }
]
```

## Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- 📧 **Email**: support@fallback.pics
- 💬 **Discord**: [Join our community](https://discord.gg/hwGJNnN3)
- 🐛 **Issues**: [GitHub Issues](https://github.com/abhijeetpratapsingh/fallback-pics/issues)
- 📖 **Docs**: [Documentation](https://docs.fallback.pics)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)

- Typography from [Inter](https://rsms.me/inter/) and [Geist](https://vercel.com/font)

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website.

[Become a sponsor](https://github.com/sponsors/abhijeetpratapsingh)

---

**Made with ❤️ by the open source community**