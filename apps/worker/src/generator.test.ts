import { describe, it, expect } from 'vitest';
import { generateImage } from './generator';
import { ImageParams } from './router';

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
    expect(result.content).toContain('<svg');
    expect(result.content).toContain('width="400"');
    expect(result.content).toContain('height="300"');
    expect(result.content).toContain('#7C3AED');
    expect(result.content).toContain('400 × 300');
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
    
    expect(result.content).toContain('<circle');
    expect(result.content).toContain('JD'); // Should show initials
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
    
    expect(result.content).toContain('shimmer');
    expect(result.content).toContain('<animate');
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
    
    expect(result.content).not.toContain('<script>');
    expect(result.content).toContain('&lt;script&gt;');
  });
});