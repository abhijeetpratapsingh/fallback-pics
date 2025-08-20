/**
 * Accessibility utilities for fallback.pics
 */

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within an element (useful for modals)
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });

  firstFocusable?.focus();
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate animation duration based on user preference
 */
export function getAnimationDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 0 : defaultDuration;
}

/**
 * Manage focus for route changes in SPAs
 */
export function handleRouteChange(targetId?: string) {
  const target = targetId 
    ? document.getElementById(targetId)
    : document.querySelector('main, [role="main"]');
    
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus();
    
    setTimeout(() => {
      target.removeAttribute('tabindex');
    }, 0);
  }
  
  announceToScreenReader('Page navigation completed', 'polite');
}

/**
 * Create a live region for dynamic content updates
 */
export function createLiveRegion(id: string, ariaLive: 'polite' | 'assertive' = 'polite') {
  const region = document.createElement('div');
  region.id = id;
  region.setAttribute('aria-live', ariaLive);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.appendChild(region);
  return region;
}

/**
 * Update live region content
 */
export function updateLiveRegion(id: string, message: string) {
  const region = document.getElementById(id);
  if (region) {
    region.textContent = message;
  }
}

/**
 * Keyboard navigation helper
 */
export function handleArrowKeyNavigation(
  e: KeyboardEvent,
  currentIndex: number,
  items: HTMLElement[],
  options: { loop?: boolean; orientation?: 'horizontal' | 'vertical' | 'both' } = {}
) {
  const { loop = true, orientation = 'both' } = options;
  let nextIndex = currentIndex;

  switch (e.key) {
    case 'ArrowUp':
      if (orientation === 'horizontal') return;
      nextIndex = currentIndex - 1;
      break;
    case 'ArrowDown':
      if (orientation === 'horizontal') return;
      nextIndex = currentIndex + 1;
      break;
    case 'ArrowLeft':
      if (orientation === 'vertical') return;
      nextIndex = currentIndex - 1;
      break;
    case 'ArrowRight':
      if (orientation === 'vertical') return;
      nextIndex = currentIndex + 1;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = items.length - 1;
      break;
    default:
      return;
  }

  if (loop) {
    nextIndex = (nextIndex + items.length) % items.length;
  } else {
    nextIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
  }

  items[nextIndex]?.focus();
  e.preventDefault();
}

/**
 * Check color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hexColor: string) => {
    const rgb = hexColor.match(/[A-Fa-f0-9]{2}/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(val => {
      const channel = parseInt(val, 16) / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG standards
 */
export function meetsWCAGContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AA') {
    return largeText ? ratio >= 3 : ratio >= 4.5;
  } else {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }
}

/**
 * Debounce function for screen reader announcements
 */
export function debounceAnnouncement(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format text for screen readers
 */
export function formatForScreenReader(text: string, options: {
  expandAbbreviations?: boolean;
  spellOutNumbers?: boolean;
} = {}): string {
  let formatted = text;
  
  if (options.expandAbbreviations) {
    formatted = formatted
      .replace(/\betc\b/gi, 'et cetera')
      .replace(/\be\.g\./gi, 'for example')
      .replace(/\bi\.e\./gi, 'that is');
  }
  
  if (options.spellOutNumbers) {
    formatted = formatted.replace(/\d+/g, match => {
      return match.split('').join(' ');
    });
  }
  
  return formatted;
}

/**
 * Set up skip links
 */
export function setupSkipLinks() {
  const skipLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#footer', text: 'Skip to footer' }
  ];
  
  const container = document.createElement('div');
  container.className = 'skip-links';
  container.setAttribute('role', 'navigation');
  container.setAttribute('aria-label', 'Skip links');
  
  skipLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.className = 'skip-link';
    anchor.textContent = link.text;
    container.appendChild(anchor);
  });
  
  document.body.insertBefore(container, document.body.firstChild);
}