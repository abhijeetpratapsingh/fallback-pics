import { afterEach, describe, expect, it, vi } from "vitest";

import * as appEntrypoint from "./[[catchall]]";
import { buildWorkerUrl, onRequest, type PagesFunctionContext } from "./proxy";
import * as rootEntrypoint from "../../../../../functions/api/v1/[[catchall]]";

function contextFor(
  request: Request,
  workerOrigin = "https://worker.example.com/",
): PagesFunctionContext {
  return {
    request,
    env: {
      WORKER_ORIGIN: workerOrigin,
    },
  };
}

describe("Pages API v1 proxy", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps both Cloudflare Pages entrypoints wired to the same implementation", () => {
    expect(rootEntrypoint.buildWorkerUrl).toBe(appEntrypoint.buildWorkerUrl);
    expect(rootEntrypoint.onRequest).toBe(appEntrypoint.onRequest);
  });

  it("builds worker URLs from WORKER_ORIGIN while preserving path and query string", () => {
    expect(
      buildWorkerUrl(
        "https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Product+Image&format=svg",
        "https://fallback-pics.example.workers.dev///",
      ),
    ).toBe(
      "https://fallback-pics.example.workers.dev/400x300/7C3AED/FFFFFF?text=Product+Image&format=svg",
    );
  });

  it("responds to OPTIONS without proxying to the worker", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest(
      contextFor(
        new Request("https://fallback.pics/api/v1/400x300", {
          method: "OPTIONS",
        }),
      ),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, HEAD, OPTIONS",
    );
  });

  it("fails clearly when WORKER_ORIGIN is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({
      request: new Request("https://fallback.pics/api/v1/400x300"),
      env: {},
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("WORKER_ORIGIN is not configured");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("proxies HEAD as GET, forwards query strings, and strips the response body", async () => {
    let forwardedRequest: Request | undefined;
    const fetchMock = vi.fn(async (request: Request) => {
      forwardedRequest = request;

      return new Response("worker body", {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "image/svg+xml",
        },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest(
      contextFor(
        new Request("https://fallback.pics/api/v1/avatar/200?text=JD", {
          method: "HEAD",
          headers: {
            "X-Test-Header": "forward-me",
          },
        }),
        " https://worker.example.com/base/ ",
      ),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(forwardedRequest?.url).toBe(
      "https://worker.example.com/base/avatar/200?text=JD",
    );
    expect(forwardedRequest?.method).toBe("GET");
    expect(forwardedRequest?.headers.get("X-Test-Header")).toBe("forward-me");
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
    expect(response.headers.get("Content-Type")).toContain("image/svg+xml");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, HEAD, OPTIONS",
    );
  });
});
