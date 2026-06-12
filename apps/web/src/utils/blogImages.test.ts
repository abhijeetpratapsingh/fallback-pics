import { describe, expect, it } from "vitest";
import {
  blogPublishDate,
  buildBlogThumbnailUrl,
  inferCodeLanguage,
  toSocialImageUrl,
} from "./blogImages";

describe("blogPublishDate", () => {
  it("assigns one calendar day per index from 2026-01-01", () => {
    expect(blogPublishDate(0)).toBe("2026-01-01");
    expect(blogPublishDate(29)).toBe("2026-01-30");
    expect(blogPublishDate(30)).toBe("2026-01-31");
    expect(blogPublishDate(31)).toBe("2026-02-01");
    expect(blogPublishDate(59)).toBe("2026-03-01");
  });
});

describe("buildBlogThumbnailUrl", () => {
  it("uses the thumbnail route with title, brand label, style, and theme", () => {
    const url = buildBlogThumbnailUrl(
      "React Image Fallback Patterns",
      "react-image-fallback-patterns",
    );
    expect(url).toMatch(
      /^https:\/\/fallback\.pics\/api\/v1\/thumbnail\/1200x630\?/,
    );
    expect(url).toContain("text=React+Image+Fallback+Patterns");
    expect(url).toContain("label=fallback.pics");
    expect(url).toContain("style=");
    expect(url).toContain("theme=");
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
