import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';

// Preset configurations with thumbnails
const presets = [
  { id: 'standard', label: 'Standard', icon: '🖼️', color: 'from-purple-500 to-blue-500' },
  { id: 'square', label: 'Square', icon: '⬜', color: 'from-blue-500 to-cyan-500' },
  { id: 'avatar', label: 'Avatar', icon: '👤', color: 'from-green-500 to-emerald-500' },
  { id: 'banner', label: 'Banner', icon: '🎯', color: 'from-orange-500 to-red-500' },
  { id: 'animated', label: 'Animated', icon: '✨', color: 'from-pink-500 to-purple-500' },
  { id: 'ai', label: 'AI Generated', icon: '🤖', color: 'from-indigo-500 to-purple-500' },
];

const animationTypes = [
  { id: 'skeleton', label: 'Skeleton Shimmer', preview: '░░░' },
  { id: 'pulse', label: 'Pulse', preview: '◉' },
  { id: 'wave', label: 'Wave', preview: '〰️' },
  { id: 'shimmer', label: 'Shimmer Line', preview: '✨' },
  { id: 'gradient', label: 'Rotating Gradient', preview: '🌈' },
  { id: 'dots', label: 'Loading Dots', preview: '•••' },
];

const colorPresets = [
  { bg: '7C3AED', fg: 'FFFFFF', label: 'Purple' },
  { bg: '3B82F6', fg: 'FFFFFF', label: 'Blue' },
  { bg: '10B981', fg: 'FFFFFF', label: 'Green' },
  { bg: 'F97316', fg: 'FFFFFF', label: 'Orange' },
  { bg: 'EC4899', fg: 'FFFFFF', label: 'Pink' },
  { bg: '1F2937', fg: 'FFFFFF', label: 'Dark' },
];

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
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  
  // Generate URL based on current settings
  const generateUrl = useCallback(() => {
    let url = `${API_URL}/`;
    
    if (preset === 'standard') {
      url += `${width}x${height}`;
      if (bgColor !== '7C3AED' || textColor !== 'FFFFFF') {
        url += `/${bgColor}/${textColor}`;
      }
    } else if (preset === 'square' || preset === 'avatar') {
      url += `${preset}/${width}`;
    } else if (preset === 'banner') {
      url += `banner/${width}x${height}`;
    } else if (preset === 'animated') {
      url += `animated/${animationType}/${width}x${height}`;
    } else if (preset === 'ai') {
      url += `ai/${width}x${height}`;
    } else {
      url += `${preset}/${width}x${height}`;
    }
    
    const params = [];
    if (text) {
      params.push(`text=${encodeURIComponent(text)}`);
    }
    if (preset === 'ai') {
      if (aiContext) {
        params.push(`context=${encodeURIComponent(aiContext)}`);
      }
      if (aiMood) {
        params.push(`mood=${encodeURIComponent(aiMood)}`);
      }
    }
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return url;
  }, [width, height, bgColor, textColor, text, preset, aiContext, aiMood, animationType]);
  
  // Update URL with debouncing for smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      const newUrl = generateUrl();
      setImageUrl(newUrl);
      setImageLoading(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [generateUrl]);
  
  // Copy URL to clipboard
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    
    // Add to recent URLs
    setRecentUrls(prev => {
      const updated = [imageUrl, ...prev.filter(url => url !== imageUrl)].slice(0, 3);
      return updated;
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Apply color preset
  const applyColorPreset = (bg: string, fg: string) => {
    setBgColor(bg);
    setTextColor(fg);
  };
  
  return (
    <section id="playground" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Try It <span className="gradient-text">Right Now</span>
          </h2>
          <p className="text-xl text-gray-600">
            No signup. No API key. Just works.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Preset Selection - Visual Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Choose Preset
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    className={`
                      relative p-4 rounded-xl transition-all duration-200
                      ${preset === p.id 
                        ? 'bg-gradient-to-br ' + p.color + ' text-white shadow-lg scale-105' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                    `}
                    aria-label={`Select ${p.label} preset`}
                  >
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <div className="text-xs font-semibold">{p.label}</div>
                    {preset === p.id && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Dimensions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Dimensions
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="width" className="block text-xs text-gray-500 mb-1">
                    Width (px)
                  </label>
                  <div className="relative">
                    <input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-mono"
                      min="1"
                      max="5000"
                      disabled={preset === 'square' || preset === 'avatar'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      px
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="height" className="block text-xs text-gray-500 mb-1">
                    Height (px)
                  </label>
                  <div className="relative">
                    <input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-mono"
                      min="1"
                      max="5000"
                      disabled={preset === 'square' || preset === 'avatar'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      px
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Size Buttons */}
              <div className="flex gap-2 mt-3">
                {[
                  { w: 400, h: 300, label: 'Small' },
                  { w: 800, h: 600, label: 'Medium' },
                  { w: 1920, h: 1080, label: 'HD' },
                ].map((size) => (
                  <button
                    key={size.label}
                    onClick={() => {
                      setWidth(size.w);
                      setHeight(size.h);
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={preset === 'square' || preset === 'avatar'}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Colors
              </label>
              
              {/* Color Presets */}
              <div className="flex gap-2 mb-4">
                {colorPresets.map((cp) => (
                  <button
                    key={cp.label}
                    onClick={() => applyColorPreset(cp.bg, cp.fg)}
                    className="group relative"
                    aria-label={`Apply ${cp.label} color preset`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `#${cp.bg}` }}
                    />
                    {bgColor === cp.bg && (
                      <div className="absolute inset-0 rounded-lg border-2 border-purple-500" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={`#${bgColor}`}
                      onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                      className="h-12 w-20 border-2 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={`#${bgColor}`}
                      onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                      className="flex-1 px-3 py-2 border-2 rounded-lg font-mono text-sm"
                      maxLength={7}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={`#${textColor}`}
                      onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                      className="h-12 w-20 border-2 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={`#${textColor}`}
                      onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                      className="flex-1 px-3 py-2 border-2 rounded-lg font-mono text-sm"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Custom Text */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label htmlFor="custom-text" className="block text-sm font-bold text-gray-700 mb-4">
                Custom Text
              </label>
              <input
                id="custom-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Leave empty for dimensions..."
              />
            </div>
            
            {/* Animation Options */}
            {preset === 'animated' && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Animation Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {animationTypes.map((anim) => (
                    <button
                      key={anim.id}
                      onClick={() => setAnimationType(anim.id)}
                      className={`
                        p-3 rounded-lg transition-all duration-200 flex items-center gap-2
                        ${animationType === anim.id 
                          ? 'bg-purple-500 text-white shadow-md' 
                          : 'bg-white hover:bg-gray-50'}
                      `}
                    >
                      <span className="text-lg">{anim.preview}</span>
                      <span className="text-sm font-medium">{anim.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* AI Options */}
            {preset === 'ai' && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-indigo-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  AI Generation Options
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Context (Industry/Type)
                    </label>
                    <input
                      type="text"
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500"
                      placeholder="e.g., e-commerce, healthcare, tech"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Mood/Style
                    </label>
                    <input
                      type="text"
                      value={aiMood}
                      onChange={(e) => setAiMood(e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500"
                      placeholder="e.g., minimal, vibrant, professional"
                    />
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-2">
                      ✨ Try these combinations:
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div>• "e-commerce product" + "minimal"</div>
                      <div>• "healthcare" + "calm"</div>
                      <div>• "tech startup" + "vibrant"</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 space-y-6">
            {/* Live Preview */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='black' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
                }} />
              </div>
              
              {/* Image Preview */}
              <div className="relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={`Generated placeholder${text ? ` with text: ${text}` : ``}`}
                  className="max-w-full h-auto rounded-lg shadow-2xl transition-opacity duration-300"
                  onLoad={() => setImageLoading(false)}
                  style={{ opacity: imageLoading ? 0.5 : 1 }}
                />
              </div>
            </div>
            
            {/* Generated URL */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-700">
                  Generated URL
                </label>
                <button
                  onClick={copyToClipboard}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm
                    transition-all duration-200 transform
                    ${copied 
                      ? 'bg-green-500 text-white scale-105 shadow-lg' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white hover:shadow-lg hover:scale-105'}
                  `}
                >
                  {copied ? (
                    <>✓ Copied!</>
                  ) : (
                    <>📋 Copy URL</>
                  )}
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400 font-mono text-sm break-all">
                  {imageUrl}
                </code>
              </div>
            </div>
            
            {/* Recent URLs */}
            {recentUrls.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  Recent URLs
                </h3>
                <div className="space-y-2">
                  {recentUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 truncate hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => navigator.clipboard.writeText(url)}
                      title="Click to copy"
                    >
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .gradient-text {
          background: linear-gradient(90deg, #7C3AED, #3B82F6, #10B981);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}
