import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../config';

const presets = [
  { id: 'standard', label: 'Standard', description: 'Dimension-based SVG' },
  { id: 'square', label: 'Square', description: 'Equal width and height' },
  { id: 'avatar', label: 'Avatar', description: 'Initials and profiles' },
  { id: 'banner', label: 'Banner', description: 'Wide responsive media' },
  { id: 'animated', label: 'Animated', description: 'Loading placeholders' },
  { id: 'ai', label: 'Pattern', description: 'Contextual SVG pattern' },
];

const animationTypes = [
  { id: 'skeleton', label: 'Skeleton shimmer' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'wave', label: 'Wave' },
  { id: 'shimmer', label: 'Shimmer line' },
  { id: 'gradient', label: 'Rotating gradient' },
  { id: 'dots', label: 'Loading dots' },
];

const colorPresets = [
  { bg: '7C3AED', fg: 'FFFFFF', label: 'Brand' },
  { bg: '2563EB', fg: 'FFFFFF', label: 'Blue' },
  { bg: '059669', fg: 'FFFFFF', label: 'Success' },
  { bg: '111827', fg: 'FFFFFF', label: 'Dark' },
  { bg: 'F3F4F6', fg: '111827', label: 'Neutral' },
  { bg: 'EEF2FF', fg: '4338CA', label: 'Soft' },
];

const clampDimension = (value: number) => Math.min(4000, Math.max(10, Number.isFinite(value) ? value : 400));
const sanitizeHex = (value: string, fallback: string) => {
  const normalized = value.replace('#', '').replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase();
  return normalized.length === 6 ? normalized : fallback;
};

export default function LiveDemoEnhanced() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState('7C3AED');
  const [textColor, setTextColor] = useState('FFFFFF');
  const [text, setText] = useState('');
  const [preset, setPreset] = useState('standard');
  const [aiContext, setAiContext] = useState('');
  const [aiMood, setAiMood] = useState('');
  const [animationType, setAnimationType] = useState('skeleton');
  const [imageUrl, setImageUrl] = useState(`${API_URL}/400x300`);
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  const generateUrl = useCallback(() => {
    const safeWidth = clampDimension(width);
    const safeHeight = clampDimension(height);
    const safeBg = sanitizeHex(bgColor, '7C3AED');
    const safeText = sanitizeHex(textColor, 'FFFFFF');
    let url = `${API_URL}/`;

    if (preset === 'standard') {
      url += `${safeWidth}x${safeHeight}`;
      if (safeBg !== '7C3AED' || safeText !== 'FFFFFF') {
        url += `/${safeBg}/${safeText}`;
      }
    } else if (preset === 'square' || preset === 'avatar') {
      url += `${preset}/${safeWidth}`;
    } else if (preset === 'banner') {
      url += `banner/${safeWidth}x${safeHeight}`;
    } else if (preset === 'animated') {
      url += `animated/${animationType}/${safeWidth}x${safeHeight}`;
    } else if (preset === 'ai') {
      url += `ai/${safeWidth}x${safeHeight}`;
    } else {
      url += `${preset}/${safeWidth}x${safeHeight}`;
    }

    const params = [];
    if (text) params.push(`text=${encodeURIComponent(text)}`);
    if (preset === 'ai') {
      if (aiContext) params.push(`context=${encodeURIComponent(aiContext)}`);
      if (aiMood) params.push(`mood=${encodeURIComponent(aiMood)}`);
    }

    return params.length > 0 ? `${url}?${params.join('&')}` : url;
  }, [width, height, bgColor, textColor, text, preset, aiContext, aiMood, animationType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageUrl(generateUrl());
      setImageLoading(true);
    }, 180);

    return () => clearTimeout(timer);
  }, [generateUrl]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setRecentUrls((previous) => [imageUrl, ...previous.filter((url) => url !== imageUrl)].slice(0, 3));
    setTimeout(() => setCopied(false), 2000);
  };

  const applyColorPreset = (bg: string, fg: string) => {
    setBgColor(bg);
    setTextColor(fg);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">Interactive generator</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-5xl">
          Build a fallback URL in seconds.
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Tune dimensions, presets, colors, and text while the generated image updates in place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)]">
        <div className="space-y-4">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Preset</h3>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {presets.find((item) => item.id === preset)?.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Placeholder preset">
              {presets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreset(item.id)}
                  role="radio"
                  aria-checked={preset === item.id}
                  className={`rounded-lg border p-3 text-left transition ${
                    preset === item.id
                      ? 'border-purple-500 bg-purple-50 text-purple-950 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">{item.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Dimensions</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Width
                <input
                  type="number"
                  value={width}
                  onChange={(event) => setWidth(clampDimension(Number(event.target.value)))}
                  min="10"
                  max="4000"
                  disabled={preset === 'square' || preset === 'avatar'}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-950 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Height
                <input
                  type="number"
                  value={height}
                  onChange={(event) => setHeight(clampDimension(Number(event.target.value)))}
                  min="10"
                  max="4000"
                  disabled={preset === 'square' || preset === 'avatar'}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-950 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { w: 400, h: 300, label: '400x300' },
                { w: 800, h: 600, label: '800x600' },
                { w: 1200, h: 630, label: 'OG image' },
                { w: 1920, h: 1080, label: 'HD' },
              ].map((size) => (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => {
                    setWidth(size.w);
                    setHeight(size.h);
                  }}
                  disabled={preset === 'square' || preset === 'avatar'}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {size.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Colors</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color.label}
                  type="button"
                  onClick={() => applyColorPreset(color.bg, color.fg)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
                    bgColor === color.bg
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: `#${color.bg}` }} />
                  {color.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700">
                Background
                <div className="mt-2 flex gap-2">
                  <input
                    type="color"
                    value={`#${sanitizeHex(bgColor, '7C3AED')}`}
                    onChange={(event) => setBgColor(sanitizeHex(event.target.value, '7C3AED'))}
                    className="h-11 w-14 rounded border border-gray-300 bg-white"
                    aria-label="Choose background color"
                  />
                  <input
                    type="text"
                    value={`#${bgColor}`}
                    onChange={(event) => setBgColor(event.target.value.replace('#', '').toUpperCase())}
                    onBlur={() => setBgColor(sanitizeHex(bgColor, '7C3AED'))}
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Text
                <div className="mt-2 flex gap-2">
                  <input
                    type="color"
                    value={`#${sanitizeHex(textColor, 'FFFFFF')}`}
                    onChange={(event) => setTextColor(sanitizeHex(event.target.value, 'FFFFFF'))}
                    className="h-11 w-14 rounded border border-gray-300 bg-white"
                    aria-label="Choose text color"
                  />
                  <input
                    type="text"
                    value={`#${textColor}`}
                    onChange={(event) => setTextColor(event.target.value.replace('#', '').toUpperCase())}
                    onBlur={() => setTextColor(sanitizeHex(textColor, 'FFFFFF'))}
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <label htmlFor="custom-text" className="block text-sm font-semibold uppercase tracking-wide text-gray-700">
              Custom text
            </label>
            <input
              id="custom-text"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              placeholder="Leave empty for dimensions"
            />
          </section>

          {preset === 'animated' && (
            <section className="rounded-lg border border-purple-200 bg-purple-50 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purple-900">Animation style</h3>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Animation style">
                {animationTypes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={animationType === item.id}
                    onClick={() => setAnimationType(item.id)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                      animationType === item.id
                        ? 'border-purple-500 bg-white font-semibold text-purple-900 shadow-sm'
                        : 'border-purple-100 bg-white/60 text-purple-800 hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {preset === 'ai' && (
            <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-900">Pattern context</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-indigo-950">
                  Context
                  <input
                    type="text"
                    value={aiContext}
                    onChange={(event) => setAiContext(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-indigo-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    placeholder="e-commerce, healthcare, tech"
                  />
                </label>
                <label className="block text-sm font-medium text-indigo-950">
                  Mood
                  <input
                    type="text"
                    value={aiMood}
                    onChange={(event) => setAiMood(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-indigo-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    placeholder="minimal, calm, professional"
                  />
                </label>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Live preview</h3>
                <span className="font-mono text-xs text-gray-500">{clampDimension(width)}x{clampDimension(height)}</span>
              </div>
            </div>
            <div className="relative flex min-h-[360px] items-center justify-center bg-[radial-gradient(circle_at_1px_1px,#d1d5db_1px,transparent_0)] p-8 [background-size:24px_24px]">
              {imageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600" />
                </div>
              )}
              <img
                src={imageUrl}
                alt={`Generated placeholder${text ? ` with text: ${text}` : ''}`}
                className="max-h-[420px] max-w-full rounded-lg border border-gray-200 bg-white shadow-xl transition-opacity duration-200"
                onLoad={() => setImageLoading(false)}
                style={{ opacity: imageLoading ? 0.55 : 1 }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-950 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">Generated URL</h3>
              <button
                type="button"
                onClick={copyToClipboard}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-white text-gray-950 hover:bg-gray-100'
                }`}
              >
                {copied ? 'Copied' : 'Copy URL'}
              </button>
            </div>
            <code className="block break-all rounded-lg bg-black px-4 py-3 font-mono text-sm leading-6 text-emerald-300" aria-live="polite">
              {imageUrl}
            </code>
          </div>

          {recentUrls.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Recent URLs</h3>
              <div className="space-y-2">
                {recentUrls.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="block w-full truncate rounded-lg bg-gray-50 px-3 py-2 text-left font-mono text-xs text-gray-600 transition hover:bg-gray-100"
                    title="Click to copy"
                  >
                    {url}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
