import { describe, it, expect } from 'vitest';
import { generateImage } from './generator';
import { ImageParams } from './router';
import { ImagesEncoder } from './raster';

function textContent(content: BodyInit): string {
  return content as string;
}

function fakeImagesEncoder(contentType: string): ImagesEncoder {
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
              return contentType;
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

describe('generateImage', () => {
  it('should generate standard SVG', async () => {
    const params: ImageParams = {
      width: 400,
      height: 300,
      format: 'svg',
      bgColor: '#7C3AED',
      textColor: '#FFFFFF',
    };
    
    const result = await generateImage(params);
    
    expect(result.format).toBe('svg');
    expect(result.contentType).toBe('image/svg+xml; charset=utf-8');
    expect(textContent(result.content)).toContain('<svg');
    expect(textContent(result.content)).toContain('width="400"');
    expect(textContent(result.content)).toContain('height="300"');
    expect(textContent(result.content)).toContain('#7C3AED');
    expect(textContent(result.content)).toContain('400 × 300');
  });

  it('should generate avatar SVG', async () => {
    const params: ImageParams = {
      width: 200,
      height: 200,
      format: 'svg',
      bgColor: '#7C3AED',
      textColor: '#FFFFFF',
      preset: 'avatar',
      text: 'John Doe',
    };
    
    const result = await generateImage(params);
    
    expect(textContent(result.content)).toContain('<circle');
    expect(textContent(result.content)).toContain('JD'); // Should show initials
  });

  it('should generate skeleton SVG', async () => {
    const params: ImageParams = {
      width: 400,
      height: 300,
      format: 'svg',
      bgColor: '#E5E5E5',
      textColor: '#FFFFFF',
      preset: 'skeleton',
    };
    
    const result = await generateImage(params);
    
    expect(textContent(result.content)).toContain('shimmer');
    expect(textContent(result.content)).toContain('<animate');
  });

  it('should escape XML in custom text', async () => {
    const params: ImageParams = {
      width: 400,
      height: 300,
      format: 'svg',
      bgColor: '#7C3AED',
      textColor: '#FFFFFF',
      text: '<script>alert("XSS")</script>',
    };
    
    const result = await generateImage(params);
    
    expect(textContent(result.content)).not.toContain('<script>');
    expect(textContent(result.content)).toContain('&lt;script&gt;');
  });

  it('should encode PNG output with the Images binding', async () => {
    const params: ImageParams = {
      width: 400,
      height: 300,
      format: 'png',
      bgColor: '#7C3AED',
      textColor: '#FFFFFF',
    };

    const result = await generateImage(params, fakeImagesEncoder('image/png'));

    expect(result.format).toBe('png');
    expect(result.contentType).toBe('image/png');
    await expect(new Response(result.content).text()).resolves.toBe('encoded-image/png');
  });

  it('should encode JPEG output with the Images binding', async () => {
    const params: ImageParams = {
      width: 400,
      height: 300,
      format: 'jpg',
      bgColor: '#7C3AED',
      textColor: '#FFFFFF',
    };

    const result = await generateImage(params, fakeImagesEncoder('image/jpeg'));

    expect(result.format).toBe('jpg');
    expect(result.contentType).toBe('image/jpeg');
  });

  it('should encode WebP output with the Images binding', async () => {
    const params: ImageParams = {
      width: 400,
      height: 300,
      format: 'webp',
      bgColor: '#7C3AED',
      textColor: '#FFFFFF',
    };

    const result = await generateImage(params, fakeImagesEncoder('image/webp'));

    expect(result.format).toBe('webp');
    expect(result.contentType).toBe('image/webp');
  });

  it('should require the Images binding for raster output', async () => {
    const params: ImageParams = {
      width: 400,
      height: 300,
      format: 'webp',
      bgColor: '#7C3AED',
      textColor: '#FFFFFF',
    };

    await expect(generateImage(params)).rejects.toThrow('Raster output requires the Cloudflare Images binding');
  });
});
