export type NavItem = {
  label: string;
  href: string;
  homeHref?: string;
  active?: string | string[];
  external?: boolean;
};

export const siteNav: NavItem[] = [
  { label: 'Generator', href: '/placeholder-image-generator/', homeHref: '#hero-demo', active: '/placeholder-image-generator' },
  { label: 'Docs', href: '/docs/', active: ['/docs', '/guides'] },
  { label: 'API', href: '/api/', active: '/api' },
  { label: 'Features', href: '/features/', active: '/features' },
  { label: 'Blog', href: '/blog/', active: '/blog' },
  { label: 'GitHub', href: 'https://github.com/abhijeetpratapsingh/fallback-pics', external: true },
  { label: 'Status', href: 'https://status.fallback.pics', external: true },
];

export const footerSections = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/features/' },
      { label: 'Placeholder image generator', href: '/placeholder-image-generator/' },
      { label: 'Enterprise', href: '/#enterprise' },
      { label: 'Status', href: 'https://status.fallback.pics', external: true },
      { label: 'Privacy', href: '/privacy/' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs/' },
      { label: 'API Reference', href: '/api/' },
      { label: 'Guides', href: '/guides/nextjs-image-fallback/' },
      { label: 'GitHub', href: 'https://github.com/abhijeetpratapsingh/fallback-pics', external: true },
    ],
  },
  {
    heading: 'Use Cases',
    links: [
      { label: 'Placeholder image API', href: '/placeholder-image-api/' },
      { label: 'Dummy image generator', href: '/dummy-image-generator/' },
      { label: 'Broken image fallback', href: '/broken-image-fallback/' },
      { label: 'React image fallback', href: '/guides/react-image-fallback/' },
      { label: 'Next.js image fallback', href: '/guides/nextjs-image-fallback/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Blog', href: '/blog/' },
      { label: 'Support', href: 'mailto:support@fallback.pics' },
      { label: 'Terms', href: '/terms/' },
      { label: 'Contact sales', href: 'mailto:support@fallback.pics?subject=Enterprise%20fallback.pics' },
    ],
  },
];
