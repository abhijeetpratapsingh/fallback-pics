import React, { useState } from 'react';
import { API_URL } from '../config';

export default function LiveDemo() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState('7C3AED');
  const [textColor, setTextColor] = useState('FFFFFF');
  const [text, setText] = useState('');
  const [preset, setPreset] = useState('standard');
  const [aiContext, setAiContext] = useState('');
  const [aiMood, setAiMood] = useState('');
  const [animationType, setAnimationType] = useState('skeleton');
  
  const getImageUrl = () => {
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
  };
  
  const imageUrl = getImageUrl();
  
  return (
    <section id="demo" className="py-20 px-4" role="region" aria-labelledby="demo-heading">
      <div className="max-w-6xl mx-auto">
        <h2 id="demo-heading" className="text-4xl font-bold text-center mb-12">Interactive Playground</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="preset-select" className="block text-sm font-medium mb-2">Preset</label>
              <select 
                id="preset-select"
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label="Select placeholder type preset"
              >
                <option value="standard">Standard</option>
                <option value="square">Square</option>
                <option value="avatar">Avatar</option>
                <option value="banner">Banner</option>
                <option value="skeleton">Skeleton</option>
                <option value="blur">Blur</option>
                <option value="ai">AI Generated</option>
                <option value="animated">Animated</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="width-input" className="block text-sm font-medium mb-2">Width</label>
                <input
                  id="width-input"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  min="1"
                  max="5000"
                  disabled={preset === 'square' || preset === 'avatar'}
                  aria-label="Image width in pixels"
                  aria-describedby="width-desc"
                />
              </div>
              <div>
                <label htmlFor="height-input" className="block text-sm font-medium mb-2">Height</label>
                <input
                  id="height-input"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  min="1"
                  max="5000"
                  disabled={preset === 'square' || preset === 'avatar'}
                  aria-label="Image height in pixels"
                  aria-describedby="height-desc"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bg-color-picker" className="block text-sm font-medium mb-2">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    id="bg-color-picker"
                    type="color"
                    value={`#${bgColor}`}
                    onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                    className="h-10 w-20 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Choose background color"
                  />
                  <input
                    id="bg-color-text"
                    type="text"
                    value={`#${bgColor}`}
                    onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                    className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={7}
                    placeholder="#7C3AED"
                    aria-label="Background color hex value"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="text-color-picker" className="block text-sm font-medium mb-2">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    id="text-color-picker"
                    type="color"
                    value={`#${textColor}`}
                    onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                    className="h-10 w-20 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Choose text color"
                  />
                  <input
                    id="text-color-text"
                    type="text"
                    value={`#${textColor}`}
                    onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                    className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={7}
                    placeholder="#FFFFFF"
                    aria-label="Text color hex value"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="custom-text" className="block text-sm font-medium mb-2">Custom Text (Optional)</label>
              <input
                id="custom-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Leave empty for dimensions"
                aria-label="Custom text to display on the placeholder image"
                aria-describedby="custom-text-desc"
              />
            </div>
            
            {preset === 'ai' && (
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                <div>
                  <label htmlFor="ai-context" className="block text-sm font-medium mb-2">AI Context (Industry/Type)</label>
                  <input
                    id="ai-context"
                    type="text"
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., e-commerce, healthcare, tech, product"
                    aria-label="AI context for generating relevant patterns"
                    aria-describedby="ai-context-help"
                  />
                </div>
                <div>
                  <label htmlFor="ai-mood" className="block text-sm font-medium mb-2">AI Mood/Style</label>
                  <input
                    id="ai-mood"
                    type="text"
                    value={aiMood}
                    onChange={(e) => setAiMood(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., minimal, vibrant, professional, playful"
                    aria-label="AI mood or style for the generated pattern"
                    aria-describedby="ai-mood-help"
                  />
                </div>
                <div className="text-xs text-gray-600" id="ai-context-help" role="note">
                  <p className="font-semibold mb-1">Try these combinations:</p>
                  <ul className="space-y-1">
                    <li>• Context: "e-commerce product" + Mood: "minimal"</li>
                    <li>• Context: "healthcare" + Mood: "calm"</li>
                    <li>• Context: "tech" + Mood: "vibrant"</li>
                    <li>• Context: "music" + Mood: "energetic"</li>
                  </ul>
                </div>
              </div>
            )}
            
            {preset === 'animated' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label htmlFor="animation-type" className="block text-sm font-medium mb-2">Animation Type</label>
                  <select 
                    id="animation-type"
                    value={animationType}
                    onChange={(e) => setAnimationType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    aria-label="Select animation type for the placeholder"
                  >
                    <option value="skeleton">Skeleton Shimmer</option>
                    <option value="pulse">Pulse</option>
                    <option value="wave">Wave</option>
                    <option value="shimmer">Shimmer Line</option>
                    <option value="gradient">Rotating Gradient</option>
                    <option value="dots">Loading Dots</option>
                  </select>
                </div>
                <div className="text-xs text-gray-600" role="note" aria-label="Animation features information">
                  <p className="font-semibold mb-1">Animation Features:</p>
                  <ul className="space-y-1">
                    <li>• CSS-only animations (no JavaScript)</li>
                    <li>• Respects prefers-reduced-motion</li>
                    <li>• Perfect for loading states</li>
                    <li>• Add ?reducedMotion=true to disable</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="bg-gray-100 p-4 rounded-lg" role="region" aria-label="Generated URL output">
              <label htmlFor="generated-url" className="block text-sm font-medium mb-2">Generated URL</label>
              <code id="generated-url" className="block bg-white p-3 rounded text-sm font-mono break-all" aria-live="polite" aria-atomic="true">
                {imageUrl}
              </code>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]" role="img" aria-label="Live preview of generated placeholder image">
            <img 
              src={imageUrl} 
              alt={`Generated placeholder image${text ? ` with text: ${text}` : ` showing dimensions ${width}x${height}`}`}
              className="max-w-full h-auto rounded shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}