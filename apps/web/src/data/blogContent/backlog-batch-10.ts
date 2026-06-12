import type { BlogPost } from '../blogPosts';

export const backlogBatch10: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────────
  {
    title: "Docker Deployment for Self-Hosted Placeholder Image Workers",
    description:
      "Run a docker placeholder image api worker locally or in CI with a single container. Covers image sizing, caching headers, reverse proxy setup, and production readiness.",
    slug: "docker-self-hosted-placeholder-api",
    readTime: "10 min read",
    category: "Technical",
    tags: [
      "Docker placeholder image api",
      "Self-hosted placeholder",
      "Cloudflare Workers",
      "Container deployment",
      "Image API",
    ],
    summary: [
      "A docker placeholder image api container gives teams a fully isolated, reproducible image service that mirrors what fallback.pics serves at the edge — useful for air-gapped environments, CI pipelines where external network calls are blocked, or internal tooling that must not depend on third-party uptime.",
      "This guide walks through writing a minimal Dockerfile for a Node-based SVG generator, wiring cache headers, setting up a reverse proxy, and connecting it to the same URL shape your production code already expects.",
    ],
    sections: [
      {
        eyebrow: "Use case",
        title: "When you need a self-hosted docker placeholder image api",
        body: [
          "Most teams reach for self-hosting when CI jobs run in a sandbox with no external internet access. Playwright or Cypress suites that render product grids will show broken-image icons if they call fallback.pics and the network is blocked. Replacing every test fixture with a local static file is tedious and hard to maintain at scale.",
          "Internal enterprise tools present a second reason. Some security policies prohibit loading assets from domains outside the corporate trust boundary. A containerized placeholder service satisfies the policy without forcing every frontend team to maintain their own static asset library.",
          "The third scenario is cost control at very high volume. The edge service handles the vast majority of production traffic efficiently, but teams occasionally prototype features that hammer the API hundreds of thousands of times in load tests. A local container absorbs that traffic without touching rate limits.",
        ],
      },
      {
        eyebrow: "Dockerfile",
        title: "Minimal Node container for SVG placeholder generation",
        body: [
          "The worker itself needs only a URL parser, a string template for SVG, and an HTTP server. Node's built-in `http` module plus a small routing function is enough. Avoid image-processing libraries like Sharp unless you need raster output — they add hundreds of megabytes to the image and make layer caching slower.",
          "Pin the Node version to an LTS release and use a slim or alpine base. The final image should be under 100 MB. Set `NODE_ENV=production` to prevent dev-only dependencies from being installed.",
        ],
        code: `# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

EXPOSE 3000
CMD ["node", "src/index.js"]

# src/index.js  (minimal SVG server)
import http from 'node:http';
import { parse } from 'node:url';

const PORT = process.env.PORT ?? 3000;

http.createServer((req, res) => {
  const { pathname, query } = parse(req.url, true);
  const match = pathname.match(/^\\/api\\/v1\\/(\\d+)x(\\d+)/);
  if (!match) {
    res.writeHead(400); res.end('Bad request'); return;
  }
  const [, w, h] = match;
  const bg  = query.bg  ?? '7C3AED';
  const fg  = query.fg  ?? 'FFFFFF';
  const text = query.text ?? \`\${w}×\${h}\`;

  const svg = \`<svg xmlns="http://www.w3.org/2000/svg"
    width="\${w}" height="\${h}">
    <rect width="100%" height="100%" fill="#\${bg}"/>
    <text x="50%" y="50%" fill="#\${fg}"
      font-family="system-ui,sans-serif"
      font-size="\${Math.min(+w,+h)*0.12}"
      text-anchor="middle" dominant-baseline="middle">
      \${text}
    </text>
  </svg>\`;

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
  res.end(svg);
}).listen(PORT);`,
      },
      {
        eyebrow: "Compose setup",
        title: "docker-compose for local development and CI",
        body: [
          "A compose file gives developers a one-command start and lets CI services declare the placeholder container as a dependency with `depends_on`. Map port 3000 inside the container to whatever the test suite expects — commonly 3001 to avoid colliding with the app's own dev server.",
          "Set a health check so CI does not try to run tests before the server is ready. A `curl` to the `/api/v1/1x1` route is the simplest probe.",
        ],
        code: `# docker-compose.yml
services:
  placeholder:
    build: .
    ports:
      - "3001:3000"
    environment:
      PORT: 3000
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/v1/1x1"]
      interval: 5s
      retries: 3

# In your test env, point image requests here:
# NEXT_PUBLIC_PLACEHOLDER_BASE=http://localhost:3001/api/v1`,
      },
      {
        eyebrow: "Reverse proxy",
        title: "Nginx cache and path rewriting for production containers",
        body: [
          "If you deploy the container behind Nginx, add a proxy_cache zone so the SVG generator process only runs once per unique URL. Subsequent requests are served from disk. This mirrors the CDN layer that fallback.pics uses in production.",
          "Rewrite the path if your internal URL convention differs from `/api/v1/{w}x{h}`. A single `rewrite` rule at the proxy layer means application code never needs to know about the container's routing logic.",
        ],
        code: `# nginx.conf (relevant block)
proxy_cache_path /var/cache/nginx
  levels=1:2 keys_zone=placeholders:10m
  max_size=1g inactive=1y use_temp_path=off;

server {
  location /api/v1/ {
    proxy_pass http://placeholder:3000;
    proxy_cache placeholders;
    proxy_cache_valid 200 1y;
    add_header X-Cache-Status $upstream_cache_status;
  }
}`,
      },
      {
        eyebrow: "CI integration",
        title: "Wiring the container into GitHub Actions",
        body: [
          "GitHub Actions supports Docker Compose services directly via the `services` key. Declare the placeholder container there and it will start before your test step. Use `PLACEHOLDER_BASE_URL` as an environment variable in tests so you can swap between local, CI, and production without code changes.",
          "For Playwright specifically, set `baseURL` in `playwright.config.ts` to use an environment variable and pass the container's address in CI. That way visual regression baselines match whether a developer runs tests locally against fallback.pics or in CI against the container.",
        ],
        code: `# .github/workflows/test.yml (excerpt)
services:
  placeholder:
    image: ghcr.io/your-org/placeholder-api:latest
    ports:
      - 3001:3000

env:
  PLACEHOLDER_BASE_URL: http://localhost:3001/api/v1

steps:
  - uses: actions/checkout@v4
  - run: npm ci
  - run: npx playwright test`,
      },
      {
        eyebrow: "Production checklist",
        title: "What to harden before deploying the container to production",
        body: [
          "Set `max-age=31536000, immutable` in Cache-Control. Without this, every request hits the Node process and the value of the container over a CDN drops to zero. Add an `ETag` header derived from the URL parameters so conditional GETs return 304s without regenerating SVG.",
          "Restrict accepted dimensions to prevent abuse. A request for a 50000×50000 SVG can be served trivially but some downstream clients may try to rasterize it. Add an upper bound — 4096 pixels per side is reasonable for most use cases.",
          "Run the container as a non-root user. Add `USER node` to the Dockerfile after dependencies are installed. Log to stdout so your container orchestrator can forward logs to your observability stack without needing a file-based log drain.",
        ],
      },
      {
        eyebrow: "Related resources",
        title: "Further reading on placeholder infrastructure",
        body: [
          "If the self-hosted route adds more operational overhead than your team can justify, the managed fallback.pics service provides the same URL shape with a global CDN, zero ops, and immutable cache semantics out of the box.",
        ],
        code: `# Managed alternative (no container required)
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product

# Docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/self-hosted-vs-managed-placeholder-api/
https://fallback.pics/blog/cloudflare-cdn-cache-generated-images/`,
      },
    ],
    takeaways: [
      "Use a containerized placeholder service in CI environments where external network access is blocked.",
      "Keep the Docker image under 100 MB by avoiding heavy raster-processing libraries for SVG-only output.",
      "Add Nginx proxy caching to avoid regenerating SVGs for every request in high-traffic deployments.",
      "Cap accepted dimensions (e.g. 4096px) and run the container as a non-root user before going to production.",
      "Pass the placeholder base URL via environment variable so tests work against both the container and the managed service.",
    ],
    related: [
      "self-hosted-vs-managed-placeholder-api",
      "cloudflare-cdn-cache-generated-images",
      "immutable-urls-cdn-placeholder-caching",
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────────
  {
    title: "Figma Handoff: Using Placeholder URLs in Design Specs",
    description:
      "Replace Figma lorem-image fills with figma placeholder image URLs in design specs so developers get real dimensions and colors during handoff instead of grey boxes.",
    slug: "figma-handoff-placeholder-urls",
    readTime: "8 min read",
    category: "UX Patterns",
    tags: [
      "Figma placeholder image",
      "Design handoff",
      "Placeholder URLs",
      "Developer specs",
      "UX workflow",
    ],
    summary: [
      "Figma's image fills work well during ideation but they create friction in handoff: images are embedded blobs, not URLs, so developers must re-export or guess dimensions when implementing. Replacing embedded fills with figma placeholder image URLs in Inspect annotations gives developers copy-pasteable code with exact dimensions baked into the address.",
      "This guide covers how to annotate Figma frames with placeholder URLs using the Inspect panel and dev mode, how to size URLs to match your actual component dimensions, and how to keep placeholder tokens consistent across a design system.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why embedded Figma image fills slow down handoff",
        body: [
          "When a designer drags a stock photo into a card component, Figma encodes the image as a base64 blob. In the Inspect panel a developer sees no URL, only width and height in the properties. They must manually note the dimensions, open the image, export it, or look up the asset in a separate tool.",
          "The embedded image also carries no semantic meaning about what the production image should look like. A developer implementing a 320×180 video thumbnail has no signal from the design file about whether the production image should be 16:9, whether there is a colored overlay, or what fallback state looks like.",
          "Placeholder URLs fix both problems. A URL like `https://fallback.pics/api/v1/320x180/1E293B/94A3B8?text=Thumbnail` is self-documenting, carries exact dimensions, shows the intended color palette, and is immediately usable in a `<img>` tag during development.",
        ],
      },
      {
        eyebrow: "Annotation technique",
        title: "Adding figma placeholder image URLs to the Inspect panel",
        body: [
          "In Figma Dev Mode, select an image layer and use the component description field or a sticky annotation to record the placeholder URL. Teams that use Figma's annotation toolkit can add a custom annotation type called 'Placeholder URL' that appears inline next to dimension properties.",
          "For component libraries, define a variant called 'Placeholder' that sets the image fill to a solid color matching the placeholder's background hex. Export it as an SVG with the URL recorded in the SVG title element. Developers reading the SVG source will find the URL without needing to open Figma.",
        ],
        code: `<!-- Developer can read this directly from Figma Inspect -->
<!-- Placeholder URL: https://fallback.pics/api/v1/320x180/1E293B/94A3B8?text=Video+Thumbnail -->

<img
  src="https://fallback.pics/api/v1/320x180/1E293B/94A3B8?text=Video+Thumbnail"
  width="320"
  height="180"
  alt="Video thumbnail placeholder"
/>`,
      },
      {
        eyebrow: "Design tokens",
        title: "Encoding brand colors into placeholder URLs for consistency",
        body: [
          "Placeholder URLs accept background and foreground hex values directly in the path. Pair these with your design token values to keep placeholders on-brand during development. If your card background token is `surface-muted` = `#F1F5F9` and your muted text token is `text-muted` = `#64748B`, encode them directly: `/F1F5F9/64748B`.",
          "Document the mapping in your design system handbook so developers do not invent colors. A token-to-placeholder URL mapping table helps teams maintain visual consistency from design to staging.",
        ],
        code: `// design-tokens.ts (excerpt)
export const placeholders = {
  cardSmall:   'https://fallback.pics/api/v1/280x160/F1F5F9/64748B?text=Image',
  cardLarge:   'https://fallback.pics/api/v1/560x320/F1F5F9/64748B?text=Image',
  avatar48:    'https://fallback.pics/api/v1/avatar/48?text=AB',
  heroBanner:  'https://fallback.pics/api/v1/1200x400/7C3AED/FFFFFF?text=Hero',
  thumbnail:   'https://fallback.pics/api/v1/1200x630?text=Title&style=soft&theme=purple&label=fallback.pics',
};`,
      },
      {
        eyebrow: "Responsive variants",
        title: "Sizing placeholder URLs to match Figma breakpoint frames",
        body: [
          "Figma frames for mobile (375px wide), tablet (768px), and desktop (1440px) typically use different image dimensions. Define one placeholder URL per breakpoint frame and record all three in the annotation. Developers then map them to the correct responsive `srcset` or CSS media query.",
          "For fluid images that use `width: 100%`, record the placeholder at the max intrinsic size the image should reach. Passing `width` and `height` attributes matching that maximum prevents CLS even when the actual render size is smaller.",
        ],
      },
      {
        eyebrow: "Storybook bridge",
        title: "Sharing placeholder URLs between Figma and Storybook",
        body: [
          "Storybook default args and Figma component specs can share the same placeholder URLs. Define the URLs in a shared `constants/placeholders.ts` file that both the component `defaultArgs` and the design token documentation import. When a designer updates a card dimension in Figma, one file change propagates to both Storybook and production fallback behavior.",
          "Teams using Storybook Connect or Chromatic for Figma integration can use this shared token file to validate that the Storybook render dimensions match the Figma frame dimensions automatically in CI.",
        ],
      },
      {
        eyebrow: "Handoff checklist",
        title: "What to include in every Figma component spec for images",
        body: [
          "Every image surface in a Figma component should document: the placeholder URL at the primary render size, the aspect ratio or fixed dimensions, the alt text pattern (is it descriptive or decorative?), and the failure state if the production image is missing. Most teams skip the failure state; it is the most important one.",
        ],
        code: `# Figma component annotation template

## Image surface: Product thumbnail
- Placeholder URL: https://fallback.pics/api/v1/240x240/F8FAFC/CBD5E1?text=Product
- Dimensions: 240×240 (1:1 aspect ratio)
- Alt text pattern: product.name + " product photo"
- Fallback state: show placeholder URL if src returns 404

## Related resources
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/storybook-default-placeholder-urls/`,
      },
    ],
    takeaways: [
      "Replace embedded Figma image fills with placeholder URLs in Inspect annotations to give developers copy-pasteable, dimension-accurate code.",
      "Encode design token hex values into placeholder URL paths to keep staging builds visually consistent with designs.",
      "Define one placeholder URL per responsive breakpoint frame and record all variants in the component annotation.",
      "Share placeholder URL constants between Figma specs and Storybook default args to keep dimensions in sync.",
      "Always document the failure state alongside the placeholder — it is the most commonly skipped but most important spec.",
    ],
    related: [
      "storybook-default-placeholder-urls",
      "shadcn-card-media-placeholders",
      "blur-placeholder-loading-states",
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────────
  {
    title: "Storybook Default Args with Placeholder Image URLs",
    description:
      "Set storybook placeholder image URLs as default args for image props so every story renders correctly without requiring real assets or mocked fetch calls.",
    slug: "storybook-default-placeholder-urls",
    readTime: "8 min read",
    category: "Testing",
    tags: [
      "Storybook placeholder image",
      "Default args",
      "Component testing",
      "Visual regression",
      "Design system",
    ],
    summary: [
      "Storybook stories with image props often show broken-image icons in the default state because no `src` value is provided. Setting a deterministic storybook placeholder image URL as the default arg means every story renders a visually complete component on first open — with correct dimensions and no network dependency on real assets.",
      "This guide covers setting component-level and story-level default args, creating a shared placeholder constants file, integrating with Chromatic for visual regression, and avoiding the common mistake of using random URLs that produce non-deterministic snapshots.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why Storybook stories break without image default args",
        body: [
          "A `ProductCard` component with an `imageSrc` prop renders a broken icon if the story does not provide a value. Designers reviewing the story in Storybook see an incomplete component, and Chromatic's visual regression baseline captures the broken state — meaning any future fix triggers a false positive diff.",
          "Using a real production image URL as the default arg causes a different problem: the URL may change, return a 404, or be unavailable in CI networks. Developers end up committing local image paths that only work on their machine, or skipping the image prop altogether.",
          "A deterministic placeholder URL solves both. The URL is always valid, returns the same SVG for the same parameters, and can be calculated from the component's expected dimensions — making the default arg self-documenting.",
        ],
      },
      {
        eyebrow: "Setup",
        title: "A shared placeholder constants file for all stories",
        body: [
          "Create a single file that exports placeholder URLs keyed by component or size name. Import from this file in every story that needs image args. When a component's dimensions change, update one constant and all stories update automatically.",
          "Keep the file in `.storybook/` or `src/stories/` depending on your project convention. Avoid putting it in `src/constants/` unless you intend to use the same placeholders in production fallback code — which is actually a valid pattern.",
        ],
        code: `// .storybook/placeholders.ts
const BASE = 'https://fallback.pics/api/v1';

export const ph = {
  card:          \`\${BASE}/320x180/E2E8F0/94A3B8?text=Image\`,
  cardLarge:     \`\${BASE}/640x360/E2E8F0/94A3B8?text=Image\`,
  avatar32:      \`\${BASE}/avatar/32?text=AB\`,
  avatar64:      \`\${BASE}/avatar/64?text=AB\`,
  avatar96:      \`\${BASE}/avatar/96?text=AB\`,
  hero:          \`\${BASE}/1200x400/7C3AED/FFFFFF?text=Hero\`,
  thumbnail:     \`\${BASE}/1200x630?text=Title&style=soft&theme=purple&label=fallback.pics\`,
  productSquare: \`\${BASE}/square/400?text=Product\`,
  banner728:     \`\${BASE}/banner/728x90?text=Banner\`,
};`,
      },
      {
        eyebrow: "Component story",
        title: "Setting placeholder default args at the component level",
        body: [
          "Set image defaults at the component (`Meta`) level so every story in the file inherits them. Override at the story level only when you are specifically testing a different image state — a tall image, a landscape image, a missing image, etc.",
          "For components with multiple image props (e.g. a user card with `avatarSrc` and `coverSrc`), provide defaults for all of them. A partially-rendered component is harder to review than a fully-rendered one.",
        ],
        code: `// ProductCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';
import { ph } from '../../.storybook/placeholders';

const meta: Meta<typeof ProductCard> = {
  component: ProductCard,
  args: {
    imageSrc: ph.card,
    title: 'Running Shoes',
    price: '$89.00',
  },
};
export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {};

export const LargeImage: Story = {
  args: { imageSrc: ph.cardLarge },
};

export const BrokenImage: Story = {
  args: { imageSrc: 'https://example.com/does-not-exist.jpg' },
};`,
      },
      {
        eyebrow: "Chromatic",
        title: "Deterministic placeholders prevent false Chromatic diffs",
        body: [
          "Chromatic takes a screenshot of each story and compares it to the previous baseline. If the image src is a random URL or a live URL that changes, the screenshot changes every run even if the component code did not change. Chromatic flags this as a diff and requires a manual review decision.",
          "A deterministic placeholder URL returns the exact same SVG pixel-for-pixel on every request. Chromatic's baseline stays clean. Diffs only appear when the component itself changes — which is the correct behavior.",
          "Set `disableSnapshot: false` explicitly on your image-testing stories and `disableSnapshot: true` on stories that are known to have dynamic content (timestamps, random data) to prevent noise from leaking into baseline reviews.",
        ],
      },
      {
        eyebrow: "CSF3 pattern",
        title: "Using the play function to test image error states",
        body: [
          "CSF3's `play` function lets you write interaction tests inside a story. Test the fallback behavior by starting with a broken src and asserting that the component swaps in the placeholder after the error event fires.",
        ],
        code: `export const FallbackOnError: Story = {
  args: { imageSrc: 'https://example.com/broken.jpg' },
  play: async ({ canvasElement }) => {
    const { within, waitFor } = await import('@storybook/testing-library');
    const canvas = within(canvasElement);
    const img = canvas.getByRole('img');

    // simulate load error
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(img.getAttribute('src')).toContain('fallback.pics');
    });
  },
};`,
      },
      {
        eyebrow: "Related resources",
        title: "Placeholder infrastructure for testing environments",
        body: [
          "Placeholder URLs work the same way in Playwright visual regression tests and Cypress end-to-end tests. If your CI environment blocks outbound traffic, the self-hosted Docker container provides the same URL shape locally.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/figma-handoff-placeholder-urls/
https://fallback.pics/blog/playwright-deterministic-placeholders/`,
      },
    ],
    takeaways: [
      "Set placeholder URLs as component-level default args so every story renders a complete, visually correct component without requiring real assets.",
      "Keep all placeholder constants in one file so dimension changes propagate to all stories at once.",
      "Deterministic placeholder URLs prevent false Chromatic diffs because the same URL always returns the same SVG.",
      "Add a `BrokenImage` story that tests the onerror fallback behavior explicitly alongside the happy-path story.",
      "Use the CSF3 `play` function to test that image error events trigger the correct fallback swap in interaction tests.",
    ],
    related: [
      "figma-handoff-placeholder-urls",
      "playwright-deterministic-placeholders",
      "percy-chromatic-placeholder-images",
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────────
  {
    title: "Tailwind CSS Background Image Fallback Utilities",
    description:
      "Use tailwind background image placeholder utilities and inline CSS variables to handle missing background-image URLs without layout collapse or blank cards.",
    slug: "tailwind-background-image-fallbacks",
    readTime: "9 min read",
    category: "Implementation Guides",
    tags: [
      "Tailwind background image placeholder",
      "Tailwind CSS",
      "CSS custom properties",
      "Background fallback",
      "Image loading",
    ],
    summary: [
      "Tailwind's `bg-[url(...)]` arbitrary-value utility makes it easy to set background images inline, but there is no native fallback mechanism — when the URL returns a 404 or takes too long, the element renders blank. The tailwind background image placeholder pattern uses CSS custom properties and a layered `background-image` declaration to show a deterministic SVG while the real image loads.",
      "This guide covers four techniques: CSS property layering, JavaScript-assisted class swapping, data-attribute-driven fallbacks, and Tailwind plugin extensions that generate fallback utilities from your design tokens.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why Tailwind's bg-[url()] has no built-in fallback",
        body: [
          "CSS `background-image` does not fire a JavaScript error event the way `<img>` does. You cannot attach an `onerror` handler to a div. When the URL in `bg-[url(...)]` returns a 404, the browser silently renders nothing — no broken icon, no error in the console, just a blank region.",
          "For a card with `bg-[url(https://example.com/product.jpg)] bg-cover`, a missing product image means the entire card background collapses to whatever `background-color` is set. If that color is white on a white page, the card appears empty.",
          "The fix requires either a CSS fallback layer or JavaScript that detects the missing image and swaps a class. Neither approach is built into Tailwind, but both are straightforward to implement.",
        ],
      },
      {
        eyebrow: "CSS layering",
        title: "Multiple background layers as a CSS fallback mechanism",
        body: [
          "CSS `background-image` accepts a comma-separated list of layers. The browser renders the first layer that loads successfully. Set the placeholder URL as the second layer — it will show immediately and be replaced visually once the first (real) layer loads.",
          "This technique requires no JavaScript. It works in all modern browsers and does not interfere with Tailwind's JIT output.",
        ],
        code: `<!-- Two-layer background: real image first, placeholder second -->
<div
  class="bg-cover bg-center rounded-lg h-48 w-full"
  style="background-image:
    url('https://example.com/product.jpg'),
    url('https://fallback.pics/api/v1/320x180/E2E8F0/94A3B8?text=Product');"
>
</div>

<!-- With Tailwind arbitrary property (requires square-bracket syntax) -->
<div
  class="[background-image:url('https://example.com/product.jpg'),url('https://fallback.pics/api/v1/320x180/E2E8F0/94A3B8')]
         bg-cover bg-center h-48 w-full rounded-lg"
>
</div>`,
      },
      {
        eyebrow: "CSS custom properties",
        title: "Using CSS variables for swappable background sources",
        body: [
          "Define a CSS variable for the image URL and reference it in a Tailwind arbitrary-property class. JavaScript can then update the variable when the image loads or fails, without re-rendering the component.",
          "This pattern is useful in React or Vue components where you want to keep the class list static but swap the underlying value reactively.",
        ],
        code: `/* globals.css */
.bg-dynamic {
  background-image: var(--bg-src, url('https://fallback.pics/api/v1/320x180/E2E8F0/94A3B8'));
  background-size: cover;
  background-position: center;
}

// ProductCard.tsx
function ProductCard({ imageUrl }: { imageUrl: string }) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      divRef.current?.style.setProperty('--bg-src', \`url('\${imageUrl}')\`);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return <div ref={divRef} className="bg-dynamic h-48 w-full rounded-lg" />;
}`,
      },
      {
        eyebrow: "Data attribute",
        title: "Data-attribute-driven fallback with a small utility script",
        body: [
          "Add a `data-bg-src` attribute for the desired image URL and let a one-time script set `background-image` after probing the URL. This keeps the HTML clean — no inline styles — and works in server-rendered HTML without hydration.",
          "Run the script once at `DOMContentLoaded`. It reads all `[data-bg-src]` elements, probes each URL with an `Image` object, and either sets the real image or leaves the Tailwind background-color class visible as the fallback.",
        ],
        code: `// bg-fallback.ts  (run once on page load)
document.querySelectorAll<HTMLElement>('[data-bg-src]').forEach((el) => {
  const src = el.dataset.bgSrc!;
  const fallback = el.dataset.bgFallback
    ?? 'https://fallback.pics/api/v1/320x180/E2E8F0/94A3B8';

  const probe = new Image();
  probe.onload  = () => { el.style.backgroundImage = \`url('\${src}')\`; };
  probe.onerror = () => { el.style.backgroundImage = \`url('\${fallback}')\`; };
  probe.src = src;
});

<!-- HTML usage -->
<div
  class="bg-cover bg-center bg-slate-100 h-48 w-full rounded-lg"
  data-bg-src="https://example.com/product.jpg"
  data-bg-fallback="https://fallback.pics/api/v1/320x180/E2E8F0/94A3B8?text=Product"
>
</div>`,
      },
      {
        eyebrow: "Tailwind plugin",
        title: "Generating fallback utilities with a Tailwind plugin",
        body: [
          "A Tailwind plugin can generate a set of `.bg-placeholder-{name}` utilities from your design tokens. This keeps placeholder definitions in `tailwind.config.js` alongside your other design tokens and makes them available as first-class Tailwind classes.",
        ],
        code: `// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const placeholders = theme('placeholderImages', {});
      const utilities = Object.entries(placeholders).reduce((acc, [key, url]) => {
        acc[\`.bg-placeholder-\${key}\`] = {
          'background-image': \`url('\${url}')\`,
          'background-size': 'cover',
          'background-position': 'center',
        };
        return acc;
      }, {});
      addUtilities(utilities);
    }),
  ],
  theme: {
    placeholderImages: {
      card:    'https://fallback.pics/api/v1/320x180/E2E8F0/94A3B8',
      hero:    'https://fallback.pics/api/v1/1200x400/7C3AED/FFFFFF',
      avatar:  'https://fallback.pics/api/v1/avatar/64?text=AB',
      product: 'https://fallback.pics/api/v1/square/400?text=Product',
    },
  },
};`,
      },
      {
        eyebrow: "Further reading",
        title: "Resources for background image fallback patterns",
        body: [
          "The CSS layering approach works without JavaScript and is the fastest to implement. Use the JavaScript probe pattern when you need precise error handling or analytics on image failures.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/css-background-image-fallbacks/
https://fallback.pics/blog/prevent-layout-shift-missing-images/`,
      },
    ],
    takeaways: [
      "CSS `background-image` has no `onerror` event — use CSS layer stacking or JavaScript probing to detect and handle missing background URLs.",
      "The two-layer CSS technique (real URL first, placeholder second) requires no JavaScript and works in all modern browsers.",
      "CSS custom properties let you swap background sources reactively without touching the class list.",
      "A small `DOMContentLoaded` script with `data-bg-src` attributes keeps HTML clean and works in server-rendered pages.",
      "A Tailwind plugin can generate first-class placeholder utilities from your design tokens so teams use consistent dimensions everywhere.",
    ],
    related: [
      "css-background-image-fallbacks",
      "prevent-layout-shift-missing-images",
      "blur-placeholder-loading-states",
    ],
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────────
  {
    title: "MUI and Chakra UI Avatar Fallback Image URLs",
    description:
      "Configure mui avatar fallback URLs and Chakra UI Avatar fallbackSrc props to show branded placeholders when user profile images fail or are missing.",
    slug: "mui-chakra-avatar-fallback-urls",
    readTime: "8 min read",
    category: "Implementation Guides",
    tags: [
      "MUI avatar fallback",
      "Chakra UI avatar",
      "Avatar placeholder",
      "Component library",
      "User profile images",
    ],
    summary: [
      "MUI's `Avatar` and Chakra UI's `Avatar` both have built-in fallback mechanisms, but by default they render a generic person icon or initials — not a branded, color-coded placeholder that matches your application's visual design. Setting a deterministic mui avatar fallback URL means users see a consistent, intentional image state rather than a grey silhouette.",
      "This guide covers the correct props for each library, how to build a fallback URL from user initials and a deterministic color, how to handle the SRC error cycle safely, and how to apply the same pattern to avatars in tables, sidebars, and notification lists.",
    ],
    sections: [
      {
        eyebrow: "MUI setup",
        title: "MUI Avatar fallback URL with the src and alt props",
        body: [
          "MUI's `Avatar` component renders the `src` image if it loads. If the image fails, it falls back to the `children` prop (usually initials), and then to a generic icon if children is empty. There is no direct `fallbackSrc` prop, but you can intercept the `onError` event on the underlying `img` element.",
          "The cleanest approach is to provide a `src` that resolves to a placeholder when the real image fails. Use an `onError` handler that swaps the src to a fallback.pics avatar URL generated from the user's initials.",
        ],
        code: `// MuiUserAvatar.tsx
import Avatar from '@mui/material/Avatar';
import { useRef } from 'react';

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function avatarFallback(name: string, size = 40) {
  const text = initials(name);
  return \`https://fallback.pics/api/v1/avatar/\${size}?text=\${text}\`;
}

export function UserAvatar({ src, name, size = 40 }: {
  src?: string;
  name: string;
  size?: number;
}) {
  const errored = useRef(false);

  return (
    <Avatar
      src={src}
      alt={name}
      sx={{ width: size, height: size }}
      imgProps={{
        onError: (e) => {
          if (!errored.current) {
            errored.current = true;
            (e.target as HTMLImageElement).src = avatarFallback(name, size);
          }
        },
      }}
    >
      {/* Shown if src is undefined; hidden once src loads */}
      {initials(name)}
    </Avatar>
  );
}`,
      },
      {
        eyebrow: "Chakra UI setup",
        title: "Chakra Avatar fallbackSrc and getInitials props",
        body: [
          "Chakra UI's `Avatar` has a first-class `fallbackSrc` prop that accepts a URL string. When the `src` image fails, Chakra renders the `fallbackSrc` URL in an `<img>` tag automatically. No `onError` handler needed.",
          "You can also pass `getInitials` to customize how Chakra extracts initials from the `name` prop, which controls the built-in initial-based fallback. Use `fallbackSrc` for a branded image fallback and let `getInitials` serve as a secondary text fallback if the image URL itself fails.",
        ],
        code: `// ChakraUserAvatar.tsx
import { Avatar } from '@chakra-ui/react';

function avatarFallback(name: string, size = 40) {
  const text = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return \`https://fallback.pics/api/v1/avatar/\${size}?text=\${text}\`;
}

export function UserAvatar({ src, name, size = 40 }: {
  src?: string;
  name: string;
  size?: number;
}) {
  return (
    <Avatar
      src={src}
      name={name}
      size="md"
      fallbackSrc={avatarFallback(name, size)}
    />
  );
}`,
      },
      {
        eyebrow: "Deterministic colors",
        title: "Generating consistent avatar colors from user IDs",
        body: [
          "A deterministic color per user makes avatars instantly recognizable in lists and tables. Derive a hex color from a hash of the user's ID — not their name, which can change. Encode the color into the placeholder URL so the fallback matches the color the user would see in the initials fallback.",
          "Use a small palette of accessible background/foreground pairs rather than arbitrary hash output. Map the hash modulo to an index in the palette array.",
        ],
        code: `const PALETTE = [
  { bg: '7C3AED', fg: 'FFFFFF' }, // purple
  { bg: '0369A1', fg: 'FFFFFF' }, // blue
  { bg: '047857', fg: 'FFFFFF' }, // green
  { bg: 'B45309', fg: 'FFFFFF' }, // amber
  { bg: 'BE123C', fg: 'FFFFFF' }, // rose
];

function colorForId(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function avatarUrl(userId: string, name: string, size = 40) {
  const { bg, fg } = colorForId(userId);
  const text = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return \`https://fallback.pics/api/v1/avatar/\${size}/\${bg}/\${fg}?text=\${text}\`;
}`,
      },
      {
        eyebrow: "List and table avatars",
        title: "Applying avatar fallbacks in data tables and sidebars",
        body: [
          "Data tables that render hundreds of user rows can be slow if each avatar makes a separate fetch to probe its URL. Render the `src` directly and let the browser's native `onerror` fire for any that fail. The fallback URL is computed client-side from the user's data — no extra network requests.",
          "In sidebars or navigation components where the logged-in user's avatar appears, use the same `avatarUrl` function with the session user's ID. This ensures the nav avatar and the table avatar for the same user always look identical.",
        ],
      },
      {
        eyebrow: "Accessibility",
        title: "Alt text and ARIA for avatar fallback images",
        body: [
          "Always set `alt` to the user's full name on avatar images. A blank `alt` makes screen readers skip the image entirely, which is appropriate for purely decorative images but not for user avatars in a team directory or comment thread.",
          "If the avatar is inside a button or link, the accessible name should come from the button label, not the image alt. Set `alt=\"\"` on the image in that context and ensure the button has an `aria-label`.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "More on avatar and profile image patterns",
        body: [
          "The avatar route at fallback.pics renders a circular-cropped SVG by default, matching the typical rounded avatar shape used in most component libraries.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/avatar-placeholder-generator-initials-colors-accessibility/
https://fallback.pics/blog/shadcn-avatar-fallback-src/`,
      },
    ],
    takeaways: [
      "MUI Avatar requires an `onError` handler on `imgProps` to swap in a fallback URL; add an `errored` ref guard to prevent infinite loops.",
      "Chakra UI Avatar has a first-class `fallbackSrc` prop — pass the placeholder URL directly and Chakra handles the swap automatically.",
      "Derive avatar colors from the user's ID (not their name) so colors stay consistent even when display names change.",
      "Use a fixed palette of accessible background/foreground pairs rather than raw hash output to ensure readable fallback initials.",
      "Set `alt` to the user's full name on standalone avatar images; use `alt=\"\"` when the image is inside a labeled button or link.",
    ],
    related: [
      "shadcn-avatar-fallback-src",
      "avatar-placeholder-generator-initials-colors-accessibility",
      "react-image-fallback-patterns",
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────────
  {
    title: "shadcn/ui Card Media Placeholders for Dashboards",
    description:
      "Add shadcn card image placeholders to dashboard cards and data grids using deterministic URLs that match your shadcn design tokens and prevent blank media regions.",
    slug: "shadcn-card-media-placeholders",
    readTime: "8 min read",
    category: "Implementation Guides",
    tags: [
      "shadcn card image",
      "shadcn/ui",
      "Dashboard placeholders",
      "Card components",
      "React image fallback",
    ],
    summary: [
      "shadcn/ui's Card component uses a slot-based composition pattern — there is no built-in `image` prop. Adding a media region means placing an `<img>` or a background-image div inside `CardHeader` or above the card body. Without an explicit fallback, missing images show broken icons or collapsed regions that break the card grid layout.",
      "This guide covers the correct slot placement for card media, how to pair it with fallback.pics URLs that match shadcn's design token colors, and how to handle loading states and aspect-ratio constraints without causing CLS.",
    ],
    sections: [
      {
        eyebrow: "Card anatomy",
        title: "Where to place media in a shadcn Card without breaking layout",
        body: [
          "shadcn's `Card` exports `CardHeader`, `CardContent`, `CardFooter`, and `CardTitle`. None of them are specifically designed for images. The typical approach is to place an `<img>` above `CardHeader` inside the `Card` wrapper, wrapped in a div that enforces the aspect ratio.",
          "Set `aspect-ratio: 16/9` (or `3/2`, `1/1` for square product tiles) on the wrapping div, not on the `<img>` itself. The div constrains the space whether the image loads or not, preventing CLS when the image is replaced by the fallback.",
        ],
        code: `// ProductCard.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const FALLBACK = 'https://fallback.pics/api/v1/320x180/F1F5F9/94A3B8?text=Product';

export function ProductCard({ image, title, price }: {
  image?: string;
  title: string;
  price: string;
}) {
  return (
    <Card className="overflow-hidden">
      {/* Media slot — aspect ratio enforced here, not on <img> */}
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={image ?? FALLBACK}
          alt={title}
          width={320}
          height={180}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== FALLBACK) target.src = FALLBACK;
          }}
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{price}</p>
      </CardContent>
    </Card>
  );
}`,
      },
      {
        eyebrow: "Token alignment",
        title: "Matching placeholder colors to shadcn's CSS variables",
        body: [
          "shadcn uses CSS custom properties like `--muted`, `--muted-foreground`, and `--border` for its default color scale. The default light theme maps these to specific gray shades. Pick fallback URL hex values that approximate the equivalent Tailwind gray — `#F1F5F9` for `--muted` (slate-100) and `#94A3B8` for `--muted-foreground` (slate-400).",
          "This makes the placeholder look like an intentional loading state rather than an error. Users perceive the card as still loading rather than broken, which is the correct mental model for a placeholder.",
        ],
        code: `// constants/placeholders.ts (shadcn theme-aligned)
export const SHADCN_PH = {
  // Light theme — matches slate-100 / slate-400
  cardLandscape:  'https://fallback.pics/api/v1/320x180/F1F5F9/94A3B8',
  cardSquare:     'https://fallback.pics/api/v1/square/320?text=Image',
  // Dark theme — matches zinc-800 / zinc-500
  cardLandscapeDark: 'https://fallback.pics/api/v1/320x180/27272A/71717A',
  cardSquareDark:    'https://fallback.pics/api/v1/square/320?text=Image',
  // Branded (uses shadcn primary purple)
  cardBranded:    'https://fallback.pics/api/v1/320x180/7C3AED/FFFFFF?text=Loading',
};`,
      },
      {
        eyebrow: "Dashboard grids",
        title: "Skeleton-style card placeholders for data-loading states",
        body: [
          "Dashboard cards often load asynchronously. During the fetch, render the card shell with a placeholder image so the grid layout is stable. Replace the placeholder src with the real image URL once the data resolves.",
          "Avoid conditional rendering (`{data ? <Card/> : <Skeleton/>}`) if possible. The layout shift from mounting and unmounting cards is worse than a stable card with a placeholder image. Keep the card mounted and update the `src` prop instead.",
        ],
        code: `// DashboardGrid.tsx
function MetricCard({ item }: { item?: DashboardItem }) {
  const ph = 'https://fallback.pics/api/v1/320x180/F1F5F9/94A3B8';

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={item?.imageUrl ?? ph}
          alt={item?.title ?? 'Loading'}
          width={320}
          height={180}
          className="h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: item ? 1 : 0.5 }}
          onError={(e) => {
            if (e.currentTarget.src !== ph) e.currentTarget.src = ph;
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className={item ? '' : 'animate-pulse bg-muted h-4 w-32 rounded'}>
          {item?.title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}`,
      },
      {
        eyebrow: "Dark mode",
        title: "Switching placeholder colors with Tailwind's dark variant",
        body: [
          "shadcn supports dark mode via a class on the `html` element. You cannot conditionally change a URL string with a CSS class alone, but you can use two `<img>` elements — one for light, one for dark — and toggle their visibility with `hidden dark:block`. This is the simplest approach without JavaScript.",
          "The JavaScript alternative is to read `document.documentElement.classList.contains('dark')` on mount and pick the appropriate placeholder URL. Add a `MutationObserver` on the `classList` if the theme can change at runtime.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Resources for shadcn image and card patterns",
        body: [
          "For avatar-specific fallbacks inside shadcn cards, see the dedicated avatar fallback guide. For background-image-based card covers, the Tailwind background fallback guide covers CSS layering and probe patterns.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/shadcn-avatar-fallback-src/
https://fallback.pics/blog/tailwind-background-image-fallbacks/`,
      },
    ],
    takeaways: [
      "Wrap card media in a fixed-aspect-ratio div (not on the `<img>`) so the layout is stable whether the image loads, fails, or shows the placeholder.",
      "Match placeholder hex values to shadcn's CSS custom property equivalents (slate-100/slate-400) so the fallback looks like an intentional loading state.",
      "Keep cards mounted during data loads and update the `src` prop rather than conditionally unmounting — this avoids a second layout shift.",
      "Provide both light and dark placeholder URLs and toggle them with Tailwind's `dark:` variant or a `MutationObserver` for runtime theme switches.",
      "Add an `onError` guard that checks `currentTarget.src !== fallback` before swapping to prevent infinite error loops.",
    ],
    related: [
      "shadcn-avatar-fallback-src",
      "tailwind-background-image-fallbacks",
      "skeleton-loaders-image-grids",
    ],
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────────
  {
    title: "shadcn Avatar Component with External Fallback Src",
    description:
      "Wire a shadcn avatar fallback src URL into the Avatar, AvatarImage, and AvatarFallback primitives to show branded placeholders when profile images fail or are absent.",
    slug: "shadcn-avatar-fallback-src",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "shadcn avatar fallback",
      "shadcn/ui",
      "Avatar component",
      "Radix UI",
      "Profile image fallback",
    ],
    summary: [
      "shadcn's Avatar is a thin wrapper around Radix UI's Avatar primitive. It renders `AvatarImage` when the src loads and falls back to `AvatarFallback` when it does not. By default `AvatarFallback` renders a text node — typically initials. Replacing that text node with a branded shadcn avatar fallback image URL gives you a more polished, on-brand fallback state without rebuilding the component.",
      "This guide covers the Radix Avatar API, how to add an `<img>` inside `AvatarFallback` pointing to a fallback.pics avatar URL, how to generate the URL from user data, and how to handle the transition delay that Radix applies before showing the fallback.",
    ],
    sections: [
      {
        eyebrow: "Radix API",
        title: "How Radix Avatar's three-state rendering model works",
        body: [
          "Radix's Avatar primitive has three states: `idle` (src not yet loaded), `loading`, and `error`. `AvatarImage` is only visible in the `loading` and `idle` states while the image loads. `AvatarFallback` becomes visible after a configurable `delayMs` — by default 600 ms — if the image has not loaded.",
          "The `delayMs` prevents a flash of the fallback content on fast connections. It also means that on slow connections, users see nothing for 600 ms before the fallback appears. Lowering `delayMs` to 0 trades the flicker prevention for faster fallback rendering — the right choice depends on your median connection speed.",
          "You cannot bypass the three-state model by setting `src` to an empty string. Radix treats an empty string as a valid (but immediately failing) src, which triggers the error state after the `delayMs`. Pass `undefined` explicitly when there is no src to skip the loading phase.",
        ],
      },
      {
        eyebrow: "Implementation",
        title: "Adding a fallback src image inside AvatarFallback",
        body: [
          "`AvatarFallback` accepts any React children. Replace the default initials text with an `<img>` tag pointing to the placeholder URL. The `<img>` inside `AvatarFallback` is a standard HTML element — it will load the placeholder URL normally and can itself have an `onError` handler as a last resort.",
          "Set `width` and `height` on the inner `<img>` to match the `Avatar` dimensions to prevent a layout shift inside the fallback state.",
        ],
        code: `// components/ui/user-avatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function buildFallbackUrl(name: string, size: number) {
  const text = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return \`https://fallback.pics/api/v1/avatar/\${size}?text=\${text}\`;
}

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

export function UserAvatar({ src, name, size = 40, className }: UserAvatarProps) {
  const fallbackUrl = buildFallbackUrl(name, size);

  return (
    <Avatar className={className} style={{ width: size, height: size }}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback delayMs={0}>
        <img
          src={fallbackUrl}
          alt={name}
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
      </AvatarFallback>
    </Avatar>
  );
}`,
      },
      {
        eyebrow: "Color coding",
        title: "Deterministic user colors from ID for branded avatar fallbacks",
        body: [
          "Use the same deterministic color approach as MUI avatars: hash the user ID, map to a palette index, and encode the hex pair into the URL. This ensures that the initials-based text fallback and the image fallback show the same color, creating a consistent visual identity per user across loading states.",
        ],
        code: `const AVATAR_PALETTE = [
  ['7C3AED', 'FFFFFF'],
  ['0369A1', 'FFFFFF'],
  ['047857', 'FFFFFF'],
  ['B45309', 'FFFFFF'],
  ['BE123C', 'FFFFFF'],
  ['0F172A', 'F8FAFC'],
];

function hashId(id: string): number {
  return id.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
}

export function avatarUrl(userId: string, name: string, size = 40) {
  const [bg, fg] = AVATAR_PALETTE[hashId(userId) % AVATAR_PALETTE.length];
  const text = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return \`https://fallback.pics/api/v1/avatar/\${size}/\${bg}/\${fg}?text=\${text}\`;
}`,
      },
      {
        eyebrow: "Loading delay",
        title: "Tuning delayMs to prevent fallback flash on fast connections",
        body: [
          "Set `delayMs={300}` as a middle ground: fast enough that users on slow connections see the fallback quickly, but short enough to suppress the flicker on most broadband connections. Avoid setting it higher than 1000 ms — at that point users notice the empty Avatar state and assume the page is broken.",
          "If you are rendering many avatars in a table or list, keep `delayMs` consistent. Inconsistent delays between avatar instances create a staggered reveal that looks like a bug rather than a design decision.",
        ],
      },
      {
        eyebrow: "Group avatars",
        title: "Applying fallback URLs in AvatarGroup stacks",
        body: [
          "AvatarGroup stacks multiple Avatars with overlapping rings. Use the same `UserAvatar` wrapper for each member. Fallbacks in a group are especially important because a missing avatar in the middle of a stack creates a gap that breaks the overlapping layout.",
          "Set explicit `width` and `height` on every avatar in the group. Without them, a fallback image with different intrinsic dimensions can expand or contract the group container on load.",
        ],
        code: `// Example: team member stack
function TeamAvatarGroup({ members }: { members: User[] }) {
  return (
    <div className="flex -space-x-2">
      {members.map((m) => (
        <UserAvatar
          key={m.id}
          src={m.avatarUrl}
          name={m.name}
          size={32}
          className="ring-2 ring-background"
        />
      ))}
    </div>
  );
}`,
      },
      {
        eyebrow: "Further reading",
        title: "Avatar and profile image fallback resources",
        body: [
          "For MUI and Chakra UI avatar fallback patterns with the same deterministic color approach, see the companion guide. The avatar route at fallback.pics accepts a size parameter and renders a circular SVG with the initials centered.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/mui-chakra-avatar-fallback-urls/
https://fallback.pics/blog/avatar-placeholder-generator-initials-colors-accessibility/`,
      },
    ],
    takeaways: [
      "Place an `<img>` inside `AvatarFallback` pointing to the placeholder URL rather than rebuilding the Avatar component to add a fallback src prop.",
      "Pass `undefined` (not an empty string) as `src` when there is no profile image — Radix skips the loading phase entirely for `undefined`.",
      "Set `delayMs={300}` to balance flicker prevention on fast connections with quick fallback display on slow ones.",
      "Use deterministic colors from the user's ID so initials-based and image-based fallbacks share the same color scheme.",
      "Match `width` and `height` on the inner fallback `<img>` to the Avatar container size to prevent layout shifts inside the fallback state.",
    ],
    related: [
      "mui-chakra-avatar-fallback-urls",
      "avatar-placeholder-generator-initials-colors-accessibility",
      "shadcn-card-media-placeholders",
    ],
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────────
  {
    title: "Internal Linking Strategy for Developer Docs and Blog Hubs",
    description:
      "Build an internal linking developer blog network that boosts topical authority, distributes page equity, and keeps readers moving through your documentation and content hub.",
    slug: "internal-linking-image-fallback-content-hub",
    readTime: "10 min read",
    category: "Web Development",
    tags: [
      "Internal linking developer blog",
      "Content hub",
      "SEO internal links",
      "Developer documentation",
      "Topical authority",
    ],
    summary: [
      "A developer blog with dozens of posts on image fallbacks, placeholder APIs, and CMS workflows is a topical authority asset — but only if search engines and readers can navigate between posts efficiently. An internal linking developer blog strategy connects posts by topic cluster, signals content depth to crawlers, and creates clear reading paths that turn one-page sessions into multi-page journeys.",
      "This guide covers how to build a three-tier hub-and-spoke model for developer content, which anchor text patterns work best for technical posts, how to surface related links programmatically from a blog data structure, and how to audit and improve an existing link graph without a full content rewrite.",
    ],
    sections: [
      {
        eyebrow: "Architecture",
        title: "Hub-and-spoke clusters for developer documentation sites",
        body: [
          "A hub-and-spoke model has one pillar page (the hub) that covers a broad topic comprehensively, and multiple supporting posts (spokes) that go deep on subtopics. The hub links to every spoke; every spoke links back to the hub and to 2-3 peer spokes.",
          "For a site like fallback.pics, the hub might be 'Complete Guide to Image Placeholders in Web Development'. The spokes are posts on specific frameworks (Vue, Next.js, Shopify), use cases (avatars, heroes, OG images), and infrastructure (CDN caching, Docker, Cloudflare Workers).",
          "Search engines use the link graph to understand content hierarchy. A spoke post about MUI avatar fallbacks that links back to the hub signals that the MUI post is part of the broader image placeholders topic — helping both pages rank for related queries.",
        ],
      },
      {
        eyebrow: "Anchor text",
        title: "Anchor text patterns that work for technical content",
        body: [
          "Technical anchor text should match the primary keyword of the target page where natural to do so, but should read like human prose, not keyword stuffing. 'See the MUI avatar fallback guide' is correct. 'Click here for more information' is wasted link equity.",
          "Vary anchor text for pages that receive many inbound internal links. If twenty posts link to the hub page, use slightly different phrases: 'complete image placeholder guide', 'placeholder image overview', 'our full walkthrough'. This avoids over-optimization signals while still communicating topical relevance.",
          "For documentation cross-links, prefer inline contextual links over footer 'related articles' lists. A link inside a relevant paragraph transfers more relevance signal than a link in a sidebar widget. Both help, but inline links have more weight.",
        ],
      },
      {
        eyebrow: "Data-driven links",
        title: "Surfacing related posts programmatically from blog data",
        body: [
          "Hardcoding internal links in every blog post body is unmaintainable at scale. Instead, define a `related` array in each post's data object and render a 'Related posts' section in the blog article layout. This makes internal links systematic and easy to audit.",
          "For deeper automation, compute related posts from shared tags and category membership at build time. Posts sharing two or more tags are strong candidates for cross-linking. A build script can generate a `related` array for any post that does not have one defined manually.",
        ],
        code: `// scripts/suggest-related.mjs
// Run at build time to suggest related posts for new content

import { blogPosts } from '../src/data/blogPosts.js';

function jaccard(a, b) {
  const setA = new Set(a);
  const intersection = b.filter(t => setA.has(t)).length;
  return intersection / (setA.size + b.length - intersection);
}

for (const post of blogPosts) {
  const candidates = blogPosts
    .filter(p => p.slug !== post.slug)
    .map(p => ({ slug: p.slug, score: jaccard(post.tags, p.tags) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(p => p.slug);

  if (post.related.length === 0) {
    console.log(\`\${post.slug}:\\n  suggested: \${candidates.join(', ')}\`);
  }
}`,
      },
      {
        eyebrow: "Link placement",
        title: "Where to place internal links in developer blog posts",
        body: [
          "Each post should have internal links in at least two places: inline within the first 300 words (establishes context early for crawlers) and in a dedicated 'Related' section at the end (serves readers who finished the post and want more). A third placement inside a code comment or example is natural for technical content.",
          "The final section of a post — often a 'Resources' or 'Further reading' section — is a good place to consolidate links to both the documentation and to 2-3 related posts. Use the full URL so readers can see the destination without hovering.",
        ],
        code: `# Final section template for developer blog posts

## Further reading

- [Complete Image Placeholder Guide](https://fallback.pics/blog/complete-guide-to-image-placeholders-in-web-development/) — the hub page for this topic cluster
- [Placeholder Image API Reference](https://fallback.pics/placeholder-image-api/) — URL syntax, parameters, and format options
- [React Image Fallback Patterns](https://fallback.pics/blog/react-image-fallback-patterns/) — onerror, custom hooks, and next/image
- [shadcn Avatar Fallback Src](https://fallback.pics/blog/shadcn-avatar-fallback-src/) — Radix Avatar with external fallback images`,
      },
      {
        eyebrow: "Audit",
        title: "Auditing your existing internal link graph",
        body: [
          "Run Screaming Frog or a site:// crawl to export internal links. Look for posts with zero inbound internal links — these are 'orphan pages' that receive no equity from the rest of the site. Add at least one inbound link to every orphan from a topically relevant post or from the hub.",
          "Look for pages with a high number of inbound links but very few outbound links to peer spokes. These are link equity sinks. Add 2-3 outbound links from the most-linked pages to distribute equity to spoke pages that are underperforming.",
          "Check anchor text diversity on the most-linked pages. If 80% of internal links use identical anchor text, vary the phrasing in newer posts. Crawlers accept some repetition but flag extremely uniform anchor text as a signal of unnatural optimization.",
        ],
      },
      {
        eyebrow: "Cluster map",
        title: "Building a visual topic cluster map for content planning",
        body: [
          "A simple spreadsheet with columns for slug, hub, cluster (e.g. 'CMS Workflows', 'Performance', 'Mobile UX'), and inbound/outbound link counts is enough to identify gaps. Post this in your team's wiki and update it when new posts go live.",
          "For the fallback.pics content hub, the current post set spans ten clusters. Each cluster should have at least one post that links back to the site's main documentation pages. If a cluster has five posts but none of them links to `/docs/` or `/placeholder-image-api/`, that cluster is not contributing to the product pages' authority.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/complete-guide-to-image-placeholders-in-web-development/
https://fallback.pics/blog/broken-images-seo-fallback-fix/`,
      },
    ],
    takeaways: [
      "Use a hub-and-spoke model: one pillar page links to all spokes, every spoke links back to the hub and to 2-3 peer spokes in the same cluster.",
      "Prefer inline contextual links over footer link lists — they transfer more relevance signal and serve readers who are actively reading, not scanning.",
      "Define a `related` array in each post's data object and render it systematically in the blog layout rather than hardcoding links in post bodies.",
      "Audit for orphan pages (zero inbound internal links) and link sinks (high inbound, low outbound) — both reduce the efficiency of your link graph.",
      "Every topic cluster should have at least one post linking to the product's main documentation pages to contribute authority to conversion pages.",
    ],
    related: [
      "complete-guide-to-image-placeholders-in-web-development",
      "broken-images-seo-fallback-fix",
      "google-images-seo-generated-placeholders",
    ],
  },
];
