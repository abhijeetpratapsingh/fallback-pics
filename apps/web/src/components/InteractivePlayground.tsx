import { useState, useEffect } from 'react';

export default function InteractivePlayground() {
  const [params, setParams] = useState({
    width: 400,
    height: 300,
    text: 'Preview',
    bgColor: '7C3AED',
    textColor: 'FFFFFF',
    preset: 'standard',
    format: 'svg',
  });

  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Build URL based on parameters
    let url = 'https://fallback.pics/api/v1/';
    
    if (params.preset === 'standard') {
      url += `${params.width}x${params.height}`;
      if (params.bgColor && params.textColor) {
        url += `/${params.bgColor}/${params.textColor}`;
      }
    } else if (params.preset === 'avatar') {
      url += `avatar/${params.width}`;
    } else if (params.preset === 'skeleton') {
      url += `animated/skeleton/${params.width}x${params.height}`;
    } else if (params.preset === 'chart') {
      url += `chart/bar/${params.width}x${params.height}`;
    }
    
    if (params.text && params.preset !== 'skeleton' && params.preset !== 'chart') {
      url += `?text=${encodeURIComponent(params.text)}`;
    }
    
    if (params.format !== 'svg') {
      url = url.replace(/(\d+)(x\d+)?/, `$1$2.${params.format}`);
    }
    
    setImageUrl(url);
  }, [params]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Customize Parameters</h3>
          
          {/* Preset Selection */}
          <div>
            <label htmlFor="preset" className="block text-sm font-medium text-gray-700 mb-2">
              Preset Type
            </label>
            <select
              id="preset"
              value={params.preset}
              onChange={(e) => setParams({ ...params, preset: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select preset type"
            >
              <option value="standard">Standard Placeholder</option>
              <option value="avatar">Avatar</option>
              <option value="skeleton">Animated Skeleton</option>
              <option value="chart">Chart Mockup</option>
            </select>
          </div>
          
          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                Width (px)
              </label>
              <input
                id="width"
                type="number"
                min="10"
                max="4000"
                value={params.width}
                onChange={(e) => setParams({ ...params, width: parseInt(e.target.value) || 400 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Image width in pixels"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Height (px)
              </label>
              <input
                id="height"
                type="number"
                min="10"
                max="4000"
                value={params.height}
                onChange={(e) => setParams({ ...params, height: parseInt(e.target.value) || 300 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={params.preset === 'avatar'}
                aria-label="Image height in pixels"
              />
            </div>
          </div>
          
          {/* Custom Text */}
          {params.preset !== 'skeleton' && params.preset !== 'chart' && (
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Text
              </label>
              <input
                id="text"
                type="text"
                value={params.text}
                onChange={(e) => setParams({ ...params, text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter custom text"
                aria-label="Custom text to display on image"
              />
            </div>
          )}
          
          {/* Colors */}
          {params.preset === 'standard' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">#</span>
                  <input
                    id="bgColor"
                    type="text"
                    value={params.bgColor}
                    onChange={(e) => setParams({ ...params, bgColor: e.target.value.replace('#', '') })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="7C3AED"
                    maxLength={6}
                    aria-label="Background color hex code without #"
                  />
                  <div 
                    className="w-10 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: `#${params.bgColor}` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">#</span>
                  <input
                    id="textColor"
                    type="text"
                    value={params.textColor}
                    onChange={(e) => setParams({ ...params, textColor: e.target.value.replace('#', '') })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="FFFFFF"
                    maxLength={6}
                    aria-label="Text color hex code without #"
                  />
                  <div 
                    className="w-10 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: `#${params.textColor}` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Format Selection */}
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <select
              id="format"
              value={params.format}
              onChange={(e) => setParams({ ...params, format: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select output format"
            >
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
              <option value="jpg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
        
        {/* Preview */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Preview</h3>
          
          {/* Image Preview */}
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
            {params.preset === 'avatar' ? (
              <img 
                src={imageUrl}
                alt="Live preview of generated placeholder image"
                className="rounded-full shadow-lg"
                style={{ width: params.width, height: params.width }}
                key={imageUrl}
              />
            ) : (
              <img 
                src={imageUrl}
                alt="Live preview of generated placeholder image"
                className="rounded-lg shadow-lg max-w-full h-auto"
                key={imageUrl}
              />
            )}
          </div>
          
          {/* Generated URL */}
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <div className="pr-20">
              <code className="text-green-400 text-sm font-mono break-all">
                {imageUrl}
              </code>
            </div>
            <button
              onClick={copyToClipboard}
              className={`absolute top-3 right-3 px-3 py-1 rounded text-white text-sm font-medium transition-all ${
                copied 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              aria-label="Copy URL to clipboard"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          {/* Usage Example */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Usage Example:</h4>
            <code className="text-sm text-blue-800 font-mono">
              &lt;img src="{imageUrl}" alt="Placeholder" /&gt;
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}