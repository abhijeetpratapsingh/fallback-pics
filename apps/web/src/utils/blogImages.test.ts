import { describe, expect, it } from "vitest";
import {
  buildBlogThumbnailUrl,
  categoryThumbnailLabel,
  inferCodeLanguage,
  toSocialImageUrl,
} from "./blogImages";

describe("buildBlogThumbnailUrl", () => {
  it("uses the thumbnail route with title, label, style, and theme", () => {
    const url = buildBlogThumbnailUrl(
      "React Image Fallback Patterns",
      "React Guides",
      "react-image-fallback-patterns",
    );
    expect(url).toMatch(
      /^https:\/\/fallback\.pics\/api\/v1\/thumbnail\/1200x630\?/,
    );
    expect(url).toContain("text=React+Image+Fallback+Patterns");
    expect(url).toContain("label=React");
    expect(url).toContain("style=");
    expect(url).toContain("theme=");
  });

  it("maps categories to short thumbnail labels", () => {
    expect(categoryThumbnailLabel("API Guides")).toBe("Guide");
    expect(categoryThumbnailLabel("Case Studies")).toBe("Case Study");
  });
});

describe("toSocialImageUrl", () => {
  it("adds .jpg to thumbnail routes without a format suffix", () => {
    expect(
      toSocialImageUrl(
        "https://fallback.pics/api/v1/thumbnail/1200x630?text=Hello",
      ),
    ).toBe(
      "https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=Hello",
    );
  });

  it("leaves non-thumbnail URLs unchanged", () => {
    const url = "https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF";
    expect(toSocialImageUrl(url)).toBe(url);
  });
});

describe("inferCodeLanguage", () => {
  it("detects URL examples", () => {
    expect(
      inferCodeLanguage("https://fallback.pics/api/v1/thumbnail/1200x630"),
    ).toBe("bash");
  });

  it("detects TypeScript snippets", () => {
    expect(inferCodeLanguage("const image = post.featuredImage;")).toBe("tsx");
  });
});
