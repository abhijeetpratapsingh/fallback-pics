export interface ImageParams {
  width: number;
  height: number;
  format: "svg" | "png" | "jpg" | "jpeg" | "webp" | "avif" | "gif";
  bgColor: string;
  textColor: string;
  text?: string;
  preset?:
    | "square"
    | "avatar"
    | "banner"
    | "random"
    | "blur"
    | "skeleton"
    | "ai"
    | "animated"
    | "chart"
    | "thumbnail";
  animationType?:
    | "skeleton"
    | "pulse"
    | "wave"
    | "shimmer"
    | "gradient"
    | "dots";
  chartType?:
    | "bar"
    | "pie"
    | "line"
    | "area"
    | "donut"
    | "scatter"
    | "radar"
    | "heatmap";
  font?: string;
  fontSize?: number;
  retina?: number;
  context?: string;
  mood?: string;
  thumbnailStyle?: string;
  thumbnailTheme?: string;
  thumbnailLabel?: string;
  thumbnailAccent?: string;
  thumbnailColor?: string;
  thumbnailBg?: string;
  thumbnailSeed?: string;
  reducedMotion?: boolean;
}

export class Router {
  private url: URL;

  constructor(request: Request) {
    this.url = new URL(request.url);
  }

  parse(): ImageParams {
    let pathname = this.url.pathname.replace(/^\/+|\/+$/g, "");

    // Handle /api/v1 prefix if present
    if (pathname.startsWith("api/v1/")) {
      pathname = pathname.replace("api/v1/", "");
    }

    // Handle subdomain routing - Cloudflare passes full URL path
    // When using route without /*, the path after domain becomes the pathname
    // Check if pathname looks like a domain path that wasn't properly routed
    const host = this.url.hostname;
    if (
      host.includes("img.fallback.pics") ||
      host.includes("https://fallback.pics/api/v1")
    ) {
      // Extract actual image params from URL
      const fullPath = this.url.href;
      const match = fullPath.match(/(?:img|api)\.fallback\.pics\/(.+)/);
      if (match) {
        pathname = match[1];
      }
    }

    const segments = pathname.split("/").filter(Boolean);

    // Handle root path - return a default placeholder
    if (segments.length === 0) {
      return {
        width: 400,
        height: 300,
        format: "svg",
        bgColor: "#7C3AED",
        textColor: "#FFFFFF",
        text: "Fallback.pics",
      };
    }

    let width = 400;
    let height = 300;
    let format: ImageParams["format"] = "svg";
    let preset: ImageParams["preset"] | undefined;

    const first = segments[0];

    // Handle presets
    if (
      [
        "square",
        "avatar",
        "banner",
        "random",
        "blur",
        "skeleton",
        "ai",
        "animated",
        "chart",
        "thumbnail",
      ].includes(first)
    ) {
      preset = first as ImageParams["preset"];

      if (preset === "square" || preset === "avatar") {
        const size = parseInt(segments[1] || "400", 10);
        width = height = size;
      } else if (preset === "thumbnail") {
        const dimensionMatch = (segments[1] || "1200x630").match(
          /^(\d+)x(\d+)(?:\.(\w+))?$/,
        );
        if (dimensionMatch) {
          width = parseInt(dimensionMatch[1], 10);
          height = parseInt(dimensionMatch[2], 10);
          if (dimensionMatch[3]) {
            format = this.validateFormat(dimensionMatch[3]);
          }
        } else {
          width = 1200;
          height = 630;
        }
      } else if (preset === "banner") {
        // Banner format: /banner/1200x400 or default
        if (segments[1]) {
          const match = segments[1].match(/^(\d+)x(\d+)$/);
          if (match) {
            width = parseInt(match[1], 10);
            height = parseInt(match[2], 10);
          }
        } else {
          width = 1200;
          height = 400;
        }
      } else if (preset === "animated") {
        // Animated format: /animated/type/400x300
        // type can be: skeleton, pulse, wave, shimmer, gradient, dots
        const animType = segments[1];
        if (segments[2]) {
          const match = segments[2].match(/^(\d+)x(\d+)$/);
          if (match) {
            width = parseInt(match[1], 10);
            height = parseInt(match[2], 10);
          }
        }
      } else if (preset === "chart") {
        // Chart format: /chart/type/600x400
        // type can be: bar, pie, line, area, donut, scatter, radar, heatmap
        const chartType = segments[1];
        if (segments[2]) {
          const match = segments[2].match(/^(\d+)x(\d+)$/);
          if (match) {
            width = parseInt(match[1], 10);
            height = parseInt(match[2], 10);
          }
        }
      } else {
        // For random, blur, skeleton - parse dimensions from second segment
        if (segments[1]) {
          const match = segments[1].match(/^(\d+)x(\d+)$/);
          if (match) {
            width = parseInt(match[1], 10);
            height = parseInt(match[2], 10);
          }
        }
      }
    } else {
      // Standard format: 400x300 or 400x300.jpg
      const dimensionMatch = first.match(/^(\d+)x(\d+)(?:\.(\w+))?$/);
      // Square format: 200 or 200.jpg (shorthand for 200x200)
      const squareMatch = first.match(/^(\d+)(?:\.(\w+))?$/);

      if (dimensionMatch) {
        width = parseInt(dimensionMatch[1], 10);
        height = parseInt(dimensionMatch[2], 10);
        if (dimensionMatch[3]) {
          format = this.validateFormat(dimensionMatch[3]);
        }
      } else if (squareMatch) {
        // Single dimension creates a square
        width = height = parseInt(squareMatch[1], 10);
        if (squareMatch[2]) {
          format = this.validateFormat(squareMatch[2]);
        }
        preset = "square";
      } else {
        throw new Error("Invalid dimensions format");
      }
    }

    // Validate dimensions (matching placehold.co limits)
    if (
      !width ||
      !height ||
      width < 10 ||
      height < 10 ||
      width > 4000 ||
      height > 4000
    ) {
      throw new Error("Invalid dimensions (10-4000 allowed)");
    }

    // Parse colors from path or query params
    // Use neutral colors for animated and chart presets
    let bgColor =
      preset === "animated" || preset === "skeleton" || preset === "chart"
        ? "#FFFFFF"
        : "#7C3AED";
    let textColor =
      preset === "animated" || preset === "skeleton" || preset === "chart"
        ? "#6B7280"
        : "#FFFFFF";

    // Path-based colors: /400x300/bg/text
    // For animated routes, colors come after dimensions: /animated/type/400x300/bg/text
    let bgIndex = preset ? 2 : 1;
    let textIndex = preset ? 3 : 2;

    // Special handling for animated and chart routes
    if (preset === "animated" || preset === "chart") {
      bgIndex = 3; // After /preset/type/dimensions
      textIndex = 4;
    }

    // Only apply path colors if they're not dimension strings
    if (segments[bgIndex] && !/^\d+x\d+/.test(segments[bgIndex])) {
      bgColor = this.normalizeColor(segments[bgIndex]);
    }
    if (segments[textIndex] && !/^\d+x\d+/.test(segments[textIndex])) {
      textColor = this.normalizeColor(segments[textIndex]);
    }

    // Query param colors (override path colors)
    const bgParam =
      this.url.searchParams.get("bg") || this.url.searchParams.get("bgColor");
    const textParam =
      this.url.searchParams.get("fg") || this.url.searchParams.get("textColor");

    if (bgParam) bgColor = this.normalizeColor(bgParam);
    if (textParam) textColor = this.normalizeColor(textParam);

    // Custom text
    const text =
      this.url.searchParams.get("text") ||
      (preset !== "thumbnail"
        ? this.url.searchParams.get("label")
        : undefined) ||
      (preset === "avatar" && segments[2]) ||
      undefined;

    // Font options
    const font = this.url.searchParams.get("font") || "system";
    const fontSize = this.url.searchParams.get("fontSize")
      ? parseInt(this.url.searchParams.get("fontSize")!, 10)
      : undefined;

    // Retina support (@2x, @3x)
    const retina = this.url.searchParams.get("retina")
      ? parseInt(this.url.searchParams.get("retina")!, 10)
      : undefined;

    // AI context parameters
    const context = this.url.searchParams.get("context") || undefined;
    const mood = this.url.searchParams.get("mood") || undefined;
    const thumbnailStyle = this.url.searchParams.get("style") || undefined;
    const thumbnailTheme = this.url.searchParams.get("theme") || undefined;
    const thumbnailLabel = this.url.searchParams.get("label") || undefined;
    const thumbnailAccent = this.url.searchParams.get("accent") || undefined;
    const thumbnailColor = this.url.searchParams.get("color") || undefined;
    const thumbnailBg = this.url.searchParams.get("bg") || undefined;
    const thumbnailSeed = this.url.searchParams.get("seed") || undefined;

    // Animation parameters
    let animationType: ImageParams["animationType"] | undefined;
    if (preset === "animated" && segments[1]) {
      const validTypes = [
        "skeleton",
        "pulse",
        "wave",
        "shimmer",
        "gradient",
        "dots",
      ];
      if (validTypes.includes(segments[1])) {
        animationType = segments[1] as ImageParams["animationType"];
      }
    }

    // Accessibility
    const reducedMotion =
      this.url.searchParams.get("reducedMotion") === "true" ||
      this.url.searchParams.get("reduced-motion") === "true";

    // Chart type
    let chartType: ImageParams["chartType"] | undefined;
    if (preset === "chart" && segments[1]) {
      const validTypes = [
        "bar",
        "pie",
        "line",
        "area",
        "donut",
        "scatter",
        "radar",
        "heatmap",
      ];
      if (validTypes.includes(segments[1])) {
        chartType = segments[1] as ImageParams["chartType"];
      }
    }

    return {
      width,
      height,
      format,
      bgColor,
      textColor,
      text,
      preset,
      font,
      fontSize,
      retina,
      context,
      mood,
      thumbnailStyle,
      thumbnailTheme,
      thumbnailLabel,
      thumbnailAccent,
      thumbnailColor,
      thumbnailBg,
      thumbnailSeed,
      animationType,
      chartType,
      reducedMotion,
    };
  }

  private validateFormat(format: string): ImageParams["format"] {
    const normalized = format.toLowerCase();
    const validFormats = ["svg", "png", "jpg", "jpeg", "webp", "avif", "gif"];
    if (validFormats.includes(normalized)) {
      // Normalize jpeg to jpg
      return (
        normalized === "jpeg" ? "jpg" : normalized
      ) as ImageParams["format"];
    }
    return "svg";
  }

  private normalizeColor(color: string): string {
    // CSS color names mapping
    const cssColors: Record<string, string> = {
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

    // Check for CSS color names
    const lowerColor = color.toLowerCase();
    if (cssColors[lowerColor]) {
      return cssColors[lowerColor];
    }

    // Remove # if present
    color = color.replace(/^#/, "");

    // Validate hex color
    if (/^[0-9A-Fa-f]{3}$/.test(color)) {
      // Convert 3-char to 6-char
      color = color
        .split("")
        .map((c) => c + c)
        .join("");
    }

    if (/^[0-9A-Fa-f]{6}$/.test(color)) {
      return "#" + color.toUpperCase();
    }

    // Return default if invalid
    return "#7C3AED";
  }
}
