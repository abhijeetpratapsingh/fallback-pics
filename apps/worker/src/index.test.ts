import { describe, expect, it } from "vitest";
import worker, { Env } from "./index";
import { ImagesEncoder } from "./raster";

function fakeImagesEncoder(): ImagesEncoder {
  return {
    input() {
      return {
        transform() {
          return this;
        },
        draw() {
          return this;
        },
        async output(options) {
          return {
            response() {
              return new Response("encoded-image", {
                headers: { "Content-Type": options.format },
              });
            },
            contentType() {
              return options.format;
            },
            image() {
              return new Response(`encoded-${options.format}`).body!;
            },
          };
        },
      };
    },
  };
}

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
} as unknown as ExecutionContext;

describe("worker raster formats", () => {
  it("returns PNG bytes and headers for .png routes", async () => {
    const env: Env = {
      IMAGES: fakeImagesEncoder(),
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request("https://fallback.pics/api/v1/400x300.png"),
      env,
      ctx,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    await expect(response.text()).resolves.toBe("encoded-image/png");
  });

  it("returns JPEG bytes and headers for .jpg routes", async () => {
    const env: Env = {
      IMAGES: fakeImagesEncoder(),
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request("https://fallback.pics/api/v1/400x300.jpg"),
      env,
      ctx,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    await expect(response.text()).resolves.toBe("encoded-image/jpeg");
  });

  it("returns WebP bytes and headers for preset .webp routes", async () => {
    const env: Env = {
      IMAGES: fakeImagesEncoder(),
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request("https://fallback.pics/api/v1/avatar/200.webp?text=JD"),
      env,
      ctx,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    await expect(response.text()).resolves.toBe("encoded-image/webp");
  });

  it("returns SVG blog thumbnails with safe-zone decoration styles", async () => {
    const env: Env = {
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request(
        "https://fallback.pics/api/v1/thumbnail/1200x630?text=Prevent+Layout+Shift+From+Missing+Images&style=lines&label=Performance&theme=dark",
      ),
      env,
      ctx,
    );

    const body = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("image/svg+xml");
    expect(body).toContain("PERFORMANCE");
    expect(body).toContain("Prevent Layout");
    expect(body).toContain("Missing Images");
  });

  it("rejects unsupported .gif format with 400", async () => {
    const env: Env = {
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request("https://fallback.pics/api/v1/400x300.gif"),
      env,
      ctx,
    );

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.toContain("Unsupported image format");
  });

  it("returns avatar initials instead of full text", async () => {
    const env: Env = {
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request("https://fallback.pics/api/v1/avatar/200?text=John+Doe"),
      env,
      ctx,
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("JD");
    expect(body).not.toContain("John");
  });

  it("escapes AI custom text in SVG output", async () => {
    const env: Env = {
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request(
        "https://fallback.pics/api/v1/ai/400x300?text=%3Cscript%3Ealert(1)%3C%2Fscript%3E",
      ),
      env,
      ctx,
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).not.toContain("<script>");
    expect(body).toContain("&lt;script&gt;");
  });

  it("rejects zero-width dimensions", async () => {
    const env: Env = {
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request("https://fallback.pics/api/v1/0x300"),
      env,
      ctx,
    );

    expect(response.status).toBe(400);
  });

  it("shows banner custom text from query param", async () => {
    const env: Env = {
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request(
        "https://fallback.pics/api/v1/banner/1200x400?text=Launch+Week",
      ),
      env,
      ctx,
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("Launch Week");
  });

  it("returns 503 when raster format requested without Images binding", async () => {
    const env: Env = {
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request("https://fallback.pics/api/v1/400x300.png"),
      env,
      ctx,
    );

    expect(response.status).toBe(503);
    await expect(response.text()).resolves.toContain(
      "Raster output requires the Cloudflare Images binding",
    );
  });

  it("returns raster encoded thumbnail responses", async () => {
    const env: Env = {
      IMAGES: fakeImagesEncoder(),
      GOOGLE_ANALYTICS_ENABLED: "false",
      NEW_RELIC_ENABLED: "false",
    };

    const response = await worker.fetch(
      new Request(
        "https://fallback.pics/api/v1/thumbnail/1200x630.webp?text=Blog+Thumbnail",
      ),
      env,
      ctx,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    await expect(response.text()).resolves.toBe("encoded-image/webp");
  });
});
