# Fallback.pics - Placeholder Image Service

## 🎯 Project Overview

**Name:** Fallback.pics  
**Domain:** fallback.pics  
**Tagline:** "Never show broken images again"  
**Purpose:** A lightning-fast, developer-friendly placeholder image service that provides instant fallback images for web development

## 🎨 Brand Identity

### Color Palette
Based on modern SaaS design principles:

```css
:root {
  /* Primary Colors - Purple/Indigo Gradient */
  --primary: #7C3AED;        /* Purple 700 */
  --primary-dark: #6D28D9;   /* Purple 800 */
  --primary-light: #8B5CF6;  /* Purple 500 */
  
  /* Accent Colors */
  --accent-blue: #3B82F6;     /* Blue 500 */
  --accent-green: #10B981;    /* Emerald 500 */
  --accent-orange: #F97316;   /* Orange 500 */
  
  /* Background Colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --bg-dark: #18181B;
  
  /* Text Colors */
  --text-primary: #18181B;
  --text-secondary: #71717A;
  --text-light: #A1A1AA;
  
  /* Gradient */
  --gradient-primary: linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%);
  --gradient-hover: linear-gradient(135deg, #6D28D9 0%, #2563EB 100%);
}
```

### Logo Design
- **Icon:** Minimalist parachute or safety net symbol
- **Font:** Inter or Geist Sans (clean, modern)
- **Style:** Simple, scalable, works in mono and color

### Typography
```css
/* Headings */
font-family: 'Geist Sans', 'Inter', system-ui, -apple-system, sans-serif;

/* Body Text */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Code/Technical */
font-family: 'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace;
```

## 🛠️ Technical Stack

### Architecture: Serverless Edge Computing

```yaml
Core:
  Runtime: Cloudflare Workers
  Language: TypeScript
  Image Generation: SVG (no dependencies)
  Caching: Cloudflare CDN (automatic)

Frontend:
  Framework: Astro (static site)
  Styling: Tailwind CSS
  Components: React (islands architecture)
  Hosting: Cloudflare Pages

Infrastructure:
  DNS: Cloudflare
  Analytics: Cloudflare Analytics
  Storage: Cloudflare R2 (if needed)
  Database: Cloudflare D1 (for analytics)

Development:
  Package Manager: pnpm
  Build Tool: Vite
  Testing: Vitest
  Linting: ESLint + Prettier
  CI/CD: GitHub Actions
```

## 📁 Project Structure

```
fallback.pics/
├── apps/
│   ├── worker/                 # Cloudflare Worker
│   │   ├── src/
│   │   │   ├── index.ts       # Main worker entry
│   │   │   ├── router.ts      # URL routing logic
│   │   │   ├── generator.ts   # Image generation
│   │   │   ├── cache.ts       # Cache headers
│   │   │   └── utils.ts       # Helper functions
│   │   ├── wrangler.toml      # Cloudflare config
│   │   └── package.json
│   │
│   └── web/                    # Documentation site
│       ├── src/
│       │   ├── pages/         # Astro pages
│       │   ├── components/    # React components
│       │   ├── layouts/       # Page layouts
│       │   └── styles/        # Global styles
│       ├── astro.config.mjs
│       └── package.json
│
├── packages/
│   ├── shared/                # Shared types & constants
│   └── ui/                    # Shared UI components
│
├── .github/
│   └── workflows/             # CI/CD pipelines
│
├── turbo.json                 # Turborepo config
├── pnpm-workspace.yaml        # pnpm workspace
└── README.md
```

## 🌐 URL Structure

### Basic Usage
```
https://fallback.pics/[width]x[height]
https://fallback.pics/400x300
https://fallback.pics/1920x1080
```

### Advanced Features
```
# With format
https://fallback.pics/400x300.jpg
https://fallback.pics/400x300.png
https://fallback.pics/400x300.webp

# With colors (hex without #)
https://fallback.pics/400x300/7C3AED/FFFFFF
https://fallback.pics/400x300/bg_color/text_color

# With text
https://fallback.pics/400x300?text=Product+Image
https://fallback.pics/400x300?text=Custom+Text

# Special routes
https://fallback.pics/square/400           # Square image
https://fallback.pics/avatar/200           # Avatar placeholder
https://fallback.pics/avatar/200?text=JD   # Avatar with initials
https://fallback.pics/banner/1200x400      # Banner preset
https://fallback.pics/random/400x300       # Random unsplash image
https://fallback.pics/blur/400x300         # Blurred placeholder
https://fallback.pics/skeleton/400x300     # Skeleton loader style
```

## 💻 Core Implementation

### Cloudflare Worker (TypeScript)
```typescript
// worker/src/index.ts
import { Router } from './router';
import { generateImage } from './generator';
import { setCacheHeaders } from './cache';

export default {
  async fetch(request: Request): Promise<Response> {
    const router = new Router(request);
    
    try {
      const params = router.parse();
      const image = await generateImage(params);
      
      return new Response(image, {
        headers: setCacheHeaders(params.format)
      });
    } catch (error) {
      return new Response('Invalid parameters', { status: 400 });
    }
  }
};
```

### SVG Generation
```typescript
// worker/src/generator.ts
export function generateSVG(width: number, height: number, options: Options): string {
  const { bgColor = '#7C3AED', textColor = '#FFFFFF', text } = options;
  const displayText = text || `${width} × ${height}`;
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${Math.min(width, height) * 0.1}" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${displayText}
      </text>
    </svg>
  `;
}
```

## 🚀 Features Roadmap

### Phase 1: MVP (Week 1)
- [x] Basic image generation (width x height)
- [x] SVG output
- [x] Cache headers
- [ ] Landing page
- [ ] Basic documentation

### Phase 2: Core Features (Week 2)
- [ ] Multiple formats (PNG, JPEG, WebP)
- [ ] Custom colors
- [ ] Custom text
- [ ] Common presets (avatar, banner, square)
- [ ] API documentation

### Phase 3: Advanced (Week 3)
- [ ] Blur effect placeholders
- [ ] Skeleton loaders
- [ ] Random images from Unsplash
- [ ] Gradient backgrounds
- [ ] Pattern backgrounds
- [ ] Image categories

### Phase 4: Premium Features (Week 4)
- [ ] Custom domains
- [ ] Analytics dashboard
- [ ] Team accounts
- [ ] Priority support
- [ ] No rate limits
- [ ] Custom watermarks

## 💰 Monetization Strategy

### Free Tier
- Up to 1000 requests/day
- Basic features
- Community support
- Small "fallback.pics" watermark

### Pro ($9/month)
- Unlimited requests
- No watermark
- Custom subdomain
- Priority support
- Advanced analytics
- All image formats

### Enterprise (Custom)
- Custom domain
- SLA guarantee
- Dedicated support
- Custom features
- White-label option

## 📊 Success Metrics

- **Performance:** <50ms response time globally
- **Uptime:** 99.9% availability
- **Usage:** 1M+ images served/month
- **Users:** 10K+ developers using the service
- **Revenue:** $1K MRR within 6 months

## 🎯 Marketing Strategy

### Launch Plan
1. **Soft Launch:** Share with close developer friends
2. **Reddit:** Post on r/webdev, r/programming
3. **Product Hunt:** Schedule launch for Tuesday
4. **Twitter/X:** Share building progress (#buildinpublic)
5. **Dev.to Article:** "Building a Placeholder Service with Cloudflare Workers"
6. **Hacker News:** Show HN post

### SEO Keywords
- placeholder image api
- dummy image generator
- image placeholder service
- fallback images
- development placeholder images
- mockup image generator

### Content Marketing
- Blog post: "Why Every Developer Needs Image Fallbacks"
- Tutorial: "Implementing Perfect Image Loading with Fallbacks"
- Comparison: "Fallback.pics vs Other Placeholder Services"

## 📝 Sample Marketing Copy

### Hero Section
**Headline:** "Never Show Broken Images Again"  
**Subheadline:** "Lightning-fast placeholder images for developers. Simple URLs, instant results, zero configuration."

### Features Copy
- ⚡ **Instant Generation** - Images generated at the edge in <50ms
- 🎨 **Fully Customizable** - Colors, text, formats, and sizes
- 🚀 **Developer Friendly** - Simple URL API, no authentication needed
- 🌍 **Global CDN** - Served from 200+ locations worldwide
- 💪 **Always Available** - 99.9% uptime guarantee
- 🔒 **Privacy First** - No tracking, no cookies, no BS

## 🛡️ Security & Performance

### Security Headers
```javascript
headers: {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

### Caching Strategy
```javascript
'Cache-Control': 'public, max-age=31536000, immutable'
'CDN-Cache-Control': 'max-age=31536000'
```

### Rate Limiting
- Free: 1000 requests/day per IP
- Pro: Unlimited
- Implement via Cloudflare Rate Limiting

## 🤝 Support Channels

- **Documentation:** docs.fallback.pics
- **GitHub:** github.com/fallbackpics
- **Email:** support@fallback.pics
- **Twitter/X:** @fallbackpics
- **Discord:** Community server for users

## 🎉 Launch Checklist

### Pre-Launch
- [ ] Domain registered and configured
- [ ] Cloudflare Worker deployed
- [ ] Landing page live
- [ ] Documentation complete
- [ ] GitHub repo public
- [ ] Social accounts created

### Launch Day
- [ ] Product Hunt submission
- [ ] Twitter announcement
- [ ] Reddit posts
- [ ] Email friends/network
- [ ] Monitor analytics

### Post-Launch
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Implement requested features
- [ ] Write blog post about launch
- [ ] Thank early users

## 💡 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/nosignupdev/fallbackpics
cd fallback.pics
pnpm install

# Development
pnpm dev

# Deploy Worker
pnpm deploy:worker

# Deploy Website
pnpm deploy:web

# Run tests
pnpm test

# Format code
pnpm format
```

## 🔗 Important Links

- **Production:** https://fallback.pics
- **Documentation:** https://docs.fallback.pics
- **GitHub:** https://github.com/fallbackpics
- **Status Page:** https://status.fallback.pics
- **Analytics:** Cloudflare Dashboard

---

**Created:** 2025  
**Status:** In Development  
**Next Step:** Set up Cloudflare Worker and deploy MVP

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
