import type { BlogPost } from '../blogPosts';

export const backlogBatch09: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────────
  {
    title: "Section 508 and WCAG: Accessible Fallback Image Patterns",
    description:
      "Meet wcag image accessibility requirements for fallback and placeholder images with proper alt text, role attributes, and aria labels that screen readers handle correctly.",
    slug: "wcag-accessible-fallback-images",
    readTime: "9 min read",
    category: "UX Patterns",
    tags: [
      "wcag image accessibility",
      "Section 508",
      "alt text",
      "ARIA",
      "placeholder images",
      "screen readers",
    ],
    summary: [
      "Placeholder and fallback images are often treated as purely visual concerns, but wcag image accessibility rules apply to every img element regardless of whether it contains real content. Getting alt text, role, and aria-hidden wrong on placeholders causes screen readers to announce meaningless URLs or dimension strings.",
      "This guide covers the WCAG 2.1 and Section 508 rules that affect fallback images, explains when to use empty alt, aria-hidden, or role=img with a label, and shows code patterns for the most common surfaces: product grids, avatars, hero images, and skeleton loading states.",
    ],
    sections: [
      {
        eyebrow: "Baseline",
        title: "Which WCAG criteria apply to wcag image accessibility for placeholders",
        body: [
          "WCAG 1.1.1 (Non-text Content, Level A) requires that every non-decorative image has a text alternative. The rule applies whether the image is a product photo, a broken-image fallback, or a dimension placeholder. A screen reader that encounters an img with no alt attribute will read the full src URL, which for a fallback looks like 'api v1 blur 800x500' — useless at best, disorienting at worst.",
          "Section 508 mirrors this with 36 CFR 1194.22(a), which federal contractors and agencies must meet. In practice, the rules align closely enough that satisfying WCAG 2.1 Level AA covers Section 508 image requirements. The main decision point is whether a given placeholder is decorative (hides it from AT) or informative (needs a label).",
          "The three cases you will encounter are: decorative placeholders that hold layout space and should be hidden from assistive technology; status placeholders that communicate a loading or error state and need a brief label; and fallback images that replace broken product or content images and should inherit the original alt text.",
        ],
      },
      {
        eyebrow: "Decorative",
        title: "Hide layout-only placeholders with empty alt and aria-hidden",
        body: [
          "A placeholder used purely to reserve space while real content loads is decorative. Set alt to an empty string and aria-hidden to true. The empty string satisfies the WCAG 1.1.1 rule by explicitly marking the image as presentational; aria-hidden removes it from the accessibility tree entirely so VoiceOver and JAWS skip it.",
          "Do not omit the alt attribute. An img with no alt attribute is treated as 'unlabeled image' by most screen readers, which will then read the src URL. An empty alt='' is the correct signal that the image is intentionally decoration.",
        ],
        code: `<!-- Decorative placeholder: holds grid space, no content value -->
<img
  src="https://fallback.pics/api/v1/400x300/E4E4E7/E4E4E7"
  width="400"
  height="300"
  alt=""
  aria-hidden="true"
/>`,
      },
      {
        eyebrow: "Loading state",
        title: "Label skeleton and blur placeholders as loading states",
        body: [
          "When a placeholder communicates that content is loading, it is informative rather than decorative. Give it a brief, accurate alt text like 'Product image loading' or use role='status' on the parent container with an aria-label. This tells screen reader users what will appear, not just that something is there.",
          "For animated skeleton placeholders, the animation itself should respect prefers-reduced-motion. WCAG 2.3.3 (Animation from Interactions, Level AAA) recommends suppressing non-essential animation for users who have set this preference. At Level AA, you are not required to disable the animation, but stopping it is considered good practice and avoids potential vestibular issues.",
          "Use a visually hidden span inside the image container if you want to provide richer loading context without adding visible text. Position it off-screen with the standard sr-only Tailwind class or equivalent CSS.",
        ],
        code: `<!-- Loading placeholder with sr-only label -->
<div class="relative" role="img" aria-label="Product image loading">
  <img
    src="https://fallback.pics/api/v1/animated/skeleton/400x300"
    width="400"
    height="300"
    alt=""
    aria-hidden="true"
  />
</div>

/* Respect reduced motion for animated skeletons */
@media (prefers-reduced-motion: reduce) {
  .skeleton-img { animation: none; }
}`,
      },
      {
        eyebrow: "Fallback swap",
        title: "Preserve original alt text when swapping broken images",
        body: [
          "The most critical case is an onerror fallback that replaces a broken product or article image. When this happens, the alt text of the original img element must remain intact. The fallback is substituting for the original content, so it should carry the same label.",
          "If you are building a fallback component in React, Vue, or another framework, pass alt as a required prop and apply it to both the primary img and any fallback state. Never swap alt text to a generic string like 'Image unavailable' unless the original alt was already empty or decorative.",
        ],
        code: `// React: preserve original alt through fallback swap
function FallbackImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const [errored, setErrored] = React.useState(false);
  const fallbackSrc =
    \`https://fallback.pics/api/v1/\${width}x\${height}/7C3AED/FFFFFF?text=\${encodeURIComponent(alt)}\`;

  return (
    <img
      src={errored ? fallbackSrc : src}
      alt={alt}           // ← same alt in both states
      width={width}
      height={height}
      onError={() => setErrored(true)}
    />
  );
}`,
      },
      {
        eyebrow: "Avatars",
        title: "Avatar fallbacks and initials: WCAG-compliant patterns",
        body: [
          "Avatar placeholders generated from user initials are informative images. Use alt text that matches what the initials represent: 'Profile photo for Jane Doe' or, if initials are shown, 'JD — profile photo placeholder'. This gives screen reader users the same information sighted users get from the visual.",
          "The avatar route accepts a text parameter for initials. When you use it as a fallback, the initials are redundant for users who have the real name in surrounding context (like a user card). In that case, hiding the avatar from the accessibility tree with aria-hidden='true' and relying on adjacent text is often the cleaner solution.",
        ],
        code: `<!-- Avatar with initials: informative, keep alt -->
<img
  src="https://fallback.pics/api/v1/avatar/80?text=JD"
  width="80"
  height="80"
  alt="Profile photo for Jane Doe"
/>

<!-- Avatar inside a user card where name is visible text -->
<div class="user-card">
  <img
    src="https://fallback.pics/api/v1/avatar/80?text=JD"
    width="80"
    height="80"
    alt=""
    aria-hidden="true"
  />
  <span>Jane Doe</span> <!-- AT reads this instead -->
</div>`,
      },
      {
        eyebrow: "Testing",
        title: "Audit accessibility on placeholder images in CI",
        body: [
          "Automated accessibility tools like axe-core and Lighthouse detect images with missing alt attributes. Add fallback.pics URLs to your test fixtures and run axe against pages that render placeholder states. This catches regressions before they ship.",
          "Manual testing with VoiceOver (macOS/iOS) or NVDA (Windows) is still necessary because automated tools cannot assess whether the alt text is meaningful. Navigate to a page with visible fallback images and listen to what the screen reader announces. If it reads a URL fragment or 'image', the alt text needs work.",
          "Screen reader testing should cover the loading state (placeholder visible), the loaded state (real image), and the error state (fallback rendered). Each state may present different alt text, and all three should be audible, accurate, and brief.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Reference links for wcag image accessibility and Section 508",
        body: [
          "The WCAG 2.1 specification covers image alternatives in detail under success criterion 1.1.1. The W3C also publishes an Images Tutorial with dedicated guidance for decorative, functional, and complex images.",
          "Use the fallback.pics API to generate accessible placeholders at exact dimensions with matching text alternatives baked into the URL.",
        ],
        code: `# Docs and reference
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/

# Related reading
https://fallback.pics/blog/alt-text-placeholder-fallback-images/
https://fallback.pics/blog/reduced-motion-image-loading/`,
      },
    ],
    takeaways: [
      "Set alt='' on decorative placeholders that hold layout space only; omitting alt is a WCAG 1.1.1 violation.",
      "Add aria-hidden='true' to purely visual placeholders so screen readers skip them entirely.",
      "Preserve the original alt text when swapping a broken image with a fallback src.",
      "Label skeleton and loading-state placeholders with role='status' or a parent aria-label so users know content is incoming.",
      "Test placeholder states (loading, loaded, error) with axe-core in CI and VoiceOver manually before shipping.",
    ],
    related: [
      "alt-text-placeholder-fallback-images",
      "reduced-motion-image-loading",
      "dark-mode-placeholder-colors",
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────────
  {
    title: "High Contrast and Reduced Motion for Image Loading States",
    description:
      "Apply prefers-reduced-motion and prefers-contrast media queries to image placeholders and fallbacks so loading states work for all users and pass WCAG checks.",
    slug: "reduced-motion-image-loading",
    readTime: "8 min read",
    category: "UX Patterns",
    tags: [
      "prefers-reduced-motion images",
      "prefers-contrast",
      "accessible loading states",
      "WCAG",
      "placeholder images",
    ],
    summary: [
      "Animated skeleton loaders and shimmering placeholders improve perceived performance for most users, but they can trigger vestibular symptoms for people who are sensitive to motion, and they may be invisible to users who rely on high contrast mode. The prefers-reduced-motion CSS media query lets you disable or simplify animation without removing the placeholder entirely.",
      "This guide shows how to apply both prefers-reduced-motion and prefers-contrast to image loading states, covers which fallback.pics routes work best in each context, and provides patterns for React and vanilla CSS that handle all four combinations of motion and contrast preference.",
    ],
    sections: [
      {
        eyebrow: "Why it matters",
        title: "How motion and contrast preferences affect image placeholders",
        body: [
          "Skeleton loaders and animated blur placeholders loop indefinitely until the real image loads. For users with vestibular disorders — a population estimated at 35% of adults over 40 — persistent looping animation can cause dizziness, nausea, or headaches. The prefers-reduced-motion media query was introduced precisely for this case, and WCAG 2.3.3 (Animation from Interactions, Level AAA) recommends honoring it.",
          "High-contrast mode is a separate but related concern. Windows High Contrast Mode and macOS Increased Contrast replace color palettes with high-contrast pairs. A neutral gray placeholder at low contrast becomes invisible in forced-colors mode. Users relying on high contrast see no visual cue that content is loading unless you provide an explicit border or text indicator.",
          "Both issues are preventable without removing the loading state. The goal is a graceful degradation path: animated shimmer → static placeholder → bordered static placeholder, moving down the chain as user preferences indicate.",
        ],
      },
      {
        eyebrow: "Reduced motion",
        title: "Stop skeleton animations when prefers-reduced-motion is active",
        body: [
          "The animated skeleton route returns an SVG with a CSS animation inside. When you use it as a background-image or img src, the animation is self-contained. To suppress it, replace the animated URL with a static placeholder when the media query fires.",
          "In CSS, you can switch the background-image or content property with a media query. In JavaScript or React, you can use window.matchMedia to read the preference and select the correct URL at render time. Both approaches work; the CSS method is simpler for static HTML and server-rendered pages.",
        ],
        code: `/* CSS approach: swap animated for static on reduced motion */
.product-placeholder {
  background-image: url('https://fallback.pics/api/v1/animated/skeleton/400x300');
}

@media (prefers-reduced-motion: reduce) {
  .product-placeholder {
    /* Static soft gray instead of animated shimmer */
    background-image: url('https://fallback.pics/api/v1/400x300/E4E4E7/E4E4E7');
  }
}

/* React hook approach */
function useReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function SkeletonImage({ width, height }: { width: number; height: number }) {
  const reduced = useReducedMotion();
  const src = reduced
    ? \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/E4E4E7\`
    : \`https://fallback.pics/api/v1/animated/skeleton/\${width}x\${height}\`;
  return <img src={src} width={width} height={height} alt="" aria-hidden="true" />;
}`,
      },
      {
        eyebrow: "High contrast",
        title: "Make placeholders visible in forced-colors mode",
        body: [
          "In forced-colors mode, the browser replaces background colors with system palette values. A placeholder div with background-color: #e4e4e7 becomes invisible because the system overrides that color. The CSS forced-colors: active media query lets you add a compensating border.",
          "When using fallback.pics URLs as img elements rather than background images, the browser does not suppress them in forced-colors mode. An img src is still rendered. But the image colors may be replaced, making a subtle gray placeholder look harsh or wrong. A 1px ButtonText-colored border on the img element keeps the boundary visible without fighting the system palette.",
        ],
        code: `/* Ensure placeholder is visible in high-contrast mode */
.placeholder-img {
  display: block;
  border: 1px solid transparent;
}

@media (forced-colors: active) {
  .placeholder-img {
    border-color: ButtonText; /* system high-contrast color */
    forced-color-adjust: none; /* preserve internal SVG colors */
  }
}

/* Combined with reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .placeholder-img {
    content: url('https://fallback.pics/api/v1/400x300/E4E4E7/D4D4D8');
  }
}`,
      },
      {
        eyebrow: "Best routes",
        title: "Which fallback.pics routes work best per preference mode",
        body: [
          "For reduced-motion users, use the static blur route or a plain color placeholder. The blur route generates a soft effect that reads as 'loading' without any animation. The plain color route is the lightest option and renders instantly even on slow connections.",
          "For high-contrast users, the text route is ideal: it shows the image dimensions or a brief label in high-contrast-friendly colors. Setting background to 3F3F46 and text to FFFFFF gives sufficient contrast ratio (WCAG AA requires 4.5:1 for normal text, 3:1 for large), and the high-contrast system palette will further increase it.",
        ],
        cards: [
          {
            title: "Default",
            body: "Use /animated/skeleton/{w}x{h} for full animation when no preference is set.",
          },
          {
            title: "Reduced motion",
            body: "Switch to /blur/{w}x{h} or /{w}x{h}/E4E4E7/E4E4E7 — static, no loops.",
          },
          {
            title: "High contrast",
            body: "Use /{w}x{h}/3F3F46/FFFFFF?text=Loading or add a ButtonText border to any placeholder img.",
          },
        ],
      },
      {
        eyebrow: "Testing",
        title: "Verify loading states across all preference combinations",
        body: [
          "Chrome DevTools has a Rendering panel with prefers-reduced-motion and forced-colors emulation. Toggle them while your page loads to confirm the correct placeholder variant is shown in each mode. Check that no animation is visible in reduced-motion mode and that the placeholder boundary is clear in forced-colors mode.",
          "For automated testing, Playwright and Cypress support emulating media features with page.emulateMedia() and cy.visit() with media options. Include assertions that the animated skeleton element is not present when reduced-motion is active.",
          "Lighthouse does not currently flag prefers-reduced-motion violations, so manual testing is necessary. Axe-core checks for WCAG 2.3.3 in AAA mode, but enabling AAA audits is non-default. Enable it explicitly in your axe configuration for thorough motion accessibility coverage.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Docs for prefers-reduced-motion images and contrast patterns",
        body: [
          "The fallback.pics API supports all static and animated placeholder variants described above. See the full route reference for query parameters.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/wcag-accessible-fallback-images/
https://fallback.pics/blog/dark-mode-placeholder-colors/`,
      },
    ],
    takeaways: [
      "Swap animated skeleton placeholders for static variants when prefers-reduced-motion: reduce is active.",
      "Add a 1px ButtonText border to placeholder img elements so they remain visible in forced-colors mode.",
      "Use the blur route as the reduced-motion fallback; it reads as 'loading' without any CSS animation.",
      "Test loading states in Chrome DevTools Rendering panel with both prefers-reduced-motion and forced-colors emulation enabled.",
      "Automated tools miss motion violations at Level AA; add manual VoiceOver and High Contrast Mode checks to your review process.",
    ],
    related: [
      "wcag-accessible-fallback-images",
      "dark-mode-placeholder-colors",
      "skeleton-loaders-image-grids",
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────────
  {
    title: "Dark Mode Placeholder Colors for Cards and Heroes",
    description:
      "Pick dark mode placeholder colors that match your dark UI theme, prevent jarring light flash on load, and maintain sufficient contrast for accessible image loading states.",
    slug: "dark-mode-placeholder-colors",
    readTime: "7 min read",
    category: "UX Patterns",
    tags: [
      "dark mode placeholder",
      "dark mode images",
      "CSS color-scheme",
      "prefers-color-scheme",
      "UX patterns",
    ],
    summary: [
      "A gray placeholder at #e4e4e7 looks fine on a white background but creates a jarring bright flash on a dark-mode UI before the real image loads. Dark mode placeholder colors should sit in the 20-30% lightness range to blend into a dark card surface without disappearing entirely.",
      "The fallback.pics color parameters let you pick exact hex backgrounds and text colors per URL, so you can generate dark-mode-appropriate placeholders without any client-side JavaScript or CSS custom properties. This guide shows the right color values, the CSS approach using prefers-color-scheme, and patterns for Tailwind and CSS-in-JS.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why light placeholders flash on dark mode UIs",
        body: [
          "Most placeholder libraries default to light gray backgrounds chosen to be visible on white pages. When a dark-mode user loads a product grid, the browser renders all those light-gray placeholder img elements before the real images arrive. The contrast between a #f4f4f5 placeholder and a #18181b card background is stark — it looks like a bug, not a loading state.",
          "This is especially visible at slow connection speeds and on below-the-fold content that lazy loads. Each image reveals itself as a bright rectangle before fading into the dark content. The fix is trivial: generate placeholders with dark background colors that match your dark surface tokens.",
          "Dark mode is not only a preference setting. A growing number of OLED displays default to dark mode, and many design systems ship dark-first. Treating placeholder colors as an afterthought means a visible regression for a significant portion of your users.",
        ],
      },
      {
        eyebrow: "Color values",
        title: "Choosing dark mode placeholder colors for common surface tokens",
        body: [
          "Most design systems use zinc, slate, or neutral color scales. Dark surfaces typically sit at the 800-900 shade (approximately #27272a to #18181b in the Tailwind zinc scale). A placeholder should be one or two shades lighter than its card surface to remain subtly visible without flashing. That puts it in the 600-700 range: roughly #3f3f46 to #52525b.",
          "Text color on a dark placeholder can be a mid-light tone like #a1a1aa (zinc-400) — visible enough to read the dimension string, but not so bright it creates its own contrast problem in the loading state.",
        ],
        code: `<!-- Dark mode placeholder: zinc-700 bg, zinc-400 text -->
https://fallback.pics/api/v1/800x450/3F3F46/A1A1AA

<!-- Slate variant for blue-tinted dark themes -->
https://fallback.pics/api/v1/800x450/334155/94A3B8

<!-- Pure dark with minimal text for hero images -->
https://fallback.pics/api/v1/1200x630/18181B/3F3F46

<!-- Subtle blur placeholder for dark cards -->
https://fallback.pics/api/v1/blur/400x300/27272A/3F3F46`,
      },
      {
        eyebrow: "CSS approach",
        title: "Switch placeholder color with prefers-color-scheme",
        body: [
          "If you deliver placeholder URLs from server-side templates or static HTML, you cannot inspect the user's color scheme at generation time. Use CSS background-image with a media query to swap the URL based on color scheme. This keeps the placeholder URL selection in CSS where it belongs and avoids JavaScript.",
          "For img elements with a src attribute, the src is fixed at render time. The cleanest approach for dynamic placeholder selection is a data attribute that stores both URLs; a small inline script or framework hook reads the preferred scheme and sets the correct src before the first paint.",
        ],
        code: `/* CSS method for background-image placeholders */
.card-img {
  background-image: url('https://fallback.pics/api/v1/400x300/E4E4E7/A1A1AA');
  background-size: cover;
  width: 400px;
  height: 300px;
}

@media (prefers-color-scheme: dark) {
  .card-img {
    background-image: url('https://fallback.pics/api/v1/400x300/3F3F46/71717A');
  }
}

/* React with useColorScheme */
function usePlaceholderUrl(w: number, h: number): string {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark
    ? \`https://fallback.pics/api/v1/\${w}x\${h}/3F3F46/71717A\`
    : \`https://fallback.pics/api/v1/\${w}x\${h}/E4E4E7/A1A1AA\`;
}`,
      },
      {
        eyebrow: "Tailwind",
        title: "Dark mode placeholders with Tailwind dark: variants",
        body: [
          "Tailwind's dark variant targets the dark color scheme via a parent class or media query depending on your configuration. You can combine it with background-image utilities by using arbitrary value syntax. For img elements, use a React or Vue wrapper that selects the dark URL when the dark class is present on the html element.",
          "If your Tailwind config uses class-based dark mode, read document.documentElement.classList.contains('dark') to select the placeholder URL. This integrates cleanly with next-themes, vocs theme systems, and any library that manages the dark class on html.",
        ],
        code: `{/* Tailwind + next-themes pattern */}
import { useTheme } from 'next-themes';

function CardImage({ src, alt, width, height }: CardImageProps) {
  const { resolvedTheme } = useTheme();
  const [errored, setErrored] = React.useState(false);
  const dark = resolvedTheme === 'dark';

  const placeholder = dark
    ? \`https://fallback.pics/api/v1/\${width}x\${height}/3F3F46/71717A\`
    : \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/A1A1AA\`;

  return (
    <img
      src={errored ? placeholder : src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setErrored(true)}
      className="rounded-lg object-cover"
    />
  );
}`,
      },
      {
        eyebrow: "Hero images",
        title: "Hero and banner placeholders in dark mode layouts",
        body: [
          "Hero images span the full viewport width, which makes a mis-matched placeholder color more obvious than it would be on a small card. For dark-mode hero placeholders, aim for a color close to the page background — #18181b for zinc-dark themes, #0f172a for slate-dark. The placeholder should be nearly invisible against the dark background rather than prominently displayed.",
          "Add a subtle bottom gradient overlay on the hero placeholder so any text that sits in front of it remains readable. The fallback.pics blur route in dark colors produces a soft gradient-like effect that works well here.",
        ],
        code: `<!-- Full-width hero placeholder for dark theme -->
<div class="relative w-full aspect-video">
  <img
    src="https://fallback.pics/api/v1/blur/1920x1080/18181B/27272A"
    class="absolute inset-0 w-full h-full object-cover"
    width="1920"
    height="1080"
    alt=""
    aria-hidden="true"
  />
  <h1 class="relative z-10 text-white text-4xl font-bold p-8">
    Page Title
  </h1>
</div>`,
      },
      {
        eyebrow: "Contrast check",
        title: "Confirm WCAG contrast on dark placeholder text",
        body: [
          "If your placeholder shows dimension text (400 × 300), it needs a 4.5:1 contrast ratio against its background for WCAG AA compliance. Zinc-400 (#a1a1aa) on zinc-700 (#3f3f46) gives a ratio of about 3.6:1, which passes for large text (18pt or 14pt bold) but not for body size. Use zinc-300 (#d4d4d8) on zinc-700 for comfortable reading at small sizes.",
          "For purely decorative placeholders where the dimension string is suppressed or the image has aria-hidden='true', contrast requirements do not apply to the placeholder colors themselves — only to text users are expected to read.",
        ],
      },
    ],
    takeaways: [
      "Use #3f3f46 to #52525b as placeholder backgrounds on dark card surfaces to avoid a bright loading flash.",
      "Switch placeholder URLs with prefers-color-scheme in CSS for background-image placeholders or window.matchMedia in JavaScript for img src.",
      "Zinc-400 on zinc-700 passes WCAG AA large text; use zinc-300 on zinc-700 for small dimension labels.",
      "Hero placeholders on dark pages should nearly match the background; use the blur route for a soft gradient effect.",
      "Test dark mode placeholder colors by throttling the network in DevTools with dark mode active to see the loading state clearly.",
    ],
    related: [
      "wcag-accessible-fallback-images",
      "reduced-motion-image-loading",
      "blur-placeholder-loading-states",
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────────
  {
    title: "MockImg.dev vs fallback.pics for Production Fallbacks",
    description:
      "Compare mockimg alternative options: MockImg.dev and fallback.pics feature sets, uptime model, caching behavior, and which service fits production image fallbacks.",
    slug: "mockimg-alternative-comparison",
    readTime: "8 min read",
    category: "Comparisons",
    tags: [
      "mockimg alternative",
      "placeholder image service",
      "fallback images",
      "image API comparison",
      "production image fallbacks",
    ],
    summary: [
      "MockImg.dev is a popular developer tool for generating dimension-labeled placeholder images during UI mockups and design handoffs. It handles basic use cases well. When you need a mockimg alternative for production fallbacks — URLs embedded in deployed code, cached at the CDN edge, and always available under load — the requirements are different.",
      "This comparison covers URL structure, output formats, caching behavior, rate limits, and the edge-deployed model that distinguishes fallback.pics from standalone mock image tools. Use it to decide which service belongs in your prototype workflow versus which belongs in your production codebase.",
    ],
    sections: [
      {
        eyebrow: "Use cases",
        title: "Design prototyping versus production fallback: different needs",
        body: [
          "MockImg.dev is well suited for Figma annotations, internal wiki screenshots, and early-stage prototype demos. In those contexts, uptime guarantees and CDN caching are irrelevant because the images are disposable. If MockImg.dev is down when a designer opens a Notion doc, nobody ships broken software.",
          "Production fallbacks are different. When a product image in an ecommerce store fails to load and your onerror handler fires, the fallback URL must respond in milliseconds from the user's geography. A service that is down for maintenance or rate-limiting your IP will cause the fallback to fail too — replacing one broken image with another.",
          "The core distinction is: mock image tools are designed to be used by developers at development time; production fallback APIs must serve end users at runtime. This single difference drives most of the comparison below.",
        ],
      },
      {
        eyebrow: "URL structure",
        title: "How MockImg and fallback.pics differ in URL design",
        body: [
          "MockImg.dev uses a path structure like mockimg.dev/400/300 with optional query parameters for background color and text. fallback.pics uses a structured path: fallback.pics/api/v1/400x300/BGCOLOR/FGCOLOR with text as a query parameter. The fallback.pics path embeds all visual properties directly, making URLs more cacheable — the full cache key is in the path, not split between path and query string.",
          "Immutable caching requires that the same URL always returns the same bytes. Query parameters that affect rendering are not automatically excluded from cache keys by CDNs, which means a CDN might cache different responses for the same query string under heavy load. Path-encoded parameters are always part of the cache key and never stripped.",
        ],
        code: `# MockImg URL pattern
https://mockimg.dev/400/300?bg=7C3AED&text=Product

# fallback.pics equivalent (all params in path)
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product

# fallback.pics with format extension for raster output
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF.jpg?text=Product`,
      },
      {
        eyebrow: "Caching",
        title: "Edge caching and cache-control headers in production",
        body: [
          "fallback.pics is deployed on Cloudflare Workers and returns Cache-Control: public, max-age=31536000, immutable on all generated images. The CDN caches generated images globally, so the first request to any data center computes the SVG once; all subsequent requests from the same region are served directly from Cloudflare's edge cache with sub-millisecond latency.",
          "MockImg.dev does not publish explicit cache-control headers or an SLA for response latency. For prototype use, this is fine. For production, any service without published caching guarantees should not be used as a fallback URL in deployed code. Relying on an external service with unknown caching semantics adds unpredictable latency to your error recovery path.",
        ],
      },
      {
        eyebrow: "Formats",
        title: "Output formats for email, social, and in-page use",
        body: [
          "MockImg.dev outputs PNG images by default. fallback.pics supports SVG (default, smallest file size), PNG, JPEG, and WebP by appending the extension to the dimension segment. SVG is ideal for in-page use because it scales to any display density without aliasing. JPEG and WebP are required for email clients and social crawlers that reject SVG responses.",
          "For Open Graph images — which must be raster format — fallback.pics lets you use the same URL structure with .jpg appended. MockImg.dev outputs PNG which social crawlers accept, but PNG files are considerably larger than JPEG for the same dimensions.",
        ],
        cards: [
          {
            title: "SVG",
            body: "Smallest, scalable, ideal for in-page img elements. Use fallback.pics default (no extension).",
          },
          {
            title: "JPEG/WebP",
            body: "Required for email and social OG. Append .jpg or .webp to the dimension segment on fallback.pics.",
          },
          {
            title: "PNG",
            body: "MockImg.dev default. Works everywhere but larger file size than JPEG for same content.",
          },
        ],
      },
      {
        eyebrow: "When to switch",
        title: "Migration: moving from MockImg to a production fallback service",
        body: [
          "If you have MockImg.dev URLs hardcoded in src attributes or JavaScript fallback handlers in deployed code, replacing them with fallback.pics URLs is a find-and-replace operation. The URL structure is different but the concept is identical: a URL that generates a placeholder image at a given dimension.",
          "During migration, audit whether your fallback URLs live in client-side code (onerror handlers, React components) or server-side templates. Client-side fallback URLs fire at user's request time; server-side URLs render into HTML at build or request time. Both need production-grade placeholder services, but the performance impact of latency is higher for client-side fallbacks.",
        ],
        code: `// Before: MockImg in onerror handler
img.onerror = () => { img.src = 'https://mockimg.dev/400/300'; };

// After: fallback.pics with matching dimensions and colors
img.onerror = () => {
  img.onerror = null; // prevent loop
  img.src = 'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF';
};`,
      },
      {
        eyebrow: "Summary",
        title: "When mockimg alternative choices matter for your project",
        body: [
          "MockImg.dev is a good tool for its intended audience: developers who need disposable placeholder images in non-production contexts. If you are building a prototype, writing internal documentation, or creating a design spec, it does the job.",
          "For any URL embedded in deployed production code — onerror handlers, CMS templates, email campaigns, or server-rendered HTML — use a service with explicit caching guarantees, edge deployment, and public uptime reporting.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/best-placeholder-image-apis-for-developers/
https://fallback.pics/blog/placehold-co-alternatives-production-placeholder-images/`,
      },
    ],
    takeaways: [
      "Mock image tools are designed for developers at design time; production fallback APIs must serve end users at runtime.",
      "Path-encoded parameters (not query strings) produce more reliable CDN cache keys for immutable placeholder URLs.",
      "fallback.pics returns Cache-Control: immutable and is deployed on Cloudflare's global edge network.",
      "Use JPEG or WebP variants from fallback.pics for OG images and email; MockImg.dev defaults to PNG which is larger.",
      "Audit all placeholder URLs in deployed code and replace ad-hoc mock tool URLs with a service that publishes uptime and caching guarantees.",
    ],
    related: [
      "best-placeholder-image-apis-for-developers",
      "placehold-co-alternatives-production-placeholder-images",
      "immutable-urls-cdn-placeholder-caching",
    ],
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────────
  {
    title: "PlaceholderImage.co vs URL Placeholder APIs",
    description:
      "Compare PlaceholderImage.co as a placeholderimage.co alternative against URL-based placeholder APIs like fallback.pics for production image fallbacks and dev mockups.",
    slug: "placeholderimage-co-alternative",
    readTime: "7 min read",
    category: "Alternatives",
    tags: [
      "placeholderimage.co alternative",
      "placeholder image service",
      "fallback images",
      "image placeholder API",
      "production fallbacks",
    ],
    summary: [
      "PlaceholderImage.co provides simple URL-based placeholder images with basic dimension and color support. It works for quick mockups and prototyping, but lacks the edge caching, format flexibility, and route variety that production applications require when using placeholder URLs as live image fallbacks.",
      "This comparison explains what PlaceholderImage.co does well, where it falls short for production use cases, and how fallback.pics fills the gaps with immutable CDN-cached URLs, raster format support, and specialized routes for avatars, banners, thumbnails, and skeleton loading states.",
    ],
    sections: [
      {
        eyebrow: "What it offers",
        title: "PlaceholderImage.co feature overview",
        body: [
          "PlaceholderImage.co generates dimension-labeled images through a simple URL pattern with width, height, and optional background color parameters. It delivers JPEG output and is easy to drop into a Figma annotation or README screenshot. The service has been available long enough to accumulate a library of tutorials pointing to it as a placeholder solution.",
          "Its URL structure is straightforward: placeholderimage.co/200/200/CCCCCC for a 200×200 image with a gray background. Background and text color customization is available via path segments. No API key is required.",
        ],
      },
      {
        eyebrow: "Limitations",
        title: "Where PlaceholderImage.co falls short for production use",
        body: [
          "PlaceholderImage.co does not publish cache-control headers, SLA documents, or a status page. For a URL used in a developer's README or a design prototype, this is a non-issue. For a URL embedded in an onerror handler on a production ecommerce site serving millions of users, it means the fallback could introduce latency or fail silently.",
          "The service offers JPEG output but does not support SVG, WebP, or AVIF. SVG is the most efficient format for generated placeholders — the file is a few hundred bytes regardless of dimensions — and WebP is preferred for Open Graph images on modern crawlers. Without SVG support, every placeholder download is a full raster image decoded by the browser.",
          "Route specialization is also limited. There is no blur route, no skeleton animation route, no avatar route with initials, and no thumbnail route that formats text for blog cards. For applications that need multiple placeholder styles, PlaceholderImage.co requires managing multiple fallback image hosts.",
        ],
      },
      {
        eyebrow: "URL comparison",
        title: "Side-by-side URL structure: placeholderimage.co vs fallback.pics",
        body: [
          "The table below maps equivalent use cases. Both services handle the basic case. For specialized placeholders, only fallback.pics has native routes.",
        ],
        code: `# Basic 400x300 gray placeholder
placeholderimage.co/400/300/CCCCCC
https://fallback.pics/api/v1/400x300/CCCCCC/888888

# With custom text
placeholderimage.co/400/300/7C3AED?text=Product  (if supported)
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product

# Avatar (not available on placeholderimage.co)
https://fallback.pics/api/v1/avatar/80?text=JD

# Skeleton animation (not available on placeholderimage.co)
https://fallback.pics/api/v1/animated/skeleton/400x300

# Blur (not available on placeholderimage.co)
https://fallback.pics/api/v1/blur/800x500

# Blog thumbnail with safe-zone text
https://fallback.pics/api/v1/thumbnail/1200x630?text=Post+Title&style=soft&theme=purple`,
      },
      {
        eyebrow: "Caching",
        title: "CDN caching and edge deployment for placeholderimage.co alternatives",
        body: [
          "fallback.pics runs on Cloudflare Workers deployed to 300+ edge locations. Generated images are cached with Cache-Control: public, max-age=31536000, immutable, meaning the CDN serves them directly without hitting an origin server after the first request to any given PoP. Response times for cached placeholders are typically under 10ms.",
          "PlaceholderImage.co does not document its infrastructure or publish latency benchmarks. In informal testing, response times vary from fast to noticeably slow depending on load and geography. For production fallback URLs that fire in onerror handlers, unpredictable response time directly affects user-visible behavior.",
        ],
      },
      {
        eyebrow: "Migration",
        title: "Switching from PlaceholderImage.co to a URL placeholder API",
        body: [
          "If you have PlaceholderImage.co URLs in production HTML, JavaScript fallback handlers, or CMS templates, replacing them is a simple URL substitution. Map each existing URL's dimensions and colors to the equivalent fallback.pics path.",
          "For large codebases, use a search-and-replace to find all occurrences of placeholderimage.co and replace them systematically. After replacement, verify in your staging environment that all images render at the expected dimensions before deploying.",
        ],
        code: `# Find and replace pattern (zsh / bash)
grep -r "placeholderimage.co" apps/ --include="*.ts" --include="*.tsx" --include="*.astro"

# Example substitution
# Before: placeholderimage.co/400/300/CCCCCC
# After:  https://fallback.pics/api/v1/400x300/CCCCCC/888888`,
      },
      {
        eyebrow: "Resources",
        title: "Docs and related comparisons for placeholderimage.co alternative choices",
        body: [
          "See the fallback.pics API reference for the full list of routes, color parameters, and format options.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/best-placeholder-image-apis-for-developers/
https://fallback.pics/blog/placehold-co-alternatives-production-placeholder-images/`,
      },
    ],
    takeaways: [
      "PlaceholderImage.co works for prototyping and README screenshots but lacks published caching guarantees for production use.",
      "fallback.pics returns SVG by default (smallest format) and supports JPEG, WebP, and PNG for raster-required contexts.",
      "Specialized routes for avatars, blur, skeleton animation, and thumbnails remove the need for multiple placeholder hosts.",
      "Edge deployment on Cloudflare Workers keeps placeholder response times under 10ms for cached images globally.",
      "Migration from any placeholder service is a URL substitution: map old dimensions and colors to the fallback.pics path structure.",
    ],
    related: [
      "best-placeholder-image-apis-for-developers",
      "via-placeholder-alternative-migration",
      "placeholder-com-alternative",
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────────
  {
    title: "plchldr.co and plchldr API Comparison for Developers",
    description:
      "Evaluate plchldr alternative options for development and production: compare plchldr.co URL structure, output format, and caching against fallback.pics for image fallbacks.",
    slug: "plchldr-co-alternative",
    readTime: "7 min read",
    category: "Alternatives",
    tags: [
      "plchldr alternative",
      "placeholder image API",
      "image fallback service",
      "production placeholder",
      "developer tools",
    ],
    summary: [
      "plchldr.co is a minimal placeholder image service that generates dimension-labeled images through simple URLs. It is useful for development prototypes where you need a quick, unremarkable stand-in for real content. As a plchldr alternative for production fallbacks or specialized use cases, it does not cover the full range of routes and reliability guarantees modern applications need.",
      "This guide compares plchldr.co and fallback.pics across URL design, available routes, output formats, and production readiness so you can decide which service fits your workflow at each stage of development.",
    ],
    sections: [
      {
        eyebrow: "plchldr overview",
        title: "What plchldr.co provides for developer placeholder images",
        body: [
          "plchldr.co generates static dimension-labeled images at URLs like plchldr.co/400x300. It supports background color and text color as path segments and allows a custom text label. The output is a flat image with centered text — the same basic pattern as placeholder.com, via.placeholder.com, and their descendants.",
          "The service is minimalist by design: no JavaScript dependency, no API key, no configuration. Paste the URL into an img src and get a labeled rectangle. That simplicity is its primary appeal for prototype screenshots and CMS dummy data.",
        ],
      },
      {
        eyebrow: "Limitations",
        title: "Where plchldr.co falls short for modern applications",
        body: [
          "plchldr.co does not publish an SLA, cache-control headers, or infrastructure documentation. The service has experienced downtime and is not backed by a CDN with published performance guarantees. This is acceptable for a developer's local environment; it is not acceptable for a URL embedded in production client-side code.",
          "Route variety is limited to the basic dimension+color pattern. There is no blur route for soft loading states, no animated skeleton, no avatar with initials, and no thumbnail route designed for Open Graph images. Most production UIs need more than one placeholder style across different surfaces.",
          "Output format is fixed as a raster image (PNG or JPEG depending on the service state). SVG output — which is smaller, resolution-independent, and caches more efficiently — is not available.",
        ],
      },
      {
        eyebrow: "URL comparison",
        title: "plchldr.co vs fallback.pics route equivalents",
        body: [
          "The basic dimension+color route maps cleanly between services. Specialized routes are only available on fallback.pics.",
        ],
        code: `# Basic placeholder
plchldr.co/400x300
https://fallback.pics/api/v1/400x300

# With background color
plchldr.co/400x300/7C3AED
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF

# With custom text
plchldr.co/400x300/7C3AED/FFFFFF?text=Product
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product

# Avatar with initials (fallback.pics only)
https://fallback.pics/api/v1/avatar/80?text=AB

# Blur loading state (fallback.pics only)
https://fallback.pics/api/v1/blur/400x300/3F3F46/52525B

# Animated skeleton (fallback.pics only)
https://fallback.pics/api/v1/animated/skeleton/400x300`,
      },
      {
        eyebrow: "Production readiness",
        title: "Reliability requirements for placeholder URLs in deployed code",
        body: [
          "Any placeholder URL embedded in a deployed onerror handler must be treated as a dependency with uptime requirements. If plchldr.co is slow or down when a user's browser fires an onerror event, the fallback itself fails. The user sees a broken image twice: once for the original content, once for the fallback.",
          "fallback.pics uses Cloudflare Workers deployed globally with Cloudflare's standard 99.99% uptime. Generated images are cached at the CDN edge with Cache-Control: public, max-age=31536000, immutable. After the first request from any edge location, subsequent requests are served from cache without hitting origin at all.",
          "The difference between a cached placeholder and an uncached one matters at the tail of your performance distribution. A CDN-cached SVG returns in under 5ms from nearby nodes; an origin request on a shared server can take 200–600ms. For a fallback image shown during an error state, slow latency extends the time a user sees a broken layout.",
        ],
      },
      {
        eyebrow: "Migration path",
        title: "How to replace plchldr URLs in your codebase",
        body: [
          "Search your codebase for all occurrences of plchldr.co. Replace them with the equivalent fallback.pics URL using the dimension and color mapping above. If plchldr URLs appear in SQL database records, CMS content, or configuration files, update those sources as well.",
          "Test the migration on a branch with real network throttling enabled. Confirm that the replacement URLs render at the same dimensions, that onerror handlers do not loop, and that cache headers are present in the response.",
        ],
        code: `// Quick replacement helper
function placeholderUrl(width: number, height: number, bgHex = 'E4E4E7', fgHex = 'A1A1AA'): string {
  return \`https://fallback.pics/api/v1/\${width}x\${height}/\${bgHex}/\${fgHex}\`;
}

// Usage in onerror handler
img.onerror = () => {
  img.onerror = null;
  img.src = placeholderUrl(img.naturalWidth || 400, img.naturalHeight || 300);
};`,
      },
      {
        eyebrow: "Summary",
        title: "Choosing the right plchldr alternative for your project stage",
        body: [
          "plchldr.co remains a useful bookmark for rapid prototype screenshots and throwaway mockups. Its minimalism is a strength in that context. Once you move to production code — anything a real user's browser will fetch — replace it with a service that publishes caching guarantees and offers the routes your UI actually needs.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/via-placeholder-alternative-migration/
https://fallback.pics/blog/fakeimg-alternatives-production/`,
      },
    ],
    takeaways: [
      "plchldr.co is suitable for throwaway prototype URLs but has no published uptime, caching, or SLA documentation.",
      "Production onerror fallback URLs need CDN caching and reliable uptime; treat them as external dependencies.",
      "fallback.pics provides blur, skeleton, avatar, and thumbnail routes beyond the basic dimension+color pattern.",
      "SVG output is smaller and resolution-independent versus the raster output from most minimal placeholder services.",
      "Replace plchldr.co URLs in production code with a search-and-replace and verify with network throttling in staging.",
    ],
    related: [
      "via-placeholder-alternative-migration",
      "placeholder-com-alternative",
      "fakeimg-alternatives-production",
    ],
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────────
  {
    title: "FreePlaceholder.com Snippet and OG Card vs Thumbnail Routes",
    description:
      "Compare FreePlaceholder.com as a freeplaceholder alternative against fallback.pics thumbnail and OG card routes for blog featured images and social sharing previews.",
    slug: "freeplaceholder-alternative",
    readTime: "7 min read",
    category: "Alternatives",
    tags: [
      "freeplaceholder alternative",
      "OG image placeholder",
      "thumbnail placeholder",
      "blog featured image",
      "social preview image",
    ],
    summary: [
      "FreePlaceholder.com generates basic image placeholders with simple dimension URLs and optional color customization. It is a freeplaceholder alternative commonly referenced in beginner tutorials for inserting dummy images into HTML layouts. For Open Graph cards and blog thumbnails — where the placeholder needs to look like editorial content rather than a development artifact — it is the wrong tool.",
      "fallback.pics has a thumbnail route purpose-built for blog and social contexts: it formats a text title into a styled card with gradient theme, category label, and safe-zone decoration. This comparison explains when FreePlaceholder.com is sufficient and when you need a thumbnail-aware route instead.",
    ],
    sections: [
      {
        eyebrow: "Context",
        title: "Why OG images and blog thumbnails need more than a dimension placeholder",
        body: [
          "When a blog post or documentation page is shared on social media, Twitter, LinkedIn, Slack, and Discord all fetch the og:image URL and render it as a preview card. A generic gray rectangle with '1200x630' printed in the center does not represent the content, does not drive clicks, and may cause the post to look unfinished or broken in social feeds.",
          "Blog index pages have the same problem. A grid of post cards where each thumbnail is a different shade of gray with dimension text is not engaging. Even a minimally designed placeholder with the post title and a gradient background is significantly better than a raw dimension image.",
          "FreePlaceholder.com generates the gray rectangle. fallback.pics generates the titled card. The difference is visible immediately when you compare them side by side in a social preview tool.",
        ],
      },
      {
        eyebrow: "FreePlaceholder",
        title: "What FreePlaceholder.com provides",
        body: [
          "FreePlaceholder.com offers a simple URL pattern for width-by-height placeholder images with optional background color. The output is a static labeled image with centered dimension text. It requires no registration and imposes no API key. For a developer inserting filler content into a layout mockup, it is adequate.",
          "The service does not support a text parameter that accepts arbitrary content, does not have gradient or style options, and does not produce thumbnail-style layouts. All output is the same minimal labeled rectangle.",
        ],
        code: `# FreePlaceholder basic pattern
https://via.freeplacehold.com/400x300
https://via.freeplacehold.com/400x300/7C3AED/FFFFFF

# fallback.pics equivalent for development mocks
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF

# fallback.pics thumbnail route for blog/social use
https://fallback.pics/api/v1/thumbnail/1200x630?text=Why+Image+Fallbacks+Matter&style=soft&theme=purple&label=Tutorial

# OG image with raster output for social crawlers
https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=Why+Image+Fallbacks+Matter&style=soft&theme=purple&label=Tutorial`,
      },
      {
        eyebrow: "Thumbnail route",
        title: "Using the fallback.pics thumbnail route for blog previews",
        body: [
          "The thumbnail route takes a text parameter and formats it as a title in a styled card layout. The safe-zone design keeps text on the left side and decorative elements on the right, which means even long post titles remain readable. The style parameter controls the decoration pattern: soft gives gradient blobs, rings gives concentric circles, lines gives diagonal stripes, and pattern gives a geometric repeat.",
          "Use the label parameter for the category pill shown above the title. This mimics the visual hierarchy of a real blog card and makes the placeholder look like intentional content rather than a missing image.",
        ],
        code: `<!-- Blog thumbnail in Astro component -->
---
const thumbnailUrl = \`https://fallback.pics/api/v1/thumbnail/1200x630?text=\${
  encodeURIComponent(post.title)
}&style=soft&theme=\${post.theme ?? 'purple'}&label=\${
  encodeURIComponent(post.category)
}\`;
---
<img
  src={thumbnailUrl}
  width="1200"
  height="630"
  alt={post.title}
  class="w-full rounded-lg"
/>`,
      },
      {
        eyebrow: "OG tags",
        title: "OG card placeholder URLs for social sharing",
        body: [
          "Open Graph image crawlers (Twitter Cards, LinkedIn, Discord unfurl) require raster formats. Append .jpg or .webp to the dimension segment to get a JPEG or WebP response instead of SVG.",
          "The thumbnail route at 1200x630 is the standard OG image size. Append .jpg for maximum compatibility across all social platforms. Twitter Cards additionally require the image to be under 5MB; the fallback.pics JPEG thumbnail is under 50KB, well within limits.",
        ],
        code: `<!-- meta tags with freeplaceholder alternative for OG -->
<meta property="og:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=Post+Title&style=soft&theme=purple&label=Blog" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=Post+Title&style=soft&theme=purple&label=Blog" />`,
      },
      {
        eyebrow: "When FreePlaceholder is fine",
        title: "Cases where a basic dimension placeholder is the right choice",
        body: [
          "For local development mockups, database seed scripts, and design system component stories, a dimension-labeled rectangle is exactly right. You want a clear visual cue that the space is a placeholder — not a styled thumbnail that might be mistaken for real content.",
          "FreePlaceholder.com works for this. So does any other minimal placeholder service. Reserve the thumbnail and styled routes for contexts where the placeholder appears in user-facing interfaces: blog index pages, social shares, CMS previews, and email newsletters.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Docs for freeplaceholder alternative thumbnail patterns",
        body: [
          "See the fallback.pics thumbnail route reference for the full list of style, theme, and label options.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/generate-blog-thumbnails-from-text/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "FreePlaceholder.com generates dimension-labeled rectangles suitable for local mocks but not for user-facing blog or OG card placeholders.",
      "The fallback.pics thumbnail route formats a text title into a styled card with gradient, label, and safe-zone decoration.",
      "Append .jpg to get a JPEG response from the thumbnail route for OG images that require raster format.",
      "Use the label parameter for the category pill to make thumbnails look like editorial content rather than placeholders.",
      "Keep dimension-labeled placeholders in Storybook stories and seed data; use styled thumbnails in any context a real user sees.",
    ],
    related: [
      "generate-blog-thumbnails-from-text",
      "og-image-placeholders-blogs-docs-social-sharing",
      "jpeg-placeholder-urls-email-social",
    ],
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────────
  {
    title: "ImageNow Preset Sizes vs Custom Dimension Placeholders",
    description:
      "Compare imagenow placeholder preset sizes against custom-dimension URL-based placeholder APIs for development workflows and production fallback image requirements.",
    slug: "imagenow-placeholder-api-comparison",
    readTime: "7 min read",
    category: "Comparisons",
    tags: [
      "imagenow placeholder",
      "placeholder image API",
      "custom dimension placeholder",
      "image presets",
      "production fallbacks",
    ],
    summary: [
      "ImageNow and similar preset-based placeholder tools simplify image generation by offering named size presets — 'thumbnail', 'hero', 'avatar' — instead of raw dimensions. Presets reduce decision fatigue in prototyping sessions but create friction when your design system uses custom dimensions that do not map to the preset list.",
      "URL-based placeholder APIs that accept arbitrary width and height parameters eliminate the preset lookup step and make every dimension valid without configuration. This comparison explains the imagenow placeholder tradeoff between preset convenience and dimensional flexibility, and when each model wins.",
    ],
    sections: [
      {
        eyebrow: "Preset model",
        title: "How preset-based placeholder services work",
        body: [
          "Preset services define a fixed list of named sizes: small, medium, large, square, thumbnail, hero, and so on. You reference the preset by name rather than specifying width and height. The advantage is that a new team member can use the service without knowing the exact pixel dimensions their design system uses.",
          "The disadvantage is that real-world design systems rarely align perfectly with preset lists. A product card at 320x240, a banner at 1440x400, or an avatar at 56x56 may not match any preset. Getting a placeholder at those exact dimensions requires either picking the closest preset and accepting a dimensional mismatch or switching to a service that accepts arbitrary dimensions.",
        ],
      },
      {
        eyebrow: "Custom dimensions",
        title: "Why arbitrary dimension APIs fit design systems better",
        body: [
          "Design systems define specific spatial tokens: a card image slot might be 348x220, an article hero might be 1280x480, and a company logo in a grid might be 120x40. These numbers are chosen for layout reasons, not because they match a standard preset. A placeholder service that accepts any width and height fits without adaptation.",
          "fallback.pics accepts any dimension from 1x1 to 4096x4096 as path parameters. The URL is predictable: width, height, optional background hex, optional foreground hex, optional text. No preset lookup, no approximation, no mismatch.",
        ],
        code: `# Arbitrary dimensions that no preset service covers
https://fallback.pics/api/v1/348x220/7C3AED/FFFFFF?text=Card
https://fallback.pics/api/v1/1280x480/3B82F6/FFFFFF?text=Hero
https://fallback.pics/api/v1/120x40/18181B/FFFFFF?text=Logo

# Standard sizes also work the same way
https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=OG+Image
https://fallback.pics/api/v1/800x600/E4E4E7/A1A1AA
https://fallback.pics/api/v1/avatar/56?text=AB`,
      },
      {
        eyebrow: "Named routes",
        title: "Convenience presets for common surfaces in fallback.pics",
        body: [
          "fallback.pics offers named routes for the most common surfaces — avatar, banner, square, thumbnail — as syntactic shortcuts without removing dimensional control. These routes set sensible defaults for those surface types but still accept dimension overrides.",
          "The square route at /square/400 generates a 400×400 image with centered text. The banner route accepts a WxH parameter. The thumbnail route formats content like a blog card. You get the preset convenience for the common cases and full dimensional control for the custom ones.",
        ],
        code: `# Named routes with defaults
https://fallback.pics/api/v1/avatar/80          # 80x80 avatar
https://fallback.pics/api/v1/square/200          # 200x200 square
https://fallback.pics/api/v1/banner/1200x400     # banner at exact dimensions
https://fallback.pics/api/v1/thumbnail/1200x630  # blog card layout

# Same routes with custom colors
https://fallback.pics/api/v1/avatar/80?text=JD
https://fallback.pics/api/v1/square/200/7C3AED/FFFFFF?text=New`,
      },
      {
        eyebrow: "Caching",
        title: "Cache behavior differences between preset and dimension-parameterized URLs",
        body: [
          "Preset services often generate images dynamically per request with limited CDN caching because presets may be mapped to different dimensions depending on service version. URL-based services with dimensions encoded in the path produce stable, deterministic URLs that CDNs can cache permanently.",
          "fallback.pics returns Cache-Control: public, max-age=31536000, immutable on all responses. The same URL always returns the same image bytes, making it safe for immutable CDN caching and browser cache storage indefinitely.",
        ],
      },
      {
        eyebrow: "Integration",
        title: "Integrating arbitrary-dimension placeholders in a design system",
        body: [
          "The cleanest pattern in a design system is a helper function that accepts the same spatial tokens your layout components use and returns the correct fallback.pics URL. This keeps placeholder generation co-located with the dimension definitions and makes them automatically consistent when tokens change.",
        ],
        code: `// Design system placeholder helper
const tokens = {
  cardImage: { width: 348, height: 220 },
  articleHero: { width: 1280, height: 480 },
  avatar: { size: 56 },
} as const;

function placeholderFor(
  token: keyof typeof tokens,
  text?: string,
): string {
  const t = tokens[token];
  if ('size' in t) {
    return \`https://fallback.pics/api/v1/avatar/\${t.size}\${text ? '?text=' + encodeURIComponent(text) : ''}\`;
  }
  const base = \`https://fallback.pics/api/v1/\${t.width}x\${t.height}/E4E4E7/A1A1AA\`;
  return text ? base + '?text=' + encodeURIComponent(text) : base;
}`,
      },
      {
        eyebrow: "Summary",
        title: "When preset APIs fit and when custom dimensions are necessary",
        body: [
          "Preset APIs reduce onboarding friction when everyone on the team works with the same standard sizes. They fall apart when your design system diverges from those sizes, which happens in virtually every mature product.",
          "Dimension-parameterized APIs with named shortcuts give you both: the shortcut when it applies and exact dimensions when it does not. For production fallback URLs, the dimensional accuracy also matters for layout stability — a placeholder at the wrong size causes CLS even when the real image loads.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/square-placeholder-images-presets/
https://fallback.pics/blog/banner-placeholder-iab-ad-sizes/`,
      },
    ],
    takeaways: [
      "Preset placeholder services trade dimensional flexibility for onboarding convenience; most design systems outgrow them.",
      "fallback.pics accepts any width and height up to 4096px, making every design system token directly expressible as a URL.",
      "Named routes (avatar, square, banner, thumbnail) provide preset convenience without removing dimensional control.",
      "Dimension-in-path URLs produce stable cache keys for immutable CDN caching; query-string dimensions are less reliably cached.",
      "A design system placeholder helper function keeps placeholder URLs co-located with spatial token definitions.",
    ],
    related: [
      "square-placeholder-images-presets",
      "banner-placeholder-iab-ad-sizes",
      "best-placeholder-image-apis-for-developers",
    ],
  },

  // ─── 9 ───────────────────────────────────────────────────────────────────────
  {
    title: "Cloudinary vs Generated Placeholder URLs for Fallbacks",
    description:
      "Compare Cloudinary placeholder and transformation features against URL-based placeholder APIs for image fallbacks in production apps and ecommerce catalogs.",
    slug: "cloudinary-vs-generated-placeholders",
    readTime: "9 min read",
    category: "Comparisons",
    tags: [
      "cloudinary placeholder",
      "cloudinary vs fallback",
      "image CDN comparison",
      "placeholder image API",
      "production fallbacks",
    ],
    summary: [
      "Cloudinary is a full-featured image transformation and delivery platform. It can generate placeholder images through its transformation API — applying pixelate effects, blur, or color fill to a source image. But Cloudinary placeholders are derived from source images that already exist in your media library, not generated from nothing when no image is present.",
      "URL-based placeholder APIs like fallback.pics generate images purely from URL parameters with no source asset required. This comparison clarifies where Cloudinary's cloudinary placeholder capabilities apply and where a standalone placeholder API fills the gap that Cloudinary cannot.",
    ],
    sections: [
      {
        eyebrow: "What Cloudinary does",
        title: "Cloudinary image transformations vs standalone placeholder generation",
        body: [
          "Cloudinary's transformation API is powerful for operations on existing images: resize, crop, format convert, apply effects, overlay text, generate AI thumbnails. For placeholders, you can use the e_pixelate, e_blur, or b_color Cloudinary transformations on a source image to create a low-fidelity loading state.",
          "The key word is source image. Cloudinary transformations operate on images you have already uploaded to your Cloudinary media library. If a product image has not been uploaded yet, or if the upload failed, there is no source for Cloudinary to transform. You cannot use Cloudinary's transformation API to generate a placeholder for missing content that has no source asset.",
          "This is the fundamental gap. Cloudinary handles the case where you have an image and want a transformed variant. A standalone placeholder API handles the case where no image exists at all — a new product listing, a draft blog post, an unassigned user avatar.",
        ],
      },
      {
        eyebrow: "Cloudinary placeholders",
        title: "Cloudinary LQIP and blur-up for existing images",
        body: [
          "Cloudinary's blur-up pattern works well for images that exist. Generate a LQIP (Low Quality Image Placeholder) by requesting your image with e_blur:2000 and w_20 — a 20-pixel-wide blurred thumbnail that compresses to under 1KB. Load this immediately, then swap to the full image. Cloudinary's client SDK automates this.",
          "This LQIP approach is genuinely excellent for content that will always have an image. It outperforms fallback.pics blur placeholders in visual fidelity because the LQIP is derived from the actual image rather than a generic pattern. Use Cloudinary's built-in LQIP where images exist; use fallback.pics for the missing-image case.",
        ],
        code: `// Cloudinary LQIP for an existing image
const cloudinaryLqip = cloudinary.url('product/shoes-001', {
  transformation: [{ width: 20, effect: 'blur:2000', quality: 'auto' }],
});

// fallback.pics for a product with no image uploaded yet
const missingProductFallback =
  'https://fallback.pics/api/v1/400x400/E4E4E7/A1A1AA?text=No+Image';

// Combined: LQIP if image exists, generated placeholder if not
function getProductImageSrc(cloudinaryId: string | null): string {
  if (!cloudinaryId) return missingProductFallback;
  return cloudinary.url(cloudinaryId, { width: 400, height: 400, crop: 'fill' });
}`,
      },
      {
        eyebrow: "Cost model",
        title: "Cloudinary pricing vs free placeholder generation",
        body: [
          "Cloudinary charges per transformation and per stored asset. The free tier covers 25 credits/month; transformation-heavy workflows consume credits quickly. For a product catalog where every image has a Cloudinary asset, the LQIP generation adds measurable transformation cost.",
          "Standalone placeholder APIs like fallback.pics generate images with no per-transformation fee. A placeholder URL is the same cost whether it is served once or a million times. For fallback scenarios — which by definition fire only when something goes wrong — there is no reason to pay per-transformation costs.",
        ],
      },
      {
        eyebrow: "Integration",
        title: "Using both Cloudinary and fallback.pics in the same application",
        body: [
          "The practical architecture for a content-heavy application is: Cloudinary for all transformations on existing images (resize, crop, format, LQIP), and fallback.pics for all cases where no Cloudinary asset exists. The two services are complementary, not competing.",
          "In practice, this means your image component checks whether a Cloudinary public ID is present. If yes, use Cloudinary's URL builder for the src. If no, fall back to a fallback.pics URL at the same dimensions. The onerror handler on the Cloudinary URL also points to fallback.pics in case the asset exists but fails to deliver.",
        ],
        code: `import { buildUrl } from '@cloudinary/url-gen';
import { Resize } from '@cloudinary/url-gen/actions/resize';

function ProductImage({
  cloudinaryId,
  alt,
  width,
  height,
}: {
  cloudinaryId: string | null;
  alt: string;
  width: number;
  height: number;
}) {
  const fallback = \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/A1A1AA?text=\${encodeURIComponent(alt)}\`;
  const [src, setSrc] = React.useState(
    cloudinaryId
      ? buildUrl(cloudinaryId, { transformation: Resize.fill(width, height) })
      : fallback,
  );

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setSrc(fallback)}
    />
  );
}`,
      },
      {
        eyebrow: "Uptime",
        title: "Fallback reliability: why your fallback URL must not depend on Cloudinary",
        body: [
          "Cloudinary has had documented outages. During an outage, transformation requests fail. If your fallback images are also Cloudinary URLs — generated via transformation from a placeholder source image in your library — they fail at the same time as your real images. The fallback defeats its own purpose.",
          "For onerror fallback URLs specifically, use a service with a different infrastructure stack. Cloudinary outages affecting your main image delivery do not propagate to Cloudflare Workers serving fallback.pics URLs. Infrastructure diversity is a reliability feature, not just a cost consideration.",
        ],
      },
      {
        eyebrow: "Summary",
        title: "Cloudinary vs generated placeholders: which for what",
        body: [
          "Cloudinary is the right tool for transforming and delivering images that exist. Its LQIP blur-up pattern is excellent for content with guaranteed source assets. fallback.pics fills the structural gap: images that do not exist, uploads that failed, and draft content that has never had a photo. For onerror fallbacks in production, keeping the fallback URL independent of your main image CDN is a sound reliability pattern.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/blur-placeholder-loading-states/
https://fallback.pics/blog/lqip-blur-up-placeholders-layout-shift/`,
      },
    ],
    takeaways: [
      "Cloudinary transformations require a source asset; they cannot generate a placeholder when no image has been uploaded.",
      "Use Cloudinary LQIP (e_blur:2000, w_20) for content that always has an image; use fallback.pics for missing or draft content.",
      "Per-transformation Cloudinary costs apply to LQIP generation; URL-based placeholders have no per-request fee.",
      "Keep onerror fallback URLs on a separate infrastructure stack from your main image CDN to avoid coincident failures.",
      "The two services are complementary: Cloudinary for transformations on real assets, fallback.pics for generated placeholders when none exist.",
    ],
    related: [
      "lqip-blur-up-placeholders-layout-shift",
      "blur-placeholder-loading-states",
      "imgix-vs-placeholder-api",
    ],
  },

  // ─── 10 ──────────────────────────────────────────────────────────────────────
  {
    title: "Imgix and Image CDN vs Simple Placeholder APIs",
    description:
      "Compare imgix placeholder and image CDN transformation features against simple URL-based placeholder APIs for missing images and fallback states in production.",
    slug: "imgix-vs-placeholder-api",
    readTime: "8 min read",
    category: "Comparisons",
    tags: [
      "imgix placeholder",
      "image CDN",
      "placeholder image API",
      "fallback images",
      "imgix vs fallback",
    ],
    summary: [
      "Imgix is a powerful image CDN and real-time transformation service that processes images stored in an S3 bucket or other origin. It can generate blur-up LQIP variants from existing images, apply color fills, and output multiple formats. Like Cloudinary, its imgix placeholder capabilities only apply to images that are already in your source bucket.",
      "Simple placeholder APIs generate images from URL parameters with no source asset. They are faster to configure for the missing-image case, require no SDK, and cost nothing per transformation. This comparison shows where imgix excels and where a standalone placeholder API is the simpler and cheaper solution.",
    ],
    sections: [
      {
        eyebrow: "Imgix overview",
        title: "What imgix does and where its placeholder features apply",
        body: [
          "Imgix works by sitting in front of an image source (typically S3, GCS, or Azure Blob). You give it a base URL, and it transforms images on demand through URL parameters: resize, crop, format, quality, blur, color fill, and more. Its real-time transformation pipeline is fast and the output is aggressively cached.",
          "For LQIP generation, imgix uses the blur parameter (blur=200) combined with width (w=20) to produce a tiny blurred thumbnail that loads in milliseconds. The quality of an imgix LQIP is better than a generated placeholder because the blur is based on the actual image content.",
          "The limitation is the same as with Cloudinary: the source image must already exist at your imgix origin. A missing product photo, an unset user avatar, or a draft blog post with no featured image cannot be represented through imgix transformations. There is no source to transform.",
        ],
      },
      {
        eyebrow: "Gaps",
        title: "The cases imgix cannot handle without a source image",
        body: [
          "New product listings that are created before photos are taken. User accounts created before a profile photo is uploaded. Blog posts in draft state without a featured image. CMS content that was migrated from a system where images were optional. These are all cases where there is no source asset.",
          "For these cases, you need a placeholder that generates from parameters alone. The onerror handler on any imgix-delivered image also needs a fallback URL. If the source asset is deleted from S3 after imgix has cached a 200 response, the imgix URL will eventually 404 after the cache expires, and the onerror fallback fires.",
          "Using another imgix URL as a fallback creates a dependency chain on the same infrastructure. An imgix-wide outage or origin issue affects both the primary URL and the fallback simultaneously. Fallback URLs should be on independent infrastructure.",
        ],
      },
      {
        eyebrow: "Cost",
        title: "Imgix pricing compared to free placeholder generation",
        body: [
          "Imgix pricing is based on origin images and transformation variants delivered. The starter plan begins at around $75/month for small volumes. For a site that delivers significant image traffic, imgix is cost-effective relative to its feature set. But using imgix for placeholder images — when a free URL-based API could serve the same bytes — is unnecessary cost.",
          "fallback.pics placeholder URLs are served from Cloudflare's free tier for edge deployment. Generated SVGs are a few hundred bytes; cached responses cost nothing to serve. The placeholder use case does not justify an imgix subscription if that is the only reason you are considering it.",
        ],
      },
      {
        eyebrow: "Combined architecture",
        title: "Using imgix and fallback.pics together",
        body: [
          "The architecture that covers all cases: imgix for delivery and transformation of images that exist, fallback.pics for images that do not. An image component gets an imgix URL for the src and a fallback.pics URL for the onerror handler. If imgix delivers successfully, the fallback URL is never fetched and costs nothing.",
          "This pattern also applies to LQIP: use imgix's blur parameter for the LQIP state on content with images, and use fallback.pics blur route for content without images. The user experience is consistent — soft loading states in both cases — regardless of whether a source asset exists.",
        ],
        code: `// imgix for real images + fallback.pics for missing/errored
const imgixBase = 'https://yoursite.imgix.net';

function contentImageSrc(
  path: string | null,
  width: number,
  height: number,
): string {
  if (!path) {
    return \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/A1A1AA\`;
  }
  return \`\${imgixBase}/\${path}?w=\${width}&h=\${height}&fit=crop&auto=format\`;
}

function lqipSrc(path: string | null, width: number, height: number): string {
  if (!path) {
    return \`https://fallback.pics/api/v1/blur/\${width}x\${height}/E4E4E7/D4D4D8\`;
  }
  return \`\${imgixBase}/\${path}?w=20&blur=200&auto=format\`;
}`,
      },
      {
        eyebrow: "onerror independence",
        title: "Why fallback URLs should not be on the same CDN as primary images",
        body: [
          "An onerror fallback URL should come from infrastructure that is independent of your primary image delivery. When your primary CDN has an incident, your fallback URLs are the last line of defense. If they share the same CDN, they fail at the same time.",
          "Cloudflare Workers (which powers fallback.pics) and Cloudflare CDN are different products on the same network, but the Workers runtime is highly isolated from CDN status. More practically, imgix and fallback.pics are different companies with different network paths, making simultaneous outages effectively independent events.",
        ],
      },
      {
        eyebrow: "Summary",
        title: "imgix placeholder vs standalone placeholder API: which to use where",
        body: [
          "Use imgix for transformation and delivery of source images at scale. Its LQIP blur-up is excellent for content that always has an image. For the missing-image case, use a standalone placeholder API. Keep your fallback URL infrastructure separate from your primary image CDN.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/cloudinary-vs-generated-placeholders/
https://fallback.pics/blog/lqip-blur-up-placeholders-layout-shift/`,
      },
    ],
    takeaways: [
      "Imgix requires a source asset in your origin bucket; it cannot generate a placeholder for images that do not exist.",
      "Use imgix LQIP (blur=200&w=20) for content with guaranteed source images; use fallback.pics for missing content.",
      "Fallback URLs should be on infrastructure independent from your primary image CDN to avoid coincident failures.",
      "Generated placeholder SVGs from fallback.pics are ~300 bytes vs a full-resolution raster image from imgix.",
      "The practical architecture: imgix for transformations on existing assets, fallback.pics for no-source-asset cases and onerror fallbacks.",
    ],
    related: [
      "cloudinary-vs-generated-placeholders",
      "lqip-blur-up-placeholders-layout-shift",
      "vercel-image-optimization-vs-placeholders",
    ],
  },

  // ─── 11 ──────────────────────────────────────────────────────────────────────
  {
    title: "Unsplash Source Shutdown: Safe Alternatives for Dev Mockups",
    description:
      "Replace unsplash source alternative URLs after the Source API shutdown with deterministic placeholder services that work reliably in staging, demos, and CI pipelines.",
    slug: "unsplash-source-alternative-mockups",
    readTime: "8 min read",
    category: "Alternatives",
    tags: [
      "unsplash source alternative",
      "unsplash source shutdown",
      "development mockup images",
      "placeholder image API",
      "demo images",
    ],
    summary: [
      "The Unsplash Source API (source.unsplash.com) has been deprecated and no longer reliably serves random photo URLs. Many codebases, tutorials, and demo projects that used it for quick development mockups now show broken images or receive redirects. An unsplash source alternative for development needs to be deterministic, fast, and not dependent on a photo library's API uptime.",
      "This guide explains why random photo APIs fail in CI and staging environments, covers the best deterministic alternatives for different mockup contexts, and shows how to replace Source API URLs in your codebase with stable fallback.pics URLs that generate predictable images at exact dimensions.",
    ],
    sections: [
      {
        eyebrow: "What happened",
        title: "Why source.unsplash.com stopped working for development",
        body: [
          "Unsplash deprecated the Source API in 2023 and began rate-limiting and eventually disabling requests without authentication. Code that used URLs like source.unsplash.com/400x300 started returning redirects to the Unsplash website, HTTP errors, or images at wrong dimensions. Thousands of GitHub repositories, tutorials, and demo applications were affected.",
          "The deeper problem is that random photo APIs were never designed for development and CI use. They return different images on each request, which breaks visual regression tests. They depend on external network access, which fails in air-gapped CI environments. They require API keys in production, which complicates demo deployments.",
          "Deterministic placeholder APIs — where the same URL always returns the same image — solve all three problems. There is no randomness to break visual tests, no external photo library to be rate-limited by, and no API key needed.",
        ],
      },
      {
        eyebrow: "Visual regression",
        title: "Why random images break CI visual tests",
        body: [
          "Visual regression testing tools like Percy, Chromatic, and Playwright snapshots compare pixel-level screenshots between branches. If an image changes between the baseline snapshot and the comparison run, the test fails even when no code changed. Random photo APIs produce a new image on every request, which is a guaranteed visual regression on every test run.",
          "Deterministic placeholder URLs produce the same SVG bytes for the same URL every time, forever. The URL encodes all the parameters that affect the output — dimensions, colors, text. There are no random seeds, no photo selection algorithms, and no dependency on external data.",
        ],
        code: `// Before: Unsplash Source (non-deterministic, deprecated)
const heroImg = 'https://source.unsplash.com/1280x720/?technology';
const avatarImg = 'https://source.unsplash.com/80x80/?person';

// After: deterministic fallback.pics URLs
const heroImg = 'https://fallback.pics/api/v1/1280x720/18181B/27272A';
const avatarImg = 'https://fallback.pics/api/v1/avatar/80?text=AB';

// Or with descriptive text for visual context in demos
const heroImg = 'https://fallback.pics/api/v1/1280x720/18181B/71717A?text=Hero+Image';
const cardImg = 'https://fallback.pics/api/v1/400x300/3B82F6/FFFFFF?text=Article+Photo';`,
      },
      {
        eyebrow: "picsum alternative",
        title: "picsum.photos as a middle ground for visual demos",
        body: [
          "Lorem Picsum (picsum.photos) is a widely used alternative that serves real photographs at specified dimensions. Unlike the deprecated Unsplash Source API, Picsum is actively maintained and uses numeric IDs to return deterministic images (picsum.photos/id/237/400/300 always returns the same dog photo).",
          "Picsum is a good choice when you want photographic content in demos and design presentations. The tradeoff is that the images are real photographs of real subjects, which can introduce content-appropriateness questions for some contexts. Generated placeholders avoid this entirely because the output is abstract by design.",
        ],
        code: `# Picsum with deterministic IDs (photographic)
https://picsum.photos/id/237/400/300   # always the same dog photo
https://picsum.photos/id/1/400/300     # always the same mountain photo

# fallback.pics (generated, no photo content)
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product
https://fallback.pics/api/v1/400x300/3B82F6/FFFFFF?text=Article`,
      },
      {
        eyebrow: "CI environments",
        title: "Placeholder images that work in air-gapped CI pipelines",
        body: [
          "Some CI environments block external network access. Unsplash Source, Picsum, and other photo APIs all require outbound HTTP. Visual regression tests run in these environments fail if any image fetch goes out to an external service.",
          "In this case, the right solution is to use placeholder URLs that can be intercepted by a test fixture or served from a local mock. Deterministic fallback.pics URLs are easy to mock at the network layer: a single catch-all handler for fallback.pics/api/ can return a static SVG for every request, making all placeholder images resolve instantly without external traffic.",
        ],
        code: `// Playwright: mock all fallback.pics requests in CI
await page.route('https://fallback.pics/api/**', (route) => {
  // Return a minimal 1x1 transparent SVG for all placeholder requests
  route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
  });
});`,
      },
      {
        eyebrow: "Migration",
        title: "Find and replace Unsplash Source URLs in your codebase",
        body: [
          "Search your codebase for source.unsplash.com and replace each URL with a dimensionally equivalent fallback.pics URL. The Unsplash Source URL encodes dimensions after the domain; extract width and height and plug them into the fallback.pics path.",
          "For seed data files and fixtures, replace random photo URLs with fallback.pics URLs that include descriptive text so developers can tell at a glance what content type the placeholder represents.",
        ],
        code: `# Find all Unsplash Source URLs
rg "source\\.unsplash\\.com" --type ts --type tsx --type astro --type html

# Example replacements
# source.unsplash.com/800x600/?nature  →  fallback.pics/api/v1/800x600/3B82F6/FFFFFF?text=Nature
# source.unsplash.com/200/200/?person  →  fallback.pics/api/v1/avatar/200?text=User
# source.unsplash.com/1200x630/?tech   →  fallback.pics/api/v1/thumbnail/1200x630?text=Tech+Post&style=soft&theme=blue`,
      },
      {
        eyebrow: "Resources",
        title: "Docs for unsplash source alternative placeholder patterns",
        body: [
          "See the fallback.pics API reference for the full parameter set. The lorem-picsum vs SVG placeholder comparison post covers the photographic vs generated tradeoff in more depth.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/lorem-picsum-vs-svg-placeholder-images/
https://fallback.pics/blog/picsum-photos-vs-deterministic-placeholders/`,
      },
    ],
    takeaways: [
      "Unsplash Source API is deprecated; URLs returning errors or redirects need to be replaced in any codebase using them.",
      "Random photo APIs break visual regression tests because the same URL returns different images on different runs.",
      "Deterministic placeholder URLs (same URL, same image, always) are required for stable CI pipelines and visual snapshots.",
      "Picsum with numeric IDs is a photographic alternative; fallback.pics provides generated abstract placeholders with no photo content.",
      "In air-gapped CI, mock fallback.pics URLs at the network layer rather than maintaining local image fixtures.",
    ],
    related: [
      "picsum-photos-vs-deterministic-placeholders",
      "lorem-picsum-vs-svg-placeholder-images",
      "placeholder-images-storybook-playwright-visual-regression",
    ],
  },

  // ─── 12 ──────────────────────────────────────────────────────────────────────
  {
    title: "Picsum Photos vs Deterministic Placeholders in Production",
    description:
      "Compare picsum photos production suitability against deterministic URL-based placeholder APIs for CI stability, image fallbacks, and controlled visual testing.",
    slug: "picsum-photos-vs-deterministic-placeholders",
    readTime: "8 min read",
    category: "Comparisons",
    tags: [
      "picsum photos production",
      "lorem picsum",
      "deterministic placeholder",
      "visual regression testing",
      "placeholder image API",
    ],
    summary: [
      "Lorem Picsum (picsum.photos) is a well-maintained service that serves real photographs at specified dimensions. It supports deterministic IDs, grayscale, and blur parameters, and has stayed reliably available. For demos and non-production mockups, it is an excellent choice. For picsum photos production use — deployed code where the image URL is part of user-facing behavior — deterministic generated placeholders handle edge cases that Picsum cannot.",
      "This comparison covers random vs deterministic behavior, content appropriateness in automated contexts, CI pipeline constraints, and the specific onerror fallback case where Picsum works but is not the right tool.",
    ],
    sections: [
      {
        eyebrow: "Picsum strengths",
        title: "What Lorem Picsum does well",
        body: [
          "Picsum is actively maintained, has stable uptime, and serves high-quality photographs at any dimensions via a simple URL. The ID-based URL pattern (picsum.photos/id/N/WxH) is deterministic: the same numeric ID always returns the same photograph. This makes it usable for visual regression tests as long as you use fixed IDs rather than random ones.",
          "The blur and grayscale parameters are useful for LQIP states. A blurred Picsum image at low width looks like a content-aware blur-up placeholder because the blur is based on actual photo content. For UI demos and blog posts about image loading techniques, Picsum produces more visually interesting examples than abstract generated placeholders.",
          "The free tier is genuinely free with no API key required. For personal projects, tutorials, and open-source demos, Picsum is hard to beat for convenience.",
        ],
      },
      {
        eyebrow: "Production gaps",
        title: "Where Picsum falls short for picsum photos production use cases",
        body: [
          "Picsum serves real photographs of real places, people, and objects. In automated contexts — seed data generation, CI fixtures, content moderation testing — the image content is outside your control. A product catalog seeded with random Picsum photos may surface images that are inappropriate for the product context or trigger false positives in automated content moderation.",
          "Picsum is a third-party service with no published SLA or uptime commitment. For a URL in a deployed onerror handler, third-party service availability directly affects your error recovery path. Picsum outages are rare but have occurred; in 2019 and 2021 the service experienced multi-hour downtime.",
          "The photographic content also means Picsum placeholder URLs cannot express anything about the expected image content. A dimension-labeled generated placeholder at 400x300 with text 'Product Image' communicates intent. A random Picsum photo at the same dimensions communicates nothing about what should be there.",
        ],
      },
      {
        eyebrow: "Deterministic comparison",
        title: "Deterministic vs random: the CI test stability issue",
        body: [
          "The distinction between deterministic and random is critical for CI pipelines. Picsum supports deterministic IDs, but random Picsum URLs (picsum.photos/400/300 without an ID) return a different photo on each request. Any codebase that uses random Picsum URLs in visual regression tests will have failing tests on every non-baseline run.",
          "Generated placeholder APIs are deterministic by definition. Every parameter that affects the output is encoded in the URL. The same URL always produces byte-for-byte identical output. This makes them safe for visual regression baselines, snapshot tests, and any other test that compares image content across runs.",
        ],
        code: `// Non-deterministic: different image on each request (bad for tests)
const badFix = 'https://picsum.photos/400/300';

// Deterministic Picsum with ID (acceptable for visual tests)
const picsumDeterministic = 'https://picsum.photos/id/10/400/300';

// Fully deterministic generated placeholder (best for production fallbacks)
const generated = 'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product';

// Same URL always returns same SVG bytes from any Cloudflare edge node
`,
      },
      {
        eyebrow: "Content safety",
        title: "Why generated abstract placeholders are safer in automated pipelines",
        body: [
          "Automated test pipelines that render and screenshot pages may need to pass content moderation checks before publishing reports. Real photographs in placeholder slots can trigger false positives in NSFW detection classifiers, logo recognition, or copyright matching tools that run as part of a CI/CD pipeline.",
          "Generated abstract placeholders with solid colors, text labels, and geometric patterns contain no photographic content, no identifiable faces, no copyrighted imagery, and nothing that could trigger content policy checks. For enterprise CI environments with automated content scanning, this is a genuine advantage.",
        ],
      },
      {
        eyebrow: "When to use each",
        title: "Decision guide: Picsum vs deterministic generated placeholders",
        body: [
          "Use Picsum when you want photographic content for design presentations, demo sites, and public tutorial examples. The visual variety makes demos more engaging and the service is reliable enough for low-stakes non-production use.",
          "Use deterministic generated placeholders for onerror fallbacks in deployed production code, visual regression test fixtures, CI seed data, and any automated context where content control or test stability matters. The trade-off is lower visual appeal versus higher predictability.",
        ],
        cards: [
          {
            title: "Picsum",
            body: "Design demos, tutorial screenshots, public mockups. Use ID-based URLs for any test fixture.",
          },
          {
            title: "Generated placeholders",
            body: "Production onerror fallbacks, CI fixtures, visual regression baselines, automated content pipelines.",
          },
          {
            title: "Both together",
            body: "Picsum for hero demo images in Storybook; fallback.pics for onerror and missing-content states.",
          },
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading on picsum photos production alternatives",
        body: [
          "See the lorem picsum vs SVG placeholder comparison and the Unsplash Source shutdown post for related service comparisons.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/lorem-picsum-vs-svg-placeholder-images/
https://fallback.pics/blog/unsplash-source-alternative-mockups/`,
      },
    ],
    takeaways: [
      "Picsum with fixed numeric IDs is deterministic and safe for visual regression test fixtures; random Picsum URLs are not.",
      "Real photographs in placeholder slots can trigger false positives in automated content moderation pipelines.",
      "Generated abstract placeholders are byte-identical on every request from any edge node — the strongest form of determinism.",
      "For production onerror fallbacks, prefer a service with a published SLA over any volunteer-run or community-maintained project.",
      "Use Picsum for photographic demos; use fallback.pics for production fallbacks, CI, and automated contexts that need content control.",
    ],
    related: [
      "lorem-picsum-vs-svg-placeholder-images",
      "unsplash-source-alternative-mockups",
      "placeholder-images-storybook-playwright-visual-regression",
    ],
  },

  // ─── 13 ──────────────────────────────────────────────────────────────────────
  {
    title: "Self-Hosted vs Managed Placeholder API: Cost and Ops",
    description:
      "Compare self hosted image api deployments on Cloudflare Workers or Docker against managed placeholder services for cost, maintenance burden, and operational reliability.",
    slug: "self-hosted-vs-managed-placeholder-api",
    readTime: "9 min read",
    category: "Technical",
    tags: [
      "self hosted image api",
      "placeholder API deployment",
      "Cloudflare Workers",
      "managed placeholder service",
      "developer infrastructure",
    ],
    summary: [
      "Running your own self hosted image api for placeholder generation is technically straightforward — a Cloudflare Worker or a small Node.js service can generate SVG placeholders in under 100 lines of code. The real question is whether the ongoing operational cost of owning that infrastructure is worth the control it provides.",
      "This guide examines the actual costs, maintenance requirements, and failure modes of self-hosted versus managed placeholder APIs, covering compute cost, CDN cache configuration, format support, and the time cost of keeping the service operational over months and years.",
    ],
    sections: [
      {
        eyebrow: "When self-hosting makes sense",
        title: "Legitimate reasons to run a self hosted image api",
        body: [
          "Privacy-sensitive applications that cannot make requests to third-party services have a genuine reason to self-host. This includes applications subject to GDPR restrictions on data processor agreements, healthcare applications operating under HIPAA, and air-gapped enterprise deployments.",
          "Applications that need placeholder images with custom internal branding — company logo watermarks, internal color palettes not available in a public API — may also need a self-hosted solution if the managed service does not expose those parameters.",
          "Finally, organizations with strict security policies that forbid embedding third-party URLs in their CSP img-src directive may self-host to avoid the whitelist approval process. Adding a new domain to the CSP requires a security review at many organizations; a URL on the organization's own domain does not.",
        ],
      },
      {
        eyebrow: "Self-hosting on Workers",
        title: "Deploying a placeholder generator on Cloudflare Workers",
        body: [
          "A Cloudflare Worker that generates SVG placeholders requires no external dependencies. Parse the URL path for width, height, and color parameters, render an SVG string, and return it with the correct content-type and cache-control headers. The entire function fits in under 100 lines of TypeScript.",
          "Cloudflare Workers free tier allows 100,000 requests per day with zero infrastructure cost. The Worker is deployed globally to all Cloudflare PoPs automatically. For a small to mid-size application, the free tier is sufficient and the operational overhead is minimal after initial setup.",
          "The catch is feature development. When you need a new route — blur, skeleton, avatar with initials, thumbnail — you write and deploy it. Each new feature requires design decisions, implementation, testing, and ongoing maintenance. A managed service amortizes this cost across all users.",
        ],
        code: `// Minimal Cloudflare Worker placeholder generator
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const [w, h] = url.pathname.replace('/', '').split('x').map(Number);
    if (!w || !h || w > 4096 || h > 4096) {
      return new Response('Invalid dimensions', { status: 400 });
    }
    const bg = url.searchParams.get('bg') ?? 'E4E4E7';
    const fg = url.searchParams.get('fg') ?? 'A1A1AA';
    const text = url.searchParams.get('text') ?? \`\${w} × \${h}\`;
    const fontSize = Math.round(Math.min(w, h) * 0.08);

    const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${w}" height="\${h}">
  <rect width="100%" height="100%" fill="#\${bg}"/>
  <text x="50%" y="50%" font-family="system-ui" font-size="\${fontSize}"
    fill="#\${fg}" text-anchor="middle" dominant-baseline="middle">
    \${text}
  </text>
</svg>\`;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  },
};`,
      },
      {
        eyebrow: "Operational costs",
        title: "Hidden costs of running your own placeholder infrastructure",
        body: [
          "Compute and bandwidth on Cloudflare Workers free tier are effectively zero. But compute is not the main cost. The main cost is developer time: initial setup, monitoring alerts, deployment pipelines, format support (adding JPEG/PNG/WebP output requires image encoding libraries that add bundle size and complexity to a Worker), and handling edge cases like oversized dimensions, malformed hex colors, or text injection in query parameters.",
          "Security is also a cost. A public-facing image generation API that accepts arbitrary text in URL parameters needs input validation, output encoding, and consideration of SVG injection vectors. A managed service has already solved these problems; a self-hosted service must solve them each time.",
          "Version management is another ongoing cost. Cloudflare Workers, Node.js, and Docker all receive security updates. A self-hosted service that is not actively updated accumulates dependency debt.",
        ],
      },
      {
        eyebrow: "Managed advantages",
        title: "What a managed placeholder service provides beyond generation",
        body: [
          "A managed service maintains the full feature surface: blur, skeleton animation, avatar, thumbnail, banner, JPEG/PNG/WebP format output, LQIP presets, dark mode defaults. New features are added without any work on your side. Edge caching with immutable headers is configured correctly from day one.",
          "Managed services also absorb abuse protection. A public image generation endpoint will receive bot traffic, crawler traffic, and occasional intentional abuse — extremely large dimensions, millions of rapid requests, malformed inputs. A managed service has rate limiting and abuse detection built in.",
          "For most applications, the managed approach is the right default. Self-hosting is justified when a specific compliance, branding, or security constraint cannot be met by a managed service.",
        ],
        cards: [
          {
            title: "Self-hosted wins",
            body: "GDPR/HIPAA compliance, air-gapped deployments, custom internal branding, strict CSP constraints.",
          },
          {
            title: "Managed wins",
            body: "Feature breadth, zero maintenance burden, abuse protection, global edge caching, no ongoing cost.",
          },
          {
            title: "Hybrid",
            body: "Self-host for internal tooling and dev; use managed for production fallback URLs that serve real users.",
          },
        ],
      },
      {
        eyebrow: "Migration",
        title: "Moving from self-hosted to managed placeholder API",
        body: [
          "If you have an existing self-hosted placeholder service and want to migrate to a managed one, the migration is a URL base change. Map your existing URL parameters to the managed service's path structure. Because placeholder URLs are deterministic, you can do a rolling migration by redirecting old URLs to new ones at the reverse proxy or CDN layer.",
          "Keep the self-hosted service running behind the redirect during migration to avoid broken images in server-rendered HTML that is already cached by browsers or CDNs. Deprecate the old URLs after your CDN's cache TTL expires.",
        ],
        code: `# Nginx redirect from self-hosted to fallback.pics
# Old: /placeholder/400x300?bg=7C3AED&fg=FFFFFF
# New: https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF

location /placeholder/ {
  rewrite ^/placeholder/([0-9]+)x([0-9]+)(.*)$ https://fallback.pics/api/v1/$1x$2$3 permanent;
}`,
      },
      {
        eyebrow: "Summary",
        title: "Self-hosted vs managed: the default choice for most teams",
        body: [
          "For most web applications, a managed placeholder API is the right default. The operational overhead of running a self-hosted image generation service outweighs the benefits unless a specific compliance or constraint makes managed services off-limits. Use the hours saved to build features that users care about instead of maintaining infrastructure that users never see.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/self-hosted-placeholder-image-api-cloudflare-workers/
https://fallback.pics/blog/rate-limiting-public-image-apis/`,
      },
    ],
    takeaways: [
      "Cloudflare Workers free tier makes compute cost negligible; the real cost of self-hosting is developer time for features, security, and maintenance.",
      "A minimal SVG placeholder Worker fits in under 100 lines; adding raster format output requires image encoding libraries that increase complexity.",
      "Self-hosting is justified for GDPR/HIPAA compliance, air-gapped environments, or strict CSP requirements that forbid third-party domains.",
      "Managed services provide abuse protection, CDN cache configuration, format support, and ongoing feature development at zero operational cost.",
      "Hybrid approach: self-host for internal dev tooling, use managed for production fallback URLs that serve real end users.",
    ],
    related: [
      "self-hosted-placeholder-image-api-cloudflare-workers",
      "rate-limiting-public-image-apis",
      "csp-img-src-placeholder-apis",
    ],
  },

  // ─── 14 ──────────────────────────────────────────────────────────────────────
  {
    title: "Rate Limiting and Abuse Protection for Public Image APIs",
    description:
      "Understand image api rate limiting strategies, abuse vectors for public placeholder services, and how CDN caching and Cloudflare rate limiting protect generation infrastructure.",
    slug: "rate-limiting-public-image-apis",
    readTime: "8 min read",
    category: "Technical",
    tags: [
      "image api rate limiting",
      "API abuse protection",
      "Cloudflare rate limiting",
      "CDN caching",
      "public image API",
    ],
    summary: [
      "Public image generation APIs are exposed to the full range of internet traffic: benign crawlers, link preview fetchers, bot traffic, and occasional intentional abuse. Without image api rate limiting and CDN caching, a small percentage of abusive traffic can exhaust compute resources and degrade response times for legitimate users.",
      "This guide explains the main abuse vectors for placeholder image APIs, how CDN caching eliminates most compute-level risk by serving cached responses, how Cloudflare rate limiting handles the remaining uncached attack surface, and what self-hosted operators need to implement to match the protection level of managed services.",
    ],
    sections: [
      {
        eyebrow: "Abuse vectors",
        title: "How public image APIs get abused",
        body: [
          "The most common abuse pattern is high-volume enumeration: an automated client generates thousands of unique dimension combinations per second to bypass CDN caching and hit the origin. Because placeholder APIs accept arbitrary dimensions, every unique combination is a cache miss. An attacker generating random dimensions can manufacture unbounded origin load.",
          "A second pattern is extremely large dimension requests. Generating a 4096x4096 image requires more SVG computation and produces a larger response than a 100x100 image. Bounding dimensions to a reasonable maximum is the first line of defense against compute exhaustion.",
          "Text injection through query parameters is a third concern. An image API that renders user-supplied text into SVG must sanitize that text to prevent XSS in SVG consumers, escape XML special characters, and limit text length. Unsanitized text in an SVG response can be a vector for content injection if the SVG is rendered inline.",
        ],
      },
      {
        eyebrow: "CDN caching",
        title: "How immutable CDN caching eliminates most abuse risk",
        body: [
          "The most effective defense against high-volume enumeration is immutable CDN caching. When a placeholder URL is cached at the CDN edge, subsequent requests for the same URL are served from cache without touching the origin Worker. The origin only computes the image once per unique URL per Cloudflare PoP.",
          "fallback.pics returns Cache-Control: public, max-age=31536000, immutable on all responses. The Cloudflare CDN layer absorbs requests for previously cached URLs at the CDN layer, not at the origin. A single PoP serving 10,000 requests for the same 400x300 placeholder computes it once and serves the remaining 9,999 from cache.",
          "Cache-based protection works when attackers use the same URLs repeatedly. For enumeration attacks that intentionally vary parameters to avoid caching, rate limiting at the origin edge is necessary.",
        ],
        code: `# Correct cache-control headers for public placeholder APIs
Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: max-age=31536000
Cloudflare-CDN-Cache-Control: max-age=31536000

# These headers tell Cloudflare to cache for 1 year and treat
# the resource as immutable (no revalidation needed)`,
      },
      {
        eyebrow: "Rate limiting",
        title: "Cloudflare rate limiting for uncached image generation requests",
        body: [
          "For requests that miss the CDN cache — new dimension combinations, first requests to a PoP, or intentionally varied parameters — rate limiting at the Cloudflare Workers layer or Cloudflare Firewall provides a second line of defense.",
          "Cloudflare's rate limiting can apply per IP, per ASN, or per JA3 fingerprint. For a public placeholder API where no authentication is required, per-IP rate limiting at a threshold like 100 cache-miss requests per minute is a reasonable starting point. Legitimate use cases — developers using a new URL from their laptop, crawlers indexing a page with several unique placeholder URLs — rarely exceed this threshold.",
          "The rate limit should apply only to origin-hitting requests, not to CDN-cached responses. Cloudflare's rate limiting configuration supports this distinction through the rule action and cache status conditions.",
        ],
        code: `// Cloudflare Worker: dimension bounds and text sanitization
const MAX_DIMENSION = 4096;
const MAX_TEXT_LENGTH = 100;

function sanitizeText(raw: string): string {
  return raw
    .slice(0, MAX_TEXT_LENGTH)
    .replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function parseDimensions(path: string): [number, number] | null {
  const match = path.match(/^\/(\d{1,4})x(\d{1,4})/);
  if (!match) return null;
  const w = parseInt(match[1], 10);
  const h = parseInt(match[2], 10);
  if (w < 1 || h < 1 || w > MAX_DIMENSION || h > MAX_DIMENSION) return null;
  return [w, h];
}`,
      },
      {
        eyebrow: "Self-hosted",
        title: "Implementing rate limiting in a self-hosted placeholder service",
        body: [
          "If you are self-hosting a placeholder Worker, you need to implement rate limiting yourself. Cloudflare's Rate Limiting product can be added to any Workers route. Define a rule that matches your placeholder path and set a threshold of requests per period per IP.",
          "For a Node.js-based service behind nginx or a reverse proxy, use nginx's limit_req module or a Redis-backed rate limiter in your application code. The bucket size and refill rate depend on your expected legitimate traffic patterns; start conservative and increase based on observed usage.",
          "Regardless of platform, always set a maximum dimension, sanitize text parameters, and log 429 responses so you can tune the rate limit threshold over time.",
        ],
        code: `# nginx rate limiting for a self-hosted placeholder service
http {
  limit_req_zone $binary_remote_addr zone=placeholder:10m rate=60r/m;

  server {
    location /api/v1/ {
      limit_req zone=placeholder burst=20 nodelay;
      limit_req_status 429;
      proxy_pass http://placeholder-origin;
    }
  }
}`,
      },
      {
        eyebrow: "Input validation",
        title: "Preventing text injection and oversized dimension attacks",
        body: [
          "Every public-facing parameter must be validated and bounded. For image generation APIs, the critical parameters are: dimensions (maximum 4096, minimum 1, integers only), color parameters (valid hex format, exactly 6 characters after stripping the # prefix), and text (maximum length, XML-entity-escaped before rendering into SVG).",
          "Test your validation with adversarial inputs: dimensions of 0, -1, NaN, Infinity, and 99999; colors with script injections like 'fill=red onload=alert(1)'; text with angle brackets and ampersands. Your SVG output should contain none of these characters unescaped.",
        ],
        code: `// Comprehensive input validation for placeholder API
function validateHex(raw: string): string {
  const clean = raw.replace(/^#/, '').toUpperCase();
  if (!/^[0-9A-F]{6}$/.test(clean)) return 'E4E4E7'; // default gray
  return clean;
}

function buildSafeUrl(
  w: number, h: number, bg: string, fg: string, text: string,
): string | null {
  if (!Number.isInteger(w) || !Number.isInteger(h)) return null;
  if (w < 1 || h < 1 || w > 4096 || h > 4096) return null;
  return \`https://fallback.pics/api/v1/\${w}x\${h}/\${validateHex(bg)}/\${validateHex(fg)}?text=\${encodeURIComponent(text.slice(0, 100))}\`;
}`,
      },
      {
        eyebrow: "Summary",
        title: "Defense in depth for public image API rate limiting",
        body: [
          "The defense stack for a public image API is: maximum dimension bounds to prevent compute exhaustion, text sanitization to prevent injection, immutable CDN caching to eliminate compute load from repeat requests, and rate limiting at the edge for novel uncached requests. Each layer handles a different part of the threat surface.",
          "Managed services like fallback.pics have all four layers in place by default. Self-hosted operators must implement them explicitly, which is one of the non-trivial operational costs of owning the infrastructure.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/self-hosted-vs-managed-placeholder-api/
https://fallback.pics/blog/csp-img-src-placeholder-apis/`,
      },
    ],
    takeaways: [
      "Dimension enumeration attacks bypass CDN caching by varying parameters; max-dimension bounds and rate limiting are necessary defenses.",
      "Immutable CDN caching is the most effective protection: the origin only computes each unique URL once per PoP.",
      "Text parameters in SVG generators must be XML-entity-escaped to prevent content injection in SVG consumers.",
      "Per-IP rate limiting at ~60 requests/minute blocks enumeration attacks without affecting legitimate developer usage.",
      "Self-hosted operators must implement all four defenses (bounds, sanitization, caching, rate limiting) that managed services provide by default.",
    ],
    related: [
      "self-hosted-vs-managed-placeholder-api",
      "csp-img-src-placeholder-apis",
      "immutable-urls-cdn-placeholder-caching",
    ],
  },
];
