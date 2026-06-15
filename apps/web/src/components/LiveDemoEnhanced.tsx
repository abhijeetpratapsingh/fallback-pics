import { useCallback, useEffect, useState } from 'react';
import { PUBLIC_API_BASE } from '../config';
import { trackConversion, trackEvent } from '../utils/analytics';

type PresetId =
  | 'standard'
  | 'square'
  | 'avatar'
  | 'banner'
  | 'thumbnail'
  | 'skeleton'
  | 'blur'
  | 'animated'
  | 'ai';

const presets: Array<{ id: PresetId; label: string; description: string }> = [
  { id: 'standard', label: 'Standard', description: 'Dimension-based SVG' },
  { id: 'square', label: 'Square', description: 'Equal width and height' },
  { id: 'avatar', label: 'Avatar', description: 'Initials and profiles' },
  { id: 'banner', label: 'Banner', description: 'Wide responsive media' },
  { id: 'thumbnail', label: 'Thumbnail', description: 'Blog featured images' },
  { id: 'skeleton', label: 'Skeleton', description: 'Loading placeholders' },
  { id: 'blur', label: 'Blur', description: 'Blurred media state' },
  { id: 'animated', label: 'Animated', description: 'Motion placeholders' },
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
  { bg: '18181B', fg: 'FFFFFF', label: 'Dark' },
  { bg: 'F4F4F5', fg: '18181B', label: 'Neutral' },
  { bg: 'EEF2FF', fg: '4338CA', label: 'Soft' },
];

const thumbnailStyles = [
  { id: 'soft', label: 'Soft shapes' },
  { id: 'rings', label: 'Rings' },
  { id: 'lines', label: 'Lines' },
  { id: 'pattern', label: 'Mini pattern' },
];

const thumbnailThemes = [
  { id: 'purple', label: 'Purple' },
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'orange', label: 'Orange' },
  { id: 'dark', label: 'Dark' },
];

const MAX_DIMENSION = 5000;

const clampDimension = (value: number, fallback = 400) =>
  Math.min(MAX_DIMENSION, Math.max(10, Number.isFinite(value) ? value : fallback));

const sanitizeHex = (value: string, fallback: string) => {
  const normalized = value
    .replace('#', '')
    .replace(/[^0-9a-fA-F]/g, '')
    .slice(0, 6)
    .toUpperCase();
  return normalized.length === 6 ? normalized : fallback;
};

function showColorControlsFor(preset: PresetId) {
  return preset === 'standard' || preset === 'banner' || preset === 'square' || preset === 'avatar';
}

type LiveDemoEnhancedProps = {
  embedded?: boolean;
};

export default function LiveDemoEnhanced({ embedded = false }: LiveDemoEnhancedProps) {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(450);
  const [bgColor, setBgColor] = useState('7C3AED');
  const [textColor, setTextColor] = useState('FFFFFF');
  const [text, setText] = useState('Placeholder Image');
  const [preset, setPreset] = useState<PresetId>('standard');
  const [aiContext, setAiContext] = useState('');
  const [aiMood, setAiMood] = useState('');
  const [animationType, setAnimationType] = useState('skeleton');
  const [thumbnailStyle, setThumbnailStyle] = useState('soft');
  const [thumbnailTheme, setThumbnailTheme] = useState('purple');
  const [thumbnailLabel, setThumbnailLabel] = useState('Blog Post');
  const [thumbnailBg, setThumbnailBg] = useState('');
  const [thumbnailAccent, setThumbnailAccent] = useState('');
  const [thumbnailColor, setThumbnailColor] = useState('');
  const [thumbnailSeed, setThumbnailSeed] = useState('');
  const [imageUrl, setImageUrl] = useState(
    `${PUBLIC_API_BASE}/800x450/7C3AED/FFFFFF?text=Placeholder+Image`,
  );
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  const locksSquareDimensions = preset === 'avatar' || preset === 'square';
  const safeWidth = clampDimension(width, 800);
  const safeHeight = locksSquareDimensions ? safeWidth : clampDimension(height, 450);
  const showColorControls = showColorControlsFor(preset);

  const generateUrl = useCallback(() => {
    const safeBg = sanitizeHex(bgColor, '7C3AED');
    const safeFg = sanitizeHex(textColor, 'FFFFFF');
    let url = `${PUBLIC_API_BASE}/`;

    if (preset === 'standard') {
      url += `${safeWidth}x${safeHeight}`;
      if (safeBg !== '7C3AED' || safeFg !== 'FFFFFF') {
        url += `/${safeBg}/${safeFg}`;
      }
    } else if (preset === 'square' || preset === 'avatar') {
      url += `${preset}/${safeWidth}`;
    } else if (preset === 'banner') {
      url += `banner/${safeWidth}x${safeHeight}`;
    } else if (preset === 'animated') {
      url += `animated/${animationType}/${safeWidth}x${safeHeight}`;
    } else if (preset === 'thumbnail') {
      url += `thumbnail/${safeWidth}x${safeHeight}`;
    } else if (preset === 'ai') {
      url += `ai/${safeWidth}x${safeHeight}`;
    } else {
      url += `${preset}/${safeWidth}x${safeHeight}`;
    }

    const params: string[] = [];
    if (text && preset !== 'skeleton' && preset !== 'blur') {
      params.push(`text=${encodeURIComponent(text)}`);
    }
    if (preset === 'thumbnail') {
      params.push(`style=${encodeURIComponent(thumbnailStyle)}`);
      params.push(`theme=${encodeURIComponent(thumbnailTheme)}`);
      if (thumbnailLabel) params.push(`label=${encodeURIComponent(thumbnailLabel)}`);
      if (thumbnailBg) params.push(`bg=${encodeURIComponent(thumbnailBg)}`);
      if (thumbnailAccent) params.push(`accent=${encodeURIComponent(thumbnailAccent)}`);
      if (thumbnailColor) params.push(`color=${encodeURIComponent(thumbnailColor)}`);
      if (thumbnailSeed) params.push(`seed=${encodeURIComponent(thumbnailSeed)}`);
    }
    if (preset === 'ai') {
      if (aiContext) params.push(`context=${encodeURIComponent(aiContext)}`);
      if (aiMood) params.push(`mood=${encodeURIComponent(aiMood)}`);
    }

    return params.length > 0 ? `${url}?${params.join('&')}` : url;
  }, [
    width,
    height,
    bgColor,
    textColor,
    text,
    preset,
    aiContext,
    aiMood,
    animationType,
    thumbnailStyle,
    thumbnailTheme,
    thumbnailLabel,
    thumbnailBg,
    thumbnailAccent,
    thumbnailColor,
    thumbnailSeed,
    safeWidth,
    safeHeight,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setImageUrl(generateUrl());
      setImageLoading(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [generateUrl]);

  function selectPreset(next: PresetId) {
    setPreset(next);

    switch (next) {
      case 'avatar':
        setWidth(128);
        setHeight(128);
        setText('JD');
        break;
      case 'square':
        setWidth(400);
        setHeight(400);
        setText('Square');
        break;
      case 'banner':
        setWidth(1200);
        setHeight(400);
        setText('Hero Banner');
        break;
      case 'thumbnail':
        setWidth(1200);
        setHeight(630);
        setText((current) => current || 'How to Fix Broken Images in Production');
        break;
      case 'skeleton':
        setWidth(640);
        setHeight(360);
        break;
      case 'blur':
        setWidth(800);
        setHeight(450);
        break;
      case 'animated':
        setWidth(640);
        setHeight(360);
        break;
      case 'ai':
        setWidth(800);
        setHeight(450);
        break;
      default:
        setWidth(800);
        setHeight(450);
        setText('Placeholder Image');
        break;
    }

    trackEvent('demo_preset_select', {
      event_category: 'demo',
      event_label: next,
      preset: next,
    });
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    trackEvent('demo_url_copy', {
      event_category: 'conversion',
      event_label: preset,
      preset,
    });
    trackConversion('demo_url_copy', preset);
    setRecentUrls((previous) =>
      [imageUrl, ...previous.filter((url) => url !== imageUrl)].slice(0, 3),
    );
    window.setTimeout(() => setCopied(false), 2000);
  };

  const applyColorPreset = (bg: string, fg: string) => {
    setBgColor(bg);
    setTextColor(fg);
  };

  const presetLabel = presets.find((item) => item.id === preset)?.label ?? preset;

  return (
    <div className={embedded ? 'min-w-0' : 'mx-auto max-w-7xl'}>
      {!embedded && (
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
            Interactive generator
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-5xl">
            Build a fallback URL in seconds.
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            Tune dimensions, presets, colors, and text while the generated image updates in place.
          </p>
        </div>
      )}

      <div
        className={`overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_32px_64px_-28px_rgba(91,33,182,0.14),0_20px_40px_-24px_rgba(9,9,11,0.12)] ring-1 ring-zinc-950/[0.04] ${
          embedded ? '' : 'mb-2'
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" aria-hidden="true" />

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
          <div className="space-y-4 border-b border-zinc-100 p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <section>
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-400">
                Placeholder type
              </p>
              <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Placeholder preset">
                {presets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectPreset(item.id)}
                    role="radio"
                    aria-checked={preset === item.id}
                    className={`rounded-lg border px-1.5 py-2 text-center text-[0.65rem] font-semibold leading-tight transition sm:py-2.5 sm:text-xs ${
                      preset === item.id
                        ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-400">
                Dimensions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-medium text-zinc-600">
                  Width
                  <input
                    type="number"
                    value={width}
                    onChange={(event) => setWidth(clampDimension(Number(event.target.value), 800))}
                    min="10"
                    max={MAX_DIMENSION}
                    className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-2 font-mono text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </label>
                <label className="text-xs font-medium text-zinc-600">
                  Height
                  <input
                    type="number"
                    value={height}
                    onChange={(event) => setHeight(clampDimension(Number(event.target.value), 450))}
                    min="10"
                    max={MAX_DIMENSION}
                    disabled={locksSquareDimensions}
                    className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-2 font-mono text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
                  />
                </label>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  { w: 400, h: 300, label: '400×300' },
                  { w: 800, h: 450, label: '800×450' },
                  { w: 1200, h: 630, label: 'OG' },
                  { w: 1920, h: 1080, label: 'HD' },
                ].map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() => {
                      setWidth(size.w);
                      setHeight(size.h);
                      trackEvent('demo_dimension_select', {
                        event_category: 'demo',
                        event_label: size.label,
                        width: size.w,
                        height: size.h,
                      });
                    }}
                    disabled={locksSquareDimensions}
                    className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </section>

            {preset !== 'skeleton' && preset !== 'blur' && (
              <section>
                <label htmlFor="generator-label" className="text-xs font-medium text-zinc-600">
                  Label
                  <input
                    id="generator-label"
                    type="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-sm text-zinc-950 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    placeholder="Product Image"
                  />
                </label>
              </section>
            )}

            {showColorControls && (
              <section>
                <h3 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-400">
                  Colors
                </h3>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {colorPresets.map((color) => (
                    <button
                      key={color.label}
                      type="button"
                      onClick={() => {
                        applyColorPreset(color.bg, color.fg);
                        trackEvent('demo_color_select', {
                          event_category: 'demo',
                          event_label: color.label,
                        });
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                        bgColor === color.bg
                          ? 'border-violet-600 bg-violet-50 text-violet-800'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: `#${color.bg}` }}
                      />
                      {color.label}
                    </button>
                  ))}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="text-xs font-medium text-zinc-600">
                    Background
                    <div className="mt-1 flex gap-2">
                      <input
                        type="color"
                        value={`#${sanitizeHex(bgColor, '7C3AED')}`}
                        onChange={(event) => setBgColor(sanitizeHex(event.target.value, '7C3AED'))}
                        className="h-10 w-12 rounded border border-zinc-200 bg-white"
                        aria-label="Choose background color"
                      />
                      <input
                        type="text"
                        value={`#${bgColor}`}
                        onChange={(event) =>
                          setBgColor(event.target.value.replace('#', '').toUpperCase())
                        }
                        onBlur={() => setBgColor(sanitizeHex(bgColor, '7C3AED'))}
                        className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-2 font-mono text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      />
                    </div>
                  </label>
                  <label className="text-xs font-medium text-zinc-600">
                    Text color
                    <div className="mt-1 flex gap-2">
                      <input
                        type="color"
                        value={`#${sanitizeHex(textColor, 'FFFFFF')}`}
                        onChange={(event) => setTextColor(sanitizeHex(event.target.value, 'FFFFFF'))}
                        className="h-10 w-12 rounded border border-zinc-200 bg-white"
                        aria-label="Choose text color"
                      />
                      <input
                        type="text"
                        value={`#${textColor}`}
                        onChange={(event) =>
                          setTextColor(event.target.value.replace('#', '').toUpperCase())
                        }
                        onBlur={() => setTextColor(sanitizeHex(textColor, 'FFFFFF'))}
                        className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-2 font-mono text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      />
                    </div>
                  </label>
                </div>
              </section>
            )}

            {preset === 'animated' && (
              <section className="rounded-lg border border-violet-200 bg-violet-50/80 p-3">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-900">
                  Animation style
                </h3>
                <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Animation style">
                  {animationTypes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={animationType === item.id}
                      onClick={() => {
                        setAnimationType(item.id);
                        trackEvent('demo_animation_select', {
                          event_category: 'demo',
                          event_label: item.label,
                          animation_type: item.id,
                        });
                      }}
                      className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold transition ${
                        animationType === item.id
                          ? 'border-violet-600 bg-violet-600 text-white'
                          : 'border-violet-100 bg-white text-violet-800 hover:border-violet-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {preset === 'thumbnail' && (
              <section className="rounded-lg border border-blue-200 bg-blue-50/80 p-3">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-950">
                  Thumbnail options
                </h3>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-blue-950">
                    Category label
                    <input
                      type="text"
                      value={thumbnailLabel}
                      onChange={(event) => setThumbnailLabel(event.target.value)}
                      className="mt-1 w-full rounded-md border border-blue-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {thumbnailThemes.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setThumbnailTheme(item.id)}
                        className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold transition ${
                          thumbnailTheme === item.id
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-blue-100 bg-white text-blue-900 hover:border-blue-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {preset === 'ai' && (
              <section className="rounded-lg border border-indigo-200 bg-indigo-50/80 p-3">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-900">
                  Pattern context
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="text-xs font-medium text-indigo-950">
                    Context
                    <input
                      type="text"
                      value={aiContext}
                      onChange={(event) => setAiContext(event.target.value)}
                      className="mt-1 w-full rounded-md border border-indigo-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="text-xs font-medium text-indigo-950">
                    Mood
                    <input
                      type="text"
                      value={aiMood}
                      onChange={(event) => setAiMood(event.target.value)}
                      className="mt-1 w-full rounded-md border border-indigo-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                </div>
              </section>
            )}

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-500">
                  API URL
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex shrink-0 min-h-8 min-w-[4.25rem] items-center justify-center rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-950 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="block break-all font-mono text-[0.7rem] leading-5 text-zinc-800 sm:text-xs" aria-live="polite">
                {imageUrl}
              </code>
            </div>
          </div>

          <aside className="flex flex-col bg-gradient-to-br from-violet-50/70 via-zinc-50 to-indigo-50/40">
            <div className="border-b border-zinc-100 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">Live preview</h3>
                <span className="font-mono text-xs text-zinc-500">
                  {safeWidth} × {safeHeight} · {presetLabel}
                </span>
              </div>
            </div>
            <div className="relative flex min-h-[280px] flex-1 items-center justify-center p-5 sm:min-h-[360px] sm:p-8">
              <div
                className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,#d4d4d8_1px,transparent_0)] [background-size:18px_18px]"
                aria-hidden="true"
              />
              {imageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-600" />
                </div>
              )}
              <img
                src={imageUrl}
                alt={`Generated ${presetLabel} placeholder${text ? `: ${text}` : ''}`}
                onLoad={() => setImageLoading(false)}
                style={
                  locksSquareDimensions ? undefined : { aspectRatio: `${safeWidth} / ${safeHeight}` }
                }
                className={`relative z-[1] max-h-[min(72%,320px)] max-w-full object-contain shadow-[0_12px_32px_-12px_rgba(9,9,11,0.28)] ring-1 ring-black/10 transition-opacity duration-200 ${
                  preset === 'avatar'
                    ? 'aspect-square max-h-[min(52%,200px)] max-w-[min(52%,200px)] rounded-full'
                    : preset === 'square'
                      ? 'aspect-square max-h-[min(52%,200px)] max-w-[min(52%,200px)] rounded-none'
                      : 'rounded-lg'
                }`}
              />
            </div>
          </aside>
        </div>
      </div>

      {recentUrls.length > 0 && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">Recent URLs</h3>
          <div className="space-y-2">
            {recentUrls.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => navigator.clipboard.writeText(url)}
                className="block w-full truncate rounded-lg bg-zinc-50 px-3 py-2 text-left font-mono text-xs text-zinc-600 transition hover:bg-zinc-100"
                title="Click to copy"
              >
                {url}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
