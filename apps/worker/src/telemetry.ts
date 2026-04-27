/**
 * New Relic Telemetry Integration for Cloudflare Workers
 * Non-blocking metrics collection using event.waitUntil()
 */

export interface Env {
  NEW_RELIC_LICENSE_KEY?: string;
  NEW_RELIC_APP_NAME?: string;
  NEW_RELIC_ENABLED?: string;
}

export interface MetricData {
  eventType: string;
  timestamp: number;
  [key: string]: any;
}

export interface RequestMetrics {
  route: string;
  method: string;
  statusCode: number;
  responseTime: number;
  country?: string | undefined;
  userAgent?: string | null | undefined;
  imageWidth?: number;
  imageHeight?: number;
  imageFormat?: string;
  customText?: boolean;
  errorMessage?: string;
}

class NewRelicTelemetry {
  private licenseKey: string;
  private appName: string;
  private enabled: boolean;
  private endpoint = 'https://insights-collector.newrelic.com/v1/accounts/7148037/events';

  constructor(env: Env) {
    this.licenseKey = env.NEW_RELIC_LICENSE_KEY || '';
    this.appName = env.NEW_RELIC_APP_NAME || 'fallback-pics';
    this.enabled = env.NEW_RELIC_ENABLED === 'true' && !!this.licenseKey;
  }

  /**
   * Send metrics to New Relic (non-blocking)
   */
  async sendMetrics(metrics: MetricData[]): Promise<void> {
    if (!this.enabled || !this.licenseKey) {
      return;
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-License-Key': this.licenseKey,
        },
        body: JSON.stringify(metrics),
      });

      // Log response for debugging (only in development)
      if (!response.ok) {
        console.error('New Relic telemetry failed:', response.status, await response.text());
      }
    } catch (error) {
      // Silently fail - don't impact the main request
      console.error('New Relic telemetry error:', error);
    }
  }

  /**
   * Track a request with comprehensive metrics
   */
  trackRequest(metrics: RequestMetrics): MetricData {
    return {
      eventType: 'FallbackPicsRequest',
      timestamp: Date.now(),
      appName: this.appName,
      ...metrics,
    };
  }

  /**
   * Track business metrics
   */
  trackBusinessMetric(metric: string, value: number, attributes: Record<string, any> = {}): MetricData {
    return {
      eventType: 'FallbackPicsBusiness',
      timestamp: Date.now(),
      appName: this.appName,
      metric,
      value,
      ...attributes,
    };
  }

  /**
   * Track errors
   */
  trackError(error: string, route: string, statusCode: number, attributes: Record<string, any> = {}): MetricData {
    return {
      eventType: 'FallbackPicsError',
      timestamp: Date.now(),
      appName: this.appName,
      error,
      route,
      statusCode,
      ...attributes,
    };
  }
}

export { NewRelicTelemetry };

/**
 * Helper function to extract route information from pathname
 */
export function extractRoute(pathname: string): string {
  // Remove /api/v1 prefix
  if (pathname.startsWith('/api/v1/')) {
    pathname = pathname.substring(8);
  }

  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1);
  }

  const segments = pathname.split('/');
  const firstSegment = segments[0];

  // Identify special routes
  if (firstSegment === 'avatar') return 'avatar';
  if (firstSegment === 'square') return 'square';
  if (firstSegment === 'banner') return 'banner';
  if (firstSegment === 'chart') return 'chart';
  if (firstSegment === 'ai') return 'ai';
  if (firstSegment === 'skeleton') return 'skeleton';
  if (firstSegment === 'blur') return 'blur';
  if (firstSegment === 'gradient') return 'gradient';
  if (firstSegment === 'animated') return `animated-${segments[1] || 'unknown'}`;
  if (firstSegment.includes('x') || /^\d+$/.test(firstSegment)) return 'standard';

  return 'unknown';
}

/**
 * Helper function to extract dimensions from pathname
 */
export function extractDimensions(pathname: string): { width?: number; height?: number } {
  // Remove /api/v1 prefix and leading slash
  if (pathname.startsWith('/api/v1/')) {
    pathname = pathname.substring(8);
  }
  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1);
  }

  const segments = pathname.split('/');
  const firstSegment = segments[0];

  // Handle special routes
  if (firstSegment === 'avatar' && segments[1]) {
    const size = parseInt(segments[1]);
    return { width: size, height: size };
  }

  if (firstSegment === 'square' && segments[1]) {
    const size = parseInt(segments[1]);
    return { width: size, height: size };
  }

  // Standard dimensions
  const dimensionStr = firstSegment.replace(/\.(svg|png|jpg|jpeg|webp|avif|gif)$/i, '');
  const match = /^(\d+)(?:x(\d+))?$/.exec(dimensionStr);

  if (match) {
    const width = parseInt(match[1]);
    const height = match[2] ? parseInt(match[2]) : width;
    return { width, height };
  }

  return {};
}

/**
 * Helper function to get user agent category
 */
export function getUserAgentCategory(userAgent: string | null | undefined): string {
  if (!userAgent) return 'unknown';

  const ua = userAgent.toLowerCase();
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) return 'bot';
  if (ua.includes('mobile')) return 'mobile';
  if (ua.includes('tablet')) return 'tablet';
  return 'desktop';
}