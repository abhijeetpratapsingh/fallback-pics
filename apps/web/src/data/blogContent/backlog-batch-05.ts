import type { BlogPost } from '../blogPosts';

export const backlogBatch05: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────
  {
    title: "Blur Placeholder Routes for Soft Loading States",
    description:
      "Use fallback.pics blur placeholder URLs to create smooth soft-focus loading states that prevent layout shift and feel intentional, not broken.",
    slug: "blur-placeholder-loading-states",
    readTime: "7 min read",
    category: "UX Patterns",
    tags: [
      "blur placeholder image",
      "loading states",
      "UX patterns",
      "image fallback",
      "CLS prevention",
    ],
    summary: [
      "A solid gray box is technically a placeholder, but it reads as broken to users. Blur placeholders use a soft, out-of-focus aesthetic that communicates \"image coming\" rather than \"image missing,\" which reduces abandonment on image-heavy pages.",
      "The fallback.pics blur route generates deterministic blurred SVGs from a URL with no client-side CSS or JavaScript required. Drop the URL into an img src and the blur state renders immediately at any dimension.",
    ],
    sections: [
      {
        eyebrow: "Context",
        title: "Why blur placeholders outperform solid color fills",
        body: [
          "Solid color placeholders hold layout space, but they create a hard visual discontinuity when the real image loads. The eye registers the color change as a flash rather than a reveal. Blur placeholders have no sharp edge to pop because the real image and the placeholder share the same general tonal range.",
          "There is also a legibility benefit. A blurred shape signals an image is expected rather than absent, which matters for product grids, blog hero images, and media galleries where users scan before they wait.",
          "The tradeoff is file size. An SVG blur effect is heavier than a flat rect element. For grids with dozens of tiles, measure whether the extra bytes per placeholder affect your First Contentful Paint before committing.",
        ],
      },
      {
        eyebrow: "Basic URL",
        title: "Add a blur placeholder with one URL",
        body: [
          "The blur route accepts any width and height. The output is an SVG that uses feGaussianBlur with a base rectangle tinted to a neutral mid-gray. The blur radius scales with the smaller dimension so small thumbnails and large heroes both look appropriately soft.",
          "Use the URL directly in an img src or as a CSS background-image. No JavaScript, no build step, no base64 encoding required.",
        ],
        code: `<!-- Basic blur placeholder at 800x500 -->
<img
  src="https://fallback.pics/api/v1/blur/800x500"
  width="800"
  height="500"
  alt="Loading product photo"
/>

<!-- Smaller thumbnail in a grid -->
<img
  src="https://fallback.pics/api/v1/blur/400x400"
  width="400"
  height="400"
  alt="Loading product image"
/>`,
      },
      {
        eyebrow: "Tinted blur",
        title: "Match your brand with a tinted blur background",
        body: [
          "Pass a hex background color to shift the blur base from neutral gray to a brand-adjacent tone. Purple-tinted blur placeholders, for example, feel much more intentional on a purple-themed product page than generic gray.",
          "The foreground color parameter controls the shimmer highlight layered inside the blur. Keeping it close to the background color produces a subtle effect; a higher contrast value gives a more active animated appearance.",
        ],
        code: `<!-- Purple-tinted blur for a branded SaaS UI -->
https://fallback.pics/api/v1/blur/800x500/7C3AED/8B5CF6

<!-- Warm tint for a food or travel context -->
https://fallback.pics/api/v1/blur/800x500/F97316/FCD34D

<!-- Dark mode neutral blur -->
https://fallback.pics/api/v1/blur/800x500/27272A/3F3F46`,
      },
      {
        eyebrow: "React pattern",
        title: "Swap blur for real image on load",
        body: [
          "The classic pattern: render the blur placeholder as the initial src, then swap in the real image URL once the asset loads. The transition is smooth because the blur and the real image share the same spatial footprint.",
          "Use CSS opacity transition on the real image rather than instantly replacing the blur. A 200ms fade hides any resolution difference between the placeholder and the final asset.",
        ],
        code: `import { useState } from 'react';

const BLUR_URL = 'https://fallback.pics/api/v1/blur/800x500';

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', width: 800, height: 500 }}>
      <img
        src={BLUR_URL}
        width={800}
        height={500}
        alt=""
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
      />
      <img
        src={src}
        width={800}
        height={500}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.currentTarget.src = BLUR_URL; }}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
      />
    </div>
  );
}`,
      },
      {
        eyebrow: "CSS background",
        title: "Use blur URLs as CSS background-image",
        body: [
          "CSS background-image works well for decorative containers where you control the box size through layout rather than the img element. Set background-size to cover to let the blur fill the container edge to edge.",
          "This approach also works for inline styles in frameworks that accept style objects, and for server-rendered HTML where you want to avoid JavaScript altogether.",
        ],
        code: `/* In a stylesheet */
.product-card__media {
  background-image: url('https://fallback.pics/api/v1/blur/600x400');
  background-size: cover;
  aspect-ratio: 3 / 2;
}

/* Inline in a React component */
<div
  style={{
    backgroundImage: "url('https://fallback.pics/api/v1/blur/600x400')",
    backgroundSize: 'cover',
    aspectRatio: '3 / 2',
  }}
/>`,
      },
      {
        eyebrow: "Next.js",
        title: "Blur placeholders in Next.js Image",
        body: [
          "Next.js Image accepts blurDataURL as a base64 string, but external blur URLs work just as well with the standard img fallback pattern or a plain img element inside a Next.js page. For App Router with server components, fetch the blur URL string and pass it as the src before the real image resolves.",
          "If you use next/image and want the built-in blur effect, you can still use fallback.pics for error states: the onError handler fires when the primary src fails, letting you swap in the blur URL as a controlled broken-image fallback.",
        ],
        code: `// pages/ProductCard.tsx – error fallback with blur URL
'use client';
import Image from 'next/image';

const BLUR = 'https://fallback.pics/api/v1/blur/800x500';

export function ProductCard({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={500}
      onError={(e) => {
        e.currentTarget.src = BLUR;
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Performance note",
        title: "Cache and CDN behavior for blur SVGs",
        body: [
          "Blur SVGs are generated deterministically from the URL parameters. The same URL always returns the same bytes, so CDN caching is safe with a long max-age. Set Cache-Control: public, max-age=31536000, immutable for production workloads.",
          "For grids with many identical-dimension tiles, browsers will cache the first blur response and reuse it for all subsequent img tags pointing to the same URL. One network round-trip covers the entire grid.",
        ],
        code: `# Verify caching headers
curl -I "https://fallback.pics/api/v1/blur/400x400"

# Internal links for deeper reading
# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/skeleton-placeholder-images-vs-static-fallbacks/
# https://fallback.pics/blog/prevent-layout-shift-missing-images/`,
      },
    ],
    takeaways: [
      "Blur placeholders feel intentional; solid gray boxes feel broken.",
      "The /blur/ route generates deterministic SVGs from a URL with no client JavaScript.",
      "Tint the blur with hex color parameters to match your brand palette.",
      "Fade from blur to real image with a CSS opacity transition, not an instant swap.",
      "One blur URL is cached by the browser for all tiles sharing that dimension.",
    ],
    related: [
      "skeleton-placeholder-images-vs-static-fallbacks",
      "prevent-layout-shift-missing-images",
      "animated-skeleton-placeholder-url",
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────
  {
    title: "Animated Skeleton Placeholders via URL (No CSS Required)",
    description:
      "Generate animated skeleton loading placeholders from a URL alone. No CSS keyframes, no JS shimmer libraries — just an img src pointing to fallback.pics.",
    slug: "animated-skeleton-placeholder-url",
    readTime: "8 min read",
    category: "UX Patterns",
    tags: [
      "animated skeleton placeholder",
      "skeleton loader",
      "loading states",
      "placeholder image API",
      "image fallback",
    ],
    summary: [
      "Skeleton loaders reduce perceived wait time by giving users an immediate structural preview of the content layout. Building them with CSS keyframes and component wrappers is fine for design systems, but for simpler cases a URL-generated animated SVG lets you drop a skeleton into any img tag with zero extra code.",
      "The fallback.pics animated skeleton route embeds a CSS animation inside an SVG, producing a shimmer effect that works in every browser without JavaScript or stylesheet dependencies. The output is deterministic and CDN-cacheable like every other fallback.pics URL.",
    ],
    sections: [
      {
        eyebrow: "How it works",
        title: "Animated SVG without external CSS",
        body: [
          "SVG supports inline style and CSS animation natively. A skeleton SVG can contain a linearGradient that shifts position using a CSS keyframe declared inside a style element within the SVG document. When the browser renders the SVG as an img src, the animation runs independently of the page stylesheet.",
          "The important constraint is that SVGs loaded via img src are sandboxed from the page. They cannot read external stylesheets or run JavaScript. All animation logic must live inside the SVG itself. fallback.pics handles that packaging — you get a self-contained animated SVG from a plain URL.",
        ],
      },
      {
        eyebrow: "Basic URL",
        title: "Drop a skeleton placeholder into any img tag",
        body: [
          "Use the /animated/skeleton/ prefix followed by dimensions. The default output is a light-gray skeleton with a left-to-right shimmer in the style of a card loading state.",
          "Specify width and height attributes on the img element to match the final content dimensions. That prevents layout shift when the real image loads.",
        ],
        code: `<!-- Standard card skeleton -->
<img
  src="https://fallback.pics/api/v1/animated/skeleton/600x400"
  width="600"
  height="400"
  alt="Loading image"
/>

<!-- Square avatar skeleton -->
<img
  src="https://fallback.pics/api/v1/animated/skeleton/80x80"
  width="80"
  height="80"
  alt="Loading avatar"
/>

<!-- Hero banner skeleton -->
<img
  src="https://fallback.pics/api/v1/animated/skeleton/1200x400"
  width="1200"
  height="400"
  alt="Loading header image"
/>`,
      },
      {
        eyebrow: "Dark mode",
        title: "Match skeleton colors to your theme",
        body: [
          "Pass hex colors to control the skeleton base and shimmer highlight. For dark-mode UIs, a dark base with a slightly lighter shimmer looks correct. For light UIs, the default light gray is usually fine.",
          "You can use CSS custom properties in a data-theme attribute or media query to swap which URL is used. The URL is just a string — swap it programmatically when the theme changes.",
        ],
        code: `<!-- Light mode skeleton -->
https://fallback.pics/api/v1/animated/skeleton/600x400/E4E4E7/F4F4F5

<!-- Dark mode skeleton -->
https://fallback.pics/api/v1/animated/skeleton/600x400/27272A/3F3F46

<!-- React with theme-aware URL -->
const skeletonUrl = isDark
  ? 'https://fallback.pics/api/v1/animated/skeleton/600x400/27272A/3F3F46'
  : 'https://fallback.pics/api/v1/animated/skeleton/600x400/E4E4E7/F4F4F5';`,
      },
      {
        eyebrow: "React pattern",
        title: "Skeleton while image loads, then fade in",
        body: [
          "The simplest skeleton pattern: set the src to the skeleton URL initially, then update it to the real image once it resolves. Because img src is a string, you can update it without unmounting the element. The browser replaces the SVG with the real image in one repaint.",
          "Wrap this in a custom hook to keep components clean. The hook returns the active src and a handler to set the loaded state.",
        ],
        code: `import { useState } from 'react';

function useImageWithSkeleton(realSrc: string, w: number, h: number) {
  const skeleton = \`https://fallback.pics/api/v1/animated/skeleton/\${w}x\${h}\`;
  const [src, setSrc] = useState(skeleton);
  const [loaded, setLoaded] = useState(false);

  const preload = () => {
    const img = new Image();
    img.onload = () => { setSrc(realSrc); setLoaded(true); };
    img.onerror = () => setSrc(\`https://fallback.pics/api/v1/\${w}x\${h}\`);
    img.src = realSrc;
  };

  return { src, loaded, preload };
}

function LazyCard({ realSrc, alt }: { realSrc: string; alt: string }) {
  const { src, preload } = useImageWithSkeleton(realSrc, 600, 400);
  return (
    <img
      src={src}
      width={600}
      height={400}
      alt={alt}
      onLoad={preload}
    />
  );
}`,
      },
      {
        eyebrow: "Ecommerce grid",
        title: "Keep product grids stable while images load",
        body: [
          "Product grids often render before images are fetched. With no placeholder, grid cells collapse to zero height, then jump open — a CLS event that Google measures in Core Web Vitals. Animated skeletons at the final image dimensions prevent that jump entirely.",
          "For a grid of 24 product cards all using the same 300x300 skeleton URL, the browser caches the first response and serves the rest from memory. The animation is embedded in the SVG so it runs in each img independently.",
        ],
        code: `{products.map((product) => (
  <article key={product.id} class="product-card">
    <img
      src={
        product.imageUrl
          ?? 'https://fallback.pics/api/v1/animated/skeleton/300x300'
      }
      width={300}
      height={300}
      alt={product.name}
      onError={(e) => {
        e.currentTarget.src =
          'https://fallback.pics/api/v1/animated/skeleton/300x300';
      }}
      loading="lazy"
    />
    <h3>{product.name}</h3>
  </article>
))}`,
      },
      {
        eyebrow: "Accessibility",
        title: "Screen readers and animated content",
        body: [
          "An img element with a loading state skeleton should carry an alt attribute that describes what is loading, not the skeleton itself. Use \"Loading product image\" or a short contextual label rather than an empty alt, which can confuse assistive technology when the image later resolves to meaningful content.",
          "If your users have the prefers-reduced-motion media query set, consider switching from the animated skeleton to the static blur placeholder for those sessions. The URL swap can happen in a small JavaScript snippet that checks window.matchMedia.",
        ],
        code: `const prefersReduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const placeholderUrl = prefersReduced
  ? 'https://fallback.pics/api/v1/blur/600x400'
  : 'https://fallback.pics/api/v1/animated/skeleton/600x400';`,
      },
      {
        eyebrow: "Further reading",
        title: "When to use skeletons vs other placeholder types",
        body: [
          "Animated skeletons work best for temporary loading states where real content is definitely coming. For permanent fallbacks — broken CDN assets, missing catalog images — a static colored placeholder or branded fallback is a better choice because it does not imply loading that will never complete.",
          "The comparison between skeleton loaders and static fallbacks comes down to the same question as loading vs error states. Use the right tool for each failure mode.",
        ],
        code: `# Related reading
# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/skeleton-placeholder-images-vs-static-fallbacks/
# https://fallback.pics/blog/blur-placeholder-loading-states/`,
      },
    ],
    takeaways: [
      "Animated skeleton URLs are self-contained SVGs — no external CSS or JS needed.",
      "Pass hex color pairs to match your light or dark UI theme.",
      "Set explicit width and height on img elements to prevent CLS.",
      "Switch to static blur placeholders for users who prefer reduced motion.",
      "Use skeletons for loading states, static fallbacks for permanent error states.",
    ],
    related: [
      "skeleton-placeholder-images-vs-static-fallbacks",
      "blur-placeholder-loading-states",
      "prevent-layout-shift-missing-images",
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────
  {
    title: "Pattern and AI-Style Background Placeholders from URLs",
    description:
      "Generate pattern backgrounds and AI-gradient-style placeholder images from a single URL. No design assets needed — just a fallback.pics pattern URL.",
    slug: "pattern-background-placeholders-url",
    readTime: "7 min read",
    category: "API Guides",
    tags: [
      "ai pattern placeholder",
      "pattern background image",
      "placeholder image API",
      "gradient placeholder",
      "design system",
    ],
    summary: [
      "Plain colored rectangles are the most common placeholder, but they look generic in UI demos, design reviews, and onboarding flows where visual quality matters. Pattern and gradient placeholders look intentional at a glance without requiring a design team to produce actual assets.",
      "The fallback.pics pattern and thumbnail routes support multiple background styles — dots, lines, rings, soft gradients — that approximate the aesthetic of AI-generated imagery. Combined with a hex color pair, you can produce on-brand backgrounds from a URL with no uploads.",
    ],
    sections: [
      {
        eyebrow: "Use cases",
        title: "When a pattern placeholder does more work than a solid fill",
        body: [
          "Demos and live preview environments benefit from placeholder images that look like real content at a glance. A grid of patterned placeholders communicates \"this is a media grid\" more clearly than a row of identical gray tiles.",
          "Onboarding screenshots, documentation illustrations, and UI mockups in Storybook stories all benefit from the same logic. When the placeholder is visually distinct — a noise texture, a geometric ring pattern, a soft gradient — readers understand they are looking at a representative layout rather than a broken state.",
          "The honest tradeoff: pattern placeholders are heavier than solid fills. An SVG with geometric elements is a few kilobytes versus a near-zero solid rect. For permanent fallbacks in production, a simpler colored placeholder is usually the right call. For demo and documentation contexts, a pattern is worth the weight.",
        ],
      },
      {
        eyebrow: "Thumbnail styles",
        title: "Use the thumbnail route to pick a background pattern",
        body: [
          "The thumbnail route supports a style parameter that controls the background decoration pattern. The options are soft (gentle gradient fog), rings (concentric circles), lines (parallel diagonal strokes), and pattern (a geometric tile repeat).",
          "Combine style with theme for color and label for a text pill. The output is a 1200x630 image by default, but you can set any dimensions.",
        ],
        code: `<!-- Soft gradient style, purple theme -->
https://fallback.pics/api/v1/thumbnail/800x500?style=soft&theme=purple&text=Product+Preview

<!-- Rings style, blue theme -->
https://fallback.pics/api/v1/thumbnail/800x500?style=rings&theme=blue&text=Dashboard+Screenshot

<!-- Lines style, dark theme -->
https://fallback.pics/api/v1/thumbnail/800x500?style=lines&theme=dark&text=Report+Preview

<!-- Pattern tile, green theme, category label -->
https://fallback.pics/api/v1/thumbnail/800x500?style=pattern&theme=green&label=SaaS&text=Feature+Overview`,
      },
      {
        eyebrow: "Direct color control",
        title: "Build custom gradient backgrounds with hex pairs",
        body: [
          "The base image route accepts a bg color and text color. For patterns that look like AI-style imagery, use adjacent purple-to-blue values for the background and a near-white for the foreground.",
          "The URL-encoded text becomes a label centred in the image. Omit the text parameter to get a pure color swatch.",
        ],
        code: `<!-- Purple-blue gradient feel (two-tone hex pair) -->
https://fallback.pics/api/v1/800x500/7C3AED/FFFFFF?text=Project+Banner

<!-- Warm orange-amber palette -->
https://fallback.pics/api/v1/800x500/EA580C/FEF9C3?text=Campaign+Preview

<!-- Muted dark-green UI palette -->
https://fallback.pics/api/v1/800x500/064E3B/ECFDF5?text=Analytics+Card`,
      },
      {
        eyebrow: "Storybook",
        title: "Use pattern URLs as default args in component stories",
        body: [
          "Storybook stories that show image-carrying components need a stable src for visual regression snapshots. Hard-coding a real image URL creates a snapshot dependency on an external asset. A fallback.pics pattern URL is deterministic, so the snapshot never changes unless you change the URL.",
          "Set the pattern URL as the default arg value and the story stays consistent across CI runs.",
        ],
        code: `// card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  args: {
    imageUrl:
      'https://fallback.pics/api/v1/thumbnail/800x420?style=soft&theme=purple&text=Story+Preview',
    title: 'Default card title',
  },
};

export default meta;
export const Default: StoryObj<typeof Card> = {};`,
      },
      {
        eyebrow: "Square patterns",
        title: "Pattern placeholders for profile and product tiles",
        body: [
          "Square containers need a square URL. The /square/ route accepts a single size and applies the same styling options. Use it for profile photos, product thumbnails, brand logos, and any other 1:1 aspect ratio container.",
          "Combine with the text parameter to include initials, a category label, or a product code.",
        ],
        code: `<!-- Square pattern tile, 300px -->
https://fallback.pics/api/v1/square/300?text=AB&theme=purple

<!-- Square for a product category badge -->
https://fallback.pics/api/v1/square/200?text=NEW&theme=green

<!-- Avatar-style with initials -->
https://fallback.pics/api/v1/avatar/80?text=JD`,
      },
      {
        eyebrow: "Further reading",
        title: "Pattern URLs in design handoff and documentation",
        body: [
          "Design handoff tools like Figma often show placeholder images in their live preview mode. A stable fallback.pics pattern URL can be embedded in Figma's prototype or dev-mode layer spec so engineers see a realistic image stand-in before production assets are attached.",
          "For documentation sites, pattern thumbnails replace the manual effort of producing featured images for every page. The thumbnail route's label and title parameters cover most documentation use cases.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/generate-blog-thumbnails-from-text/
# https://fallback.pics/blog/chart-dashboard-thumbnail-placeholders/`,
      },
    ],
    takeaways: [
      "Pattern and gradient placeholders communicate intent better than solid color fills in demos and docs.",
      "Use the thumbnail style parameter to pick from soft, rings, lines, or pattern backgrounds.",
      "Hex color pairs in the base route give you direct control over palette.",
      "Square and avatar routes handle 1:1 containers without URL math.",
      "Deterministic URLs make pattern placeholders safe for Storybook and Playwright snapshots.",
    ],
    related: [
      "generate-blog-thumbnails-from-text",
      "chart-dashboard-thumbnail-placeholders",
      "svg-placeholder-images-fast-cacheable-scalable",
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────
  {
    title: "Chart and Dashboard Thumbnail Placeholders",
    description:
      "Keep SaaS dashboard thumbnail grids stable while chart previews load. Use fallback.pics thumbnail URLs for report cards, widget previews, and chart gallery states.",
    slug: "chart-dashboard-thumbnail-placeholders",
    readTime: "8 min read",
    category: "SaaS",
    tags: [
      "dashboard thumbnail placeholder",
      "chart thumbnail",
      "SaaS image fallback",
      "report preview placeholder",
      "loading state",
    ],
    summary: [
      "SaaS dashboards frequently render thumbnail previews of charts, reports, and workspaces before the underlying data finishes loading. Without a placeholder at the correct dimensions, those cells collapse or shift — creating a disorienting jump that affects usability and Cumulative Layout Shift scores.",
      "A deterministic thumbnail URL from fallback.pics can fill every chart card slot with an on-brand placeholder that looks like a screenshot stand-in. The URL is fast, CDN-cacheable, and consistent across server renders and client hydration cycles.",
    ],
    sections: [
      {
        eyebrow: "The problem",
        title: "Dashboard grids break without stable placeholder dimensions",
        body: [
          "A report thumbnail grid typically renders a list of cards before the chart screenshots are available. If the img src is empty or points to a 404, the image collapses to zero height, then jumps open when the real preview loads. Google's CLS metric counts that shift.",
          "The fix is a placeholder at the exact pixel dimensions of the final screenshot. For dashboards that generate chart previews at 600x340 or 800x420, the placeholder URL needs those same numbers.",
        ],
      },
      {
        eyebrow: "Thumbnail route",
        title: "Use the thumbnail route to match screenshot proportions",
        body: [
          "Chart screenshots are often wide-format rectangles — 600x340, 700x380, 800x420 depending on the dashboard panel size. The thumbnail route accepts any of these dimensions and produces a placeholder that looks like a chart preview slot rather than a generic rectangle.",
          "Add the report title as the text parameter and it doubles as a legible preview when the real screenshot is still processing.",
        ],
        code: `<!-- Chart preview placeholder at 600x340 -->
https://fallback.pics/api/v1/thumbnail/600x340?text=Monthly+Revenue&style=lines&theme=blue&label=Chart

<!-- Analytics dashboard card at 700x380 -->
https://fallback.pics/api/v1/thumbnail/700x380?text=User+Retention&style=rings&theme=purple&label=Analytics

<!-- Wider report card at 800x420 -->
https://fallback.pics/api/v1/thumbnail/800x420?text=Conversion+Funnel&style=soft&theme=green&label=Report`,
      },
      {
        eyebrow: "React component",
        title: "Thumbnail placeholder component for report cards",
        body: [
          "Centralise the thumbnail placeholder logic in a single component. The component renders the placeholder URL when the screenshot prop is missing or null, and swaps to the real screenshot once it resolves.",
          "Pass the report title to both the placeholder URL and the img alt attribute. When the screenshot loads, the title stays accurate. When it fails, the placeholder shows the title as text inside the SVG.",
        ],
        code: `const THUMBNAIL_BASE =
  'https://fallback.pics/api/v1/thumbnail';

function ReportThumbnail({
  screenshotUrl,
  title,
  width = 600,
  height = 340,
}: {
  screenshotUrl?: string;
  title: string;
  width?: number;
  height?: number;
}) {
  const encodedTitle = encodeURIComponent(title);
  const placeholder = \`\${THUMBNAIL_BASE}/\${width}x\${height}?text=\${encodedTitle}&style=lines&theme=blue&label=Report\`;

  return (
    <img
      src={screenshotUrl ?? placeholder}
      width={width}
      height={height}
      alt={title}
      onError={(e) => { e.currentTarget.src = placeholder; }}
      loading="lazy"
    />
  );
}`,
      },
      {
        eyebrow: "Workspace previews",
        title: "Placeholder thumbnails for workspace and project cards",
        body: [
          "Project management and analytics products show workspace thumbnails in onboarding flows, navigation drawers, and recent-activity feeds. A new workspace has no screenshot yet. Rather than showing a blank square or a generic icon, render a thumbnail URL parameterised with the workspace name.",
          "When the real screenshot generates asynchronously, replace the placeholder URL in your data store. The component picks up the new URL on the next render without any additional logic.",
        ],
        code: `// Generate a stable placeholder per workspace
function workspacePlaceholder(name: string) {
  const text = encodeURIComponent(name.slice(0, 40));
  return \`https://fallback.pics/api/v1/thumbnail/600x340?text=\${text}&style=soft&theme=purple&label=Workspace\`;
}

// Usage in workspace list
{workspaces.map((ws) => (
  <WorkspaceCard
    key={ws.id}
    thumbnail={ws.screenshotUrl ?? workspacePlaceholder(ws.name)}
    name={ws.name}
  />
))}`,
      },
      {
        eyebrow: "Dark dashboards",
        title: "Dark-theme thumbnail placeholders",
        body: [
          "Most analytics products use a dark-mode default. A light-background placeholder looks jarring inside a dark card. Use the dark theme and adjust the background color to match your dashboard surface color.",
          "For a custom dark UI, use the base route with your exact background hex rather than the thumbnail route's preset themes.",
        ],
        code: `<!-- Dark theme preset -->
https://fallback.pics/api/v1/thumbnail/600x340?text=Sales+Pipeline&style=lines&theme=dark&label=CRM

<!-- Custom dark surface color (18181B = Zinc 900) -->
https://fallback.pics/api/v1/600x340/18181B/71717A?text=Revenue+Chart`,
      },
      {
        eyebrow: "Skeleton alternative",
        title: "Animated skeleton for charts still processing",
        body: [
          "When chart screenshots are generating server-side and will arrive in a few seconds, an animated skeleton communicates active processing better than a static thumbnail. Switch to the animated skeleton URL and replace it with the real screenshot when the backend notifies the client.",
          "For charts that may never generate — deleted reports, expired data, permission errors — default to a static thumbnail placeholder so the animation does not imply something is coming.",
        ],
        code: `const placeholderUrl =
  report.status === 'processing'
    ? \`https://fallback.pics/api/v1/animated/skeleton/600x340/27272A/3F3F46\`
    : \`https://fallback.pics/api/v1/thumbnail/600x340?text=\${encodeURIComponent(report.title)}&theme=dark\`;`,
      },
      {
        eyebrow: "Further reading",
        title: "Consistent previews across server and client renders",
        body: [
          "Thumbnail placeholder URLs are deterministic — the same parameters always produce the same image. That makes them safe to include in server-rendered HTML without hydration mismatches. The client receives the same URL the server rendered, and there is no flash of different content.",
          "For deeper integration patterns and caching headers, see the fallback.pics documentation.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/branded-fallback-images-saas-dashboards-internal-tools/
# https://fallback.pics/blog/pattern-background-placeholders-url/`,
      },
    ],
    takeaways: [
      "Set explicit width and height matching your chart screenshot dimensions to prevent CLS.",
      "Use the thumbnail route with text= to show the report title while the screenshot loads.",
      "Centralise placeholder logic in a ReportThumbnail component, not inline across pages.",
      "Switch between animated skeleton (processing) and static thumbnail (error/missing) by status.",
      "Dark-mode dashboards need dark-theme placeholder URLs — light fills break dark card surfaces.",
    ],
    related: [
      "branded-fallback-images-saas-dashboards-internal-tools",
      "skeleton-placeholder-images-vs-static-fallbacks",
      "pattern-background-placeholders-url",
    ],
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────
  {
    title: "Cart Thumbnail Placeholders When Line Item Images Break",
    description:
      "Stop broken image icons in checkout cart line items. Use fallback.pics cart thumbnail URLs to keep shopping cart UIs stable when product photos fail to load.",
    slug: "cart-thumbnail-image-fallback",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "cart thumbnail placeholder",
      "ecommerce image fallback",
      "shopping cart UI",
      "product image fallback",
      "checkout UX",
    ],
    summary: [
      "A broken image in a shopping cart is more damaging than a broken image on a product listing page. Users in the cart are mid-transaction. A broken thumbnail creates doubt about whether the right item was added and can trigger abandonment before checkout.",
      "Cart thumbnails are typically small — 60px to 120px square — but they require the same fallback discipline as larger product images. A deterministic fallback URL at the correct size keeps the cart stable without extra component complexity.",
    ],
    sections: [
      {
        eyebrow: "Why cart images matter more",
        title: "Broken thumbnails in the cart are a trust signal",
        body: [
          "Product listings compete with other listings. A missing image there means the user might not click. In the cart, the user has already committed to investigating a product. A broken image now raises questions: Is this the right item? Is the product real? Is the site reliable?",
          "Cart abandonment rates increase with interface friction, and a broken image icon is friction. The investment to fix cart thumbnails is small relative to the conversion impact.",
        ],
      },
      {
        eyebrow: "Dimensions",
        title: "Match the placeholder to your cart thumbnail size",
        body: [
          "Most cart line items render product thumbnails between 60x60 and 100x100 pixels. Some platforms use a 4:3 ratio for product images that also appear in the cart. Check what your cart template uses before picking a placeholder URL.",
          "Mismatched placeholder dimensions cause the same layout instability as a missing image. Use the exact width and height values your cart renders.",
        ],
        code: `<!-- 80x80 square cart thumbnail fallback -->
<img
  src="https://fallback.pics/api/v1/square/80?text=Item"
  width="80"
  height="80"
  alt="Product image unavailable"
/>

<!-- 100x75 rectangular cart thumbnail fallback -->
<img
  src="https://fallback.pics/api/v1/100x75/E4E4E7/71717A?text=No+Photo"
  width="100"
  height="75"
  alt="Product image unavailable"
/>`,
      },
      {
        eyebrow: "Implementation",
        title: "Add onerror fallback to cart line item images",
        body: [
          "The simplest implementation is an onerror handler on each cart line item img. When the product image URL fails — 404, CORS error, CDN timeout — the handler swaps in the fallback URL.",
          "Guard against infinite loops: the fallback URL must not itself fail. A fallback.pics URL will always return a valid response, making it safe to assign without an additional error check.",
        ],
        code: `<!-- HTML cart template -->
<img
  src="{{ line_item.image_url }}"
  width="80"
  height="80"
  alt="{{ line_item.name }}"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/square/80?text=Item';"
/>

<!-- React cart component -->
function CartLineItem({ item }: { item: LineItem }) {
  const fallback = 'https://fallback.pics/api/v1/square/80?text=Item';
  return (
    <img
      src={item.imageUrl ?? fallback}
      width={80}
      height={80}
      alt={item.name}
      onError={(e) => { e.currentTarget.src = fallback; }}
    />
  );
}`,
      },
      {
        eyebrow: "Branded fallback",
        title: "Use your brand color in the cart fallback",
        body: [
          "A cart fallback in your primary brand color reinforces trust rather than signaling an error. For a purple-themed store, a purple square with a short label looks like a deliberate design choice rather than a broken state.",
          "Using consistent brand-colored fallbacks also makes visual testing more predictable. QA screenshots show the same brand color in every missing-image slot rather than a browser-default broken-image icon that varies by platform.",
        ],
        code: `<!-- Brand-purple cart fallback -->
https://fallback.pics/api/v1/square/80/7C3AED/FFFFFF?text=Item

<!-- Dark neutral for a minimal dark-theme store -->
https://fallback.pics/api/v1/square/80/18181B/71717A?text=N/A`,
      },
      {
        eyebrow: "Shopify and WooCommerce",
        title: "Cart fallbacks in common ecommerce platforms",
        body: [
          "Shopify Liquid templates expose line item images through {{ line_item.image | img_url: '80x80' }}. Wrap the img tag with an onerror attribute pointing to the fallback URL. The same pattern works for WooCommerce PHP templates and any other server-rendered cart.",
          "For headless storefronts using the Storefront API or WooCommerce REST API, apply the fallback at the component level in your React or Vue cart component rather than in the template.",
        ],
        code: `{# Shopify Liquid #}
<img
  src="{{ line_item.image | img_url: '80x80' }}"
  width="80"
  height="80"
  alt="{{ line_item.title | escape }}"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/square/80/7C3AED/FFFFFF?text=Item';"
/>

<!-- WooCommerce PHP (woocommerce/cart/cart.php) -->
<img
  src="<?php echo esc_url($thumbnail_url); ?>"
  width="80"
  height="80"
  alt="<?php echo esc_attr($product_title); ?>"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/square/80/7C3AED/FFFFFF?text=Item';"
/>`,
      },
      {
        eyebrow: "Further reading",
        title: "Full checkout flow image fallback strategy",
        body: [
          "Cart thumbnails are one part of a checkout flow that includes order confirmation pages, email receipts, and return/refund interfaces. Each surface can break independently. See the checkout product image fallback guide for the next step.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/checkout-product-image-fallback/
# https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/`,
      },
    ],
    takeaways: [
      "Broken cart thumbnails damage checkout trust more than broken catalog images.",
      "Match placeholder dimensions exactly to the cart template's rendered size.",
      "Use onerror=\"this.onerror=null;...\" to prevent fallback loops.",
      "Brand-colored fallbacks look intentional; default browser error icons do not.",
      "Apply the same fallback pattern to Shopify Liquid, WooCommerce PHP, and headless cart components.",
    ],
    related: [
      "checkout-product-image-fallback",
      "product-image-placeholder-ecommerce-catalogs",
      "broken-image-icon-to-branded-fallback-checklist",
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────
  {
    title: "Checkout Page Product Image Fallbacks",
    description:
      "Prevent broken product images on checkout and order confirmation pages with fallback.pics URLs. Maintain trust at the highest-stakes point in the purchase funnel.",
    slug: "checkout-product-image-fallback",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "checkout product image",
      "ecommerce checkout fallback",
      "order confirmation image",
      "product image fallback",
      "conversion optimization",
    ],
    summary: [
      "The checkout page is the highest-trust moment in ecommerce. A broken image on the order summary, confirmation page, or receipt email does not just look bad — it raises a legitimate question about whether the transaction was processed correctly.",
      "Checkout product images appear in at least three distinct surfaces: the order summary before payment, the confirmation page after payment, and transactional email receipts. Each surface has different constraints, but all benefit from the same fallback.pics URL pattern.",
    ],
    sections: [
      {
        eyebrow: "Stakes",
        title: "Why checkout images need special attention",
        body: [
          "Cart pages get high traffic but moderate trust. Checkout pages get qualified traffic and maximum trust requirements. A broken image at checkout creates a moment of doubt that can abort a completed transaction: the user refreshes the confirmation page, contacts support, or simply distrusts the receipt.",
          "Image failures at checkout often come from sources that work fine on the catalog page: CDN TTL mismatches, images that expire between cart-add and checkout completion, or vendor-supplied URLs that only work with a referrer.",
        ],
      },
      {
        eyebrow: "Order summary",
        title: "Product images in the pre-payment order summary",
        body: [
          "The order summary on a checkout page shows each line item with a thumbnail before the user submits payment. Images failing here create the most friction — users may remove items and restart.",
          "Apply the same onerror fallback from your cart component here. If you use a shared component for line item images, one change covers both surfaces.",
        ],
        code: `// Shared LineItemImage component – works in cart and checkout
const FALLBACK = 'https://fallback.pics/api/v1/square/80/7C3AED/FFFFFF?text=Item';

export function LineItemImage({ src, name }: { src?: string; name: string }) {
  return (
    <img
      src={src ?? FALLBACK}
      width={80}
      height={80}
      alt={name}
      onError={(e) => { e.currentTarget.src = FALLBACK; }}
    />
  );
}`,
      },
      {
        eyebrow: "Confirmation page",
        title: "Order confirmation page: larger images, different CDN state",
        body: [
          "Confirmation pages often display larger product images (200–400px) and load them fresh from a different context than the checkout flow. If product images are served from a vendor CDN that uses signed URLs, the URL in your database might have expired by the time the confirmation page renders.",
          "Serve the confirmation image from your own CDN or use the product permalink image rather than a signed temporary URL. For any case where the URL is unknown or potentially expired, default to a fallback.pics URL with the product name as text.",
        ],
        code: `function ConfirmationLineItem({ item }: { item: OrderItem }) {
  const w = 200;
  const h = 200;
  const fallback =
    \`https://fallback.pics/api/v1/square/\${w}/7C3AED/FFFFFF?text=\${encodeURIComponent(item.name.slice(0, 20))}\`;

  return (
    <div class="order-item">
      <img
        src={item.permanentImageUrl ?? fallback}
        width={w}
        height={h}
        alt={item.name}
        onError={(e) => { e.currentTarget.src = fallback; }}
      />
      <div>
        <p>{item.name}</p>
        <p>Qty: {item.quantity}</p>
      </div>
    </div>
  );
}`,
      },
      {
        eyebrow: "Email receipts",
        title: "Product images in transactional email",
        body: [
          "Email clients frequently block external images by default. Product images in order confirmation emails need to be hosted on a trusted domain, served over HTTPS, and sized explicitly in the HTML. Avoid signed or expiring URLs in email receipts — those URLs may be dead before the recipient opens the email.",
          "fallback.pics URLs are permanent and deterministic. Embed the product name in the text parameter so the image is useful even when email images are blocked, and set explicit width/height for email clients that size images from HTML attributes.",
        ],
        code: `<!-- Order confirmation email HTML -->
<img
  src="{{ product.permanent_image_url | default: 'https://fallback.pics/api/v1/square/100/7C3AED/FFFFFF?text=' | append: product.name | url_encode }}"
  width="100"
  height="100"
  alt="{{ product.name }}"
  style="display:block;border:0;outline:none;"
/>`,
      },
      {
        eyebrow: "Returns and refunds",
        title: "Image fallbacks in return and refund flows",
        body: [
          "Return and refund interfaces often load product images from order history data that may be months old. Images from suppliers may have been removed or relocated since the original purchase.",
          "Store a snapshot of the product image URL at order creation time and use a fallback.pics URL as the default for any order where the image field is empty or points to a known-bad source.",
        ],
        code: `// At order creation: store a fallback alongside the product image
const orderItem = {
  productId: item.id,
  name: item.name,
  imageUrl: item.imageUrl,
  imageFallbackUrl: \`https://fallback.pics/api/v1/square/120/7C3AED/FFFFFF?text=\${encodeURIComponent(item.name.slice(0, 20))}\`,
};`,
      },
      {
        eyebrow: "Further reading",
        title: "Connecting cart, checkout, and confirmation fallbacks",
        body: [
          "Cart, checkout, and confirmation are one funnel. A shared line item image component with consistent fallback logic covers all three. Apply the pattern once and it propagates across the entire post-cart experience.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/cart-thumbnail-image-fallback/
# https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/`,
      },
    ],
    takeaways: [
      "Checkout images carry more trust weight than catalog images — fix them first.",
      "Use permanent product image URLs in receipts, not signed or expiring CDN links.",
      "A shared LineItemImage component with onerror covers cart, checkout, and confirmation.",
      "Store a fallback URL at order-creation time for return and refund flows.",
      "Email-safe product images need explicit width, height, and HTTPS URLs that do not expire.",
    ],
    related: [
      "cart-thumbnail-image-fallback",
      "product-image-placeholder-ecommerce-catalogs",
      "broken-image-icon-to-branded-fallback-checklist",
    ],
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────
  {
    title: "Marketplace Seller Listing Image Fallbacks",
    description:
      "Handle missing and broken seller-uploaded images in marketplace platforms. Use fallback.pics to keep listing grids stable when vendor media fails.",
    slug: "marketplace-listing-image-fallback",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "marketplace listing image",
      "seller image fallback",
      "multi-vendor marketplace",
      "product image placeholder",
      "ecommerce fallback",
    ],
    summary: [
      "Marketplace platforms aggregate product images from hundreds or thousands of sellers. Image quality, availability, and URL stability vary widely across vendor catalogs. A single broken CDN upstream, a seller who deleted their images, or a feed import with missing fields can leave dozens of listing cards with broken images simultaneously.",
      "Marketplace teams need a scalable fallback strategy that works at the grid level, not one custom fix per listing. A deterministic placeholder URL from fallback.pics fills any missing image slot at any dimension with a consistent, brand-safe result.",
    ],
    sections: [
      {
        eyebrow: "The scale problem",
        title: "Seller images fail at a different scale than first-party catalogs",
        body: [
          "A first-party ecommerce catalog has a small number of controlled image sources. A marketplace with 500 active sellers may have images hosted across 500 different CDNs, uploaded via five different ingestion pipelines, and referencing URLs that were valid at import time but break silently afterward.",
          "You cannot audit individual seller images continuously. The fallback layer must work automatically at render time, not in a scheduled sync job.",
          "The two most common failure modes are: the seller deleted the image from their CDN, and the import pipeline stored a URL that required a session cookie or CORS header. Both produce a 404 or CORS error that triggers the onerror handler.",
        ],
      },
      {
        eyebrow: "Listing grid",
        title: "Keep search result and category grids stable",
        body: [
          "Search and category pages are the highest-traffic surfaces in a marketplace. A grid row with three broken images in it looks untrustworthy and reduces click-through on every listing in that row — including listings with valid images.",
          "Apply a fallback at the grid image component level. Every listing card img that fails receives the same placeholder at the same dimensions, so the grid retains its visual rhythm.",
        ],
        code: `// ListingCardImage.tsx
const FALLBACK_BASE = 'https://fallback.pics/api/v1';

function ListingCardImage({
  src,
  title,
  category,
  width = 400,
  height = 300,
}: {
  src?: string;
  title: string;
  category: string;
  width?: number;
  height?: number;
}) {
  const encoded = encodeURIComponent(category.slice(0, 20));
  const fallback = \`\${FALLBACK_BASE}/\${width}x\${height}/7C3AED/FFFFFF?text=\${encoded}\`;
  return (
    <img
      src={src ?? fallback}
      width={width}
      height={height}
      alt={title}
      onError={(e) => { e.currentTarget.src = fallback; }}
      loading="lazy"
    />
  );
}`,
      },
      {
        eyebrow: "Seller detail page",
        title: "Product detail page with gallery fallbacks",
        body: [
          "Marketplace listing detail pages often show a main image plus a secondary gallery of 3–6 additional images, all supplied by the seller. Any of these can fail independently. The main image gets a larger fallback; gallery thumbnails get a smaller one.",
          "Build the gallery fallback into the image component rather than the listing page. The component knows the intended render size and can select the correct fallback URL without the page needing to handle image state.",
        ],
        code: `// Gallery with per-slot fallback
function ListingGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const mainFallback = \`https://fallback.pics/api/v1/800x600/7C3AED/FFFFFF?text=\${encodeURIComponent(name.slice(0, 30))}\`;
  const thumbFallback = 'https://fallback.pics/api/v1/square/80/E4E4E7/71717A?text=N/A';

  return (
    <div>
      <img
        src={images[active] ?? mainFallback}
        width={800}
        height={600}
        alt={name}
        onError={(e) => { e.currentTarget.src = mainFallback; }}
      />
      <div>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            width={80}
            height={80}
            alt={\`View \${i + 1}\`}
            onError={(e) => { e.currentTarget.src = thumbFallback; }}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}`,
      },
      {
        eyebrow: "Category context",
        title: "Use category labels in marketplace fallbacks",
        body: [
          "A generic fallback placeholder does not communicate anything. A fallback that shows the product category — Electronics, Clothing, Home & Garden — is more useful. Users understand the item type even when the photo is unavailable.",
          "Append the category slug as the text parameter in your fallback URL. Normalize category names to title case and truncate to 20 characters to keep the label readable inside the SVG.",
        ],
        code: `function categoryFallback(category: string, w: number, h: number): string {
  const label = category
    .split(/[-_\s]+/)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .slice(0, 20);
  return \`https://fallback.pics/api/v1/\${w}x\${h}/7C3AED/FFFFFF?text=\${encodeURIComponent(label)}\`;
}

// categoryFallback('home-and-garden', 400, 300)
// → https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Home+And+Garden`,
      },
      {
        eyebrow: "Feed imports",
        title: "Default fallbacks for bulk import pipelines",
        body: [
          "When ingesting seller feeds via CSV, XML, or API, validate image URLs before writing them to your database. For any URL that fails a HEAD request or returns a non-2xx status, store the fallback.pics URL directly as the image field value.",
          "This approach means your listing database always has a valid, renderable image URL. Components do not need onerror handlers for feed-imported listings because the URL in the database is already safe.",
        ],
        code: `async function resolveListingImage(url: string | undefined, category: string): Promise<string> {
  if (!url) return categoryFallback(category, 400, 300);
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('non-2xx');
    return url;
  } catch {
    return categoryFallback(category, 400, 300);
  }
}`,
      },
      {
        eyebrow: "Moderation",
        title: "Placeholder images during content moderation holds",
        body: [
          "Marketplace platforms often hold seller images in a moderation queue before displaying them publicly. During that window, show a branded placeholder rather than the real image.",
          "Use a different color or label for moderation placeholders compared to broken-image placeholders so internal tools can distinguish between the two states visually.",
        ],
        code: `const MODERATION_PLACEHOLDER =
  'https://fallback.pics/api/v1/400x300/F97316/FFFFFF?text=Under+Review';

const BROKEN_PLACEHOLDER =
  'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Image+Unavailable';

const imageUrl =
  listing.imageStatus === 'pending_moderation'
    ? MODERATION_PLACEHOLDER
    : (listing.imageUrl ?? BROKEN_PLACEHOLDER);`,
      },
      {
        eyebrow: "Further reading",
        title: "Ecommerce image fallback strategy at scale",
        body: [
          "Marketplace image fallbacks touch ingestion pipelines, CDN configuration, component libraries, and admin tooling. Start with component-level onerror handlers to fix the visible problem, then move toward feed validation to fix the root cause.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
# https://fallback.pics/blog/fashion-apparel-catalog-placeholders/`,
      },
    ],
    takeaways: [
      "Seller images fail at marketplace scale in ways first-party catalogs do not.",
      "Component-level onerror fallbacks fix the visual problem immediately.",
      "Category labels in the fallback text parameter make placeholder images more informative.",
      "Validate image URLs during feed import to store safe fallback URLs from the start.",
      "Use visually distinct placeholder colors for moderation holds vs broken images.",
    ],
    related: [
      "product-image-placeholder-ecommerce-catalogs",
      "fashion-apparel-catalog-placeholders",
      "cart-thumbnail-image-fallback",
    ],
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────
  {
    title: "Fashion Apparel Catalog Placeholders (Square Product Tiles)",
    description:
      "Keep fashion and apparel product grids clean with square fallback.pics placeholder URLs. Handle missing ghost mannequin photos, color swatch failures, and catalog import gaps.",
    slug: "fashion-apparel-catalog-placeholders",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "fashion product placeholder",
      "apparel catalog placeholder",
      "square product tile",
      "ecommerce image fallback",
      "product grid placeholder",
    ],
    summary: [
      "Fashion and apparel catalogs use square or near-square product tiles almost universally. The 1:1 aspect ratio makes broken images easy to spot — a portrait or landscape placeholder in a square grid creates an obvious dimension mismatch. Placeholders must be square.",
      "Apparel catalogs also have a higher volume of missing images than other categories because shoots are scheduled separately from catalog data entry, ghost mannequin processing takes time, and color variants share a single photo set that may not cover every SKU.",
    ],
    sections: [
      {
        eyebrow: "Dimensions",
        title: "Square tiles are standard in fashion product grids",
        body: [
          "Most fashion ecommerce platforms — Shopify, Magento, VTEX, BigCommerce — default to square product images: 800x800, 600x600, or 400x400. The aspect ratio is baked into the CSS grid, so a placeholder in a different ratio pushes the layout out of alignment.",
          "The /square/ route on fallback.pics takes a single size parameter and returns a 1:1 image. Use it instead of a width × height URL for any fashion catalog fallback.",
        ],
        code: `<!-- 400x400 square fashion tile -->
<img
  src="https://fallback.pics/api/v1/square/400"
  width="400"
  height="400"
  alt="Loading product image"
/>

<!-- 80x80 square for swatches and thumbnails -->
<img
  src="https://fallback.pics/api/v1/square/80"
  width="80"
  height="80"
  alt="Loading swatch"
/>`,
      },
      {
        eyebrow: "Color variants",
        title: "Color swatch fallbacks for multi-variant products",
        body: [
          "A product with 12 color variants may have photos for 8 and missing images for 4. Rather than showing a broken icon for the missing variants, render a swatch placeholder tinted to the variant's hex color. This keeps the color selector visually informative even when photos are absent.",
          "Encode the variant color name as the text parameter and use the variant's hex as the background color. Users see a colored tile with a label instead of an error state.",
        ],
        code: `function SwatchFallback({ colorHex, colorName }: { colorHex: string; colorName: string }) {
  const bg = colorHex.replace('#', '');
  // Use white text on dark colors, dark text on light colors
  const fg = isDark(colorHex) ? 'FFFFFF' : '18181B';
  const label = encodeURIComponent(colorName.slice(0, 10));
  const src = \`https://fallback.pics/api/v1/square/80/\${bg}/\${fg}?text=\${label}\`;
  return <img src={src} width={80} height={80} alt={colorName} />;
}`,
      },
      {
        eyebrow: "Ghost mannequin",
        title: "Placeholder while ghost mannequin processing completes",
        body: [
          "Ghost mannequin (invisible mannequin) processing takes the product from 24 to 72 hours after a shoot. During that window, a placeholder is better than an empty cell. Use an animated skeleton to communicate active processing, or a static tile with \"Processing\" as the text label.",
          "Switch to the static tile if the processing window exceeds 72 hours — persistent animation implies active loading, which is misleading for images that are taking longer than expected.",
        ],
        code: `const PROCESSING_PLACEHOLDER =
  'https://fallback.pics/api/v1/square/400/E4E4E7/71717A?text=Processing';

const MISSING_PLACEHOLDER =
  'https://fallback.pics/api/v1/square/400/7C3AED/FFFFFF?text=No+Photo';

const src =
  product.imageStatus === 'processing'
    ? PROCESSING_PLACEHOLDER
    : (product.imageUrl ?? MISSING_PLACEHOLDER);`,
      },
      {
        eyebrow: "Lookbook",
        title: "Lookbook and editorial grid fallbacks",
        body: [
          "Fashion editorial pages use non-square images: tall portrait shots for lookbooks (2:3 ratio, e.g. 600x900), wide banner crops for seasonal promotions (16:9, e.g. 1200x675). These surfaces need different fallback URLs than the product grid.",
          "Build the fallback URL into your image component as a function of the intended render dimensions. A single utility function that accepts width and height returns the correct fallback for every surface.",
        ],
        code: `function catalogFallback(w: number, h: number, label = 'No Photo'): string {
  const text = encodeURIComponent(label);
  if (w === h) return \`https://fallback.pics/api/v1/square/\${w}/7C3AED/FFFFFF?text=\${text}\`;
  return \`https://fallback.pics/api/v1/\${w}x\${h}/7C3AED/FFFFFF?text=\${text}\`;
}

// Product tile: 400x400
catalogFallback(400, 400);

// Lookbook portrait: 600x900
catalogFallback(600, 900, 'Coming Soon');

// Seasonal banner: 1200x400
catalogFallback(1200, 400, 'New Collection');`,
      },
      {
        eyebrow: "Performance",
        title: "Cache square placeholders across a large catalog",
        body: [
          "A fashion catalog with 5000 SKUs and 400x400 images will use the same square/400 fallback URL for every missing photo. Browsers cache that one URL and serve it from memory for all subsequent tiles. One network round-trip covers the entire batch of missing images.",
          "For large catalogs with programmatically-generated fallback URLs (variant color tiles, for example), ensure your cache headers permit long-lived caching. Set Cache-Control: public, max-age=31536000 on all fallback.pics responses.",
        ],
        code: `# All missing-image tiles in a 5000-SKU catalog share one cached URL
https://fallback.pics/api/v1/square/400/7C3AED/FFFFFF?text=No+Photo

# Variant-specific tiles are also cached per unique URL
https://fallback.pics/api/v1/square/80/C4162A/FFFFFF?text=Red
https://fallback.pics/api/v1/square/80/1D4ED8/FFFFFF?text=Blue`,
      },
      {
        eyebrow: "Further reading",
        title: "Ecommerce placeholder strategy for catalog and checkout",
        body: [
          "Fashion catalogs are a good starting point for a broader ecommerce fallback strategy because the square grid makes the dimension requirements obvious. The same component pattern scales to food, real estate, and any other image-heavy vertical.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
# https://fallback.pics/blog/marketplace-listing-image-fallback/`,
      },
    ],
    takeaways: [
      "Use the /square/ route for fashion product tiles — never a non-square fallback in a square grid.",
      "Tint color variant fallbacks with the variant's own hex color to keep selectors informative.",
      "Distinguish between processing and missing states with different placeholder labels or colors.",
      "A single square fallback URL is cached once and reused for every missing tile in the catalog.",
      "Editorial and lookbook pages need non-square fallback URLs — build a utility function that accepts width and height.",
    ],
    related: [
      "product-image-placeholder-ecommerce-catalogs",
      "marketplace-listing-image-fallback",
      "cart-thumbnail-image-fallback",
    ],
  },

  // ─── 9 ───────────────────────────────────────────────────────────────────
  {
    title: "Grocery and Food Delivery Menu Image Fallbacks",
    description:
      "Keep grocery catalog and food delivery menu grids stable when dish or product photos are missing. Use fallback.pics URL patterns designed for food app image failures.",
    slug: "food-menu-image-fallbacks",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "food menu image placeholder",
      "grocery catalog placeholder",
      "food delivery app fallback",
      "menu item image",
      "ecommerce image fallback",
    ],
    summary: [
      "Food delivery and grocery apps display hundreds or thousands of menu items and product photos. Restaurants upload photos at different quality levels and frequencies; grocery suppliers deliver product feeds where image coverage is incomplete. Missing food photos are nearly universal in production.",
      "Food app image fallbacks need to be warm and appetizing rather than cold and technical. A gray rectangle reads as an error; a placeholder using warm orange or amber tones and a short category label reads as a work in progress.",
    ],
    sections: [
      {
        eyebrow: "Context",
        title: "Why food images fail more often than other categories",
        body: [
          "Restaurant menu images are notoriously inconsistent. A restaurant may have photos for 60% of items; the rest were not photographed, are seasonal, or were added after the initial onboarding. Grocery suppliers maintain product databases that are updated independently of image assets.",
          "Delivery app platforms also aggregate from many sources simultaneously: a single city-level instance may query images from hundreds of restaurants across five different integrations. A temporary CDN outage at one integration can blank a large section of the menu grid.",
          "The scale and source diversity makes manual image monitoring impractical. Automated fallbacks at the component level are the only reliable fix.",
        ],
      },
      {
        eyebrow: "Color palette",
        title: "Use warm palette fallbacks for food contexts",
        body: [
          "Color psychology matters in food interfaces. Cool grays and purples feel neutral to cold and are associated with non-food contexts. Warm oranges, ambers, and reds perform better as food category placeholders because they align with food photography palettes.",
          "Pick a fallback color that is adjacent to your app's primary brand color but skews warm. For a teal-branded delivery app, a warm amber fallback is less jarring than a teal one.",
        ],
        code: `<!-- Warm orange-amber food fallback (works for most food categories) -->
https://fallback.pics/api/v1/400x300/EA580C/FEF9C3?text=Dish+Photo

<!-- Category-specific warm tones -->
https://fallback.pics/api/v1/400x300/DC2626/FEE2E2?text=Meat
https://fallback.pics/api/v1/400x300/16A34A/DCFCE7?text=Salad
https://fallback.pics/api/v1/400x300/CA8A04/FEF9C3?text=Bakery
https://fallback.pics/api/v1/400x300/0EA5E9/E0F2FE?text=Drinks`,
      },
      {
        eyebrow: "Menu grid",
        title: "Keep menu item grids stable on restaurant pages",
        body: [
          "Restaurant menu pages on delivery apps show items in a category-organized grid. A missing image in one category section does not affect other sections, but multiple missing images in the same section create a visually broken row.",
          "Apply the fallback URL at the menu item image component level. Pass the dish category as a prop so the fallback color is appropriate for each section.",
        ],
        code: `const FOOD_PALETTE: Record<string, [string, string]> = {
  appetizers:  ['EA580C', 'FEF9C3'],
  mains:       ['DC2626', 'FEE2E2'],
  desserts:    ['DB2777', 'FCE7F3'],
  drinks:      ['0EA5E9', 'E0F2FE'],
  sides:       ['65A30D', 'ECFCCB'],
  default:     ['EA580C', 'FFF7ED'],
};

function MenuItemImage({ src, name, category, width = 300, height = 300 }: {
  src?: string; name: string; category: string; width?: number; height?: number;
}) {
  const [bg, fg] = FOOD_PALETTE[category] ?? FOOD_PALETTE.default;
  const label = encodeURIComponent(name.slice(0, 20));
  const fallback = \`https://fallback.pics/api/v1/\${width}x\${height}/\${bg}/\${fg}?text=\${label}\`;
  return (
    <img
      src={src ?? fallback}
      width={width}
      height={height}
      alt={name}
      onError={(e) => { e.currentTarget.src = fallback; }}
      loading="lazy"
    />
  );
}`,
      },
      {
        eyebrow: "Grocery catalog",
        title: "Product fallbacks for grocery delivery catalogs",
        body: [
          "Grocery apps show product images from supplier feeds. Produce, bulk items, and private-label products are the categories with the highest rate of missing images. Use the product name and section (fruit, dairy, cleaning, etc.) to generate an informative fallback.",
          "Grocery catalogs also use square images for product cards. Set width and height equal to ensure the placeholder matches the catalog grid cell.",
        ],
        code: `// Grocery catalog fallback helper
function groceryFallback(productName: string, section: string, size = 300): string {
  const sectionColors: Record<string, string> = {
    produce:   '16A34A/DCFCE7',
    dairy:     '0EA5E9/E0F2FE',
    meat:      'DC2626/FEE2E2',
    bakery:    'CA8A04/FEF9C3',
    cleaning:  '7C3AED/EDE9FE',
    default:   'EA580C/FFF7ED',
  };
  const colors = sectionColors[section] ?? sectionColors.default;
  const label = encodeURIComponent(productName.slice(0, 20));
  return \`https://fallback.pics/api/v1/square/\${size}/\${colors}?text=\${label}\`;
}`,
      },
      {
        eyebrow: "Modifiers",
        title: "Modifier and add-on image fallbacks",
        body: [
          "Food apps show modifier images for toppings, add-ons, and size selections. These are usually very small (40–60px) and rarely photographed at high priority. A minimal square fallback with the modifier name keeps the selector readable.",
          "For small sizes, skip the text parameter — at 40px, text becomes illegible. Use a solid color fallback that matches the category color.",
        ],
        code: `<!-- Small modifier square (40px) – text too small, use solid color -->
<img
  src="https://fallback.pics/api/v1/square/40/EA580C/FFF7ED"
  width="40"
  height="40"
  alt="{{ modifier.name }}"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/square/40/EA580C/FFF7ED';"
/>`,
      },
      {
        eyebrow: "App performance",
        title: "Caching food image fallbacks in delivery apps",
        body: [
          "Mobile apps and PWAs can pre-cache the most common food category fallback URLs on first launch using a service worker. Because the URLs are deterministic, the cache entry never expires from URL changes.",
          "For a 10-category food app, pre-caching 10 fallback URLs per category size covers the vast majority of missing image scenarios with a trivial storage overhead.",
        ],
        code: `// service-worker.ts – precache food fallback URLs
const FOOD_FALLBACKS = [
  'https://fallback.pics/api/v1/300x300/EA580C/FFF7ED',
  'https://fallback.pics/api/v1/300x300/16A34A/DCFCE7',
  'https://fallback.pics/api/v1/300x300/DC2626/FEE2E2',
  'https://fallback.pics/api/v1/300x300/0EA5E9/E0F2FE',
  'https://fallback.pics/api/v1/300x300/CA8A04/FEF9C3',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open('food-fallbacks-v1').then((cache) => cache.addAll(FOOD_FALLBACKS))
  );
});`,
      },
      {
        eyebrow: "Further reading",
        title: "Image fallback strategy for food and grocery platforms",
        body: [
          "Food app image fallbacks benefit from category-aware color coding more than most ecommerce contexts. Investing a small amount of time in the color palette pays off in a interface that feels designed rather than broken.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
# https://fallback.pics/blog/fashion-apparel-catalog-placeholders/`,
      },
    ],
    takeaways: [
      "Use warm palette fallback colors (orange, amber) for food contexts — avoid cold grays.",
      "Map food categories to specific hex pairs to make placeholders contextually meaningful.",
      "Small modifier images (40px) should skip text — use solid color only at that size.",
      "Grocery catalogs need square fallback URLs matching the product card grid dimensions.",
      "Pre-cache 5–10 food category fallback URLs in a service worker for offline food apps.",
    ],
    related: [
      "product-image-placeholder-ecommerce-catalogs",
      "fashion-apparel-catalog-placeholders",
      "marketplace-listing-image-fallback",
    ],
  },

  // ─── 10 ──────────────────────────────────────────────────────────────────
  {
    title: "Real Estate Listing Photo Fallbacks",
    description:
      "Handle missing property listing photos in real estate platforms with fallback.pics URLs. Keep listing cards, gallery views, and map pins stable when photos are unavailable.",
    slug: "real-estate-listing-photo-fallback",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "real estate listing placeholder",
      "property photo fallback",
      "real estate image",
      "listing photo placeholder",
      "MLS image fallback",
    ],
    summary: [
      "Real estate listing platforms ingest photos from MLS feeds, agent-uploaded files, and third-party photography services. Photos arrive on unpredictable schedules: a new listing may go live hours before photos are uploaded, and photo sets from MLS feeds can include broken URLs that were valid at sync time.",
      "Property listing photo fallbacks need to communicate property type and address rather than just holding space. A placeholder that says \"No Photos Yet\" with a contextual house or property type label is more useful than a generic gray rectangle for buyers browsing listings.",
    ],
    sections: [
      {
        eyebrow: "Failure modes",
        title: "How real estate listing photos fail in production",
        body: [
          "MLS photo feeds update on a schedule that does not match listing status. A listing marked active may have photos attached in the MLS system but not yet synced to your platform. An expired listing's photos may have been purged from the upstream CDN before your cache TTL expired.",
          "Agent-uploaded photos can fail from storage provider outages, accidental deletion, or signed URL expiration. Large photo sets — 30+ images per listing — give more chances for individual URLs to fail.",
          "The practical impact: a property with 25 photos where the hero image fails looks far worse than a listing with no photos and a clean placeholder.",
        ],
      },
      {
        eyebrow: "Hero image",
        title: "Listing card and hero photo fallbacks",
        body: [
          "The primary listing photo appears on search result cards, map marker pop-ups, and the listing detail page hero. It is the most visible image on the platform and the first photo a buyer sees.",
          "Use a fallback URL that communicates property type and availability status. A house silhouette with \"No Photos Yet\" on a warm neutral background is more informative than a blank.",
        ],
        code: `const RE_FALLBACK_BASE = 'https://fallback.pics/api/v1';

function listingHeroFallback(propertyType: string, w: number, h: number): string {
  const labels: Record<string, string> = {
    house:       'House',
    condo:       'Condo',
    apartment:   'Apartment',
    land:        'Land',
    commercial:  'Commercial',
  };
  const label = encodeURIComponent(labels[propertyType] ?? 'Property');
  return \`\${RE_FALLBACK_BASE}/\${w}x\${h}/94A3B8/F8FAFC?text=\${label}\`;
}

// Hero image component
<img
  src={listing.heroPhotoUrl ?? listingHeroFallback(listing.type, 800, 600)}
  width={800}
  height={600}
  alt={\`\${listing.address} property photo\`}
  onError={(e) => { e.currentTarget.src = listingHeroFallback(listing.type, 800, 600); }}
/>`,
      },
      {
        eyebrow: "Gallery",
        title: "Photo gallery with fallback per slot",
        body: [
          "Listing detail pages show galleries of 10–40 photos. Buyers cycle through every photo in the set. A broken image in slot 7 is noticed immediately. Each gallery slot needs an independent fallback.",
          "The gallery thumbnail strip at the bottom uses smaller images (typically 120x80 or 160x100). Apply the fallback at the thumbnail level so broken gallery slots do not expand or collapse.",
        ],
        code: `function ListingGallery({
  photos,
  address,
  type,
}: {
  photos: { url: string; caption?: string }[];
  address: string;
  type: string;
}) {
  const heroFallback = listingHeroFallback(type, 1200, 800);
  const thumbFallback = \`https://fallback.pics/api/v1/160x100/94A3B8/F8FAFC?text=Photo\`;

  return (
    <div>
      {photos.map((photo, i) => (
        <img
          key={i}
          src={photo.url}
          width={i === 0 ? 1200 : 160}
          height={i === 0 ? 800 : 100}
          alt={photo.caption ?? \`\${address} photo \${i + 1}\`}
          onError={(e) => {
            e.currentTarget.src = i === 0 ? heroFallback : thumbFallback;
          }}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}`,
      },
      {
        eyebrow: "New listing state",
        title: "No-photo state for newly listed properties",
        body: [
          "A newly listed property often goes live before photos are uploaded. Show a \"Photos Coming Soon\" placeholder rather than an empty state or a broken image. The animated skeleton is the right choice here because content is genuinely forthcoming.",
          "Once photos are uploaded and available, the API returns a non-empty photo array. The component should check array length and switch from the animated skeleton to the real photo on the next render cycle.",
        ],
        code: `const COMING_SOON_PLACEHOLDER =
  'https://fallback.pics/api/v1/animated/skeleton/800x600/E2E8F0/F8FAFC';

const MISSING_PLACEHOLDER =
  'https://fallback.pics/api/v1/800x600/94A3B8/F8FAFC?text=No+Photos';

const heroSrc =
  listing.photos.length === 0
    ? (listing.status === 'newly_listed'
        ? COMING_SOON_PLACEHOLDER
        : MISSING_PLACEHOLDER)
    : listing.photos[0].url;`,
      },
      {
        eyebrow: "Map pins",
        title: "Listing photo thumbnails in map marker pop-ups",
        body: [
          "Map-based property searches show a photo thumbnail inside the map marker or hover pop-up. These are small (100–200px) and must load fast. A broken image here is particularly jarring because the map interaction expects quick visual feedback.",
          "Pre-generate the fallback URL on the server and embed it in the listing data. Map pop-ups should never trigger a secondary fallback lookup that delays the pop-up render.",
        ],
        code: `// API response shape
interface ListingMapPin {
  id: string;
  lat: number;
  lng: number;
  price: number;
  // Compute fallback server-side, not in the browser
  thumbnailUrl: string; // primary photo or fallback.pics URL
}

// Server-side: resolve thumbnail URL before sending to client
function resolveMapThumbnail(listing: Listing): string {
  return listing.photos[0]?.url
    ?? \`https://fallback.pics/api/v1/160x120/94A3B8/F8FAFC?text=\${encodeURIComponent(listing.type)}\`;
}`,
      },
      {
        eyebrow: "MLS feed processing",
        title: "Validate MLS photo URLs during feed ingestion",
        body: [
          "MLS feeds deliver photo URL arrays that were valid at the time of export. By the time your sync job runs, some URLs may already be dead. Add a HEAD-request validation step to your ingestion pipeline that replaces invalid URLs with fallback.pics URLs before writing to your database.",
          "This is especially important for listing detail pages where the full photo array is rendered. A single validated array write saves dozens of onerror events per page view.",
        ],
        code: `async function validateMlsPhotos(
  photos: { url: string }[],
  type: string,
): Promise<string[]> {
  return Promise.all(
    photos.map(async ({ url }) => {
      try {
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(4000) });
        return res.ok ? url : listingHeroFallback(type, 800, 600);
      } catch {
        return listingHeroFallback(type, 800, 600);
      }
    })
  );
}`,
      },
      {
        eyebrow: "Further reading",
        title: "Placeholder strategy for high-stakes property listings",
        body: [
          "Real estate listings carry significant financial weight for buyers and sellers. A broken image is not just a cosmetic issue — it can affect listing credibility and buyer confidence. Investing in a solid fallback strategy at both the component and ingestion layer pays off in platform trust.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
# https://fallback.pics/blog/travel-hotel-gallery-fallbacks/`,
      },
    ],
    takeaways: [
      "Use property-type labels (House, Condo, Land) in fallback URLs to add context for buyers.",
      "Distinguish between no-photo-yet (animated skeleton) and missing-photo (static placeholder) states.",
      "Gallery thumbnails need individual fallbacks — one broken slot should not affect others.",
      "Pre-compute fallback URLs server-side for map pin pop-ups to avoid client-side delays.",
      "Validate MLS photo URLs during feed ingestion to prevent dead URLs in your database.",
    ],
    related: [
      "travel-hotel-gallery-fallbacks",
      "product-image-placeholder-ecommerce-catalogs",
      "marketplace-listing-image-fallback",
    ],
  },

  // ─── 11 ──────────────────────────────────────────────────────────────────
  {
    title: "Travel and Hotel Gallery Image Fallbacks",
    description:
      "Keep travel booking and hotel gallery pages stable when room photos fail. Use fallback.pics URLs for hero images, room type cards, and amenity galleries in OTAs and property sites.",
    slug: "travel-hotel-gallery-fallbacks",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "hotel image placeholder",
      "travel image fallback",
      "hotel gallery placeholder",
      "booking site image",
      "OTA image fallback",
    ],
    summary: [
      "Online travel agents and hotel booking sites display galleries from thousands of properties, each with 20–60 photos uploaded by the property team or a photography vendor. Photo CDN outages, expired signed URLs, and properties that delete assets without notice are routine causes of broken gallery images.",
      "Hotel photo failures have higher user trust implications than most ecommerce categories because buyers are making decisions that involve significant spend and cannot be instantly reversed. Placeholder images in travel need to feel intentional, not broken.",
    ],
    sections: [
      {
        eyebrow: "Context",
        title: "Travel galleries depend on high image quality at volume",
        body: [
          "A hotel listing on a booking platform may link to photos hosted on the property's own CDN, a third-party photography vendor, or a channel manager integration. All of these sources can fail independently. Unlike a product catalog that you control, you cannot enforce uptime SLAs on external photo hosts.",
          "The consequence of broken hotel images is worse than most categories: users use photos to evaluate the quality of a property before committing to a multi-night booking. Missing images reduce perceived quality even when the property is excellent.",
        ],
      },
      {
        eyebrow: "Hero photo",
        title: "Hotel hero photo fallback",
        body: [
          "The hero photo is the first thing a user sees on a hotel listing page. It should load instantly and should never show a broken image icon. Use a fallback URL parameterised with the property name and type.",
          "Travel and hospitality contexts benefit from warm, inviting palette choices. A teal-blue or warm amber fallback reads as a travel industry color rather than a generic tech placeholder.",
        ],
        code: `function hotelHeroFallback(name: string, w = 1200, h = 800): string {
  const label = encodeURIComponent(name.slice(0, 30));
  return \`https://fallback.pics/api/v1/\${w}x\${h}/0D9488/CCFBF1?text=\${label}\`;
}

// Usage
<img
  src={hotel.heroPhotoUrl ?? hotelHeroFallback(hotel.name)}
  width={1200}
  height={800}
  alt={\`\${hotel.name} exterior\`}
  onError={(e) => { e.currentTarget.src = hotelHeroFallback(hotel.name); }}
  loading="eager"
/>`,
      },
      {
        eyebrow: "Room types",
        title: "Room type card fallbacks in the booking flow",
        body: [
          "The room selection step in a booking flow shows a card per room type (Standard, Deluxe, Suite) with a representative photo. Each card is typically 400x250 or 600x400. A missing room photo makes the booking decision harder.",
          "Use a room-type label in the fallback to communicate what category of room the card represents even when the image is unavailable.",
        ],
        code: `const ROOM_FALLBACK_COLORS: Record<string, string> = {
  standard: '0D9488/CCFBF1',
  deluxe:   '7C3AED/EDE9FE',
  suite:    'B45309/FEF9C3',
  family:   '16A34A/DCFCE7',
  default:  '0D9488/F0FDFA',
};

function roomFallback(roomType: string, w = 600, h = 400): string {
  const colors = ROOM_FALLBACK_COLORS[roomType.toLowerCase()] ?? ROOM_FALLBACK_COLORS.default;
  const label = encodeURIComponent(
    roomType.charAt(0).toUpperCase() + roomType.slice(1).toLowerCase()
  );
  return \`https://fallback.pics/api/v1/\${w}x\${h}/\${colors}?text=\${label}+Room\`;
}`,
      },
      {
        eyebrow: "Amenity gallery",
        title: "Amenity and facility photo fallbacks",
        body: [
          "Hotels show amenity galleries for pools, gyms, restaurants, spas, and conference rooms. These photos are often uploaded once and rarely updated — meaning their CDN URLs are at higher risk of going stale than room photos that are regularly refreshed.",
          "Amenity fallbacks can use the amenity name as text. The pool fallback says \"Pool\"; the spa fallback says \"Spa\". This keeps the gallery strip legible even when multiple photos fail.",
        ],
        code: `const AMENITY_SIZES = { thumbnail: 160, card: 400, full: 800 } as const;

function amenityFallback(name: string, size: keyof typeof AMENITY_SIZES = 'card'): string {
  const w = AMENITY_SIZES[size];
  const h = Math.round(w * 0.667);
  const label = encodeURIComponent(name.slice(0, 15));
  return \`https://fallback.pics/api/v1/\${w}x\${h}/0D9488/CCFBF1?text=\${label}\`;
}

// amenityFallback('Pool', 'card') → https://fallback.pics/api/v1/400x267/0D9488/CCFBF1?text=Pool`,
      },
      {
        eyebrow: "Map thumbnails",
        title: "Hotel pin thumbnails on map views",
        body: [
          "Map-based hotel search pages show a small hotel photo thumbnail when a user hovers or clicks a map pin. These thumbnails are typically 100–150px wide and need to load instantly from a cache. Pre-resolve the thumbnail URL server-side and include it in the listing API response.",
          "A small fallback at 120x80 with the hotel name shortened to initials or a three-character abbreviation reads well in the constrained map pin pop-up space.",
        ],
        code: `// Server-side: include fallback URL in API response
function hotelMapPin(hotel: Hotel) {
  return {
    id: hotel.id,
    lat: hotel.lat,
    lng: hotel.lng,
    price: hotel.lowestPrice,
    thumbnailUrl:
      hotel.thumbnailUrl ??
      \`https://fallback.pics/api/v1/120x80/0D9488/CCFBF1?text=\${
        encodeURIComponent(hotel.name.slice(0, 3).toUpperCase())
      }\`,
  };
}`,
      },
      {
        eyebrow: "Further reading",
        title: "Gallery fallback strategy for travel and hospitality",
        body: [
          "Travel platforms that invest in consistent placeholder design reduce bounce rates from broken image states. Start with the hero photo and room type cards, which are the two surfaces with the highest trust impact on conversion.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/real-estate-listing-photo-fallback/
# https://fallback.pics/blog/car-dealership-photo-placeholders/`,
      },
    ],
    takeaways: [
      "Use teal-blue or warm amber fallback palettes — they read as travel industry, not tech error.",
      "Room type fallbacks should include the room category label (Standard, Deluxe, Suite).",
      "Amenity galleries go stale faster than room photos — apply fallbacks to the full gallery array.",
      "Pre-compute hotel thumbnail URLs server-side for map pins to avoid client-side latency.",
      "Hero photos are the highest-trust surface: prioritize them for fallback coverage first.",
    ],
    related: [
      "real-estate-listing-photo-fallback",
      "car-dealership-photo-placeholders",
      "product-image-placeholder-ecommerce-catalogs",
    ],
  },

  // ─── 12 ──────────────────────────────────────────────────────────────────
  {
    title: "Car Dealership Inventory Photo Placeholders",
    description:
      "Handle missing vehicle inventory photos in car dealership platforms with fallback.pics URLs. Keep VDP pages and search result grids stable when photos are not yet uploaded.",
    slug: "car-dealership-photo-placeholders",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "car listing placeholder image",
      "vehicle photo fallback",
      "auto dealer image",
      "VDP image placeholder",
      "inventory photo missing",
    ],
    summary: [
      "Auto dealer inventory platforms ingest vehicle data from DMS feeds that often go live before photos are taken. A new vehicle arrives on the lot, gets entered into the system, and may sit for 24–72 hours before a photo set is produced. During that window, a VDP (vehicle detail page) renders with no photos.",
      "Car listing image fallbacks need to communicate vehicle category — sedan, SUV, truck, EV — to maintain the perception that the listing is complete and trustworthy. A placeholder that reads \"Sedan — Photos Coming\" is significantly more useful than a gray box.",
    ],
    sections: [
      {
        eyebrow: "Inventory gap",
        title: "New inventory arrives before photos do",
        body: [
          "Dealer management systems (DMS) push new inventory to listing platforms via nightly feeds or real-time webhooks. Photos follow a separate workflow: a lot photographer visits, shoots the car, uploads a 20–40 image set, and the images are processed and attached to the listing.",
          "The timing gap between data feed and photo upload is 24–72 hours at most dealers. During that window, every page view of that listing shows a broken or empty photo slot. For high-traffic dealerships, this affects dozens of listings simultaneously.",
        ],
      },
      {
        eyebrow: "Vehicle type",
        title: "Category-aware fallbacks for different vehicle types",
        body: [
          "A sedan, truck, SUV, and electric vehicle have different buyer expectations. A generic gray placeholder communicates nothing about the vehicle. Use the vehicle body style or category as the fallback text parameter.",
          "Color the placeholder using the vehicle's exterior color when that data is available from the DMS feed. A red placeholder for a red car communicates the color even before the photo arrives.",
        ],
        code: `function vehicleFallback(
  bodyStyle: string,
  exteriorColor?: string,
  w = 800,
  h = 533,
): string {
  const label = encodeURIComponent(bodyStyle || 'Vehicle');

  // Use exterior color if available, else neutral gray
  const bg = exteriorColor
    ? exteriorColor.replace('#', '')
    : '374151';
  const fg = isDarkColor(bg) ? 'F9FAFB' : '111827';

  return \`https://fallback.pics/api/v1/\${w}x\${h}/\${bg}/\${fg}?text=\${label}+No+Photo\`;
}

// vehicleFallback('Sedan', '#1E3A5F') → blue sedan fallback
// vehicleFallback('SUV')              → neutral gray SUV fallback`,
      },
      {
        eyebrow: "VDP gallery",
        title: "Vehicle detail page photo gallery",
        body: [
          "VDPs show 20–40 photos in a gallery with a large hero and a thumbnail strip. Most dealers have a standard shot sequence: exterior front 3/4, exterior rear 3/4, driver side, passenger side, interior, engine bay. The hero photo is almost always the front 3/4 exterior.",
          "Apply a fallback for the hero separately from the gallery strip thumbnails. The hero is larger (typically 800x533 or 1200x800) and more prominent; the thumbnail strip uses smaller tiles (120x80 or 160x106).",
        ],
        code: `// VDP image component
function VdpHeroImage({ listing }: { listing: VehicleListing }) {
  const heroFallback = vehicleFallback(listing.bodyStyle, listing.exteriorColor, 800, 533);
  const thumbFallback = vehicleFallback(listing.bodyStyle, listing.exteriorColor, 120, 80);

  return (
    <div>
      <img
        src={listing.photos[0]?.url ?? heroFallback}
        width={800}
        height={533}
        alt={\`\${listing.year} \${listing.make} \${listing.model}\`}
        onError={(e) => { e.currentTarget.src = heroFallback; }}
        loading="eager"
      />
      <div>
        {listing.photos.slice(1).map((photo, i) => (
          <img
            key={i}
            src={photo.url}
            width={120}
            height={80}
            alt={\`View \${i + 2}\`}
            onError={(e) => { e.currentTarget.src = thumbFallback; }}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}`,
      },
      {
        eyebrow: "Search grid",
        title: "Inventory search result grid fallbacks",
        body: [
          "Dealer inventory search grids show 12–24 listings per page with a card photo for each. A new inventory batch can result in every card on the first page showing a missing photo. Apply the vehicle fallback with body style and color at the card level.",
          "Search grid cards typically use a 16:9 or 3:2 aspect ratio. The standard DMS photo upload at 800x533 (3:2) is the most common.",
        ],
        code: `{inventory.map((vehicle) => (
  <article key={vehicle.vin} class="vehicle-card">
    <img
      src={
        vehicle.photos[0]?.url
          ?? vehicleFallback(vehicle.bodyStyle, vehicle.exteriorColor, 400, 267)
      }
      width={400}
      height={267}
      alt={\`\${vehicle.year} \${vehicle.make} \${vehicle.model}\`}
      onError={(e) => {
        e.currentTarget.src = vehicleFallback(vehicle.bodyStyle, vehicle.exteriorColor, 400, 267);
      }}
      loading="lazy"
    />
    <div>
      <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
      <p>{vehicle.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
    </div>
  </article>
))}`,
      },
      {
        eyebrow: "Coming soon badge",
        title: "Overlay a Coming Soon badge on new listings",
        body: [
          "For new-arrival listings with no photos yet, an overlaid \"Photos Coming\" badge communicates active status better than a fallback alone. The badge signals that this is a legitimate new listing, not a broken one. Pair it with an animated skeleton background.",
          "Remove the badge and swap the src once photos are attached and available in the API.",
        ],
        code: `const isNewArrival = listing.daysOnLot < 3 && listing.photos.length === 0;

const heroSrc = listing.photos[0]?.url
  ?? (isNewArrival
      ? \`https://fallback.pics/api/v1/animated/skeleton/800x533/374151/4B5563\`
      : vehicleFallback(listing.bodyStyle, listing.exteriorColor, 800, 533));`,
      },
      {
        eyebrow: "Further reading",
        title: "Vehicle inventory image strategy at scale",
        body: [
          "Multi-location dealer groups running thousands of VINs across dozens of rooftops benefit most from a consistent fallback strategy baked into the shared inventory component. One component change covers all locations.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/travel-hotel-gallery-fallbacks/
# https://fallback.pics/blog/real-estate-listing-photo-fallback/`,
      },
    ],
    takeaways: [
      "New inventory arrives before photos — use animated skeletons for new-arrival listings.",
      "Encode body style (Sedan, SUV, Truck) in the fallback URL text for contextual placeholders.",
      "Use the vehicle's exterior color as the fallback background when DMS data includes it.",
      "VDP hero and gallery thumbnails need separate fallback URLs at their respective sizes.",
      "A Coming Soon overlay badge distinguishes genuine new arrivals from broken image states.",
    ],
    related: [
      "travel-hotel-gallery-fallbacks",
      "real-estate-listing-photo-fallback",
      "product-image-placeholder-ecommerce-catalogs",
    ],
  },

  // ─── 13 ──────────────────────────────────────────────────────────────────
  {
    title: "Job Board Company Logo and Avatar Fallbacks",
    description:
      "Keep company logos and user profile avatars stable on job boards with fallback.pics. Handle missing logos, unverified company accounts, and 404 avatar URLs.",
    slug: "job-board-logo-avatar-fallbacks",
    readTime: "7 min read",
    category: "SaaS",
    tags: [
      "company logo placeholder",
      "job board image fallback",
      "avatar placeholder",
      "employer logo fallback",
      "SaaS image fallback",
    ],
    summary: [
      "Job boards display two distinct image types: company logos on job listings and user profile avatars for candidates and recruiters. Both fail regularly. Company accounts go inactive and their CDN assets expire; users sign up without uploading a photo; logos from external HR systems arrive via feeds that break silently.",
      "Initials-based avatar placeholders and branded logo fallbacks are the two tools that solve these problems. fallback.pics provides both via URL: the /avatar/ route for initials avatars and the standard colored tile for company logo placeholders.",
    ],
    sections: [
      {
        eyebrow: "Company logos",
        title: "Logo fallbacks for employer accounts",
        body: [
          "Company logos on job listings fail for several reasons: a startup changes its logo and forgets to update the job board; an enterprise company rotates its CDN and breaks all externally-linked logo URLs; a free-tier company account lapses and their hosted assets go offline.",
          "A fallback that uses the company name's first letters on a brand-colored background reads as an intentional design choice (think Google's G, Amazon's A) rather than a missing image. This is the standard UI pattern for all company identities that lack a photo.",
        ],
      },
      {
        eyebrow: "Logo avatar route",
        title: "Generate company initials avatars from the URL",
        body: [
          "The /avatar/ route accepts a text parameter for initials. Use the first letter of the company name or the first two letters for multi-word names. The output is a circular or square avatar tile with the initials centered.",
          "Vary the background color by company ID or name hash to give each company a distinct color without manual setup. A simple modulo operation on the name length or character codes selects from a set of brand-safe colors.",
        ],
        code: `const COMPANY_COLORS = [
  '7C3AED', '2563EB', '0D9488', '16A34A', 'CA8A04',
  'DC2626', 'C026D3', '0369A1', '15803D', 'D97706',
];

function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function companyLogoFallback(name: string, size = 64): string {
  const initials = companyInitials(name);
  const colorIndex = name.charCodeAt(0) % COMPANY_COLORS.length;
  const bg = COMPANY_COLORS[colorIndex];
  return \`https://fallback.pics/api/v1/avatar/\${size}?text=\${encodeURIComponent(initials)}&bg=\${bg}\`;
}

// companyLogoFallback('Acme Corp', 64)
// companyLogoFallback('Stripe', 40)`,
      },
      {
        eyebrow: "Job listing card",
        title: "Logo on job listing cards and search results",
        body: [
          "Job listing search result cards show the company logo at 40–64px square alongside the job title, company name, and location. At this size, the initials fit perfectly and distinguish each company visually.",
          "Apply the fallback both for missing logos and for failed image loads. Check the company logo field server-side and default to the fallback URL if it is null or empty. The onerror handler covers URL-exists-but-returns-404 failures at render time.",
        ],
        code: `function JobListingCard({ job }: { job: JobListing }) {
  const fallback = companyLogoFallback(job.company.name, 48);
  return (
    <article>
      <img
        src={job.company.logoUrl ?? fallback}
        width={48}
        height={48}
        alt={\`\${job.company.name} logo\`}
        onError={(e) => { e.currentTarget.src = fallback; }}
      />
      <div>
        <h3>{job.title}</h3>
        <p>{job.company.name} · {job.location}</p>
      </div>
    </article>
  );
}`,
      },
      {
        eyebrow: "User avatars",
        title: "Candidate and recruiter profile avatar fallbacks",
        body: [
          "User profile avatars for candidates and recruiters fail when users sign up without uploading a photo, when OAuth-linked profile photos expire (Google, LinkedIn profile URLs are not stable long-term), or when accounts are anonymised for privacy.",
          "The /avatar/ route with the user's initials is the right fallback for authenticated user avatars. Vary the color based on the user's ID (not name — names can change) for a consistent per-user color.",
        ],
        code: `function userAvatarFallback(userId: string, displayName: string, size = 40): string {
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .slice(0, 2)
    .join('');

  // Stable color based on userId hash
  const hash = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const bg = COMPANY_COLORS[hash % COMPANY_COLORS.length];

  return \`https://fallback.pics/api/v1/avatar/\${size}?text=\${encodeURIComponent(initials || '?')}&bg=\${bg}\`;
}`,
      },
      {
        eyebrow: "Recruiter tools",
        title: "Recruiter dashboard and ATS integration fallbacks",
        body: [
          "Applicant tracking systems (ATS) pull candidate photos from LinkedIn via integrations that periodically break. Resume parsing systems may attach a photo URL that was embedded in a PDF and is no longer accessible. Recruiter-facing tools see avatar failures at a higher rate than public-facing job boards.",
          "Apply the user avatar fallback at the recruiter dashboard component level. The same component serves both the job board and the recruiter app, so one change propagates to both surfaces.",
        ],
        code: `// UserAvatar component – shared between candidate card and recruiter dashboard
export function UserAvatar({
  user,
  size = 40,
}: {
  user: { id: string; displayName: string; avatarUrl?: string };
  size?: number;
}) {
  const fallback = userAvatarFallback(user.id, user.displayName, size);
  return (
    <img
      src={user.avatarUrl ?? fallback}
      width={size}
      height={size}
      alt={user.displayName}
      onError={(e) => { e.currentTarget.src = fallback; }}
      style={{ borderRadius: '50%' }}
    />
  );
}`,
      },
      {
        eyebrow: "Unverified accounts",
        title: "Placeholder logos for unverified company accounts",
        body: [
          "Job boards let companies post jobs before completing profile verification. An unverified account may not have uploaded a logo yet. Use a distinct placeholder color or label for unverified accounts to signal their status in moderation and public-facing views.",
          "Swap to the standard initials fallback once the account is verified and a logo is still missing.",
        ],
        code: `const logoSrc =
  company.logoUrl
    ? company.logoUrl
    : company.verified
      ? companyLogoFallback(company.name, 48)
      : \`https://fallback.pics/api/v1/avatar/48?text=?\&bg=94A3B8\`;`,
      },
      {
        eyebrow: "Further reading",
        title: "Avatar and logo fallbacks in SaaS platforms",
        body: [
          "The same initials-based avatar pattern used on job boards works across all SaaS products that show user and organization identities. Build it into a shared design system component once and reuse it everywhere.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/avatar-placeholder-generator-initials-colors-accessibility/
# https://fallback.pics/blog/branded-fallback-images-saas-dashboards-internal-tools/`,
      },
    ],
    takeaways: [
      "Generate company initials from the name and assign a consistent color via a hash of the name.",
      "Use user ID, not display name, to assign a stable avatar color across name changes.",
      "Apply fallbacks server-side for missing logo fields and client-side onerror for URL failures.",
      "Unverified company accounts should show a distinct placeholder, not the standard initials tile.",
      "LinkedIn and OAuth profile photo URLs are not stable long-term — always have a fallback ready.",
    ],
    related: [
      "avatar-placeholder-generator-initials-colors-accessibility",
      "branded-fallback-images-saas-dashboards-internal-tools",
      "chart-dashboard-thumbnail-placeholders",
    ],
  },

  // ─── 14 ──────────────────────────────────────────────────────────────────
  {
    title: "Event Ticket and Venue Image Placeholders",
    description:
      "Keep event listing pages and ticket interfaces stable when venue photos and event cover images fail. Use fallback.pics URLs for event cards, venue galleries, and ticket confirmation headers.",
    slug: "event-venue-image-placeholders",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "event image placeholder",
      "venue photo fallback",
      "ticket image placeholder",
      "event listing fallback",
      "ecommerce image fallback",
    ],
    summary: [
      "Event ticketing platforms and venue listing sites display cover images submitted by event organizers, venue teams, and promoters. Image quality and availability vary dramatically: a major festival uploads high-quality assets weeks in advance; a local event organizer submits a JPEG from their phone the morning of the event.",
      "Event image fallbacks need to communicate category (Concert, Conference, Sport, Festival) and feel energetic rather than clinical. A genre-colored placeholder with the event name reads as a deliberate design choice in a context where strong visual brand matters.",
    ],
    sections: [
      {
        eyebrow: "Context",
        title: "Event images arrive late and from inconsistent sources",
        body: [
          "Event organizers create listings on ticketing platforms days or weeks before uploading cover art. For recurring events, organizers may upload art for the first instance and neglect to update it for subsequent dates — leaving outdated images attached rather than missing ones.",
          "Venue photo galleries are a separate problem: venues upload photos once during platform onboarding, then never update them. After two years, CDN asset URLs may have expired, venue management software may have migrated to a new provider, or the venue itself may have closed.",
        ],
      },
      {
        eyebrow: "Event card",
        title: "Event listing card cover image fallback",
        body: [
          "Event cards in a browse-events grid show a cover image at around 400x225 (16:9) or 400x300 (4:3). Use a category-colored fallback with the event name or category label as text.",
          "Map event categories to warm, high-energy palette colors. Music events are good candidates for deep purple or red; sports events for green or navy; conferences for blue.",
        ],
        code: `const EVENT_PALETTE: Record<string, [string, string]> = {
  music:       ['7C3AED', 'EDE9FE'],
  sports:      ['15803D', 'DCFCE7'],
  conference:  ['1D4ED8', 'DBEAFE'],
  festival:    ['EA580C', 'FFF7ED'],
  theatre:     ['9D174D', 'FCE7F3'],
  food:        ['CA8A04', 'FEF9C3'],
  comedy:      ['0369A1', 'E0F2FE'],
  default:     ['7C3AED', 'F5F3FF'],
};

function eventCoverFallback(
  eventName: string,
  category: string,
  w = 400,
  h = 225,
): string {
  const [bg, fg] = EVENT_PALETTE[category.toLowerCase()] ?? EVENT_PALETTE.default;
  const label = encodeURIComponent(eventName.slice(0, 30));
  return \`https://fallback.pics/api/v1/\${w}x\${h}/\${bg}/\${fg}?text=\${label}\`;
}`,
      },
      {
        eyebrow: "Ticket confirmation",
        title: "Event image in ticket and booking confirmation",
        body: [
          "Ticket confirmation pages show the event cover image prominently alongside order details. The image is loaded at this point from the event listing data, which may have been created days ago. Signed image URLs in the event data may have expired.",
          "Store the event cover fallback URL alongside the event cover URL in the booking record at checkout time. Render whichever resolves first.",
        ],
        code: `// At booking time: compute and store fallback URL
const booking = {
  eventId: event.id,
  eventName: event.name,
  eventCoverUrl: event.coverImageUrl,
  eventCoverFallbackUrl: eventCoverFallback(event.name, event.category, 800, 450),
};

// Confirmation page
<img
  src={booking.eventCoverUrl ?? booking.eventCoverFallbackUrl}
  width={800}
  height={450}
  alt={\`\${booking.eventName} event cover\`}
  onError={(e) => { e.currentTarget.src = booking.eventCoverFallbackUrl; }}
/>`,
      },
      {
        eyebrow: "Venue gallery",
        title: "Venue detail page photo gallery fallbacks",
        body: [
          "Venue pages show exterior and interior photos, capacity configuration images, and floor plan overlays. These assets are uploaded once during onboarding and rarely refreshed. Long-lived signed URLs are a common failure point two or three years after initial upload.",
          "Apply a venue-specific fallback (teal or warm stone palette, venue name as text) at each gallery slot. The fallback keeps the gallery strip visually consistent even when individual slots fail.",
        ],
        code: `function venuePhotoFallback(venueName: string, w = 600, h = 400): string {
  const label = encodeURIComponent(venueName.slice(0, 25));
  return \`https://fallback.pics/api/v1/\${w}x\${h}/0D9488/CCFBF1?text=\${label}\`;
}

// Gallery
{venue.photos.map((photo, i) => (
  <img
    key={i}
    src={photo.url}
    width={600}
    height={400}
    alt={\`\${venue.name} photo \${i + 1}\`}
    onError={(e) => { e.currentTarget.src = venuePhotoFallback(venue.name); }}
    loading="lazy"
  />
))}`,
      },
      {
        eyebrow: "No-art state",
        title: "Newly created events with no cover art",
        body: [
          "A newly created event listing may go live with no cover art uploaded. Rather than showing a broken slot, render the category-colored fallback immediately. The fallback URL is constructed from event data available at creation time, so no async requests are needed.",
          "Once the organizer uploads cover art, the listing API returns a non-null coverImageUrl. The component picks it up on the next render. No state management needed beyond the standard null check.",
        ],
        code: `// EventCard – handles no art, broken art, and real art in one component
function EventCard({ event }: { event: Event }) {
  const fallback = eventCoverFallback(event.name, event.category, 400, 225);
  return (
    <article>
      <img
        src={event.coverImageUrl ?? fallback}
        width={400}
        height={225}
        alt={event.name}
        onError={(e) => { e.currentTarget.src = fallback; }}
        loading="lazy"
      />
      <div>
        <span>{event.category}</span>
        <h3>{event.name}</h3>
        <time>{event.date}</time>
      </div>
    </article>
  );
}`,
      },
      {
        eyebrow: "Further reading",
        title: "Event and venue image fallback as a first-class feature",
        body: [
          "Event platforms where organizers control image assets need to treat fallbacks as a first-class feature, not an edge case. Build the fallback URL into the event creation API response so every event always has a valid, renderable image URL from the moment it is created.",
        ],
        code: `# https://fallback.pics/docs/
# https://fallback.pics/placeholder-image-api/
# https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
# https://fallback.pics/blog/job-board-logo-avatar-fallbacks/`,
      },
    ],
    takeaways: [
      "Map event categories to genre-appropriate colors — purple for music, green for sports, blue for conferences.",
      "Store the fallback URL in booking records at checkout to avoid expired-URL failures on confirmation pages.",
      "Venue gallery photos go stale — apply fallbacks to the full photo array, not just the first slot.",
      "Newly created events should have a fallback URL in the API response from the moment of creation.",
      "Category-colored event placeholders feel intentional; generic gray placeholders look like errors in a live event context.",
    ],
    related: [
      "product-image-placeholder-ecommerce-catalogs",
      "job-board-logo-avatar-fallbacks",
      "travel-hotel-gallery-fallbacks",
    ],
  },
];
