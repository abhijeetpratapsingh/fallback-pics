const THUMBNAIL_STYLES = ["soft", "rings", "lines", "pattern"] as const;
const THUMBNAIL_THEMES = ["purple", "blue", "green", "orange", "dark"] as const;

function slugVariant(slug: string, options: readonly string[]): string {
  let hash = 0;
  for (const char of slug) {
    hash = (hash + char.charCodeAt(0)) % 997;
  }
  return options[hash % options.length];
}

/** One blog per calendar day starting 2026-01-01 (index 0 = Jan 1). */
export function blogPublishDate(index: number): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error(`blogPublishDate: invalid index ${index}`);
  }
  const d = new Date("2026-01-01T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + index);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Blog featured image via /thumbnail route (title, brand label, rotated style/theme). */
export function buildBlogThumbnailUrl(
  title: string,
  slug: string,
  baseUrl = "https://fallback.pics/api/v1",
): string {
  const params = new URLSearchParams({
    text: title,
    style: slugVariant(slug, THUMBNAIL_STYLES),
    theme: slugVariant(slug, THUMBNAIL_THEMES),
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

    if (url.pathname.includes("/thumbnail/") && /^\d+x\d+$/i.test(last)) {
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
