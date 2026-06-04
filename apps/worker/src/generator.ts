import { ImageParams } from './router';
import { generateAISVG } from './ai-generator';
import { generateAnimatedSVG } from './animated-generator';
import { generateChartSVG } from './chart-generator';
import { encodeSvg, getContentType, ImagesEncoder, isSupportedOutputFormat, SupportedOutputFormat } from './raster';

export interface GeneratedImage {
  content: BodyInit;
  format: SupportedOutputFormat;
  contentType: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function generateImage(params: ImageParams, images?: ImagesEncoder): Promise<GeneratedImage> {
  const { width, height, bgColor, textColor, text, preset, format, font, fontSize, retina, context, mood, animationType, chartType, reducedMotion } = params;
  
  // Apply retina scaling if specified
  const scaledWidth = retina ? width * retina : width;
  const scaledHeight = retina ? height * retina : height;
  const scaledFontSize = fontSize && retina ? fontSize * retina : fontSize;

  if (!isSupportedOutputFormat(format)) {
    throw new Error(`Unsupported image format: ${format}`);
  }

  const outputFormat = format as SupportedOutputFormat;

  let svg: string;

  switch (preset) {
    case 'skeleton':
      svg = generateSkeletonSVG(scaledWidth, scaledHeight, bgColor);
      break;
    case 'blur':
      svg = generateBlurSVG(scaledWidth, scaledHeight, bgColor, textColor, text);
      break;
    case 'avatar':
      svg = generateAvatarSVG(scaledWidth, scaledHeight, bgColor, textColor, text);
      break;
    case 'random':
      // For random images, we'd integrate with Unsplash API
      // For now, generate a pattern
      svg = generatePatternSVG(scaledWidth, scaledHeight);
      break;
    case 'ai':
      // AI-powered contextual patterns
      svg = generateAISVG(scaledWidth, scaledHeight, context, mood);
      break;
    case 'animated':
      // Animated placeholders
      svg = generateAnimatedSVG(scaledWidth, scaledHeight, animationType || 'skeleton', bgColor, textColor, reducedMotion || false);
      break;
    case 'chart':
      // Data visualization placeholders
      svg = generateChartSVG(scaledWidth, scaledHeight, chartType || 'bar', bgColor, textColor, text);
      break;
    default:
      svg = generateStandardSVG(scaledWidth, scaledHeight, bgColor, textColor, text, font, scaledFontSize);
  }

  const encoded = await encodeSvg(svg, outputFormat, images);

  return {
    content: encoded.body,
    format: outputFormat,
    contentType: encoded.contentType || getContentType(outputFormat),
  };
}

function generateStandardSVG(
  width: number, 
  height: number, 
  bgColor: string, 
  textColor: string, 
  text?: string,
  font?: string,
  customFontSize?: number
): string {
  let displayText = text || `${width} × ${height}`;
  // Support newlines with \n
  const hasNewlines = displayText.includes('\\n');
  const lines = hasNewlines ? displayText.split('\\n') : [displayText];
  
  const fontSize = customFontSize || Math.max(14, Math.min(width, height) * 0.1);
  
  // Font mapping (quotes will be handled in SVG)
  const fontFamilies: Record<string, string> = {
    'system': 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    'sans': 'Inter, system-ui, -apple-system, sans-serif',
    'serif': 'Georgia, Cambria, Times New Roman, Times, serif',
    'mono': 'Geist Mono, JetBrains Mono, Fira Code, Consolas, monospace',
    'inter': 'Inter, sans-serif',
    'roboto': 'Roboto, sans-serif',
    'lato': 'Lato, sans-serif',
    'montserrat': 'Montserrat, sans-serif',
    'opensans': 'Open Sans, sans-serif',
    'raleway': 'Raleway, sans-serif',
    'poppins': 'Poppins, sans-serif'
  };
  
  const fontFamily = fontFamilies[font || 'system'] || fontFamilies['system'];
  const isTransparent = bgColor === 'transparent';

  // Generate text elements for multiline text
  let textElements = '';
  if (hasNewlines) {
    const lineHeight = fontSize * 1.2;
    const startY = (height / 2) - ((lines.length - 1) * lineHeight / 2);
    
    textElements = lines.map((line, index) => 
      `<text x="50%" y="${startY + index * lineHeight}" 
            font-family="${fontFamily}" 
            font-size="${fontSize}" 
            font-weight="500"
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle">${escapeXml(line)}</text>`
    ).join('\n  ');
  } else {
    textElements = `<text x="50%" y="50%" 
        font-family="${fontFamily}" 
        font-size="${fontSize}" 
        font-weight="500"
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle">${escapeXml(displayText)}</text>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(lines.join(' '))}">
  ${!isTransparent ? `<rect width="100%" height="100%" fill="${bgColor}"/>` : ''}
  ${textElements}
</svg>`;
}

function generateAvatarSVG(
  size: number, 
  height: number, 
  bgColor: string, 
  textColor: string, 
  text?: string
): string {
  const displayText = text || 'USER';
  const fontSize = size * 0.4;
  const initials = displayText.split(/\s+/)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Avatar">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${bgColor}"/>
  <text x="50%" y="50%" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${fontSize}" 
        font-weight="600"
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle">${escapeXml(initials)}</text>
</svg>`;
}

function generateSkeletonSVG(width: number, height: number, bgColor: string): string {
  const shimmerColor = adjustBrightness(bgColor, 20);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${bgColor}" stop-opacity="1">
        <animate attributeName="offset" values="-2;1" dur="2s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="${shimmerColor}" stop-opacity="1">
        <animate attributeName="offset" values="-1;2" dur="2s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="1">
        <animate attributeName="offset" values="0;3" dur="2s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#shimmer)"/>
</svg>`;
}

function generateBlurSVG(
  width: number, 
  height: number, 
  bgColor: string, 
  textColor: string,
  text?: string
): string {
  const displayText = text || `${width} × ${height}`;
  const fontSize = Math.max(14, Math.min(width, height) * 0.1);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}" filter="url(#blur)"/>
  <text x="50%" y="50%" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${fontSize}" 
        font-weight="500"
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        filter="url(#blur)">${escapeXml(displayText)}</text>
</svg>`;
}

function generatePatternSVG(width: number, height: number): string {
  // Generate a colorful geometric pattern
  const colors = ['#7C3AED', '#3B82F6', '#10B981', '#F97316'];
  const patternSize = 40;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="pattern" x="0" y="0" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="${patternSize/2}" height="${patternSize/2}" fill="${colors[0]}"/>
      <rect x="${patternSize/2}" y="0" width="${patternSize/2}" height="${patternSize/2}" fill="${colors[1]}"/>
      <rect x="0" y="${patternSize/2}" width="${patternSize/2}" height="${patternSize/2}" fill="${colors[2]}"/>
      <rect x="${patternSize/2}" y="${patternSize/2}" width="${patternSize/2}" height="${patternSize/2}" fill="${colors[3]}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#pattern)"/>
</svg>`;
}

function adjustBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse RGB values
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.floor((num >> 16) * (1 + percent / 100)));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) * (1 + percent / 100)));
  const b = Math.min(255, Math.floor((num & 0x0000FF) * (1 + percent / 100)));
  
  // Convert back to hex
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase();
}
