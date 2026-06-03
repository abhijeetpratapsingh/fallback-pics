import { afterEach, describe, expect, it, vi } from 'vitest';
import { extractDimensions, extractFormat, extractRoute, GoogleAnalyticsTelemetry } from './telemetry';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('telemetry helpers', () => {
  it('extracts dimensions for standard and preset routes', () => {
    expect(extractDimensions('/api/v1/400x300')).toEqual({ width: 400, height: 300 });
    expect(extractDimensions('/api/v1/avatar/128')).toEqual({ width: 128, height: 128 });
    expect(extractDimensions('/api/v1/banner/1200x400')).toEqual({ width: 1200, height: 400 });
    expect(extractDimensions('/api/v1/animated/pulse/640x360')).toEqual({ width: 640, height: 360 });
    expect(extractDimensions('/api/v1/chart/bar/600x400')).toEqual({ width: 600, height: 400 });
  });

  it('extracts route and requested format metadata', () => {
    expect(extractRoute('/api/v1/avatar/128')).toBe('avatar');
    expect(extractRoute('/api/v1/animated/pulse/640x360')).toBe('animated-pulse');
    expect(extractRoute('/api/v1/400x300.webp')).toBe('standard');
    expect(extractFormat('/api/v1/400x300.webp')).toBe('webp');
    expect(extractFormat('/api/v1/400x300')).toBe('svg');
  });

  it('does nothing when Google Analytics is not configured', async () => {
    const telemetry = new GoogleAnalyticsTelemetry({});

    await expect(
      telemetry.trackWorkerRequest(new Request('https://fallback.pics/api/v1/400x300?text=Secret'), {
        route: 'standard',
        method: 'GET',
        statusCode: 200,
        responseTime: 4,
        imageWidth: 400,
        imageHeight: 300,
        imageFormat: 'svg',
        customText: true,
      })
    ).resolves.toBeUndefined();
  });

  it('sends sanitized Worker events to Google Analytics', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      requests.push({ url: String(input), init });
      return new Response(null, { status: 204 });
    }) as typeof fetch;

    const telemetry = new GoogleAnalyticsTelemetry({
      GOOGLE_ANALYTICS_MEASUREMENT_ID: 'G-TEST123',
      GOOGLE_ANALYTICS_API_SECRET: 'secret',
    });

    await telemetry.trackWorkerRequest(
      new Request('https://fallback.pics/api/v1/400x300?text=Private+Text', {
        headers: {
          cookie: '_ga=GA1.1.12345.67890',
          referer: 'https://fallback.pics/docs?utm_source=private',
        },
      }),
      {
        route: 'standard',
        method: 'GET',
        statusCode: 200,
        responseTime: 4,
        imageWidth: 400,
        imageHeight: 300,
        imageFormat: 'svg',
        customText: true,
      }
    );

    expect(requests).toHaveLength(1);
    expect(requests[0].url).toContain('measurement_id=G-TEST123');
    expect(requests[0].url).toContain('api_secret=secret');

    const body = JSON.parse(requests[0].init?.body as string);
    expect(body.client_id).toBe('12345.67890');
    expect(JSON.stringify(body)).not.toContain('Private+Text');
    expect(body.events[0].name).toBe('fallback_worker_request');
    expect(body.events[0].params.page_location).toBe('https://fallback.pics/api/v1/400x300');
    expect(body.events[0].params.page_referrer).toBe('https://fallback.pics/docs');
    expect(body.events[0].params.custom_text).toBe('true');
  });
});
