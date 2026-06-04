import { ImageParams } from './router';

export type SupportedOutputFormat = Extract<ImageParams['format'], 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp'>;

export type ImagesEncoder = Pick<ImagesBinding, 'input'>;

export interface EncodedImage {
  body: BodyInit;
  contentType: string;
}

const OUTPUT_CONTENT_TYPES: Record<SupportedOutputFormat, string> = {
  svg: 'image/svg+xml; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

const IMAGE_BINDING_FORMATS: Record<Exclude<SupportedOutputFormat, 'svg'>, ImageOutputOptions['format']> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

export function getContentType(format: SupportedOutputFormat): string {
  return OUTPUT_CONTENT_TYPES[format];
}

export function isSupportedOutputFormat(format: ImageParams['format']): format is SupportedOutputFormat {
  return format === 'svg' || format === 'png' || format === 'jpg' || format === 'jpeg' || format === 'webp';
}

export function extractFormatFromSegment(segment: string | undefined): SupportedOutputFormat {
  const match = segment?.match(/\.(svg|png|jpg|jpeg|webp)$/i);
  return match ? (match[1].toLowerCase() as SupportedOutputFormat) : 'svg';
}

export async function encodeSvg(svg: string, format: SupportedOutputFormat, images?: ImagesEncoder): Promise<EncodedImage> {
  if (format === 'svg') {
    return {
      body: svg,
      contentType: OUTPUT_CONTENT_TYPES.svg,
    };
  }

  if (!images) {
    throw new Error('Raster output requires the Cloudflare Images binding');
  }

  const svgBody = new Response(svg, {
    headers: { 'Content-Type': OUTPUT_CONTENT_TYPES.svg },
  }).body;

  if (!svgBody) {
    throw new Error('Unable to create SVG stream for raster encoding');
  }

  const output = await images.input(svgBody).output({
    format: IMAGE_BINDING_FORMATS[format],
    quality: format === 'png' ? undefined : 85,
  });

  return {
    body: output.image(),
    contentType: output.contentType() || OUTPUT_CONTENT_TYPES[format],
  };
}

