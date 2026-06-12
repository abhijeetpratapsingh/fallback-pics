import type { BlogPost } from '../blogPosts';

export const backlogBatch04: Omit<BlogPost, 'image' | 'date'>[] = [
  {
    title: "fetchpriority and loading=eager for Critical Image Fallbacks",
    description:
      "Use fetchpriority=high and loading=eager on above-the-fold fallback images to prevent LCP misses and blank hero sections on slow connections.",
    slug: "fetchpriority-critical-image-fallbacks",
    readTime: "8 min read",
    category: "Performance",
    tags: [
      "fetchpriority images",
      "LCP optimization",
      "Core Web Vitals",
      "image loading",
      "placeholder images",
    ],
    summary: [
      "The fetchpriority attribute gives the browser a direct hint that an image is critical before the full page finishes parsing. When your hero or above-the-fold fallback image is a Largest Contentful Paint candidate, marking it high priority can shave hundreds of milliseconds off LCP on slow connections.",
      "Most teams apply loading=lazy universally and forget to upgrade critical images to eager. The fix is two attributes on the img tag, but knowing exactly where to apply them requires understanding how the browser preload scanner handles statically declared versus JavaScript-injected images.",
    ],
    sections: [
      {
        eyebrow: "Why it matters",
        title: "fetchpriority keeps LCP images from waiting in the resource queue",
        body: [
          "Browsers assign a default priority to every resource based on type and document position. Images are medium priority by default, which means the browser can start loading CSS and blocking scripts before fetching your hero image. On a constrained connection this ordering costs real milliseconds at the top of the page.",
          "When a fallback image is the largest visible element at page load — a hero banner placeholder, an 800×400 product photo, a full-bleed section background — it often becomes the LCP element. Without fetchpriority=high, that image waits in the same queue as deferred scripts and web fonts.",
          "Adding fetchpriority=high moves the request to the high-priority network queue. The preload scanner picks it up earlier, before layout is complete. On a 4G connection this change can reduce LCP by 200–500ms. On slower connections the improvement is larger because more requests compete for limited bandwidth.",
        ],
      },
      {
        eyebrow: "Syntax",
        title: "Adding fetchpriority=high to a fallback img element",
        body: [
          "The fetchpriority attribute accepts three values: high, low, and auto. Auto is the default and lets the browser decide based on context. High tells the browser to treat this resource as competing with the most important requests on the page. Low explicitly deprioritizes decorative or offscreen content.",
          "For fallback images, apply high only when the image is visible on initial render and large enough to be an LCP candidate. Use low for decorative fallback images in grids or sections below the fold where delaying the fetch has no impact on perceived performance.",
        ],
        code: `<!-- Above-the-fold hero fallback: high priority, eager load -->
<img
  src="https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Product+Hero"
  width="1200"
  height="630"
  fetchpriority="high"
  loading="eager"
  decoding="async"
  alt="Product hero image"
/>

<!-- Below-fold product grid item: low priority, lazy load -->
<img
  src="https://fallback.pics/api/v1/400x300/E4E4E7/71717A?text=Product"
  width="400"
  height="300"
  fetchpriority="low"
  loading="lazy"
  decoding="async"
  alt="Product placeholder"
/>`,
      },
      {
        eyebrow: "Loading attribute",
        title: "loading=eager vs loading=lazy for above-the-fold content",
        body: [
          "The loading attribute controls when the browser initiates a fetch, not how it prioritizes the request. loading=lazy defers the fetch until the image is near the viewport threshold. loading=eager, which is the default, fetches immediately regardless of scroll position.",
          "When you combine fetchpriority=high with loading=eager, you get two distinct benefits: the image is not deferred (eager), and it competes at the front of the network scheduler (high priority). For fallback placeholder images in the initial viewport, this combination produces the fastest possible render time.",
          "Never set loading=lazy on any image that appears above the fold. Lazy loading triggers a fetch only when the image enters the viewport proximity threshold, which on mobile can be several hundred milliseconds after initial render. This delays LCP even when the image is immediately visible to the user.",
        ],
      },
      {
        eyebrow: "LCP candidate",
        title: "Fallback images as Largest Contentful Paint elements",
        body: [
          "The LCP metric measures the render time of the largest image or text block visible in the viewport at load. Browsers consider img elements, CSS background images loaded via url(), video poster frames, and SVGs with intrinsic size as LCP candidates.",
          "Fallback placeholder images from fallback.pics are standard img elements with explicit width and height. When used for a hero or banner section, the placeholder will be the LCP element until the final image arrives — or permanently, if the fallback is the intentional loading state.",
          "This means fallback image performance directly impacts Core Web Vitals scores. If the fallback takes 2.2 seconds to load, your LCP is 2.2 seconds regardless of when the actual image arrives. Treat the fallback URL with the same performance discipline as the real asset.",
        ],
      },
      {
        eyebrow: "Preload scanner",
        title: "Dynamically inserted fallbacks bypass the preload scanner",
        body: [
          "The browser preload scanner reads raw HTML before the DOM is fully constructed. It finds img src attributes and link rel=preload tags and queues their fetches early in the page lifecycle. This is why static img tags load faster than JavaScript-injected images — the scanner sees them first.",
          "If your fallback src is set via JavaScript — an onerror handler, a React state update, or a framework component with conditional rendering — the preload scanner cannot see it. The fetch starts only after JavaScript executes, which is after the initial parse and at least one render cycle.",
          "For critical fallback images, declare the fallback URL as the initial src in static HTML rather than injecting it later. If the primary image URL is unknown at render time, set the placeholder as the src server-side before sending the HTML response.",
        ],
      },
      {
        eyebrow: "Framework usage",
        title: "fetchpriority in React, Vue, and Astro image components",
        body: [
          "React supports fetchpriority as a camelCase JSX prop: fetchPriority='high'. Vue passes it as a standard HTML attribute. In Astro, use the HTML attribute directly. The underlying browser behavior is identical regardless of which framework wraps it.",
          "The priority should be determined by where the image appears, not by whether it is a fallback. An above-the-fold placeholder deserves the same high priority as the final image it temporarily replaces. Pass the priority prop based on the image's visual position, not its content state.",
        ],
        code: `// React: hero image with fetchpriority and eager loading
function HeroImage({ src, alt }: { src?: string; alt: string }) {
  const fallback =
    "https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Hero";
  return (
    <img
      src={src || fallback}
      width={1200}
      height={630}
      fetchPriority="high"
      loading="eager"
      decoding="async"
      alt={alt}
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Audit checklist",
        title: "Verify fetchpriority is working before deploying",
        body: [
          "Open DevTools Performance panel and run a page load trace. Find the LCP candidate callout in the timing lane. If the LCP element is your placeholder image loading at medium priority, fetchpriority=high is the correct fix.",
          "Cross-check in the Network panel: requests with fetchpriority=high show as Highest or High in the Priority column. If your image still shows as Medium, verify the attribute is on the correct img element and not being overridden by a JavaScript framework's rendering pass.",
        ],
        code: `# API reference and docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/lcp-optimization-failed-hero-images/
https://fallback.pics/blog/core-web-vitals-cls-missing-images/`,
      },
    ],
    takeaways: [
      "Apply fetchpriority=high only to fallback images that are above the fold and likely LCP candidates.",
      "Never combine loading=lazy with above-the-fold images — defer only images the user cannot see on initial load.",
      "Combine fetchpriority=high with loading=eager for the fastest possible critical image render.",
      "Fallback images set via JavaScript miss the preload scanner; prefer static src attributes for hero slots.",
      "Confirm request priority in DevTools Network panel before shipping to production.",
    ],
    related: [
      "lcp-optimization-failed-hero-images",
      "core-web-vitals-cls-missing-images",
      "image-loading-best-practices-for-better-ux",
    ],
  },

  {
    title: "How decoding=async Improves Placeholder Image Rendering",
    description:
      "decoding=async lets the browser decode placeholder images off the main thread, reducing jank and keeping scrolling smooth during heavy page loads.",
    slug: "decoding-async-placeholder-images",
    readTime: "6 min read",
    category: "Performance",
    tags: [
      "img decoding async",
      "placeholder images",
      "browser rendering",
      "image performance",
      "main thread",
    ],
    summary: [
      "Image decoding is CPU work. Without guidance, the browser synchronously decodes images on the main thread before painting, which can delay rendering and cause jank during scroll on image-heavy pages.",
      "The decoding=async attribute tells the browser it can defer image decoding off the main thread. For placeholder images used in grids, feeds, and galleries, this single attribute often eliminates the micro-stutter that appears when dozens of images load in quick succession.",
    ],
    sections: [
      {
        eyebrow: "The rendering bottleneck",
        title: "Image decoding blocks the main thread by default",
        body: [
          "After a browser fetches image bytes, it must decode the compressed data into raw pixels before the image can be painted. JPEG decoding means running a DCT, PNG decoding means inflating zlib data, and even SVGs require parsing and rasterizing. This work happens on the main thread by default.",
          "On a page with 20 product cards, the browser may decode all 20 images synchronously as they load. Each decode call occupies the main thread, blocking scroll handlers, animations, and user input responses. On a mid-range Android device this manifests as visible stutter when a grid of placeholders appears.",
          "The browser does not know ahead of time whether an image is important or decorative. It defaults to synchronous decoding for predictable behavior. decoding=async opts out of that default for images where a few milliseconds of decoding delay is acceptable.",
        ],
      },
      {
        eyebrow: "Attribute syntax",
        title: "Using decoding=async on placeholder img elements",
        body: [
          "The decoding attribute accepts three values: sync, async, and auto. Sync forces synchronous main-thread decoding. Async explicitly moves decoding off the main thread. Auto, the default, lets the browser choose based on its own heuristics.",
          "For placeholder images in lists, grids, and feeds — any surface where many images load near-simultaneously — async is the right choice. The image may appear a frame or two later than sync would produce, but the main thread stays free for scroll and interaction events.",
        ],
        code: `<!-- Placeholder image with async decoding -->
<img
  src="https://fallback.pics/api/v1/400x300/E4E4E7/71717A?text=Product"
  width="400"
  height="300"
  loading="lazy"
  decoding="async"
  alt="Product preview"
/>

<!-- Avatar grid item: async decoding and lazy loading -->
<img
  src="https://fallback.pics/api/v1/avatar/80?text=AB"
  width="80"
  height="80"
  loading="lazy"
  decoding="async"
  alt="User avatar"
/>`,
      },
      {
        eyebrow: "When to use sync",
        title: "Hero images where a decoding delay changes LCP",
        body: [
          "For the primary hero image or any image that is the Largest Contentful Paint element, decoding=sync ensures the image is decoded and painted as part of the earliest possible frame. With async, the browser may defer decoding until after the first paint, increasing measured LCP.",
          "The tradeoff is clear: use async for below-the-fold images and multi-image grids, and use sync (or leave the default) for the single hero image that is the LCP candidate. Mixing both attributes on a page based on image position is normal and intentional.",
        ],
      },
      {
        eyebrow: "Placeholder-specific benefit",
        title: "Grids of fallback placeholders benefit most from async decoding",
        body: [
          "Placeholder images are often simpler to decode than real photos — an SVG or a solid-color PNG is much cheaper than a complex JPEG. Even so, when a product grid renders 30 placeholders simultaneously, the cumulative decode work adds up.",
          "With decoding=async on each grid item, the browser schedules those decode jobs on image decode workers rather than on the main thread. Scroll performance during the placeholder phase stays smooth, and when real images swap in, the same attribute continues to help.",
          "Test this on a CPU-throttled device. Open DevTools Performance panel, enable 4x CPU slowdown, and load a product grid with and without decoding=async. The flame chart will show the difference in main-thread image decode blocks.",
        ],
      },
      {
        eyebrow: "Combining attributes",
        title: "decoding, loading, and fetchpriority work at different stages",
        body: [
          "These three attributes control different phases of image delivery. loading controls when the fetch begins. fetchpriority controls how urgently the browser fetches the resource. decoding controls when and on which thread the browser processes the fetched bytes.",
          "A complete below-fold placeholder gets: loading=lazy (defer fetch), fetchpriority=low (low urgency), decoding=async (off-thread decode). A hero placeholder gets: loading=eager (fetch now), fetchpriority=high (maximum urgency), decoding=sync (decode in-frame for LCP).",
        ],
        code: `<!-- Complete attribute set for a below-fold placeholder -->
<img
  src="https://fallback.pics/api/v1/600x400/F4F4F5/A1A1AA?text=Loading"
  width="600"
  height="400"
  loading="lazy"
  fetchpriority="low"
  decoding="async"
  alt="Loading preview"
/>`,
      },
      {
        eyebrow: "Framework defaults",
        title: "Next.js, Astro, and Nuxt handle decoding differently",
        body: [
          "Next.js Image component sets decoding=async by default for all images. This is a reasonable default for most product grids. If you bypass the Image component and use a raw img tag, you opt out of that default.",
          "Astro's Image component also sets decoding=async. Nuxt Image and @nuxt/image follow similar defaults. When you use a placeholder URL directly in a raw img tag — for example in an onerror fallback — you need to add the attribute yourself.",
        ],
        code: `# Documentation and API reference
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/fetchpriority-critical-image-fallbacks/
https://fallback.pics/blog/image-loading-best-practices-for-better-ux/`,
      },
    ],
    takeaways: [
      "decoding=async moves image decode work off the main thread, reducing scroll jank in image-heavy grids.",
      "Use sync or the default (auto) for the primary hero image that is the LCP candidate.",
      "Placeholder grids with 10+ items benefit the most from async decoding on mid-range devices.",
      "decoding, loading, and fetchpriority each control a different phase of image delivery — all three matter.",
      "Add decoding=async manually when using raw img fallback tags; framework Image components often set it automatically.",
    ],
    related: [
      "fetchpriority-critical-image-fallbacks",
      "image-loading-best-practices-for-better-ux",
      "srcset-responsive-placeholder-images",
    ],
  },

  {
    title: "Responsive Images with srcset and Deterministic Fallback URLs",
    description:
      "Combine srcset with deterministic placeholder URLs to serve correctly sized fallback images at every breakpoint and avoid layout shift on slow networks.",
    slug: "srcset-responsive-placeholder-images",
    readTime: "9 min read",
    category: "Performance",
    tags: [
      "srcset placeholder",
      "responsive images",
      "image fallbacks",
      "layout shift",
      "Core Web Vitals",
    ],
    summary: [
      "srcset lets the browser pick the best image from a set based on device pixel ratio and viewport width. When you include fallback.pics placeholder URLs in that set, broken or missing images degrade cleanly at every breakpoint instead of collapsing the layout.",
      "Most srcset implementations only define real image sources and omit a fallback strategy. Adding deterministic placeholder URLs for each declared size means the browser always has a correctly-sized image to render, even when the primary sources return 404.",
    ],
    sections: [
      {
        eyebrow: "How srcset works",
        title: "The browser selects from srcset based on viewport and DPR",
        body: [
          "srcset defines a list of image source candidates with width descriptors (400w, 800w) or pixel density descriptors (1x, 2x). The browser evaluates its current viewport width, the sizes attribute hint, and the device pixel ratio, then selects the most appropriate source.",
          "On a 375px wide Retina display (2x DPR), a browser will prefer a 750px-wide image over a 400px one if both are available. On a 1440px desktop, it picks the largest useful size. The browser makes this decision once per image element — if the chosen source fails, there is no automatic retry from the srcset list.",
          "That last point matters for fallback strategy: srcset is not an error recovery mechanism. If the selected source returns a 404 or fails to load, the browser shows a broken image icon. You still need an onerror handler or a server-side fallback for missing images.",
        ],
      },
      {
        eyebrow: "Fallback in srcset",
        title: "Including placeholder URLs for each srcset width descriptor",
        body: [
          "One pattern is to serve placeholder URLs as the src fallback while the srcset contains real images. If the browser selects a real source from srcset and it loads, great. If all sources fail, the src fallback provides a same-size placeholder.",
          "A stronger pattern for catalogs with partially populated media is to conditionally include placeholder URLs in the srcset itself when a real image is absent. The placeholder URL can be constructed to match each declared width exactly, so the browser selects a correctly sized placeholder.",
        ],
        code: `<!-- Basic: placeholder as src fallback for a responsive hero -->
<img
  src="https://fallback.pics/api/v1/800x600/7C3AED/FFFFFF?text=Hero"
  srcset="
    /images/hero-400.jpg 400w,
    /images/hero-800.jpg 800w,
    /images/hero-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 100vw, 800px"
  width="800"
  height="600"
  loading="eager"
  fetchpriority="high"
  alt="Hero image"
  onerror="this.srcset=''; this.src='https://fallback.pics/api/v1/800x600/7C3AED/FFFFFF?text=Hero';"
/>`,
      },
      {
        eyebrow: "Dimensions matter",
        title: "Match placeholder dimensions to srcset width descriptors",
        body: [
          "A placeholder that does not match the space reserved by the aspect-ratio container or explicit width and height attributes will cause layout shift. If you declare width=800 height=600 on the img element, your fallback URL should also produce an 800×600 image.",
          "fallback.pics generates images at exact dimensions from the URL. For a responsive component where you need three sizes, construct three placeholder URLs with matching dimensions. You can also construct the URL dynamically from the same width and height values used in the srcset.",
          "When using JavaScript to generate srcset strings, build the placeholder URLs from the same dimension constants. This keeps the fallback set consistent with the real image set without duplicating numbers across the codebase.",
        ],
        code: `// Build srcset with matching placeholder fallbacks
const sizes = [400, 800, 1200] as const;
const aspectRatio = 3 / 4; // portrait product image

function buildSrcset(imageId: string): string {
  return sizes
    .map((w) => {
      const h = Math.round(w * aspectRatio);
      const real = \`/cdn/products/\${imageId}/\${w}x\${h}.jpg\`;
      return \`\${real} \${w}w\`;
    })
    .join(', ');
}

function buildFallbackSrc(w = 800): string {
  const h = Math.round(w * aspectRatio);
  return \`https://fallback.pics/api/v1/\${w}x\${h}/E4E4E7/71717A?text=Product\`;
}`,
      },
      {
        eyebrow: "Layout shift prevention",
        title: "Explicit width and height on every responsive img element",
        body: [
          "The browser calculates the aspect-ratio box for an image from its width and height attributes before the image loads. If you omit those attributes, the box collapses to zero height and expands when the image loads, shifting the page content. This is Cumulative Layout Shift.",
          "For srcset images, always provide width and height matching the largest declared size (or the intrinsic size of the image). The browser uses the aspect ratio from those attributes, even when it ultimately renders a smaller srcset candidate. Your placeholder URL should match that same aspect ratio.",
          "Alternatively, use an aspect-ratio container in CSS. The container reserves the right amount of space regardless of the image's intrinsic size, and both real images and fallback placeholders fill it without layout shift.",
        ],
      },
      {
        eyebrow: "sizes attribute",
        title: "Correct sizes hints prevent oversized placeholder fetches",
        body: [
          "Without a sizes attribute, the browser assumes the image fills 100% of the viewport. On a 1440px display, it selects the largest srcset candidate even if the image only occupies a 300px sidebar. This wastes bandwidth on the placeholder just as much as on real images.",
          "Write accurate sizes hints: (max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw for a three-column grid. The browser then selects an appropriately sized candidate from both the real images and any placeholders in the srcset.",
        ],
        code: `<!-- Product grid card with accurate sizes hint -->
<img
  src="https://fallback.pics/api/v1/400x400/E4E4E7/71717A?text=Product"
  srcset="
    /products/img-200.jpg 200w,
    /products/img-400.jpg 400w,
    /products/img-800.jpg 800w
  "
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  width="400"
  height="400"
  loading="lazy"
  decoding="async"
  alt="Product image"
/>`,
      },
      {
        eyebrow: "Art direction",
        title: "Use picture element for different crops at different breakpoints",
        body: [
          "srcset serves the same image composition at different resolutions. When you need different crops at different breakpoints — a wide landscape on desktop, a portrait crop on mobile — use the picture element with multiple source elements.",
          "Each source element in a picture block can carry its own srcset and media condition. Your fallback placeholder can be dimension-matched to each breakpoint's crop by placing a matching placeholder URL in the src attribute of the fallback img element.",
        ],
        code: `<!-- picture element with per-breakpoint fallback dimensions -->
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="/images/hero-1200x500.jpg 1200w, /images/hero-2400x1000.jpg 2400w"
    sizes="100vw"
  />
  <source
    media="(min-width: 640px)"
    srcset="/images/hero-800x600.jpg 800w"
    sizes="100vw"
  />
  <img
    src="https://fallback.pics/api/v1/400x600/7C3AED/FFFFFF?text=Hero"
    width="400"
    height="600"
    loading="eager"
    fetchpriority="high"
    alt="Hero banner"
    onerror="this.src='https://fallback.pics/api/v1/400x600/7C3AED/FFFFFF?text=Hero';"
  />
</picture>`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading on responsive images and fallback patterns",
        body: [
          "The srcset specification allows browsers to make intelligent choices, but it does not handle errors. A complete responsive image implementation combines srcset for optimization with onerror or server-side fallbacks for reliability.",
          "Test your responsive image setup with DevTools Device Mode at 1x, 2x, and 3x DPR, and verify that fallback URLs appear correctly sized in every scenario.",
        ],
        code: `# API reference
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/fetchpriority-critical-image-fallbacks/
https://fallback.pics/blog/responsive-placeholder-images-cards-banners-grids/`,
      },
    ],
    takeaways: [
      "srcset selects the best source but does not retry on failure — always pair it with an onerror fallback.",
      "Match placeholder URL dimensions to each srcset width descriptor to prevent layout shift.",
      "Write accurate sizes hints to avoid the browser fetching oversized placeholders.",
      "Use explicit width and height on every img element so the browser can reserve the aspect-ratio box before load.",
      "For different crops at different breakpoints, use the picture element with per-source media conditions.",
    ],
    related: [
      "fetchpriority-critical-image-fallbacks",
      "responsive-placeholder-images-cards-banners-grids",
      "prevent-layout-shift-missing-images",
    ],
  },

  {
    title: "AVIF Placeholders and Graceful Format Fallbacks in 2026",
    description:
      "AVIF delivers the smallest placeholder files but lacks universal support. Use the picture element and format-specific fallback URLs to handle every browser gracefully.",
    slug: "avif-placeholder-format-fallback",
    readTime: "8 min read",
    category: "Technical",
    tags: [
      "avif fallback",
      "image formats",
      "placeholder images",
      "webp",
      "picture element",
    ],
    summary: [
      "AVIF encodes images at 50–70% smaller file sizes than JPEG at equivalent quality, which makes it appealing for placeholder images served over constrained connections. Support has improved significantly but is still not universal — Safari 16+ and Chrome 85+ cover most traffic, but older browsers and some WebView environments still require a fallback.",
      "The practical approach is to offer an AVIF placeholder as the preferred source and cascade to WebP and then to a PNG or SVG fallback. fallback.pics supports format suffixes in the URL, so switching formats requires nothing more than changing the file extension in the request path.",
    ],
    sections: [
      {
        eyebrow: "Format landscape",
        title: "Where AVIF support stands and where it breaks",
        body: [
          "As of 2026, AVIF support covers Chrome 85+, Firefox 93+, Safari 16+, and Edge 121+. That accounts for roughly 85–90% of global browser traffic based on caniuse data. The remaining 10–15% includes older Safari versions, some Samsung Internet versions, and WebView-based apps that ship their own rendering engine.",
          "For placeholder images — which are temporary, low-stakes content — missing AVIF support means the user sees a broken image icon rather than a graceful fallback. The fix is a format cascade using the picture element or a server-side Accept header check.",
          "AVIF encoding is also computationally expensive. For a service generating images on demand at the edge, AVIF takes significantly longer to encode than SVG or PNG. fallback.pics handles encoding at the edge for you, but if you self-host a placeholder worker, benchmark encode times before defaulting to AVIF for dynamic content.",
        ],
      },
      {
        eyebrow: "picture element",
        title: "Cascading through AVIF, WebP, and PNG in a single picture block",
        body: [
          "The picture element evaluates source elements in order and uses the first one the browser supports. Place AVIF first, WebP second, and a PNG or SVG img as the final fallback. Browsers that do not support AVIF skip to WebP; those that support neither fall through to the img element.",
          "Each source element needs a type attribute declaring the MIME type: image/avif, image/webp, image/png. Browsers use this attribute — not the file extension — to determine support. Omitting the type attribute means the browser fetches the source to detect its format, defeating the purpose.",
        ],
        code: `<picture>
  <!-- AVIF: smallest file, modern browsers -->
  <source
    type="image/avif"
    srcset="https://fallback.pics/api/v1/800x600.avif/7C3AED/FFFFFF?text=Product"
  />
  <!-- WebP: excellent compression, broad support -->
  <source
    type="image/webp"
    srcset="https://fallback.pics/api/v1/800x600.webp/7C3AED/FFFFFF?text=Product"
  />
  <!-- PNG/SVG: universal fallback -->
  <img
    src="https://fallback.pics/api/v1/800x600/7C3AED/FFFFFF?text=Product"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
    alt="Product placeholder"
  />
</picture>`,
      },
      {
        eyebrow: "File size tradeoffs",
        title: "When AVIF overhead outweighs the file size benefit for placeholders",
        body: [
          "A 400×300 SVG placeholder from fallback.pics is typically under 2KB. The equivalent AVIF might be 800 bytes. The difference is 1.2KB — negligible for a single image, potentially meaningful for a grid of 50. Whether it matters depends on your network conditions and the number of placeholders rendered at once.",
          "SVG placeholders have a different advantage: they are text-based and compressible with Brotli or gzip in the HTTP response. An SVG served with Brotli compression can undercut a comparable AVIF file size for simple solid-color or text placeholders.",
          "For photo-realistic placeholders — blur-up previews or low-quality image previews (LQIPs) — AVIF delivers meaningfully smaller files than SVG or PNG. For solid-color, text-label, or geometric placeholders, SVG is often the most efficient format regardless of browser support.",
        ],
      },
      {
        eyebrow: "Accept header approach",
        title: "Server-side format negotiation as an alternative to picture",
        body: [
          "An alternative to picture element cascades is server-side content negotiation. When the browser sends Accept: image/avif,image/webp,*/* in the request header, the server reads that list and responds with the best format the browser supports.",
          "This approach keeps the HTML clean — you write a single img src URL — and the server handles format selection. fallback.pics uses Accept header negotiation when no format extension is specified in the URL. If you need explicit format control, append .avif, .webp, or .png to the dimension segment.",
        ],
        code: `<!-- Let the server choose the best format (no extension) -->
<img
  src="https://fallback.pics/api/v1/800x600/7C3AED/FFFFFF?text=Product"
  width="800"
  height="600"
  alt="Product"
/>

<!-- Force AVIF explicitly -->
<img
  src="https://fallback.pics/api/v1/800x600.avif/7C3AED/FFFFFF?text=Product"
  width="800"
  height="600"
  alt="Product"
/>`,
      },
      {
        eyebrow: "WebView caveat",
        title: "AVIF in WebView-based hybrid apps and Electron",
        body: [
          "Electron apps ship Chromium but the version depends on when the app was built. An Electron 25 app uses Chromium 114, which supports AVIF. An older Electron 18 app uses Chromium 98, which has partial AVIF support.",
          "React Native WebView, Capacitor, and Cordova apps wrap the platform's system WebView, whose AVIF support depends on the OS version. Android WebView has supported AVIF since Android 12 (API 31). iOS WKWebView relies on the Safari engine, which added AVIF support in iOS 16.",
          "When you cannot control the WebView version, use the picture element cascade or accept-header negotiation and avoid hardcoding .avif URLs in hybrid app code. A PNG fallback ensures the placeholder renders even on the oldest supported device.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Testing format support and choosing the right approach",
        body: [
          "Test your AVIF cascade in a real browser, not just DevTools emulation. Some DevTools device modes emulate screen DPR but not WebView feature support. Use BrowserStack or a physical device for accurate results.",
          "For simple placeholder use cases — solid colors and text labels — defaulting to SVG is the safest, fastest, and most universally supported choice. Reach for AVIF when you need photo-realistic or gradient-rich placeholders where file size genuinely matters.",
        ],
        code: `# API reference and format docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/png-vs-svg-placeholders-production/
https://fallback.pics/blog/webp-fallback-picture-element-placeholders/`,
      },
    ],
    takeaways: [
      "AVIF covers ~85–90% of global browsers in 2026; always provide a WebP or PNG fallback for the remainder.",
      "Use the picture element with type attributes to cascade AVIF → WebP → PNG without extra fetches.",
      "For solid-color and text-label placeholders, SVG often beats AVIF on file size due to Brotli compressibility.",
      "Server-side Accept header negotiation keeps HTML clean; explicit format extensions in the URL give precise control.",
      "Test AVIF fallbacks on real devices, especially in WebView-based hybrid apps where AVIF support varies by OS version.",
    ],
    related: [
      "png-vs-svg-placeholders-production",
      "webp-fallback-picture-element-placeholders",
      "svg-placeholder-images-fast-cacheable-scalable",
    ],
  },

  {
    title: "PNG vs SVG Placeholders: When to Use Each in Production",
    description:
      "SVG placeholders are tiny and infinitely scalable. PNG placeholders work in email, canvas, and raster pipelines. Know which to reach for and when to avoid each.",
    slug: "png-vs-svg-placeholders-production",
    readTime: "9 min read",
    category: "Technical",
    tags: [
      "png vs svg placeholder",
      "svg placeholder",
      "image formats",
      "placeholder images",
      "production images",
    ],
    summary: [
      "SVG and PNG serve different production constraints. SVG is vector, resolution-independent, Brotli-compressible, and safe to inline. PNG is a raster format that works everywhere images can go — HTML, CSS, email, canvas, Open Graph, and PDF pipelines.",
      "Choosing the wrong format creates silent bugs. An SVG placeholder in an email newsletter renders as a broken attachment. A PNG placeholder in a Retina product grid looks blurry at 2x. The choice is determined by the rendering context, not personal preference.",
    ],
    sections: [
      {
        eyebrow: "Format characteristics",
        title: "What SVG and PNG each are good at in image pipelines",
        body: [
          "SVG is an XML-based vector format. For placeholder images consisting of solid fills, text labels, simple shapes, and geometric patterns, SVG files are extremely small — typically 1–4KB uncompressed, under 1KB with Brotli. They render crisp at any DPR without additional assets.",
          "PNG is a lossless raster format. It supports transparency, renders identically everywhere raster images are accepted, and can be processed by imaging pipelines, email clients, PDF generators, and canvas APIs. The tradeoff is file size: a 400×300 PNG placeholder is typically 3–10KB depending on color complexity.",
          "Neither format is universally superior. The rendering context determines the winner. A TypeScript component in a Next.js app can use SVG without issue. An email template, a canvas 2D context, or an OG image processor requires raster.",
        ],
      },
      {
        eyebrow: "SVG advantages",
        title: "Where SVG placeholders outperform PNG",
        body: [
          "Resolution independence is SVG's primary advantage for placeholders. One 400×300 SVG looks sharp on a 1x desktop, a 2x Retina MacBook, and a 3x mobile device. The same 400×300 PNG looks blurry on Retina unless you provide a 2x version.",
          "SVG placeholders can be inlined in HTML or CSS without an HTTP request. This is useful for critical above-the-fold placeholders where you want zero network latency. An SVG data URI in an img src attribute or a CSS background-image is resolved without touching the network.",
          "SVG is also easier to theme. A single URL parameter can change the fill color, text color, and text content without regenerating a raster asset. For products that let users customize placeholder appearance — branded fallbacks, dark mode palettes — SVG is far simpler to parameterize than PNG.",
        ],
        cards: [
          {
            title: "Scalability",
            body: "One SVG URL works at every DPR without serving separate 1x and 2x files.",
          },
          {
            title: "File size",
            body: "Simple solid-color SVG placeholders are under 1KB with Brotli compression.",
          },
          {
            title: "CSS compatibility",
            body: "SVG URLs work as CSS background-image values and can be inlined as data URIs.",
          },
        ],
      },
      {
        eyebrow: "PNG advantages",
        title: "Where PNG placeholders are the only safe choice",
        body: [
          "Email clients are the clearest case for PNG. Gmail, Outlook, Apple Mail, and most email service providers do not render SVG in HTML emails. An SVG img src in an email shows as a broken image or is stripped entirely. Always use PNG (or JPEG) for any image in an HTML email template.",
          "Canvas 2D context also requires raster images. If you draw a placeholder into a canvas element using ctx.drawImage(), passing an SVG may work in Chrome but fails silently in some environments due to security restrictions on SVG rendering in canvas tainting contexts.",
          "Open Graph image crawlers from Facebook, LinkedIn, and Twitter fetch the og:image URL and expect a raster image. SVG support in og:image tags is inconsistent across platforms. For social preview placeholders, always request a JPEG or PNG from the fallback API.",
        ],
      },
      {
        eyebrow: "Format request syntax",
        title: "Requesting PNG vs SVG from fallback.pics",
        body: [
          "fallback.pics returns SVG by default when no format extension is specified. To request a PNG, append .png to the dimension segment. To request a JPEG, append .jpg. The text label, colors, and layout are identical across formats.",
          "Request the format closest to the rendering context's requirements rather than always defaulting to SVG. For HTML img tags in a web app, SVG is fine. For email, og:image, canvas, or PDF use cases, request PNG or JPEG explicitly.",
        ],
        code: `<!-- SVG: default for web components (sharp at any DPR) -->
<img
  src="https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product"
  width="400" height="300" alt="Product"
/>

<!-- PNG: for canvas drawImage, email templates, og:image -->
<img
  src="https://fallback.pics/api/v1/400x300.png/7C3AED/FFFFFF?text=Product"
  width="400" height="300" alt="Product"
/>

<!-- JPEG: for social crawlers, newsletters, smallest raster file -->
<img
  src="https://fallback.pics/api/v1/1200x630.jpg/7C3AED/FFFFFF?text=Blog+Post"
  width="1200" height="630" alt="Blog post thumbnail"
/>`,
      },
      {
        eyebrow: "Dark mode",
        title: "Format choice affects dark mode placeholder strategy",
        body: [
          "SVG placeholders adapt to dark mode via CSS or URL parameters. You can use prefers-color-scheme in CSS to swap the background color, or construct dark-mode-specific URLs with dark background colors.",
          "Raster PNG placeholders bake the colors at generation time. If you want a dark mode PNG placeholder, you need a separate URL with dark colors. This is manageable when placeholders are generated on demand from a URL, but adds complexity to any caching or build pipeline that pre-generates placeholder assets.",
        ],
        code: `/* CSS-driven dark mode for SVG placeholder backgrounds */
.product-image {
  background: #E4E4E7;
}
@media (prefers-color-scheme: dark) {
  .product-image {
    background: #27272A;
  }
}`,
      },
      {
        eyebrow: "Decision guide",
        title: "Choosing the right placeholder format for each context",
        body: [
          "The decision tree is short: if the rendering context is an HTML img tag in a web app, use SVG. If it is an email, canvas, PDF, raster processing pipeline, or social crawler URL, use PNG or JPEG. When in doubt about the rendering context, use PNG — it is universally accepted.",
          "For Open Graph images specifically, JPEG is better than PNG because it produces smaller files for the 1200×630 dimensions that social platforms recommend. A JPEG placeholder at 1200×630 can be under 20KB; the same PNG may be 3–5× larger.",
        ],
        code: `# API docs and format reference
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/avif-placeholder-format-fallback/
https://fallback.pics/blog/svg-placeholder-images-fast-cacheable-scalable/`,
      },
    ],
    takeaways: [
      "Use SVG placeholders for HTML img tags in web apps — they are smaller, sharper at any DPR, and easier to theme.",
      "Use PNG or JPEG placeholders for email, canvas, PDF, raster pipelines, and og:image social crawler URLs.",
      "Append .png or .jpg to the dimension segment in fallback.pics URLs to request raster output.",
      "SVG placeholders can be data-URI inlined to eliminate HTTP requests for critical above-the-fold content.",
      "JPEG is better than PNG for 1200×630 Open Graph placeholders due to significantly smaller file sizes.",
    ],
    related: [
      "avif-placeholder-format-fallback",
      "svg-placeholder-images-fast-cacheable-scalable",
      "jpeg-placeholder-urls-email-social",
    ],
  },

  {
    title: "JPEG Placeholder URLs for Email and Social Crawlers",
    description:
      "Social crawlers and email clients reject SVG images. Use JPEG placeholder URLs to ensure og:image previews and newsletter banners render in every client.",
    slug: "jpeg-placeholder-urls-email-social",
    readTime: "7 min read",
    category: "Technical",
    tags: [
      "jpeg placeholder image",
      "email images",
      "og image",
      "social crawlers",
      "newsletter images",
    ],
    summary: [
      "SVG is the most efficient format for web placeholders, but it is broadly rejected by email clients and inconsistently supported by social preview crawlers. JPEG is the safe format for any image that leaves the browser — og:image tags, newsletter hero banners, and transactional email product photos all need raster.",
      "fallback.pics generates JPEG output from the same URL pattern as SVG, with just a format extension change. Switching an SVG email placeholder to JPEG is a one-character change in the URL, and the cached JPEG is served from the CDN on every subsequent request.",
    ],
    sections: [
      {
        eyebrow: "Why SVG fails in email",
        title: "Email clients strip or ignore SVG images",
        body: [
          "Email HTML is rendered by one of several different rendering engines, including WebKit (Apple Mail), Trident or Word (Outlook on Windows), Blink (Gmail web), and proprietary engines in mobile mail apps. None of these environments reliably render SVG in img tags, and several strip SVG entirely.",
          "Outlook 2016–2021 on Windows uses the Word rendering engine, which does not support SVG at all. Gmail on the web strips SVG img tags from emails for security reasons. Apple Mail renders SVG but scales it to 0×0 in some configurations. The safest rule is: never use SVG in email HTML.",
          "When you use fallback.pics in email templates and forget to add the .jpg extension, the default SVG response renders as a broken image in roughly half of all email clients. The fix is always to specify the format explicitly.",
        ],
      },
      {
        eyebrow: "Social crawlers",
        title: "Facebook, LinkedIn, and Twitter OG image requirements",
        body: [
          "Social platforms crawl og:image URLs when a link is shared. The crawler fetches the image, processes it, and stores a raster copy for the link preview card. Facebook and LinkedIn require JPEG or PNG; they reject SVG og:image URLs entirely.",
          "Twitter (X) accepts some SVG URLs from certain CDNs but processes them inconsistently. For reliable social preview cards, use JPEG at 1200×630 pixels. This size is the recommended Open Graph image size used by all major platforms.",
          "Pinterest, Discord, and Slack also crawl og:image. Discord renders link previews using an internal image proxy that requests and caches a raster copy. SVG URLs in og:image will produce either a broken preview or a distorted render depending on the platform's proxy behavior.",
        ],
      },
      {
        eyebrow: "JPEG format request",
        title: "Requesting JPEG from fallback.pics",
        body: [
          "Append .jpg or .jpeg to the dimension segment to request JPEG output. The generated image uses the same colors, text, and layout as the default SVG, encoded as a standard JPEG. No other URL parameters need to change.",
          "For Open Graph placeholder images specifically, use 1200×630 with a JPEG extension. Keep the background color dark enough to create contrast with the white or light text label. A purple or dark-gray background produces readable og:image previews on all major social platforms.",
        ],
        code: `<!-- SVG (web only — do not use in email or og:image) -->
<img src="https://fallback.pics/api/v1/800x600/7C3AED/FFFFFF?text=Hero" />

<!-- JPEG for og:image meta tag -->
<meta
  property="og:image"
  content="https://fallback.pics/api/v1/1200x630.jpg/7C3AED/FFFFFF?text=Blog+Post"
/>
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />

<!-- JPEG for email newsletter banner -->
<img
  src="https://fallback.pics/api/v1/600x200.jpg/18181B/FFFFFF?text=Monthly+Update"
  width="600"
  height="200"
  alt="Newsletter banner"
  style="display:block; border:0; outline:none;"
/>`,
      },
      {
        eyebrow: "File size",
        title: "JPEG compression settings for placeholder images",
        body: [
          "JPEG compression is lossy. For placeholder images, the quality setting has almost no visible impact because the content is simple: flat colors, geometric shapes, and a short text label. A quality of 70–80 is sufficient and keeps file sizes small.",
          "A 1200×630 JPEG placeholder at quality 75 is typically 18–25KB. The same image as PNG is 60–90KB. For social preview images where file size affects cache fill times and bandwidth for mobile social app users, JPEG is clearly the right choice.",
        ],
      },
      {
        eyebrow: "Email testing",
        title: "Verify JPEG placeholder rendering across email clients",
        body: [
          "Use Litmus or Email on Acid to test placeholder image rendering across client combinations before sending a campaign. These tools render a copy of your email in over 100 client and device combinations and show screenshots of the result.",
          "Pay particular attention to Outlook on Windows (Word rendering engine), Gmail on Android, and dark mode in Apple Mail. Outlook does not respect CSS max-width on images, so always set explicit width attributes. Gmail on Android sometimes clips images wider than the screen; test at 320px and 375px viewport widths.",
          "Keep email placeholder images below 100KB per image. Many email clients and mobile networks cache aggressively, and large images slow down email open time. For transactional emails, 600px wide JPEG placeholders at quality 75 stay well under that threshold.",
        ],
      },
      {
        eyebrow: "OG image testing",
        title: "Validate og:image JPEG placeholders with social debuggers",
        body: [
          "Facebook's Sharing Debugger at developers.facebook.com/tools/debug lets you paste a URL and see exactly how the crawler fetches and renders your og:image. Use it after deploying placeholder URLs to confirm the JPEG is being picked up correctly.",
          "LinkedIn's Post Inspector at linkedin.com/post-inspector, Twitter's Card Validator (now X), and OpenGraph.xyz all provide similar validation. Run each one when you first set up a JPEG placeholder workflow to verify the format, dimensions, and cache headers are correct.",
        ],
        code: `# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/
https://fallback.pics/blog/png-vs-svg-placeholders-production/`,
      },
    ],
    takeaways: [
      "Never use SVG in email HTML — use JPEG or PNG for all newsletter and transactional email images.",
      "Facebook, LinkedIn, and Pinterest require raster og:image; use JPEG at 1200×630 for social preview placeholders.",
      "Append .jpg to the dimension segment in fallback.pics URLs to request JPEG output — no other changes needed.",
      "JPEG at quality 75 produces 18–25KB for a 1200×630 placeholder; PNG at the same size is 3–5× larger.",
      "Validate og:image JPEG placeholders using Facebook's Sharing Debugger and LinkedIn Post Inspector before launch.",
    ],
    related: [
      "og-image-placeholders-blogs-docs-social-sharing",
      "png-vs-svg-placeholders-production",
      "avif-placeholder-format-fallback",
    ],
  },

  {
    title: "Immutable Cache-Control for Generated Placeholder Images",
    description:
      "Generated placeholder images with stable URLs can carry immutable Cache-Control headers, eliminating revalidation round-trips and cutting CDN bandwidth costs.",
    slug: "immutable-urls-cdn-placeholder-caching",
    readTime: "8 min read",
    category: "Technical",
    tags: [
      "immutable cache-control images",
      "CDN caching",
      "placeholder images",
      "Cache-Control",
      "web performance",
    ],
    summary: [
      "Cache-Control: public, max-age=31536000, immutable tells browsers and CDNs to cache a resource for one year and never revalidate it — no conditional GET, no ETag check, no If-Modified-Since round-trip. For generated placeholder images whose output is fully determined by their URL, this header is appropriate and performant.",
      "The immutable directive was designed for content-addressed assets that will never change at a given URL. Deterministic placeholder images qualify: the same URL always produces the same pixels. Applying immutable cache headers to placeholder URLs collapses repeated fetches into zero-latency memory or disk cache hits.",
    ],
    sections: [
      {
        eyebrow: "Cache-Control basics",
        title: "max-age, immutable, and must-revalidate — what each directive does",
        body: [
          "max-age=N tells the browser and shared caches to treat the response as fresh for N seconds. After N seconds, the resource is stale and requires revalidation — a conditional GET with If-None-Match or If-Modified-Since. The server responds with 304 Not Modified if the resource has not changed, or with a new 200 response if it has.",
          "immutable is an extension directive that tells the browser the resource will never change before max-age expires. With immutable, the browser skips the revalidation request entirely. This eliminates one round-trip per stale resource per page load — meaningful on pages with many placeholder images.",
          "must-revalidate is the opposite: it forces the browser to check with the server before using a stale resource, even if offline or in an HTTP/2 push scenario. For placeholder images that never change, must-revalidate is the wrong directive. Do not combine it with immutable.",
        ],
      },
      {
        eyebrow: "Immutable suitability",
        title: "Deterministic placeholder URLs qualify for immutable caching",
        body: [
          "The contract for immutable is strict: you must never change the content at a given URL. If you do, browsers that have cached the old response will never fetch the update during the max-age window. For content-addressed assets where the URL encodes the content — like code bundles with a hash — this is safe.",
          "Placeholder images from fallback.pics are deterministic: the URL fully describes the output. A request to /api/v1/400x300/7C3AED/FFFFFF?text=Product always produces the same SVG or raster image. The URL is its own cache key. Applying immutable cache headers to these URLs is safe by design.",
          "This is different from user-generated or database-backed images where the content at a URL can be updated. Those images should use versioned URLs or short max-age values, not immutable.",
        ],
      },
      {
        eyebrow: "CDN behavior",
        title: "How CDN edge nodes handle immutable cache headers",
        body: [
          "CDNs like Cloudflare, Fastly, and CloudFront respect Cache-Control headers by default. When a response carries public, max-age=31536000, immutable and the CDN has not yet cached it, the CDN fetches from the origin once and stores the response. Subsequent requests for the same URL are served from the CDN edge, with zero origin fetches for one year.",
          "Cloudflare adds its own CDN-Cache-Control layer. If you want the CDN to cache the image even longer than the browser's max-age, add CDN-Cache-Control: max-age=31536000 separately. Cloudflare evaluates both headers and uses the most specific one that applies to the CDN edge.",
          "Some CDNs strip or ignore Cache-Control headers unless explicitly configured to respect them. Check your CDN's documentation for Edge Cache TTL settings. Cloudflare's default caching rules override Cache-Control for some status codes; verify that 200 responses with your Content-Type are cached according to the response headers.",
        ],
      },
      {
        eyebrow: "Browser cache tiers",
        title: "Memory cache, disk cache, and the back/forward cache",
        body: [
          "Browsers maintain multiple cache tiers. Memory cache holds recently fetched resources for the current session; disk cache persists across sessions up to the max-age limit. Immutable resources that fit in memory cache are served with zero network activity — the browser does not even touch the disk.",
          "The back/forward cache (bfcache) in modern browsers preserves a snapshot of rendered pages so navigation feels instant. Immutable cached images remain valid in bfcache because there is no revalidation needed. Pages heavy with placeholder images benefit from this because no image re-fetching occurs on back-navigation.",
        ],
      },
      {
        eyebrow: "Cache busting",
        title: "Invalidating immutable placeholders when content must change",
        body: [
          "Immutable cache headers commit you to never changing the response at a given URL. The only way to serve updated content is to use a new URL. For placeholder images, this is rarely necessary — the point is that they are stable by design.",
          "If you do need to change a placeholder — switching a brand color or updating a text label — change the URL parameters. The new URL is a new cache key, and browsers and CDNs treat it as an uncached resource. The old URL remains cached for up to a year in clients that have seen it, which is usually fine for placeholder content.",
        ],
        code: `<!-- Old URL stays cached, new URL is fresh -->
<!-- Old: purple background -->
<img src="https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product" />

<!-- New: updated brand blue background -->
<img src="https://fallback.pics/api/v1/400x300/3B82F6/FFFFFF?text=Product" />`,
      },
      {
        eyebrow: "Measuring impact",
        title: "Quantifying the revalidation round-trip savings",
        body: [
          "Open DevTools Network panel and filter by Img. Reload the page with a cold cache (Ctrl+Shift+R) and note all image fetch times. Then reload normally and compare. Without immutable, stale images trigger conditional GETs — you see 304 responses with latency equal to the round-trip time to the origin or CDN edge.",
          "With immutable Cache-Control headers, those 304 responses disappear. The browser reads the resources from disk or memory cache with 0ms latency. On a page with 30 placeholder images and a 60ms round-trip to the server, the difference is 1.8 seconds of eliminated round-trips per page load.",
        ],
        code: `# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/cache-control-placeholder-images-cdn-browser/
https://fallback.pics/blog/cloudflare-cdn-cache-generated-images/`,
      },
    ],
    takeaways: [
      "Use Cache-Control: public, max-age=31536000, immutable for generated placeholder images whose URLs encode the content.",
      "The immutable directive eliminates revalidation round-trips, saving latency proportional to the number of placeholders on the page.",
      "Never change the response at an immutable URL — change the URL instead when content needs to update.",
      "CDN edge caching requires both browser Cache-Control headers and correct CDN configuration to work end-to-end.",
      "Measure revalidation savings in DevTools Network panel by comparing cold and warm cache load times.",
    ],
    related: [
      "cache-control-placeholder-images-cdn-browser",
      "cloudflare-cdn-cache-generated-images",
      "self-hosted-placeholder-image-api-cloudflare-workers",
    ],
  },

  {
    title: "Cloudflare CDN Caching for URL-Generated Placeholder Images",
    description:
      "Configure Cloudflare cache rules to serve generated placeholder images from edge locations, cutting origin latency to near zero for global users.",
    slug: "cloudflare-cdn-cache-generated-images",
    readTime: "9 min read",
    category: "Technical",
    tags: [
      "cloudflare cache images",
      "CDN cache",
      "placeholder images",
      "Cloudflare Workers",
      "edge caching",
    ],
    summary: [
      "Cloudflare's CDN has over 300 edge locations globally. When a generated placeholder image is cached at the edge closest to the user, the response latency drops from 200–400ms (origin round-trip) to 5–20ms (edge cache hit). For a placeholder service where speed matters as much as content, this is a meaningful difference.",
      "Getting Cloudflare to cache generated images correctly requires understanding the Cache-Control header hierarchy, Cloudflare's default behaviors, and how Workers fit into the cache lifecycle. A Cloudflare Worker generating placeholder images needs to emit the right response headers to be cached automatically and for the right duration.",
    ],
    sections: [
      {
        eyebrow: "Cloudflare caching model",
        title: "How Cloudflare decides what to cache and for how long",
        body: [
          "Cloudflare evaluates several signals to decide if a response should be cached at the edge. The response must come from an origin (or Worker) that is proxied through Cloudflare. The status code must be cacheable (200, 301, 302, 404 with proper headers, and others). The response must not set cookies, and the Cache-Control header must allow public caching.",
          "By default, Cloudflare caches based on the file extension in the URL. SVG, PNG, JPEG, WebP, and AVIF are cached by default based on their extension. URLs without a file extension — like /api/v1/400x300 — may not be cached unless you configure a Cache Rule to cache them explicitly.",
          "Cloudflare's Edge Cache TTL setting overrides the browser's max-age for how long the CDN edge retains the cached asset. Setting Edge Cache TTL to one year for placeholder image paths means Cloudflare serves the image from cache for up to a year after the first fetch, regardless of what the origin returns next time.",
        ],
      },
      {
        eyebrow: "Cache Rules",
        title: "Configuring Cloudflare Cache Rules for placeholder image paths",
        body: [
          "Cloudflare Cache Rules (available on all plans) let you define URL patterns and override cache behavior for matching requests. For a placeholder API serving images at /api/v1/*, create a Cache Rule matching that path prefix and set Cache Status to Cache Everything, with a long Edge Cache TTL.",
          "Cache Rules are evaluated in order. Put the most specific rules first. A rule matching /api/v1/* should appear before any catch-all rules. If you have a rule bypassing cache for /api/* for other API routes, the placeholder-specific rule needs to be higher in the list.",
        ],
        code: `# Cloudflare Cache Rule (configured in Dashboard or via API)
# Match: URI Path starts with /api/v1/
# Setting: Cache Everything
# Edge Cache TTL: 1 year (31536000 seconds)
# Browser Cache TTL: Respect Existing Headers

# Resulting headers for a cached placeholder:
Cache-Control: public, max-age=31536000, immutable
CF-Cache-Status: HIT
Age: 86400  # seconds since edge cached this response`,
      },
      {
        eyebrow: "Workers caching",
        title: "Emitting correct headers from a Cloudflare Worker",
        body: [
          "When the placeholder image is generated by a Cloudflare Worker, the Worker controls the response headers. Set Cache-Control: public, max-age=31536000, immutable in the Worker response. Cloudflare reads this header and stores the response in its edge cache for up to a year.",
          "Workers also have access to the Cache API, which lets you programmatically store and retrieve responses from the Cloudflare cache. Using cache.put() inside a Worker lets you cache responses for paths that don't match the default extension-based caching rules.",
          "The key difference between relying on Cache-Control headers versus the Cache API is control. Cache-Control passively instructs Cloudflare; the Cache API actively stores the response in the first request and retrieves it on subsequent ones. Use the Cache API when you need predictable caching behavior regardless of path structure.",
        ],
        code: `// Cloudflare Worker: cache generated placeholder via Cache API
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    const svg = generatePlaceholderSVG(request.url);
    const response = new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'max-age=31536000',
        Vary: 'Accept',
      },
    });

    // Store in Cloudflare edge cache
    event.waitUntil(cache.put(request, response.clone()));
    return response;
  },
};`,
      },
      {
        eyebrow: "Cache headers",
        title: "CDN-Cache-Control vs Cache-Control for edge vs browser TTL",
        body: [
          "Cloudflare reads both Cache-Control and CDN-Cache-Control. CDN-Cache-Control is a Cloudflare-specific header that sets edge cache TTL independently of browser TTL. If you want the CDN edge to cache for a year but only the browser to cache for a day, set Cache-Control: public, max-age=86400 and CDN-Cache-Control: max-age=31536000.",
          "For placeholder images, you typically want both the browser and CDN to cache aggressively. Set Cache-Control: public, max-age=31536000, immutable and omit CDN-Cache-Control unless you need different TTLs. The immutable directive applies only to browser caches; Cloudflare ignores it for its own TTL calculations.",
        ],
      },
      {
        eyebrow: "Cache validation",
        title: "Verifying cache hits with CF-Cache-Status",
        body: [
          "Every response through Cloudflare's proxy includes a CF-Cache-Status response header. Possible values include HIT (served from edge cache), MISS (fetched from origin), EXPIRED (stale, refetched), BYPASS (cache bypassed), and REVALIDATED.",
          "After deploying your cache configuration, fetch a placeholder URL twice. The first request should return CF-Cache-Status: MISS. The second should return HIT. If you see BYPASS repeatedly, check that the path matches your Cache Rule and that the response does not include Set-Cookie headers, which disable caching.",
          "Use curl to inspect headers without browser interference: curl -I 'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Test'. The CF-Cache-Status and Age headers tell you exactly what Cloudflare did with the request.",
        ],
        code: `# Verify cache status with curl
curl -I 'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Test'

# Expected headers for a cached response:
# CF-Cache-Status: HIT
# Age: 3600
# Cache-Control: public, max-age=31536000, immutable
# Content-Type: image/svg+xml

# API and docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/immutable-urls-cdn-placeholder-caching/
https://fallback.pics/blog/self-hosted-placeholder-image-api-cloudflare-workers/`,
      },
      {
        eyebrow: "Global latency",
        title: "Measuring edge cache latency improvement across regions",
        body: [
          "Run a latency test against a placeholder URL from multiple geographic locations using a tool like Pingdom or WebPageTest multi-location. On the first request (MISS), latency reflects the round-trip to the origin — typically 50–400ms depending on origin location and tester region.",
          "After the CDN warms up (MISS on first request, HIT on subsequent requests), latency drops to 5–30ms from any tested region. Cloudflare's nearest edge is rarely more than 20ms from any location with decent internet connectivity.",
        ],
      },
    ],
    takeaways: [
      "Cloudflare does not cache extensionless API paths by default — create a Cache Rule for /api/v1/* matching Cache Everything.",
      "Emit Cache-Control: public, max-age=31536000, immutable from your Worker or origin to instruct edge caching.",
      "Use the Cache API in Cloudflare Workers for deterministic, programmatic cache control independent of path patterns.",
      "CDN-Cache-Control sets the Cloudflare edge TTL independently from the browser max-age.",
      "Verify caching is working with CF-Cache-Status: HIT and Age headers using curl before going to production.",
    ],
    related: [
      "immutable-urls-cdn-placeholder-caching",
      "self-hosted-placeholder-image-api-cloudflare-workers",
      "cache-control-placeholder-images-cdn-browser",
    ],
  },

  {
    title: "Vercel Image Optimization vs External Placeholder APIs",
    description:
      "Vercel's built-in image optimization transforms real media at the edge. External placeholder APIs handle missing or blank images. Here is how to use both together.",
    slug: "vercel-image-optimization-vs-placeholders",
    readTime: "9 min read",
    category: "Comparisons",
    tags: [
      "vercel image optimization",
      "placeholder images",
      "Next.js images",
      "image fallbacks",
      "Vercel CDN",
    ],
    summary: [
      "Vercel Image Optimization — exposed through Next.js's next/image component — resizes, compresses, and converts real image assets to WebP and AVIF at the edge. It is excellent at what it does, but it requires a real image to optimize. When an image is missing, the URL is null, or the asset returns a 404, next/image shows a broken image.",
      "External placeholder APIs fill the gap that Vercel Image Optimization does not cover: generating a visible, correctly sized image from nothing but a URL. The practical setup is to use next/image for real assets and fall back to a placeholder URL when the image source is absent or broken.",
    ],
    sections: [
      {
        eyebrow: "What Vercel handles",
        title: "Vercel Image Optimization pipeline: resize, convert, cache",
        body: [
          "When you use next/image with a src pointing to a real image, Vercel processes the original asset the first time a specific size is requested. It resizes the image to the requested width, converts it to WebP or AVIF based on the browser's Accept header, applies quality compression, and caches the result at the edge.",
          "Subsequent requests for the same URL and width combination are served from cache with near-zero latency. The original heavy JPEG upload from your CMS becomes a compact WebP served from a CDN edge within 20ms. This pipeline is designed for real image assets — photos, user uploads, product photography.",
          "Vercel Image Optimization has limits: a free plan allows 1,000 images per month. Exceeding this triggers 429 errors or charges depending on your plan. For a product catalog with 10,000 SKUs, optimizing every product image through Vercel's pipeline on the first request can exhaust the free tier quickly.",
        ],
      },
      {
        eyebrow: "The gap",
        title: "What next/image does not handle: missing and null sources",
        body: [
          "next/image requires a non-empty src prop. If your data layer returns null for an image field, you cannot pass null to next/image's src without a runtime error. You must either guard the component with a conditional render or provide an alternative src value.",
          "When next/image receives a 404 from its src URL, it renders a broken image icon — the same as a raw img tag. The optimization pipeline does not generate a fallback or return a placeholder. Error handling is the application's responsibility.",
          "This is the exact use case for external placeholder APIs. Use a placeholder URL as the fallback src when the image field is null or empty. When the optimized image source fails to load, use an onerror handler to swap the src to a placeholder URL.",
        ],
      },
      {
        eyebrow: "Integration pattern",
        title: "Using next/image with a fallback.pics placeholder src",
        body: [
          "The cleanest Next.js pattern is a thin wrapper component around next/image that handles null src and load errors. The wrapper receives the optional image src and a fallback URL, uses the fallback when the src is absent, and swaps to the fallback on error.",
          "Pass the placeholder URL through next/image's src prop rather than bypassing next/image with a raw img tag. This keeps the optimization pipeline active for real images while falling back to the placeholder URL for missing ones.",
        ],
        code: `import NextImage from 'next/image';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function OptimizedImage({ src, alt, width, height, className }: OptimizedImageProps) {
  const fallback = \`https://fallback.pics/api/v1/\${width}x\${height}/7C3AED/FFFFFF?text=Image\`;
  const [imgSrc, setImgSrc] = React.useState(src || fallback);

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallback)}
      unoptimized={!src} // skip Vercel optimization for placeholder URLs
    />
  );
}`,
      },
      {
        eyebrow: "unoptimized prop",
        title: "Skip Vercel optimization for external placeholder URLs",
        body: [
          "next/image with an external src URL requires that domain to be listed in next.config.js under images.remotePatterns. If you add fallback.pics as an allowed domain, Vercel will attempt to optimize placeholder URLs through its pipeline — adding latency and consuming optimization quota for content that does not need optimization.",
          "Use the unoptimized prop on next/image when the src is a placeholder URL. This tells Vercel not to route the request through the image optimization service and instead serve it as a direct passthrough. You avoid quota usage and the optimization overhead for simple placeholder images.",
          "A practical approach is to check whether the src is a placeholder domain and set unoptimized accordingly, or to always pass unoptimized when the component renders a fallback state.",
        ],
      },
      {
        eyebrow: "Performance comparison",
        title: "Latency: Vercel-optimized image vs direct placeholder URL",
        body: [
          "Vercel-optimized images are served from Vercel's edge CDN after the first optimization pass. Once cached, they are as fast as any CDN-served image — 10–30ms from nearby edges. The first request for a new size combination hits the origin, which can take 200–800ms for large images.",
          "fallback.pics placeholder images are generated at a Cloudflare Worker edge node and cached with immutable headers. The first request for a placeholder URL takes 10–50ms (Worker compute). Cached requests return in 5–15ms. For placeholder use cases, the latency is comparable to Vercel's cached response.",
          "The meaningful performance difference is in the optimization pipeline for real images. Vercel converts a 5MB JPEG upload to an 80KB WebP. A placeholder API has no equivalent input — it generates content from parameters. These are complementary tools for different problems.",
        ],
      },
      {
        eyebrow: "Cost considerations",
        title: "Vercel image quota vs placeholder API cost model",
        body: [
          "Vercel's free plan includes 1,000 optimized image units per month. Pro includes 5,000. Each unique image+size combination counts as one unit. For an ecommerce catalog with 5,000 products and three size breakpoints, that's 15,000 optimizations — already over the Pro plan's included quota.",
          "fallback.pics placeholder images are not counted against Vercel's image optimization quota when served with unoptimized=true or as external URLs. The cost model for the placeholder API is separate and independent of Vercel's billing.",
        ],
        code: `# Vercel next.config.js: allow fallback.pics as external image domain
# module.exports = {
#   images: {
#     remotePatterns: [
#       { protocol: 'https', hostname: 'fallback.pics' }
#     ]
#   }
# }

# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/nextjs-image-fallbacks-without-layout-shift/
https://fallback.pics/blog/netlify-image-cdn-fallbacks/`,
      },
    ],
    takeaways: [
      "Vercel Image Optimization handles real asset compression and format conversion; it does not generate placeholders for missing sources.",
      "Use next/image with unoptimized=true when the src is a placeholder URL to avoid wasting Vercel optimization quota.",
      "Build a thin wrapper component that accepts an optional src and falls back to a placeholder URL when the image is null or fails to load.",
      "Both systems use CDN edge caching — performance is comparable once both are warmed up.",
      "Vercel and external placeholder APIs are complementary tools: optimization for real assets, generation for missing ones.",
    ],
    related: [
      "nextjs-image-fallbacks-without-layout-shift",
      "netlify-image-cdn-fallbacks",
      "immutable-urls-cdn-placeholder-caching",
    ],
  },

  {
    title: "Netlify Image CDN and Fallback URL Patterns for Developers",
    description:
      "Netlify Image CDN optimizes images at the edge but won't generate placeholders for missing media. Use fallback.pics URLs to fill both gaps on Netlify-hosted apps.",
    slug: "netlify-image-cdn-fallbacks",
    readTime: "7 min read",
    category: "Technical",
    tags: [
      "netlify image cdn",
      "placeholder images",
      "image fallbacks",
      "Netlify",
      "edge images",
    ],
    summary: [
      "Netlify Image CDN launched in 2023 and provides on-demand image resizing and format conversion for images stored in Netlify's blob storage or linked via remote URLs. Like Vercel's offering, it handles optimization of real assets well but has no mechanism for generating placeholders when an image source is missing.",
      "The patterns for combining Netlify Image CDN with external fallback URLs are similar to Next.js but framework-agnostic. Any framework deployed to Netlify — Astro, SvelteKit, Nuxt, Remix — can use Netlify Image CDN for real assets and fallback.pics URLs for missing or errored images.",
    ],
    sections: [
      {
        eyebrow: "Netlify Image CDN overview",
        title: "What Netlify Image CDN does and how to use it",
        body: [
          "Netlify Image CDN is available through the /.netlify/images?url= transformation URL or through framework-specific integrations. You pass a source image URL or a Netlify blob path, along with width, height, format, and quality parameters. Netlify fetches and transforms the image on the first request and caches the result at the edge.",
          "Format conversion works the same way as Vercel's: based on the browser's Accept header, Netlify serves WebP or AVIF when supported. The original image can be any publicly reachable URL or a blob stored in Netlify's object storage.",
          "The transformation URL pattern is: /.netlify/images?url=ORIGINAL_URL&w=WIDTH&h=HEIGHT&fit=cover. The url parameter must be URL-encoded. Width and height control the dimensions. fit controls how the image is cropped.",
        ],
        code: `<!-- Netlify Image CDN transformation URL -->
<img
  src="/.netlify/images?url=%2Fimages%2Fproduct.jpg&w=400&h=300&fit=cover"
  width="400"
  height="300"
  loading="lazy"
  alt="Product image"
/>

<!-- With JavaScript encoding for dynamic URLs -->
<img
  src={\`/.netlify/images?url=\${encodeURIComponent(imageUrl)}&w=400&h=300&fit=cover\`}
  width="400"
  height="300"
  loading="lazy"
  alt="Product image"
  onError={(e) => {
    e.currentTarget.src =
      'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product';
  }}
/>`,
      },
      {
        eyebrow: "Missing source handling",
        title: "What happens when the Netlify CDN source URL returns a 404",
        body: [
          "When the source image URL passed to Netlify Image CDN returns a 404 or an error, Netlify Image CDN itself returns an error response. The browser renders a broken image. There is no automatic fallback to a placeholder.",
          "This means error handling must happen at the application layer, not the CDN layer. An onerror handler on the img element can catch the broken image and replace the src with a fallback.pics URL. For server-rendered frameworks, you can check image existence at render time and use a placeholder URL from the start.",
        ],
      },
      {
        eyebrow: "Astro integration",
        title: "Astro Image component with fallback.pics on Netlify",
        body: [
          "Astro's Image component with the @astrojs/netlify adapter automatically routes images through Netlify Image CDN. If the src is a local asset, Astro optimizes it at build time. If the src is a remote URL, the first request at runtime triggers the transformation.",
          "For optional image fields in Astro content collections, use a conditional in the component: if the image field is defined, use the Astro Image component; if it is undefined or null, render a raw img tag with a fallback.pics URL. This keeps Astro's optimization active for real assets.",
        ],
        code: `---
// Astro component: optimized image with fallback
import { Image } from 'astro:assets';

interface Props {
  src?: string;
  alt: string;
  width: number;
  height: number;
}
const { src, alt, width, height } = Astro.props;
const fallbackSrc = \`https://fallback.pics/api/v1/\${width}x\${height}/7C3AED/FFFFFF?text=Image\`;
---

{src ? (
  <Image src={src} alt={alt} width={width} height={height} />
) : (
  <img src={fallbackSrc} alt={alt} width={width} height={height} loading="lazy" />
)}`,
      },
      {
        eyebrow: "SvelteKit and Nuxt",
        title: "Using fallback URLs in SvelteKit and Nuxt on Netlify",
        body: [
          "SvelteKit does not have a built-in image optimization component. When deployed to Netlify, you can construct Netlify Image CDN transformation URLs manually. Pair those with an onerror handler pointing to a fallback.pics URL for missing sources.",
          "Nuxt Image supports Netlify Image CDN as a provider via the @nuxt/image-edge package. Configure the provider in nuxt.config.ts, then use the NuxtImg component. For missing images, pass a fallback URL through the component's error-handling props or use a wrapper pattern similar to the Next.js example above.",
        ],
        code: `<!-- SvelteKit: Netlify Image CDN with fallback placeholder -->
<script lang="ts">
  let src: string = \`/.netlify/images?url=\${encodeURIComponent(imageSrc)}&w=400&h=300\`;
  const fallback = 'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product';
  function onError() { src = fallback; }
</script>

<img {src} {alt} width="400" height="300" on:error={onError} loading="lazy" />`,
      },
      {
        eyebrow: "Cache headers",
        title: "Netlify CDN cache behavior for transformed and fallback images",
        body: [
          "Netlify Image CDN sets its own Cache-Control headers on transformed images. The default TTL is one year for transformed assets, which is appropriate. You do not need to configure headers for Netlify-transformed images.",
          "For fallback.pics URLs requested directly by the browser (not through Netlify Image CDN), the CDN cache headers from fallback.pics apply. These are served with immutable Cache-Control headers, so browsers and any CDN in front will cache them for up to a year.",
        ],
        code: `# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/vercel-image-optimization-vs-placeholders/
https://fallback.pics/blog/cache-control-placeholder-images-cdn-browser/`,
      },
    ],
    takeaways: [
      "Netlify Image CDN optimizes real assets; it does not generate fallbacks for missing or null sources.",
      "Use onerror handlers to swap broken Netlify CDN URLs to fallback.pics placeholder URLs at runtime.",
      "In Astro with the Netlify adapter, conditionally render the Image component for real sources and a raw img for fallback URLs.",
      "SvelteKit requires manual Netlify CDN URL construction; pair it with a reactive src swap on error.",
      "fallback.pics URLs are cached with immutable headers and work as browser-direct resources without routing through Netlify CDN.",
    ],
    related: [
      "vercel-image-optimization-vs-placeholders",
      "cache-control-placeholder-images-cdn-browser",
      "astro-image-fallback-patterns",
    ],
  },

  {
    title: "BlurHash vs Generated Placeholder URLs: Production Trade-offs",
    description:
      "BlurHash produces beautiful blur previews but needs server support and a decoder. Generated placeholder URLs need nothing. Compare the trade-offs for real projects.",
    slug: "blurhash-vs-generated-placeholders",
    readTime: "10 min read",
    category: "Comparisons",
    tags: [
      "blurhash placeholder",
      "placeholder images",
      "loading states",
      "LQIP",
      "image performance",
    ],
    summary: [
      "BlurHash is an algorithm that encodes the visual essence of an image into a short string — typically 30–50 characters. A client-side decoder renders that string as a blurred preview while the real image loads. The result looks polished and context-aware: a photo of a forest produces a green blur, a portrait produces a skin-tone blur.",
      "Generated placeholder URLs take the opposite approach: no analysis of the original image, no decoder, no server-side pipeline changes. The URL fully describes a visually neutral placeholder — dimensions, colors, and an optional text label. Both solve the same user-facing problem, but the implementation costs and failure modes are entirely different.",
    ],
    sections: [
      {
        eyebrow: "How BlurHash works",
        title: "BlurHash encoding and decoding pipeline",
        body: [
          "BlurHash is generated server-side when an image is uploaded or processed. A library analyzes the image pixels and produces a compact string representation of the dominant colors and rough structure. This hash is stored alongside the image record in your database.",
          "On the client, a BlurHash decoder (available in JavaScript, Swift, Kotlin, and other languages) renders the hash into a small canvas element — typically 32×32 pixels — which is then CSS-scaled up to fill the image placeholder. The canvas render takes 1–5ms in JavaScript, which is negligible on modern devices.",
          "The critical dependency is the pipeline: every image that needs a BlurHash must be processed to generate the hash. New uploads need hash generation. Legacy image libraries without hashes show a broken placeholder or fall through to a generic fallback. Maintaining this pipeline at scale requires integration work.",
        ],
      },
      {
        eyebrow: "How generated URLs work",
        title: "URL-based placeholder generation with no server pipeline",
        body: [
          "A generated placeholder URL encodes all the parameters needed to produce a placeholder: dimensions, background color, text color, and optional label. The placeholder API generates the image on demand from these parameters — no analysis of the original content, no stored hash.",
          "There is no setup for individual images. You can use the same placeholder URL pattern for every image slot in your application without any per-image processing. A new feature, a legacy library section, a third-party integration — all get consistent placeholders immediately.",
        ],
        code: `<!-- BlurHash-based placeholder (requires canvas decoder JS) -->
<canvas
  id="blurhash-canvas"
  width="32"
  height="32"
  style="width: 400px; height: 300px;"
></canvas>
<script>
  decode("LKO2?U%2Tw=w]~RBVZRi};RPxuwH", 32, 32, 1);
</script>

<!-- Generated placeholder URL (no JS, no pipeline) -->
<img
  src="https://fallback.pics/api/v1/400x300/E4E4E7/71717A?text=Loading"
  width="400"
  height="300"
  loading="lazy"
  alt="Loading"
/>`,
      },
      {
        eyebrow: "Visual quality",
        title: "BlurHash looks better; generated placeholders are more neutral",
        body: [
          "BlurHash produces a visually representative preview. A landscape photo of mountains produces a blue-gray-green blur that fades naturally into the actual image when it loads. This reduces the perceived jump from placeholder to content, making transitions feel smoother.",
          "Generated color placeholders are intentionally neutral — a branded solid color with a text label. They do not attempt to represent the content. The advantage is consistency: every placeholder looks deliberate and on-brand rather than showing a blurry approximation of content the user has not seen yet.",
          "For content where the blur preview creates meaningful expectations — travel photos, product lifestyle shots, editorial images — BlurHash's visual quality is worth the pipeline investment. For product catalog tiles, avatars, and functional UI elements, a neutral branded placeholder is often more appropriate.",
        ],
      },
      {
        eyebrow: "Implementation cost",
        title: "Pipeline complexity and failure modes of each approach",
        body: [
          "BlurHash requires: a server-side image processing step on every upload, hash storage in your database schema, a client-side decoder library (~5KB gzipped), and a canvas element per image placeholder. Each of these is a point where the system can fail: a missing hash, a processing queue backlog, a JavaScript bundle that fails to load.",
          "Generated placeholder URLs require: a string template in your component. The server is always available to generate the image on demand. There is no client-side JavaScript required — the img element fetches the placeholder like any other image resource.",
          "The failure mode for BlurHash with a missing hash is a blank space or a secondary fallback. The failure mode for a generated placeholder URL is a broken image only if the placeholder service is down — which, for a CDN-cached service, should be extremely rare.",
        ],
        cards: [
          {
            title: "BlurHash pipeline cost",
            body: "Requires per-image server processing, hash storage in the database, and a client-side canvas decoder.",
          },
          {
            title: "Generated URL cost",
            body: "Requires a URL template in the component. No per-image processing, no database column, no client JS.",
          },
          {
            title: "When BlurHash is worth it",
            body: "Photo-heavy apps where smooth transitions from blur to real image meaningfully improve perceived quality.",
          },
        ],
      },
      {
        eyebrow: "Hybrid approach",
        title: "Using generated placeholders as BlurHash fallback",
        body: [
          "The two approaches can coexist. Show a generated placeholder URL for images without a BlurHash (new uploads in the processing queue, legacy library, third-party content) and show the BlurHash canvas for images that have one. This gives you graceful degradation without losing BlurHash quality where it is available.",
          "The generated placeholder URL acts as the base fallback layer. BlurHash is an enhancement applied on top when the hash is present. This is a safe progressive enhancement pattern: the placeholder works without any JavaScript, and BlurHash enriches it when the data and decoder are available.",
        ],
        code: `// Hybrid: BlurHash when available, generated URL when not
function ProductImage({ src, blurhash, width, height, alt }) {
  const fallbackUrl =
    \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/71717A?text=Loading\`;

  if (!src) return <img src={fallbackUrl} width={width} height={height} alt={alt} />;

  return (
    <div style={{ position: 'relative', width, height }}>
      {blurhash && (
        <BlurHashCanvas
          hash={blurhash}
          width={32}
          height={32}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      )}
      {!blurhash && (
        <img
          src={fallbackUrl}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          alt=""
        />
      )}
      <img src={src} width={width} height={height} alt={alt}
        onError={(e) => { e.currentTarget.src = fallbackUrl; }}
        style={{ position: 'relative', zIndex: 1 }}
      />
    </div>
  );
}`,
      },
      {
        eyebrow: "Decision guide",
        title: "Choosing BlurHash, generated placeholders, or both",
        body: [
          "Choose BlurHash when: visual transition quality is a core product differentiator, you control the image upload pipeline, your team can maintain the encoding and storage infrastructure, and images are predominantly real photography where color extraction is meaningful.",
          "Choose generated placeholder URLs when: speed of implementation matters, not all images come from a controlled pipeline, you need coverage for third-party or unknown content, or you want a simple maintenance-free solution. Generated URLs are also the right choice for UI elements — avatars, icon slots, small thumbnails — where blur previews add noise rather than value.",
        ],
        code: `# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/skeleton-loaders-image-grids/
https://fallback.pics/blog/lqip-blur-up-placeholders-layout-shift/`,
      },
    ],
    takeaways: [
      "BlurHash produces visually representative blur previews but requires per-image server processing, hash storage, and a client JS decoder.",
      "Generated placeholder URLs need no pipeline, no storage, and no client JavaScript — the img element fetches the placeholder like any other image.",
      "BlurHash is worth the cost for photo-heavy apps where smooth blur-to-real transitions are a product quality differentiator.",
      "Generated placeholders are the better default for catalogs, avatars, and UI elements where neutral, branded placeholders are more appropriate.",
      "Use generated placeholder URLs as the fallback layer when BlurHash hashes are missing — they coexist cleanly as a progressive enhancement.",
    ],
    related: [
      "skeleton-loaders-image-grids",
      "lqip-blur-up-placeholders-layout-shift",
      "skeleton-placeholder-images-vs-static-fallbacks",
    ],
  },

  {
    title: "Skeleton Loaders for Image Grids: Animated vs Static",
    description:
      "Animated skeleton loaders for image grids reduce perceived wait time but add layout complexity. Learn when static fallbacks outperform animated ones.",
    slug: "skeleton-loaders-image-grids",
    readTime: "9 min read",
    category: "UX Patterns",
    tags: [
      "skeleton loader images",
      "loading states",
      "image grids",
      "placeholder images",
      "UX patterns",
    ],
    summary: [
      "Skeleton loaders create the visual impression that content is already present but loading. For image grids — product catalogs, photo feeds, search results — a skeleton that matches the grid layout reduces layout shift and perceived wait time compared to a blank screen or a spinner.",
      "Animated skeletons (shimmer, pulse) add motion to communicate activity. Static skeletons are simpler to implement and more reliable across accessibility contexts. The right choice depends on grid complexity, animation budget, and whether prefers-reduced-motion is respected.",
    ],
    sections: [
      {
        eyebrow: "Why skeletons help grids",
        title: "Skeleton loaders reduce CLS and perceived wait in image-heavy layouts",
        body: [
          "Image grids often load content in batches: the initial page skeleton renders immediately from HTML, and then data and images arrive asynchronously. Without a skeleton, the grid starts empty and expands as images load — each image that appears shifts other content, producing visible layout jump and a high Cumulative Layout Shift score.",
          "A skeleton layer that reserves the same amount of space as the final grid — same column count, same row heights, same gap — prevents all layout shift. Content appears to load into pre-reserved slots rather than pushing other content around. Users see a structure they can anticipate scrolling through.",
          "Perceived performance is also improved. Showing a structural preview of the content — even a placeholder — activates the user's expectation that something is coming. This reduces abandonment rates more than a spinner or blank page, particularly on mobile where loading times are longer.",
        ],
      },
      {
        eyebrow: "Animated skeletons",
        title: "Shimmer and pulse animations: implementation and cost",
        body: [
          "A shimmer skeleton is a gradient that sweeps left to right across placeholder elements, suggesting scanning or loading progress. It is typically implemented as a CSS animation on a linear-gradient background-position, or as an SVG animate element. The visual effect is polished and universally understood as a loading state.",
          "A pulse animation uses opacity or scale keyframes to slowly fade placeholder elements in and out. It is simpler to implement than shimmer but communicates the same waiting state.",
          "Both animations consume GPU and CPU resources for the duration of the load. On a page with 50 skeleton tiles, each with its own animation, this can impact scroll performance on mid-range devices. Profile animation performance on a CPU-throttled DevTools session before shipping animated skeletons on large grids.",
        ],
        code: `/* CSS shimmer skeleton for image grid tiles */
.skeleton-tile {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 0.375rem;
  background: linear-gradient(90deg, #E4E4E7 25%, #F4F4F5 50%, #E4E4E7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-tile {
    animation: none;
    background: #E4E4E7;
  }
}`,
      },
      {
        eyebrow: "Static skeletons",
        title: "Static placeholder images as skeleton alternatives",
        body: [
          "A static skeleton is a solid-color or lightly patterned placeholder image that occupies the correct dimensions without animation. It communicates the same space reservation as an animated skeleton but with zero animation overhead.",
          "fallback.pics animated skeleton route provides a shimmering SVG placeholder from a URL, no CSS or JavaScript required. You can use this as an img src and get the skeleton shimmer effect without writing any animation code. For teams that want the animated look with minimal implementation overhead, this is the simplest path.",
          "The tradeoff between CSS-animated skeletons and placeholder URL skeletons is control versus simplicity. CSS skeletons can match your exact design system colors, border radius, and timing. Placeholder URL skeletons are drop-in but have limited customization.",
        ],
        code: `<!-- Animated skeleton from fallback.pics URL (no CSS animation required) -->
<img
  src="https://fallback.pics/api/v1/animated/skeleton/400x300"
  width="400"
  height="300"
  alt=""
  aria-hidden="true"
/>

<!-- Static neutral placeholder (no animation) -->
<img
  src="https://fallback.pics/api/v1/400x300/E4E4E7/E4E4E7"
  width="400"
  height="300"
  alt=""
  aria-hidden="true"
/>`,
      },
      {
        eyebrow: "Accessibility",
        title: "Skeleton loaders and prefers-reduced-motion",
        body: [
          "Some users — particularly those with vestibular disorders or photosensitivity — find animated skeletons uncomfortable or disorienting. The prefers-reduced-motion media query lets you detect this preference and switch to a static skeleton.",
          "Always include a prefers-reduced-motion override in your skeleton CSS. This is not optional for accessible applications. The static version does not need to be invisible — it should still reserve the space and show a neutral color. Only the animation should be removed.",
          "If you use fallback.pics animated skeleton URLs, you cannot directly apply CSS to the img element's internal animation. Instead, conditionally choose between the animated and static skeleton URL based on matchMedia('(prefers-reduced-motion: reduce)').matches in JavaScript, or use a static fallback URL as the default and only load the animated skeleton URL when reduced motion is not preferred.",
        ],
      },
      {
        eyebrow: "Grid-specific patterns",
        title: "Skeleton count, layout matching, and transition to real content",
        body: [
          "Show the same number of skeleton tiles as the expected page size. If your grid loads 24 products per page, show 24 skeleton tiles. Showing fewer makes the grid appear to grow on load (layout shift); showing more creates an awkward collapse.",
          "Match the aspect ratio and border radius of skeleton tiles exactly to the real images. A skeleton grid with square tiles that resolves to 4:3 product cards shifts the layout on every load. One-to-one geometry mapping from skeleton to final state is the baseline requirement for a CLS score near zero.",
          "The transition from skeleton to real image can use a CSS opacity fade triggered by the image's load event. Fade from opacity 0 to 1 over 200ms. This smooths the swap and avoids the abrupt visual pop that occurs when a placeholder disappears and an image appears in the same frame.",
        ],
        code: `// React: skeleton grid with smooth fade-in on image load
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-tile">
          <ProductImage
            src={product.imageUrl}
            skeleton="https://fallback.pics/api/v1/animated/skeleton/400x400"
            width={400}
            height={400}
            alt={product.name}
          />
        </div>
      ))}
    </div>
  );
}`,
      },
      {
        eyebrow: "When static wins",
        title: "Cases where static placeholders outperform animated skeletons",
        body: [
          "Static placeholders are better for: instant-load content where the animation has no time to run before the real image appears, large grids (50+ tiles) where animation CPU cost affects scroll performance, and applications where the design system does not include animation tokens.",
          "Static placeholders are also safer for third-party embeds, email previews, and server-rendered HTML where the CSS animation code may not be loaded before the user sees the placeholder. A static img src from a placeholder URL works in every rendering context with zero additional CSS.",
        ],
        code: `# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/blurhash-vs-generated-placeholders/
https://fallback.pics/blog/skeleton-placeholder-images-vs-static-fallbacks/`,
      },
    ],
    takeaways: [
      "Skeleton loaders that match the grid's column count, row heights, and gaps prevent Cumulative Layout Shift during image loading.",
      "Animated shimmer skeletons add GPU/CPU cost on large grids; profile on CPU-throttled mobile before shipping.",
      "Always add a prefers-reduced-motion override to remove animation for users who opt out of motion.",
      "Static placeholder URLs from fallback.pics work as zero-animation skeletons in every rendering context without CSS overhead.",
      "Match skeleton tile aspect ratio exactly to the final image aspect ratio to maintain geometry consistency.",
    ],
    related: [
      "blurhash-vs-generated-placeholders",
      "skeleton-placeholder-images-vs-static-fallbacks",
      "prevent-layout-shift-missing-images",
    ],
  },

  {
    title: "Banner Placeholder Presets for Heroes and Ads (IAB Sizes)",
    description:
      "Use banner placeholder URLs sized to IAB standard ad dimensions for prototyping layouts, testing responsive ads, and filling empty slots in production.",
    slug: "banner-placeholder-iab-ad-sizes",
    readTime: "8 min read",
    category: "API Guides",
    tags: [
      "banner placeholder 728x90",
      "IAB ad sizes",
      "placeholder images",
      "banner images",
      "ad placeholders",
    ],
    summary: [
      "The IAB (Interactive Advertising Bureau) defines standard ad unit dimensions used by virtually every display ad network and publisher. Designers and developers working on ad-supported layouts need placeholder images at these exact sizes to prototype grids, test responsive behavior, and fill empty ad slots when inventory is unavailable.",
      "fallback.pics provides a banner route for common rectangular banner dimensions, and any arbitrary IAB size is accessible via the standard dimension URL pattern. The output includes the dimensions as a text label by default, making it easy to identify which ad unit is which in a multi-unit layout.",
    ],
    sections: [
      {
        eyebrow: "IAB standard sizes",
        title: "The most common IAB ad unit dimensions and their use cases",
        body: [
          "The IAB defines over a dozen standard ad units, but a handful account for the majority of display ad inventory. The 728×90 leaderboard sits at the top or bottom of a page. The 300×250 medium rectangle is the most common unit — it fits sidebars, in-content slots, and mobile feeds. The 160×600 wide skyscraper runs in right-hand sidebars.",
          "Newer IAB Rising Stars units include the 970×250 billboard (a double-height leaderboard), the 300×600 half-page unit, and the 320×50 mobile banner. Each has a specific expected position in a page layout. When designing around these units, placeholder images at the exact dimensions prevent layout miscalculation during development.",
          "Getting dimensions wrong during development is common. A 728×91 placeholder in a leaderboard slot causes a 1px layout shift when the real 728×90 ad unit loads. Using correct IAB dimensions from the start — even for placeholder content — prevents this class of bug.",
        ],
      },
      {
        eyebrow: "Banner URL syntax",
        title: "Generating IAB banner placeholders from fallback.pics",
        body: [
          "Use the standard dimension URL pattern with the exact IAB pixel dimensions. The default SVG output includes a centered text label showing the dimensions, which helps identify units in multi-placement layouts. Customize the background color to match your site's empty state or ad container style.",
          "For ad containers that use a gray background to indicate an unfilled slot, use E4E4E7 as the background color with a 71717A text color. For branded placeholders that match the site's primary palette, use the brand color as the background.",
        ],
        code: `<!-- IAB Leaderboard: 728×90 -->
<img
  src="https://fallback.pics/api/v1/728x90/E4E4E7/71717A?text=728x90+Leaderboard"
  width="728"
  height="90"
  alt="Ad leaderboard placeholder"
/>

<!-- IAB Medium Rectangle: 300×250 -->
<img
  src="https://fallback.pics/api/v1/300x250/E4E4E7/71717A?text=300x250+Rectangle"
  width="300"
  height="250"
  alt="Ad rectangle placeholder"
/>

<!-- IAB Half Page: 300×600 -->
<img
  src="https://fallback.pics/api/v1/300x600/E4E4E7/71717A?text=300x600+Half+Page"
  width="300"
  height="600"
  alt="Ad half-page placeholder"
/>

<!-- IAB Billboard: 970×250 -->
<img
  src="https://fallback.pics/api/v1/970x250/E4E4E7/71717A?text=970x250+Billboard"
  width="970"
  height="250"
  alt="Ad billboard placeholder"
/>`,
      },
      {
        eyebrow: "Mobile sizes",
        title: "Mobile banner placeholders for responsive ad layouts",
        body: [
          "The 320×50 mobile banner and the 320×100 large mobile banner are the dominant mobile ad unit sizes. When building responsive ad layouts that swap between a 728×90 leaderboard on desktop and a 320×50 mobile banner on phones, use correctly sized placeholder images for each breakpoint.",
          "Use the picture element or CSS container queries to swap between desktop and mobile ad placeholder URLs. This prevents the layout from reflowing when breakpoints change, and it ensures the ad container reports the correct expected size to the ad server when header bidding is active.",
        ],
        code: `<!-- Responsive banner: 728x90 desktop, 320x50 mobile -->
<picture>
  <source
    media="(min-width: 768px)"
    srcset="https://fallback.pics/api/v1/728x90/E4E4E7/71717A?text=Leaderboard"
  />
  <img
    src="https://fallback.pics/api/v1/320x50/E4E4E7/71717A?text=Mobile+Banner"
    width="320"
    height="50"
    alt="Ad banner placeholder"
  />
</picture>`,
      },
      {
        eyebrow: "Hero banners",
        title: "Using banner placeholders for website hero sections",
        body: [
          "Website hero sections follow different conventions than ad banners. Common hero dimensions include 1920×1080 (full-width desktop), 1440×600 (standard hero with safe zone), 1200×400 (compact hero or article header), and 2560×1440 (high-DPI hero). None of these are IAB ad units.",
          "Use the standard dimension URL for hero section placeholders. Add a descriptive text label to identify the hero slot in multi-section layouts. For hero images where the final content will be a photo, request a JPEG or WebP format from the placeholder API to match the expected final format.",
          "Hero placeholder images used in development should match the exact aspect ratio of the production hero. If the production hero is 1440×600 with the subject centered, a 1920×1080 placeholder will change the page geometry when the final hero loads — producing a CLS event on the first real-user impression.",
        ],
        code: `<!-- Hero section placeholder: standard 1440×600 -->
<img
  src="https://fallback.pics/api/v1/1440x600/18181B/FFFFFF?text=Hero+Image"
  width="1440"
  height="600"
  fetchpriority="high"
  loading="eager"
  alt="Hero banner placeholder"
/>

<!-- Blog post header: 1200×400 -->
<img
  src="https://fallback.pics/api/v1/1200x400/7C3AED/FFFFFF?text=Article+Header"
  width="1200"
  height="400"
  loading="eager"
  alt="Article header placeholder"
/>`,
      },
      {
        eyebrow: "Programmatic ads",
        title: "Placeholder behavior when ad inventory is unavailable",
        body: [
          "When an ad server has no fill for a slot — passback, floor price not met, or direct deal not ready — the slot shows either blank space or a house ad. If you use placeholder images instead of blank space, the layout remains stable and users see a neutral container rather than a jarring empty area.",
          "The placeholder should match the ad unit's dimensions exactly. Set the container min-height to the ad unit height as well, so the space is reserved even if the img element itself is hidden or fails to load. This prevents the layout from collapsing when the ad loads asynchronously.",
        ],
      },
      {
        eyebrow: "IAB size reference",
        title: "Complete reference for common banner dimensions",
        body: [
          "For a quick reference, the most widely used IAB ad unit dimensions are: 728×90 leaderboard, 300×250 medium rectangle, 300×600 half page, 160×600 wide skyscraper, 970×250 billboard, 320×50 mobile banner, 320×100 large mobile banner, and 250×250 square. Each of these can be requested directly from fallback.pics by using the dimension in the URL.",
          "Less common but still supported units include: 468×60 full banner, 234×60 half banner, 120×600 skyscraper, and 120×240 vertical rectangle. IAB also defines video and rich media units, but for standard display ad prototyping these rectangular units cover the vast majority of placements.",
        ],
        code: `# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/square-placeholder-images-presets/
https://fallback.pics/blog/responsive-placeholder-images-cards-banners-grids/`,
      },
    ],
    takeaways: [
      "Use exact IAB dimensions (728×90, 300×250, 300×600) for ad unit placeholders to prevent layout miscalculation during development.",
      "The fallback.pics standard dimension URL works for any IAB size — no special preset required, just use the pixel dimensions directly.",
      "For responsive ad layouts, use picture element breakpoints with correct placeholder dimensions for desktop and mobile units.",
      "Hero section placeholders should match the production hero aspect ratio exactly to avoid CLS on first impression.",
      "Reserve ad slot height with both an img and a min-height CSS rule on the container, so layout remains stable when ads load asynchronously.",
    ],
    related: [
      "square-placeholder-images-presets",
      "responsive-placeholder-images-cards-banners-grids",
      "srcset-responsive-placeholder-images",
    ],
  },

  {
    title: "Square Image Placeholders for Avatars and Product Tiles",
    description:
      "Square placeholder images prevent layout shift in avatar stacks, product grids, and icon lists. Use the square route for consistent sizing and fast CDN caching.",
    slug: "square-placeholder-images-presets",
    readTime: "7 min read",
    category: "API Guides",
    tags: [
      "square placeholder image",
      "avatar placeholder",
      "product tiles",
      "placeholder images",
      "image presets",
    ],
    summary: [
      "Square images are one of the most common shapes in UI: avatars, user profile pictures, app icons, product thumbnails in grids, team member cards, and category tiles all default to a 1:1 aspect ratio. Having a single consistent URL pattern for square placeholders simplifies component logic and produces predictable CDN cache behavior.",
      "fallback.pics provides a dedicated square route that accepts a single size parameter, eliminating the need to repeat the dimension twice in the URL. Combine this with text initials and a brand color to produce avatar-style placeholders that look intentional rather than generic.",
    ],
    sections: [
      {
        eyebrow: "Square URL syntax",
        title: "Using the square route for 1:1 aspect ratio placeholders",
        body: [
          "The square route takes a single size parameter and generates an image with equal width and height. This is cleaner than /NxN for cases where the aspect ratio is always 1:1 — you specify the dimension once instead of repeating it.",
          "The URL format is /api/v1/square/{size} where size is the pixel dimension of both sides. All other parameters — background color, text color, text label — follow the same conventions as the standard dimension route.",
        ],
        code: `<!-- Small avatar: 40×40 -->
<img
  src="https://fallback.pics/api/v1/square/40"
  width="40"
  height="40"
  loading="lazy"
  decoding="async"
  alt="User avatar"
/>

<!-- Medium product tile: 200×200 with label -->
<img
  src="https://fallback.pics/api/v1/square/200?text=Product"
  width="200"
  height="200"
  loading="lazy"
  alt="Product placeholder"
/>

<!-- Large team member card: 400×400 with initials -->
<img
  src="https://fallback.pics/api/v1/square/400?text=JD"
  width="400"
  height="400"
  loading="lazy"
  alt="Team member photo"
/>`,
      },
      {
        eyebrow: "Avatar placeholders",
        title: "Initials-based avatar placeholders for user profiles",
        body: [
          "When a user has not uploaded a profile picture, showing initials in a colored circle is a common and readable fallback. Use the text parameter to pass one or two characters representing the user's initials, and set a background color using a hash of the user's name or ID to produce a consistent, personalized color per user.",
          "Hash-based color selection is worth implementing: it gives each user a unique placeholder color based on their identity rather than showing the same color for every missing avatar. A simple djb2 or FNV hash of the user ID, mapped to one of six or eight brand-adjacent palette colors, produces consistent and visually differentiated avatars.",
          "The avatar route (/api/v1/avatar/{size}) produces a circular-styled avatar placeholder with a round background shape, which is appropriate for circular avatar UI. The square route produces a rectangular placeholder that works better for square-cropped product tiles and team cards.",
        ],
        code: `// Generate a consistent color for a user based on their ID
function getUserPlaceholderColor(userId: string): string {
  const colors = ['7C3AED', '3B82F6', '10B981', 'F97316', 'EF4444', '8B5CF6'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return colors[hash % colors.length];
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function avatarUrl(user: { id: string; name: string }, size = 80): string {
  const color = getUserPlaceholderColor(user.id);
  const initials = getInitials(user.name);
  return \`https://fallback.pics/api/v1/square/\${size}/\${color}/FFFFFF?text=\${initials}\`;
}`,
      },
      {
        eyebrow: "Product grids",
        title: "Square product tile placeholders for ecommerce catalogs",
        body: [
          "Product grid thumbnails are commonly square, especially for fashion, beauty, and consumer electronics where the product photography is shot against a white or neutral background at a consistent aspect ratio. A 1:1 grid is easier to build and maintain than a variable-aspect-ratio grid.",
          "Use a neutral light-gray background (E4E4E7 on light mode, 27272A on dark mode) for product tile placeholders without a text label. This mimics the appearance of an image loading and avoids showing dimensions or labels that would break the visual consistency of a product grid.",
          "For product tiles where the category or product name is known at render time, add a short text label. This makes the placeholder scannable even before the real image loads, which can help user orientation in long lazy-loaded grids.",
        ],
        code: `<!-- Product grid: neutral square placeholders (no text) -->
{products.map((product) => (
  <div key={product.id} className="product-tile">
    <img
      src={product.imageUrl ||
        \`https://fallback.pics/api/v1/square/400/E4E4E7/E4E4E7\`}
      width="400"
      height="400"
      loading="lazy"
      decoding="async"
      alt={product.name}
      onError={(e) => {
        e.currentTarget.src =
          \`https://fallback.pics/api/v1/square/400/E4E4E7/71717A?text=\${
            encodeURIComponent(product.category || 'Product')
          }\`;
      }}
    />
    <p>{product.name}</p>
  </div>
))}`,
      },
      {
        eyebrow: "Icon and logo slots",
        title: "App icon and integration logo placeholders",
        body: [
          "Marketplaces, app stores, and integration directories display vendor or app logos in square or circular tiles. When a vendor has not uploaded a logo, showing their company initials on a branded background is more informative than a broken image or a generic icon.",
          "Use the same hash-based color assignment for company logos as for user avatars — consistent color per company makes logos easier to recognize across the product, even without the real logo asset. Use the first letter of the company name as the text label.",
        ],
        code: `<!-- Integration logo grid with initials fallback -->
{integrations.map((integration) => (
  <div key={integration.id} className="integration-tile">
    <img
      src={integration.logoUrl ||
        \`https://fallback.pics/api/v1/square/64/\${getColor(integration.id)}/FFFFFF?text=\${
          integration.name[0].toUpperCase()
        }\`}
      width="64"
      height="64"
      alt={\`\${integration.name} logo\`}
      onError={(e) => {
        e.currentTarget.src =
          \`https://fallback.pics/api/v1/square/64/\${getColor(integration.id)}/FFFFFF?text=\${
            integration.name[0].toUpperCase()
          }\`;
      }}
    />
    <span>{integration.name}</span>
  </div>
))}`,
      },
      {
        eyebrow: "Dark mode",
        title: "Square placeholder colors for light and dark mode grids",
        body: [
          "Product grids and avatar stacks need placeholder colors that work in both light and dark mode. A single neutral gray background works acceptably in both, but purpose-built dark mode placeholders look more polished.",
          "In light mode, use E4E4E7 (zinc-200) or F4F4F5 (zinc-100) for neutral product tile backgrounds. In dark mode, use 27272A (zinc-800) or 3F3F46 (zinc-700). For CSS-driven dark mode, set the placeholder src conditionally or use a prefers-color-scheme media query to swap the background image.",
        ],
        code: `# API docs
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related posts
https://fallback.pics/blog/banner-placeholder-iab-ad-sizes/
https://fallback.pics/blog/avatar-placeholder-generator-initials-colors-accessibility/`,
      },
      {
        eyebrow: "Caching",
        title: "Square placeholder URLs and CDN cache efficiency",
        body: [
          "The square route produces deterministic output: the same URL always generates the same image. This makes it safe to cache with immutable Cache-Control headers for up to a year. For a product catalog with stable placeholder URLs, the CDN warms up quickly and subsequent page loads see near-zero latency on placeholder fetches.",
          "Using the same placeholder URL for all products without a photo — rather than per-product dynamic URLs — maximizes cache efficiency. A single URL cached at the edge serves thousands of product cards without any repeat origin fetches.",
        ],
      },
    ],
    takeaways: [
      "Use the square route (/api/v1/square/{size}) for 1:1 aspect ratio placeholders — cleaner than repeating the dimension twice.",
      "Hash user or company IDs to a color palette for personalized, consistent avatar and logo placeholders without per-user images.",
      "For neutral product grids, use a gray background without a text label so placeholders blend into the loading state rather than cluttering it.",
      "Reuse the same placeholder URL for all products in the same category to maximize CDN cache efficiency.",
      "Adjust placeholder background colors for dark mode: zinc-800 (27272A) on dark backgrounds, zinc-200 (E4E4E7) on light.",
    ],
    related: [
      "banner-placeholder-iab-ad-sizes",
      "avatar-placeholder-generator-initials-colors-accessibility",
      "product-image-placeholder-ecommerce-catalogs",
    ],
  },
];
