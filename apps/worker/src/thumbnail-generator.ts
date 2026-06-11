import { createSeededRandom, escapeXml, hashString } from "./utils";

export type ThumbnailStyle = "soft" | "rings" | "lines" | "pattern";
export type ThumbnailTheme = "purple" | "blue" | "green" | "orange" | "dark";

export interface ThumbnailOptions {
  text?: string;
  label?: string;
  style?: string;
  theme?: string;
  bg?: string;
  accent?: string;
  color?: string;
  seed?: string;
}

const THEMES: Record<
  ThumbnailTheme,
  { from: string; to: string; accent: string; text: string }
> = {
  purple: {
    from: "#7C3AED",
    to: "#3B82F6",
    accent: "#10B981",
    text: "#FFFFFF",
  },
  blue: { from: "#2563EB", to: "#06B6D4", accent: "#F97316", text: "#FFFFFF" },
  green: { from: "#059669", to: "#10B981", accent: "#FBBF24", text: "#FFFFFF" },
  orange: {
    from: "#EA580C",
    to: "#F97316",
    accent: "#3B82F6",
    text: "#FFFFFF",
  },
  dark: { from: "#18181B", to: "#334155", accent: "#F97316", text: "#FFFFFF" },
};

/** Left ~58% of canvas reserved for label + title; decorations start after this. */
const TEXT_ZONE_WIDTH_RATIO = 0.58;

function normalizeHex(value?: string): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace("#", "").trim();
  return /^[0-9A-Fa-f]{6}$/.test(cleaned)
    ? `#${cleaned.toUpperCase()}`
    : undefined;
}

function splitLongWord(word: string, maxChars: number): string[] {
  if (word.length <= maxChars) return [word];

  const chunks: string[] = [];
  for (let i = 0; i < word.length; i += maxChars) {
    chunks.push(word.slice(i, i + maxChars));
  }
  return chunks;
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const rawWords = text.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  const words = rawWords.flatMap((word) => splitLongWord(word, maxChars));

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) lines.push(current);
  if (words.length && lines.length === maxLines) {
    const usedWords = lines.join(" ").split(" ").length;
    if (usedWords < words.length) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, "") + "...";
    }
  }

  return lines.length ? lines : ["Blog Post"];
}

function scaled(value: number, base: number, target: number): number {
  return (value / base) * target;
}

function generateDecorations(
  width: number,
  height: number,
  style: ThumbnailStyle,
  accent: string,
  random: () => number,
): string {
  const sx = (value: number) => scaled(value, 1200, width);
  const sy = (value: number) => scaled(value, 630, height);
  const rightX = sx(740 + random() * 150);
  const topY = sy(82 + random() * 80);
  const cornerX = sx(1000 + random() * 90);
  const bottomY = sy(500 + random() * 60);

  if (style === "rings") {
    return `
  <circle cx="${cornerX}" cy="${sy(96 + random() * 40)}" r="${sx(170 + random() * 45)}" stroke="#FFFFFF" stroke-width="${sx(58 + random() * 18)}" opacity="0.12"/>
  <circle cx="${sx(1030 + random() * 60)}" cy="${bottomY}" r="${sx(120 + random() * 42)}" stroke="${accent}" stroke-width="${sx(46 + random() * 18)}" opacity="0.14"/>
  <circle cx="${sx(790 + random() * 70)}" cy="${sy(112 + random() * 40)}" r="${sx(44 + random() * 24)}" stroke="#FFFFFF" stroke-width="${sx(22 + random() * 12)}" opacity="0.09"/>
  <rect x="${rightX}" y="${sy(206 + random() * 24)}" width="${sx(250 + random() * 70)}" height="${sy(238 + random() * 70)}" rx="${sx(42)}" fill="#FFFFFF" opacity="0.09"/>`;
  }

  if (style === "lines") {
    const line = (x: number, y: number, w: number) =>
      `<path d="M${sx(x)} ${sy(y)}h${sx(w)}" stroke="#FFFFFF" stroke-width="${sx(24 + random() * 8)}" stroke-linecap="round"/>`;

    return `
  <g opacity="0.15">
    ${line(780 + random() * 60, 112 + random() * 38, 210 + random() * 90)}
    ${line(730 + random() * 54, 192 + random() * 36, 300 + random() * 90)}
    ${line(850 + random() * 44, 270 + random() * 34, 190 + random() * 80)}
    ${line(760 + random() * 50, 448 + random() * 48, 220 + random() * 90)}
  </g>
  <circle cx="${cornerX}" cy="${topY}" r="${sx(156 + random() * 40)}" fill="#FFFFFF" opacity="0.08"/>
  <rect x="${sx(720 + random() * 40)}" y="${sy(350 + random() * 50)}" width="${sx(280 + random() * 60)}" height="${sy(48 + random() * 16)}" rx="${sy(30)}" fill="${accent}" opacity="0.12"/>`;
  }

  if (style === "pattern") {
    const cells: string[] = [];
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        cells.push(
          `<rect x="${sx(760 + col * 126)}" y="${sy(96 + row * 126)}" width="${sx(88)}" height="${sy(88)}" rx="${sx(22)}" fill="#FFFFFF" opacity="${(0.08 + random() * 0.06).toFixed(2)}"/>`,
        );
      }
    }
    return `
  <g>
    ${cells.join("\n    ")}
  </g>
  <circle cx="${sx(1060 + random() * 40)}" cy="${bottomY}" r="${sx(116 + random() * 38)}" fill="${accent}" opacity="0.13"/>`;
  }

  return `
  <circle cx="${cornerX}" cy="${topY}" r="${sx(185 + random() * 48)}" fill="#FFFFFF" opacity="0.12"/>
  <circle cx="${sx(1040 + random() * 70)}" cy="${bottomY}" r="${sx(124 + random() * 50)}" fill="${accent}" opacity="0.12"/>
  <rect x="${rightX}" y="${sy(110 + random() * 40)}" width="${sx(318 + random() * 72)}" height="${sy(330 + random() * 70)}" rx="${sx(52 + random() * 16)}" fill="#FFFFFF" opacity="0.10"/>
  <circle cx="${sx(790 + random() * 76)}" cy="${sy(470 + random() * 42)}" r="${sx(48 + random() * 28)}" fill="#FFFFFF" opacity="0.08"/>`;
}

export function generateThumbnailSVG(
  width: number,
  height: number,
  options: ThumbnailOptions = {},
): string {
  const style = ["soft", "rings", "lines", "pattern"].includes(
    options.style || "",
  )
    ? (options.style as ThumbnailStyle)
    : "soft";
  const themeName = ["purple", "blue", "green", "orange", "dark"].includes(
    options.theme || "",
  )
    ? (options.theme as ThumbnailTheme)
    : "purple";
  const theme = THEMES[themeName];
  const customBg = options.bg
    ?.split(",")
    .map((part) => normalizeHex(part.trim()));
  const bgFrom = customBg?.[0] || theme.from;
  const bgTo = customBg?.[1] || theme.to;
  const accent = normalizeHex(options.accent) || theme.accent;
  const textColor = normalizeHex(options.color) || theme.text;
  const title = (options.text || "Blog Post Thumbnail").slice(0, 160);
  const label = (options.label || "Blog Post").slice(0, 28).toUpperCase();
  const random = createSeededRandom(
    options.seed ||
      `${title}|${label}|${style}|${themeName}|${options.bg || ""}|${options.accent || ""}|${options.color || ""}`,
  );
  const gradientId = `thumb-${hashString(`${bgFrom}${bgTo}`).toString(16)}`;

  const labelWidth = Math.max(132, Math.min(260, label.length * 12 + 58));
  const titleFontSize = Math.max(36, Math.min(width * 0.064, height * 0.122));
  const maxTextWidth = width * TEXT_ZONE_WIDTH_RATIO;
  const approxCharWidth = titleFontSize * 0.52;
  const maxChars = Math.max(
    8,
    Math.min(width >= 1000 ? 18 : 14, Math.floor(maxTextWidth / approxCharWidth)),
  );
  const lines = wrapText(title, maxChars, 3);
  const lineHeight = titleFontSize * 1.16;
  const textX = width * 0.06;
  const labelX = textX;
  const labelY = height * 0.115;
  const textY = height * 0.42;

  const textElements = lines
    .map(
      (line, index) =>
        `<tspan x="${textX}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="${gradientId}" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${bgFrom}"/>
      <stop offset="1" stop-color="${bgTo}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${gradientId})"/>
  ${generateDecorations(width, height, style, accent, random)}
  <rect x="${labelX}" y="${labelY}" width="${labelWidth}" height="${height * 0.07}" rx="${height * 0.035}" fill="#FFFFFF" opacity="0.18"/>
  <text x="${labelX + width * 0.025}" y="${labelY + height * 0.046}" fill="${textColor}" font-family="Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${Math.max(14, height * 0.032)}" font-weight="800">${escapeXml(label)}</text>
  <text x="${textX}" y="${textY}" fill="${textColor}" font-family="Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${titleFontSize}" font-weight="900" letter-spacing="0">${textElements}</text>
</svg>`;
}
