import { describe, expect, it } from 'vitest';
import worker, { Env } from './index';
import { ImagesEncoder } from './raster';

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
              return new Response('encoded-image', {
                headers: { 'Content-Type': options.format },
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

describe('worker raster formats', () => {
  it('returns PNG bytes and headers for .png routes', async () => {
    const env: Env = {
      IMAGES: fakeImagesEncoder(),
      GOOGLE_ANALYTICS_ENABLED: 'false',
      NEW_RELIC_ENABLED: 'false',
    };

    const response = await worker.fetch(new Request('https://fallback.pics/api/v1/400x300.png'), env, ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
    await expect(response.text()).resolves.toBe('encoded-image/png');
  });

  it('returns JPEG bytes and headers for .jpg routes', async () => {
    const env: Env = {
      IMAGES: fakeImagesEncoder(),
      GOOGLE_ANALYTICS_ENABLED: 'false',
      NEW_RELIC_ENABLED: 'false',
    };

    const response = await worker.fetch(new Request('https://fallback.pics/api/v1/400x300.jpg'), env, ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/jpeg');
    await expect(response.text()).resolves.toBe('encoded-image/jpeg');
  });

  it('returns WebP bytes and headers for preset .webp routes', async () => {
    const env: Env = {
      IMAGES: fakeImagesEncoder(),
      GOOGLE_ANALYTICS_ENABLED: 'false',
      NEW_RELIC_ENABLED: 'false',
    };

    const response = await worker.fetch(new Request('https://fallback.pics/api/v1/avatar/200.webp?text=JD'), env, ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/webp');
    await expect(response.text()).resolves.toBe('encoded-image/webp');
  });
});

