import { describe, it, expect } from "vitest";
import { Router } from "./router";

describe("Router", () => {
  it("should parse basic dimensions", () => {
    const request = new Request("https://fallback.pics/400x300");
    const router = new Router(request);
    const params = router.parse();

    expect(params.width).toBe(400);
    expect(params.height).toBe(300);
    expect(params.format).toBe("svg");
  });

  it("should parse dimensions with format", () => {
    const request = new Request("https://fallback.pics/400x300.jpg");
    const router = new Router(request);
    const params = router.parse();

    expect(params.width).toBe(400);
    expect(params.height).toBe(300);
    expect(params.format).toBe("jpg");
  });

  it("should parse square preset", () => {
    const request = new Request("https://fallback.pics/square/500");
    const router = new Router(request);
    const params = router.parse();

    expect(params.width).toBe(500);
    expect(params.height).toBe(500);
    expect(params.preset).toBe("square");
  });

  it("should parse avatar preset", () => {
    const request = new Request("https://fallback.pics/avatar/100");
    const router = new Router(request);
    const params = router.parse();

    expect(params.width).toBe(100);
    expect(params.height).toBe(100);
    expect(params.preset).toBe("avatar");
  });

  it("should parse thumbnail preset options", () => {
    const request = new Request(
      "https://fallback.pics/thumbnail/1200x630.webp?text=How+to+Fix+Broken+Images&label=Guide&style=lines&theme=dark&accent=F97316",
    );
    const router = new Router(request);
    const params = router.parse();

    expect(params.width).toBe(1200);
    expect(params.height).toBe(630);
    expect(params.format).toBe("webp");
    expect(params.preset).toBe("thumbnail");
    expect(params.text).toBe("How to Fix Broken Images");
    expect(params.thumbnailLabel).toBe("Guide");
    expect(params.thumbnailStyle).toBe("lines");
    expect(params.thumbnailTheme).toBe("dark");
    expect(params.thumbnailAccent).toBe("F97316");
  });

  it("should parse colors from path", () => {
    const request = new Request("https://fallback.pics/400x300/FF0000/FFFFFF");
    const router = new Router(request);
    const params = router.parse();

    expect(params.bgColor).toBe("#FF0000");
    expect(params.textColor).toBe("#FFFFFF");
  });

  it("should parse colors from query params", () => {
    const request = new Request(
      "https://fallback.pics/400x300?bg=00FF00&fg=000000",
    );
    const router = new Router(request);
    const params = router.parse();

    expect(params.bgColor).toBe("#00FF00");
    expect(params.textColor).toBe("#000000");
  });

  it("should parse custom text", () => {
    const request = new Request(
      "https://fallback.pics/400x300?text=Hello+World",
    );
    const router = new Router(request);
    const params = router.parse();

    expect(params.text).toBe("Hello World");
  });

  it("should validate dimensions", () => {
    const request = new Request("https://fallback.pics/10000x10000");
    const router = new Router(request);

    expect(() => router.parse()).toThrow("Invalid dimensions");
  });

  it("should handle 3-char hex colors", () => {
    const request = new Request("https://fallback.pics/400x300/F00/FFF");
    const router = new Router(request);
    const params = router.parse();

    expect(params.bgColor).toBe("#FF0000");
    expect(params.textColor).toBe("#FFFFFF");
  });
});
