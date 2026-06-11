const HEX_COLOR_REGEX = /^[0-9A-Fa-f]{6}$/;

const CSS_COLORS: Record<string, string> = {
  transparent: "transparent",
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#008000",
  blue: "#0000FF",
  yellow: "#FFFF00",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  gray: "#808080",
  grey: "#808080",
  orange: "#FFA500",
  purple: "#800080",
  brown: "#A52A2A",
  pink: "#FFC0CB",
  lime: "#00FF00",
  navy: "#000080",
  teal: "#008080",
  silver: "#C0C0C0",
  gold: "#FFD700",
  indigo: "#4B0082",
  violet: "#EE82EE",
};

export function escapeXml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

export function normalizeColor(
  color: string,
  fallback = "",
): string {
  if (!color) return fallback;

  const lowerColor = color.toLowerCase();
  if (CSS_COLORS[lowerColor]) {
    return CSS_COLORS[lowerColor];
  }

  let cleaned = color.replace(/^#/, "");

  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return HEX_COLOR_REGEX.test(cleaned) ? `#${cleaned.toUpperCase()}` : fallback;
}

export function getAvatarInitials(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "A";
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed: string): () => number {
  let state = hashString(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
