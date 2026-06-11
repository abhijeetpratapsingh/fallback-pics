import { describe, expect, it } from "vitest";
import { generateThumbnailSVG } from "./thumbnail-generator";

describe("generateThumbnailSVG", () => {
  it("breaks very long single words instead of overflowing", () => {
    const svg = generateThumbnailSVG(1200, 630, {
      text: "Supercalifragilisticexpialidocious",
      label: "Guide",
      style: "soft",
      theme: "purple",
    });

    expect(svg.match(/<tspan/g)?.length ?? 0).toBeGreaterThan(1);
    expect(svg).toContain("Supercalifragilis");
    expect(svg).toContain("ticexpialidocious");
  });

  it("escapes custom text for XML safety", () => {
    const svg = generateThumbnailSVG(400, 300, {
      text: "<script>alert(1)</script>",
      label: "Guide",
    });

    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
  });

  it("places gradient defs before background fill reference", () => {
    const svg = generateThumbnailSVG(400, 300, { text: "Test" });
    const defsIndex = svg.indexOf("<defs>");
    const fillIndex = svg.indexOf("fill=\"url(#thumb-");

    expect(defsIndex).toBeGreaterThan(-1);
    expect(fillIndex).toBeGreaterThan(-1);
    expect(defsIndex).toBeLessThan(fillIndex);
  });

  it("parses bg colors with spaces after commas", () => {
    const svg = generateThumbnailSVG(400, 300, {
      text: "Brand Colors",
      bg: "7C3AED, 3B82F6",
    });

    expect(svg).toContain("stop-color=\"#7C3AED\"");
    expect(svg).toContain("stop-color=\"#3B82F6\"");
  });

  it("produces deterministic output for the same seed", () => {
    const options = {
      text: "Deterministic Thumbnail",
      label: "Guide",
      style: "rings",
      theme: "blue",
      seed: "test-seed",
    } as const;

    const first = generateThumbnailSVG(1200, 630, options);
    const second = generateThumbnailSVG(1200, 630, options);

    expect(first).toBe(second);
  });

  it("changes decoration layout when accent color changes with explicit seed", () => {
    const base = {
      text: "Accent Test",
      label: "Guide",
      style: "soft",
      theme: "purple",
      seed: "fixed-seed",
    } as const;

    const withAccentA = generateThumbnailSVG(1200, 630, {
      ...base,
      accent: "F97316",
    });
    const withAccentB = generateThumbnailSVG(1200, 630, {
      ...base,
      accent: "10B981",
    });

    expect(withAccentA).not.toBe(withAccentB);
  });
});
