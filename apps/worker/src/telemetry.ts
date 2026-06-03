/**
 * New Relic Telemetry Integration for Cloudflare Workers
 * Non-blocking metrics collection using event.waitUntil()
 */

export interface Env {
  NEW_RELIC_LICENSE_KEY?: string;
  NEW_RELIC_APP_NAME?: string;
  NEW_RELIC_ENABLED?: string;
  GOOGLE_ANALYTICS_MEASUREMENT_ID?: string;
  GOOGLE_ANALYTICS_API_SECRET?: string;
  GOOGLE_ANALYTICS_ENABLED?: string;
  GOOGLE_ANALYTICS_CLIENT_ID_SALT?: string;
  GOOGLE_ANALYTICS_WORKER_EVENT_NAME?: string;
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

type AnalyticsParamValue = string | number | boolean | null | undefined;

class GoogleAnalyticsTelemetry {
  private measurementId: string;
  private apiSecret: string;
  private enabled: boolean;
  private clientIdSalt: string;
  private workerEventName: string;
  private endpoint = 'https://www.google-analytics.com/mp/collect';

  constructor(env: Env) {
    this.measurementId = env.GOOGLE_ANALYTICS_MEASUREMENT_ID || '';
    this.apiSecret = env.GOOGLE_ANALYTICS_API_SECRET || '';
    this.enabled = env.GOOGLE_ANALYTICS_ENABLED !== 'false' && !!this.measurementId && !!this.apiSecret;
    this.clientIdSalt = env.GOOGLE_ANALYTICS_CLIENT_ID_SALT || this.apiSecret || this.measurementId;
    this.workerEventName = this.normalizeEventName(env.GOOGLE_ANALYTICS_WORKER_EVENT_NAME || 'fallback_worker_request');
  }

  async trackWorkerRequest(request: Request, metrics: RequestMetrics): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const url = new URL(request.url);
    const clientId = await this.resolveClientId(request);
    const sanitizedLocation = `${url.origin}${url.pathname}`;
    const sanitizedReferrer = this.sanitizeUrl(request.headers.get('referer'));

    await this.sendEvent(this.workerEventName, clientId, {
      engagement_time_msec: 1,
      page_location: sanitizedLocation,
      page_referrer: sanitizedReferrer,
      page_title: `fallback.pics ${metrics.route}`,
      request_path: url.pathname,
      request_route: metrics.route,
      request_method: metrics.method,
      status_code: metrics.statusCode,
      response_time_ms: metrics.responseTime,
      country: metrics.country,
      user_agent_category: getUserAgentCategory(metrics.userAgent),
      image_width: metrics.imageWidth,
      image_height: metrics.imageHeight,
      image_format: metrics.imageFormat,
      custom_text: metrics.customText ? 'true' : 'false',
      error_message: metrics.errorMessage,
      source: 'cloudflare_worker',
    });
  }

  private async sendEvent(
    name: string,
    clientId: string,
    params: Record<string, AnalyticsParamValue>
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.endpoint}?measurement_id=${encodeURIComponent(this.measurementId)}&api_secret=${encodeURIComponent(this.apiSecret)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            non_personalized_ads: true,
            events: [
              {
                name,
                params: this.cleanParams(params),
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        console.error('Google Analytics telemetry failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Google Analytics telemetry error:', error);
    }
  }

  private cleanParams(params: Record<string, AnalyticsParamValue>): Record<string, string | number> {
    return Object.entries(params).reduce<Record<string, string | number>>((cleaned, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return cleaned;
      }

      cleaned[key] = this.cleanParamValue(value);
      return cleaned;
    }, {});
  }

  private cleanParamValue(value: Exclude<AnalyticsParamValue, null | undefined>): string | number {
    if (typeof value === 'number') {
      return value;
    }

    return String(value).slice(0, 100);
  }

  private normalizeEventName(value: string): string {
    const normalized = value.replace(/[^a-zA-Z0-9_]/g, '_');
    const withValidPrefix = /^[a-zA-Z]/.test(normalized) ? normalized : `event_${normalized}`;
    return withValidPrefix.slice(0, 40);
  }

  private async resolveClientId(request: Request): Promise<string> {
    const cookieClientId = this.getGoogleAnalyticsClientId(request.headers.get('cookie'));
    if (cookieClientId) {
      return cookieClientId;
    }

    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const ip = request.headers.get('CF-Connecting-IP') || forwardedFor || '';
    const userAgent = request.headers.get('user-agent') || '';
    const country = request.cf?.country as string | undefined;
    const source = `${this.clientIdSalt}:${ip}:${userAgent}:${country || ''}`;
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
    const bytes = Array.from(new Uint8Array(digest));
    const hex = bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    const first = parseInt(hex.slice(0, 8), 16);
    const second = parseInt(hex.slice(8, 16), 16);

    return `${first}.${second}`;
  }

  private getGoogleAnalyticsClientId(cookieHeader: string | null): string | undefined {
    if (!cookieHeader) {
      return undefined;
    }

    const gaCookie = cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('_ga='));

    if (!gaCookie) {
      return undefined;
    }

    const value = decodeURIComponent(gaCookie.slice(4));
    const segments = value.split('.');
    const clientId = segments.length >= 4 ? segments.slice(-2).join('.') : value;

    return /^\d+\.\d+$/.test(clientId) ? clientId : undefined;
  }

  private sanitizeUrl(value: string | null): string | undefined {
    if (!value) {
      return undefined;
    }

    try {
      const url = new URL(value);
      return `${url.origin}${url.pathname}`;
    } catch {
      return undefined;
    }
  }
}

export { NewRelicTelemetry, GoogleAnalyticsTelemetry };

function normalizeTelemetryPathname(pathname: string): string {
  if (pathname.startsWith('/api/v1/')) {
    pathname = pathname.substring(8);
  }

  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1);
  }

  return pathname;
}

function extractDimensionsFromSegment(segment: string | undefined, defaultHeight?: number): { width?: number; height?: number } {
  if (!segment) {
    return {};
  }

  const dimensionStr = segment.replace(/\.(svg|png|jpg|jpeg|webp|avif|gif)$/i, '');
  const match = /^(\d+)(?:x(\d+))?$/.exec(dimensionStr);

  if (!match) {
    return {};
  }

  const width = parseInt(match[1], 10);
  const height = match[2] ? parseInt(match[2], 10) : defaultHeight ?? width;

  return { width, height };
}

/**
 * Helper function to extract route information from pathname
 */
export function extractRoute(pathname: string): string {
  pathname = normalizeTelemetryPathname(pathname);

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
  pathname = normalizeTelemetryPathname(pathname);

  const segments = pathname.split('/');
  const firstSegment = segments[0];

  // Handle special routes
  if (firstSegment === 'avatar' && segments[1]) {
    return extractDimensionsFromSegment(segments[1]);
  }

  if (firstSegment === 'square' && segments[1]) {
    return extractDimensionsFromSegment(segments[1]);
  }

  if (firstSegment === 'banner' && segments[1]) {
    return extractDimensionsFromSegment(segments[1], 400);
  }

  if (firstSegment === 'ai' && segments[1]) {
    return extractDimensionsFromSegment(segments[1]);
  }

  if ((firstSegment === 'skeleton' || firstSegment === 'blur' || firstSegment === 'gradient') && segments[1]) {
    return extractDimensionsFromSegment(segments[1]);
  }

  if ((firstSegment === 'animated' || firstSegment === 'chart') && segments[2]) {
    return extractDimensionsFromSegment(segments[2]);
  }

  // Standard dimensions
  return extractDimensionsFromSegment(firstSegment);
}

export function extractFormat(pathname: string): string {
  const match = /\.(svg|png|jpg|jpeg|webp|avif|gif)$/i.exec(pathname);
  return match ? match[1].toLowerCase() : 'svg';
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
