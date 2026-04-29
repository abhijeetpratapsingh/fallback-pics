import { useMemo, useState } from 'react';

const API_BASE = 'https://fallback.pics/api/v1';

type Preset = 'standard' | 'avatar' | 'banner' | 'skeleton' | 'blur';
type CodeTab = 'html' | 'react' | 'next' | 'css' | 'curl';

const trustMetrics = [
  { label: 'Requests served', value: 'Tracked', detail: 'Cloudflare Analytics ready' },
  { label: 'Uptime posture', value: '99.9%', detail: 'Enterprise SLA path' },
  { label: 'Latency target', value: '<50ms', detail: 'Cached edge response' },
  { label: 'Cache policy', value: '1 year', detail: 'Immutable deterministic URLs' },
];

const features = [
  {
    icon: 'network',
    title: 'Global CDN delivery',
    body: 'Deterministic fallback URLs are designed for edge caching, so repeat requests stay close to users instead of depending on your app origin.',
    snippet: 'Cache-Control: public, max-age=31536000, immutable',
    tone: 'blue',
  },
  {
    icon: 'timer',
    title: 'Sub-50ms latency target',
    body: 'SVG-first generation keeps the response path small. Cached responses are built to behave like static assets, not application requests.',
    snippet: 'Server-Timing: edge; dur=18',
    tone: 'green',
  },
  {
    icon: 'shield',
    title: 'Privacy-first architecture',
    body: 'Standard placeholders are generated from URL parameters. No source image uploads, no client SDK, and no cookies are required for delivery.',
    snippet: 'GET /api/v1/640x360?text=Preview',
    tone: 'ink',
  },
  {
    icon: 'route',
    title: 'URL-based API',
    body: 'Dimensions, colors, labels, and presets are visible in the URL, which makes fallbacks easy to review, copy, test, and standardize.',
    snippet: '/api/v1/800x450/18181B/FFFFFF?text=Product',
    tone: 'violet',
  },
  {
    icon: 'image',
    title: 'Custom fallback generation',
    body: 'Create branded product placeholders, initials avatars, banners, skeleton states, and empty media frames without storing throwaway assets.',
    snippet: '/api/v1/avatar/128?text=JD',
    tone: 'orange',
  },
];

const useCases = [
  {
    title: 'E-commerce',
    label: 'Product Image',
    body: 'Keep catalog grids stable when vendor media is missing, delayed, or blocked by upstream systems.',
    url: '/api/v1/640x640/F8FAFC/18181B?text=Product+Image',
  },
  {
    title: 'SaaS dashboards',
    label: 'Report Preview',
    body: 'Render predictable chart thumbnails, workspace avatars, and attachment previews in dense app surfaces.',
    url: '/api/v1/800x500/EFF6FF/2563EB?text=Report+Preview',
  },
  {
    title: 'Marketplaces',
    label: 'Listing Media',
    body: 'Replace incomplete seller media with controlled fallbacks that preserve listing quality and trust.',
    url: '/api/v1/720x480/ECFDF5/047857?text=Listing+Media',
  },
  {
    title: 'Mobile apps',
    label: 'Profile Media',
    body: 'Use compact fallback URLs for avatars, cards, empty content, and offline-safe product states.',
    url: '/api/v1/avatar/240?text=AP',
  },
];

const enterpriseRows = [
  {
    title: 'Availability commitments',
    body: 'Enterprise plans can include contractual availability targets, support response windows, and incident communication terms based on deployment model and usage profile.',
  },
  {
    title: 'High-volume scaling',
    body: 'Stateless SVG generation and CDN-compatible caching are designed for product grids, marketplaces, CMS previews, transactional emails, and repeated UI fixtures.',
  },
  {
    title: 'Security and privacy',
    body: 'Standard requests are generated from dimensions, colors, and optional text. Do not place secrets, tokens, or regulated customer data in URL parameters.',
  },
  {
    title: 'Custom domains',
    body: 'Serve fallbacks from a branded domain such as fallback.example.com to simplify CSP policy, logs, analytics, and customer-facing markup.',
  },
];

const trustLogos = ['Cloudflare Workers', 'Cloudflare CDN', 'SVG output', 'Immutable cache', 'No client SDK'];

function clampDimension(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(4000, Math.max(10, Math.round(value)));
}

function sanitizeHex(value: string, fallback: string) {
  const normalized = value.replace('#', '').replace(/[^0-9a-f]/gi, '').slice(0, 6).toUpperCase();
  return normalized.length === 6 ? normalized : fallback;
}

function readableText(value: string) {
  return value.trim() || 'Fallback Image';
}

function buildPath(preset: Preset, width: number, height: number, bg: string, fg: string, text: string) {
  const encoded = encodeURIComponent(readableText(text)).replace(/%20/g, '+');

  if (preset === 'avatar') return `/avatar/${width}?text=${encoded.slice(0, 8)}`;
  if (preset === 'banner') return `/banner/${width}x${height}?text=${encoded}`;
  if (preset === 'skeleton') return `/animated/skeleton/${width}x${height}`;
  if (preset === 'blur') return `/blur/${width}x${height}`;

  return `/${width}x${height}/${bg}/${fg}?text=${encoded}`;
}

function createPreviewSvg(width: number, height: number, bg: string, fg: string, text: string, preset: Preset) {
  const safeWidth = clampDimension(width, 640);
  const safeHeight = preset === 'avatar' ? safeWidth : clampDimension(height, 360);
  const label = preset === 'skeleton' ? '' : readableText(text);
  const fontSize = Math.max(18, Math.min(48, Math.round(Math.min(safeWidth, safeHeight) * 0.12)));

  if (preset === 'skeleton') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}"><rect width="100%" height="100%" fill="#F4F4F5"/><rect x="${safeWidth * 0.08}" y="${safeHeight * 0.18}" width="${safeWidth * 0.48}" height="${safeHeight * 0.08}" rx="8" fill="#D4D4D8"/><rect x="${safeWidth * 0.08}" y="${safeHeight * 0.34}" width="${safeWidth * 0.76}" height="${safeHeight * 0.08}" rx="8" fill="#E4E4E7"/><rect x="${safeWidth * 0.08}" y="${safeHeight * 0.50}" width="${safeWidth * 0.62}" height="${safeHeight * 0.08}" rx="8" fill="#E4E4E7"/><rect x="${safeWidth * 0.08}" y="${safeHeight * 0.70}" width="${safeWidth * 0.32}" height="${safeHeight * 0.10}" rx="8" fill="#D4D4D8"/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  const radius = preset === 'avatar' ? safeWidth / 2 : 16;
  const dimensionsY = Math.round(safeHeight / 2 + fontSize * 0.95);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}"><rect width="100%" height="100%" rx="${radius}" fill="#${bg}"/><path d="M0 ${safeHeight * 0.82} C ${safeWidth * 0.24} ${safeHeight * 0.72}, ${safeWidth * 0.38} ${safeHeight * 0.95}, ${safeWidth} ${safeHeight * 0.72} L ${safeWidth} ${safeHeight} L 0 ${safeHeight} Z" fill="#ffffff" opacity="0.08"/><text x="50%" y="50%" font-family="Inter, Arial, sans-serif" font-size="${fontSize}" font-weight="650" fill="#${fg}" text-anchor="middle" dominant-baseline="middle">${escapeXml(label)}</text><text x="50%" y="${dimensionsY}" font-family="monospace" font-size="${Math.max(12, Math.round(fontSize * 0.36))}" fill="#${fg}" opacity="0.72" text-anchor="middle" dominant-baseline="middle">${safeWidth}x${safeHeight}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
    };
    return entities[char];
  });
}

function Icon({ name }: { name: string }) {
  const common = 'h-5 w-5';
  if (name === 'network') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 8h12M6 16h12M8 4v16M16 4v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (name === 'timer') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M10 3h4M12 13l4-4M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'shield') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === 'route') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 18c4 0 4-12 8-12h4M18 6l-2-2M18 6l-2 2M6 18l2-2M6 18l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === 'image') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="m6 16 4-4 3 3 2-2 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2"
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? 'Copied' : label}
    </button>
  );
}

function EnterpriseLanding() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(450);
  const [bg, setBg] = useState('18181B');
  const [fg, setFg] = useState('FFFFFF');
  const [text, setText] = useState('Product Image');
  const [preset, setPreset] = useState<Preset>('standard');
  const [codeTab, setCodeTab] = useState<CodeTab>('html');
  const [scenario, setScenario] = useState(0);
  const [enterpriseOpen, setEnterpriseOpen] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const safeWidth = clampDimension(width, 800);
  const safeHeight = preset === 'avatar' ? safeWidth : clampDimension(height, 450);
  const safeBg = sanitizeHex(bg, '18181B');
  const safeFg = sanitizeHex(fg, 'FFFFFF');
  const path = buildPath(preset, safeWidth, safeHeight, safeBg, safeFg, text);
  const generatedUrl = `${API_BASE}${path}`;
  const displayUrl = `https://fallback.pics${path.replace(/^\/api\/v1/, '')}`;
  const previewSvg = createPreviewSvg(safeWidth, safeHeight, safeBg, safeFg, text, preset);
  const previewSrc = imageFailed ? previewSvg : generatedUrl;

  const snippets = useMemo(() => {
    return {
      html: `<img\n  src="${generatedUrl}"\n  width="${safeWidth}"\n  height="${safeHeight}"\n  alt="${readableText(text)}"\n/>`,
      react: `type FallbackImageProps = {\n  text?: string;\n};\n\nexport function ProductFallback({ text = "${readableText(text)}" }: FallbackImageProps) {\n  const src = \`${API_BASE}/${safeWidth}x${safeHeight}/${safeBg}/${safeFg}?text=\${encodeURIComponent(text)}\`;\n\n  return <img src={src} width={${safeWidth}} height={${safeHeight}} alt={text} />;\n}`,
      next: `import Image from "next/image";\n\nexport function ProductPlaceholder() {\n  return (\n    <Image\n      src="${generatedUrl}"\n      width={${safeWidth}}\n      height={${safeHeight}}\n      alt="${readableText(text)}"\n      unoptimized\n    />\n  );\n}`,
      css: `.media-frame {\n  aspect-ratio: ${safeWidth} / ${safeHeight};\n  background-image: url("${generatedUrl}");\n  background-size: cover;\n  background-position: center;\n  border-radius: 8px;\n}`,
      curl: `curl -I "${generatedUrl}"`,
    };
  }, [generatedUrl, safeWidth, safeHeight, safeBg, safeFg, text]);

  const currentSnippet = snippets[codeTab];
  const activeUseCase = useCases[scenario];

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1fr)] lg:items-center lg:gap-10 lg:px-8 lg:py-24">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Global fallback image infrastructure
              </p>
              <h1 id="hero-heading" className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-normal text-zinc-950 sm:text-6xl lg:text-7xl">
                Never show broken images again.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:mt-6 sm:text-xl sm:leading-8">
                fallback.pics gives production applications predictable, cacheable, brand-safe fallback images generated at the edge from simple URLs.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#developers" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-violet-700 px-5 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2">
                  Start using API
                </a>
                <a href="/docs" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-950 no-underline shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2">
                  View docs
                </a>
                <a href="https://github.com/abhijeetpratapsingh/fallback-pics" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-950 no-underline shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2">
                  GitHub
                </a>
              </div>
              <div className="mt-8 hidden max-w-2xl rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:block">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-zinc-950">Production fallback URL</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">200 OK</span>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-zinc-950 p-4">
                  <code className="min-w-0 flex-1 break-all font-mono text-sm leading-6 text-emerald-300">{generatedUrl}</code>
                  <CopyButton value={generatedUrl} label="Copy" />
                </div>
              </div>
            </div>

            <div id="hero-demo" className="rounded-lg border border-zinc-200 bg-white p-4 shadow-[0_12px_32px_rgba(9,9,11,0.08)]">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-950">Live fallback builder</p>
                  <p className="text-sm text-zinc-500">Generate, preview, copy, ship.</p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-1 font-mono text-xs font-semibold text-blue-700">edge</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs font-semibold text-emerald-700">cached</span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.92fr_1fr]">
                <div className="order-2 space-y-4 lg:order-1">
                  <fieldset>
                    <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Preset</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {(['standard', 'avatar', 'banner', 'skeleton', 'blur'] as Preset[]).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setPreset(item);
                            setImageFailed(false);
                          }}
                          aria-pressed={preset === item}
                          className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold capitalize transition ${preset === item ? 'border-violet-500 bg-violet-50 text-violet-800' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm font-medium text-zinc-700">
                      Width
                      <input
                        type="number"
                        min="10"
                        max="4000"
                        value={width}
                        onChange={(event) => {
                          setWidth(clampDimension(Number(event.target.value), 800));
                          setImageFailed(false);
                        }}
                        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-mono text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                      />
                    </label>
                    <label className="text-sm font-medium text-zinc-700">
                      Height
                      <input
                        type="number"
                        min="10"
                        max="4000"
                        value={height}
                        disabled={preset === 'avatar'}
                        onChange={(event) => {
                          setHeight(clampDimension(Number(event.target.value), 450));
                          setImageFailed(false);
                        }}
                        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-mono text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:bg-zinc-100 disabled:text-zinc-400"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-zinc-700">
                    Fallback text
                    <input
                      type="text"
                      value={text}
                      onChange={(event) => {
                        setText(event.target.value);
                        setImageFailed(false);
                      }}
                      className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm font-medium text-zinc-700">
                      Background
                      <input
                        type="text"
                        value={`#${safeBg}`}
                        onChange={(event) => {
                          setBg(sanitizeHex(event.target.value, safeBg));
                          setImageFailed(false);
                        }}
                        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-mono text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                      />
                    </label>
                    <label className="text-sm font-medium text-zinc-700">
                      Text
                      <input
                        type="text"
                        value={`#${safeFg}`}
                        onChange={(event) => {
                          setFg(sanitizeHex(event.target.value, safeFg));
                          setImageFailed(false);
                        }}
                        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-mono text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                      />
                    </label>
                  </div>
                </div>

                <div className="order-1 flex flex-col gap-4 lg:order-2">
                  <div className="relative grid min-h-[280px] place-items-center rounded-lg border border-zinc-200 bg-[radial-gradient(circle_at_1px_1px,#d4d4d8_1px,transparent_0)] p-5 [background-size:22px_22px]">
                    <img
                      src={previewSrc}
                      onError={() => setImageFailed(true)}
                      alt="Live generated fallback preview"
                      className={`${preset === 'avatar' ? 'aspect-square max-w-[220px] rounded-full' : 'max-h-[260px] rounded-lg'} w-full max-w-full border border-zinc-200 bg-white object-contain shadow-sm`}
                    />
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Shareable URL</span>
                      <CopyButton value={generatedUrl} label="Copy URL" />
                    </div>
                    <code className="block break-all font-mono text-xs leading-5 text-zinc-700">{displayUrl}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                {trustMetrics.map((metric) => (
                  <div key={metric.label} className="border-b border-zinc-200 p-5 last:border-b-0 sm:odd:border-r lg:border-b lg:border-r lg:last:border-r-0">
                    <p className="text-sm font-medium text-zinc-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-zinc-950">{metric.value}</p>
                    <p className="mt-1 text-sm text-zinc-500">{metric.detail}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 px-5 py-4 sm:grid-cols-[180px_1fr] sm:items-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Representative surfaces</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {trustLogos.map((logo) => (
                    <div key={logo} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-xs font-semibold text-zinc-500">
                      {logo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="border-b border-zinc-200 bg-white px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="problem-heading">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">Problem to solution</p>
              <h2 id="problem-heading" className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
                Broken image states should not ship to users.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                Missing media creates layout shifts, empty cards, failed previews, and unreliable QA snapshots. fallback.pics turns that failure into a controlled, branded response.
              </p>
              <ul className="mt-8 space-y-4 text-sm leading-6 text-zinc-700">
                {['Keep layouts stable when uploads or CMS assets fail.', 'Replace fragile local placeholder files with cacheable edge responses.', 'Standardize fallback policy across product, marketing, docs, and tests.'].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-5 w-5 rounded-full bg-emerald-50 text-center text-[10px] font-bold leading-5 text-emerald-700">OK</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-red-950">Before</span>
                  <span className="rounded-md bg-red-100 px-2 py-1 font-mono text-xs text-red-700">404</span>
                </div>
                <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-red-300 bg-white text-center text-sm font-medium text-red-700">
                  image failed
                </div>
                <p className="mt-3 text-sm leading-6 text-red-900/80">Empty media slots break trust and make polished products feel unfinished.</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-950">After</span>
                  <span className="rounded-md bg-emerald-100 px-2 py-1 font-mono text-xs text-emerald-700">200 OK</span>
                </div>
                <img src={createPreviewSvg(640, 480, '18181B', 'FFFFFF', 'Product Image', 'standard')} alt="Resolved fallback preview" className="aspect-[4/3] w-full rounded-lg border border-emerald-200 object-cover" />
                <p className="mt-3 text-sm leading-6 text-emerald-950/80">A deterministic fallback preserves hierarchy, dimensions, and brand quality.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="features-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">Deep features</p>
              <h2 id="features-heading" className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
                Built for engineers who care about reliability.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                Every feature is designed around a production failure mode: missing media, unpredictable upstreams, incomplete content, and repeated UI states.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-5">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-1">
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.tone === 'blue' ? 'bg-blue-50 text-blue-700' : feature.tone === 'green' ? 'bg-emerald-50 text-emerald-700' : feature.tone === 'orange' ? 'bg-orange-50 text-orange-700' : feature.tone === 'violet' ? 'bg-violet-50 text-violet-700' : 'bg-zinc-100 text-zinc-700'}`}>
                    <Icon name={feature.icon} />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{feature.body}</p>
                  <code className="mt-5 block break-all rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-5 text-emerald-300">{feature.snippet}</code>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="works-heading">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">How it works</p>
                <h2 id="works-heading" className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
                  Replace the URL. Add parameters. Done.
                </h2>
                <p className="mt-5 text-lg leading-8 text-zinc-600">
                  The path defines the image. Query parameters add presentation details. The response is cacheable and ready for browsers, docs, tests, emails, and native clients.
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  ['1', 'Replace image URL', 'Use fallback.pics wherever a controlled image response is safer than a missing asset.'],
                  ['2', 'Add fallback params', 'Set dimensions, background, text color, label, avatar, banner, skeleton, or blur behavior.'],
                  ['3', 'Ship the response', 'The generated SVG is returned with deterministic output and cache-friendly headers.'],
                ].map(([step, title, body]) => (
                  <div key={step} className="grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-5 sm:grid-cols-[56px_1fr]">
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-zinc-950 font-mono text-sm font-bold text-white">{step}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
                    </div>
                  </div>
                ))}
                <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-5 text-sm leading-6 text-zinc-100"><code>{`GET ${path}\nHTTP/2 200\ncontent-type: image/svg+xml\ncache-control: public, max-age=31536000, immutable`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        <section id="developers" className="bg-zinc-950 px-5 py-20 text-white sm:px-6 lg:px-8" aria-labelledby="developers-heading">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">Developer experience</p>
                <h2 id="developers-heading" className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
                  A URL is the API.
                </h2>
                <p className="mt-5 text-lg leading-8 text-zinc-400">
                  No SDK, no auth for basic usage, no asset pipeline. Copy a URL into an image tag, component, CSS background, email template, or test fixture.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {['HTML', 'React', 'Next.js', 'CSS', 'cURL'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCodeTab(item === 'Next.js' ? 'next' : (item.toLowerCase() as CodeTab))}
                      aria-pressed={(item === 'Next.js' ? 'next' : item.toLowerCase()) === codeTab}
                      className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${((item === 'Next.js' ? 'next' : item.toLowerCase()) === codeTab) ? 'border-violet-400 bg-violet-500/15 text-white' : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <CopyButton value={currentSnippet} label="Copy code" />
                </div>
                <pre className="max-h-[520px] overflow-x-auto p-5 text-sm leading-6 text-zinc-100"><code>{currentSnippet}</code></pre>
              </div>
            </div>
          </div>
        </section>

        <section id="enterprise" className="bg-white px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="enterprise-heading">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">Enterprise</p>
              <h2 id="enterprise-heading" className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
                Placeholder infrastructure for teams.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                For organizations shipping high-volume apps, internal platforms, CMS workflows, or design systems, fallback.pics supports custom domains, visibility, limits, and production rollout guidance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="mailto:support@fallback.pics?subject=Enterprise%20fallback.pics" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white no-underline transition hover:bg-zinc-800">
                  Contact sales
                </a>
                <a href="/api" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-50">
                  Review infrastructure details
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              {enterpriseRows.map((row, index) => (
                <div key={row.title} className="border-b border-zinc-200 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setEnterpriseOpen(index)}
                    className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-5 text-left text-base font-semibold text-zinc-950 transition hover:bg-white"
                    aria-expanded={enterpriseOpen === index}
                  >
                    {row.title}
                    <span className="font-mono text-zinc-500">{enterpriseOpen === index ? '-' : '+'}</span>
                  </button>
                  {enterpriseOpen === index && (
                    <p className="px-4 pb-5 text-sm leading-6 text-zinc-600">{row.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="border-y border-zinc-200 bg-zinc-50 px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="use-cases-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">Use cases</p>
              <h2 id="use-cases-heading" className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
                One fallback layer across every product surface.
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1fr]">
              <div className="grid gap-3">
                {useCases.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setScenario(index)}
                    aria-pressed={scenario === index}
                    className={`rounded-lg border p-5 text-left transition ${scenario === index ? 'border-violet-400 bg-white shadow-sm' : 'border-zinc-200 bg-white/70 hover:bg-white'}`}
                  >
                    <h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.body}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-950">{activeUseCase.title} fallback</span>
                  <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600">before / after</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm font-medium text-zinc-500">
                    missing image
                  </div>
                  <img src={`${API_BASE}${activeUseCase.url.replace('/api/v1', '')}`} onError={(event) => { event.currentTarget.src = createPreviewSvg(720, 540, '18181B', 'FFFFFF', activeUseCase.label, 'standard'); }} alt={`${activeUseCase.title} generated fallback`} className="aspect-[4/3] w-full rounded-lg border border-zinc-200 object-cover" />
                </div>
                <code className="mt-4 block break-all rounded-lg bg-zinc-950 p-4 font-mono text-sm leading-6 text-emerald-300">{API_BASE}{activeUseCase.url.replace('/api/v1', '')}</code>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="final-cta-heading">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">Production ready by default</p>
            <h2 id="final-cta-heading" className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
              Add reliable image fallbacks in one URL.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
              Start with a single fallback URL, then standardize dimensions, labels, colors, and custom domains as your team scales.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#hero-demo" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-violet-700 px-5 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-violet-800">
                Generate your first URL
              </a>
              <a href="/docs" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-950 no-underline shadow-sm transition hover:bg-zinc-50">
                Read the docs
              </a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

export default EnterpriseLanding;
