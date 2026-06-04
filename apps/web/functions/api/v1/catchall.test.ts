import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildWorkerUrl, onRequest } from './[[catchall]]';

const originalFetch = globalThis.fetch;

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.fetch = originalFetch;
});

describe('Pages API proxy', () => {
  it('builds worker URLs from the configured origin and preserves query strings', () => {
    expect(
      buildWorkerUrl(
        'https://fallback.pics/api/v1/400x300/18181B/FFFFFF?text=Hello+World&format=svg',
        'https://worker.example.dev/',
      ),
    ).toBe('https://worker.example.dev/400x300/18181B/FFFFFF?text=Hello+World&format=svg');
  });

  it('proxies HEAD requests as GET and returns no body', async () => {
    let forwardedRequest: Request | undefined;

    globalThis.fetch = vi.fn(async (request: Request) => {
      forwardedRequest = request;

      return new Response('worker-body', {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      });
    }) as typeof fetch;

    const response = await onRequest({
      request: new Request('https://fallback.pics/api/v1/avatar/200?text=JD', {
        method: 'HEAD',
      }),
      env: {
        WORKER_ORIGIN: 'https://worker.example.dev',
      },
    });

    expect(forwardedRequest?.method).toBe('GET');
    expect(forwardedRequest?.url).toBe('https://worker.example.dev/avatar/200?text=JD');
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/svg+xml');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, HEAD, OPTIONS');
    expect(await response.text()).toBe('');
  });

  it('answers OPTIONS preflight without calling the worker', async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as typeof fetch;

    const response = await onRequest({
      request: new Request('https://fallback.pics/api/v1/400x300?text=Preview', {
        method: 'OPTIONS',
      }),
      env: {
        WORKER_ORIGIN: 'https://worker.example.dev',
      },
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, HEAD, OPTIONS');
    expect(await response.text()).toBe('');
  });

  it('returns a clear configuration error when WORKER_ORIGIN is missing', async () => {
    const response = await onRequest({
      request: new Request('https://fallback.pics/api/v1/400x300'),
      env: {},
    });

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('WORKER_ORIGIN is not configured');
  });
});
