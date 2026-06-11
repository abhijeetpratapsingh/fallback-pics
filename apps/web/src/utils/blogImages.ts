const THUMBNAIL_STYLES = ["soft", "rings", "lines", "pattern"] as const;
const THUMBNAIL_THEMES = ["purple", "blue", "green", "orange", "dark"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  "API Guides": "Guide",
  "Implementation Guides": "Guide",
  "React Guides": "React",
  "Next.js Guides": "Next.js",
  Comparisons: "Compare",
  Alternatives: "Alternative",
  Ecommerce: "Ecommerce",
  Performance: "Performance",
  "UX Patterns": "UX",
  Technical: "Technical",
  Testing: "Testing",
  Implementation: "Guide",
  "Content Workflows": "Content",
  "CMS Workflows": "CMS",
  "Mobile UX": "Mobile",
  Trust: "Trust",
  SaaS: "SaaS",
  "Web Development": "Guide",
  "Case Studies": "Case Study",
};

function slugVariant(slug: string, options: readonly string[]): string {
  let hash = 0;
  for (const char of slug) {
    hash = (hash + char.charCodeAt(0)) % 997;
  }
  return options[hash % options.length];
}

export function categoryThumbnailLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.split(/\s+/)[0];
}

/** Blog featured image via /thumbnail route (title, category pill, rotated style/theme). */
export function buildBlogThumbnailUrl(
  title: string,
  category: string,
  slug: string,
  baseUrl = "https://fallback.pics/api/v1",
): string {
  const params = new URLSearchParams({
    text: title,
    style: slugVariant(slug, THUMBNAIL_STYLES),
    theme: slugVariant(slug, THUMBNAIL_THEMES),
    label: categoryThumbnailLabel(category),
  });

  return `${baseUrl}/thumbnail/1200x630?${params.toString().replace(/%20/g, "+")}`;
}

/**
 * Raster social/OG URLs for thumbnail routes — most platforms do not accept SVG og:image.
 */
export function toSocialImageUrl(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    const segments = url.pathname.split("/");
    const last = segments[segments.length - 1] || "";

    if (
      url.pathname.includes("/thumbnail/") &&
      /^\d+x\d+$/i.test(last)
    ) {
      segments[segments.length - 1] = `${last}.jpg`;
      url.pathname = segments.join("/");
    }

    return url.toString();
  } catch {
    return imageUrl;
  }
}

export function inferCodeLanguage(code: string): string {
  const trimmed = code.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.includes("\n") ? "text" : "bash";
  }
  if (/^(const|let|function|import|export)\s/m.test(trimmed)) {
    return "tsx";
  }
  return "text";
}
