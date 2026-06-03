type AnalyticsValue = string | number | boolean | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params?: Record<string, string | number>) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  const cleaned = Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, typeof value === 'boolean' ? String(value) : value as string | number])
  );

  window.gtag('event', eventName, cleaned);
}

export function trackConversion(action: string, label?: string) {
  trackEvent('conversion', {
    conversion_action: action,
    event_category: 'conversion',
    event_label: label,
  });
}
