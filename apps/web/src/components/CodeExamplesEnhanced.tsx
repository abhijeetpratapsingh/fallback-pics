import { useState, useEffect } from 'react';
import { API_URL } from '../config';

// Syntax highlighting theme colors
const syntaxTheme = {
  keyword: '#C678DD',
  string: '#98C379',
  comment: '#5C6370',
  function: '#61AFEF',
  tag: '#E06C75',
  attribute: '#D19A66',
  number: '#D19A66',
  operator: '#56B6C2',
  variable: '#E5C07B',
  property: '#E06C75'
};

// Simple syntax highlighter
const highlightCode = (code: string, language: string) => {
  let highlighted = code;
  
  switch(language) {
    case 'html':
      // HTML highlighting
      highlighted = highlighted
        .replace(/(&lt;!--.*?--&gt;)/g, `<span style="color: ${syntaxTheme.comment}">$1</span>`)
        .replace(/(&lt;\/?[\w-]+)/g, `<span style="color: ${syntaxTheme.tag}">$1</span>`)
        .replace(/(&gt;)/g, `<span style="color: ${syntaxTheme.tag}">$1</span>`)
        .replace(/([\w-]+)=/g, `<span style="color: ${syntaxTheme.attribute}">$1</span>=`)
        .replace(/"([^"]*)"/g, `<span style="color: ${syntaxTheme.string}">"$1"</span>`);
      break;
      
    case 'javascript':
    case 'react':
      // JavaScript/React highlighting
      highlighted = highlighted
        .replace(/\/\/.*$/gm, match => `<span style="color: ${syntaxTheme.comment}">${match}</span>`)
        .replace(/\/\*[\s\S]*?\*\//g, match => `<span style="color: ${syntaxTheme.comment}">${match}</span>`)
        .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|default|class|extends|new)\b/g, 
          `<span style="color: ${syntaxTheme.keyword}">$1</span>`)
        .replace(/\b(true|false|null|undefined)\b/g, `<span style="color: ${syntaxTheme.number}">$1</span>`)
        .replace(/'([^']*)'/g, `<span style="color: ${syntaxTheme.string}">'$1'</span>`)
        .replace(/`([^`]*)`/g, `<span style="color: ${syntaxTheme.string}">\`$1\`</span>`)
        .replace(/\b(\d+)\b/g, `<span style="color: ${syntaxTheme.number}">$1</span>`)
        .replace(/\b([A-Z][a-zA-Z]*)\(/g, `<span style="color: ${syntaxTheme.function}">$1</span>(`)
        .replace(/\b([a-z][a-zA-Z]*)\(/g, `<span style="color: ${syntaxTheme.function}">$1</span>(`);
      break;
      
    case 'css':
      // CSS highlighting
      highlighted = highlighted
        .replace(/\/\*[\s\S]*?\*\//g, match => `<span style="color: ${syntaxTheme.comment}">${match}</span>`)
        .replace(/\.([\w-]+)/g, `<span style="color: ${syntaxTheme.function}">.$$1</span>`)
        .replace(/([\w-]+):/g, `<span style="color: ${syntaxTheme.property}">$1</span>:`)
        .replace(/:([\w-]+)/g, `:<span style="color: ${syntaxTheme.string}">$1</span>`)
        .replace(/'([^']*)'/g, `<span style="color: ${syntaxTheme.string}">'$1'</span>`)
        .replace(/#([0-9A-Fa-f]{3,6})\b/g, `<span style="color: ${syntaxTheme.string}">#$1</span>`)
        .replace(/(\d+(?:px|em|rem|%|vh|vw))/g, `<span style="color: ${syntaxTheme.number}">$1</span>`);
      break;
  }
  
  return highlighted;
};

const examples = {
  html: {
    label: 'HTML',
    code: `<!-- Basic usage -->
<img src="${API_URL}/400x300" alt="Placeholder">

<!-- With custom colors -->
<img src="${API_URL}/400x300/3B82F6/FFFFFF" 
     alt="Blue placeholder">

<!-- With custom text -->
<img src="${API_URL}/400x300?text=Product+Image" 
     alt="Product">

<!-- Animated skeleton loader -->
<img src="${API_URL}/animated/skeleton/400x300" 
     alt="Loading...">

<!-- AI-Generated contextual image -->
<img src="${API_URL}/ai/400x300?context=e-commerce&mood=minimal" 
     alt="AI Generated">`
  },
  
  react: {
    label: 'React',
    code: `// React component with TypeScript
interface PlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
  bg?: string;
  fg?: string;
  animated?: boolean;
}

function PlaceholderImage({ 
  width = 400, 
  height = 300, 
  text = "Product",
  bg = "7C3AED",
  fg = "FFFFFF",
  animated = false
}: PlaceholderProps) {
  const baseUrl = '${API_URL}';
  const type = animated ? 'animated/skeleton/' : '';
  
  return (
    <img 
      src={\`\${baseUrl}/\${type}\${width}x\${height}/\${bg}/\${fg}?text=\${text}\`}
      alt={text}
      loading="lazy"
      className="rounded-lg shadow-md"
    />
  );
}

// Usage
<PlaceholderImage width={800} height={600} text="Hero Image" />`
  },
  
  vue: {
    label: 'Vue',
    code: `<!-- Vue 3 Component -->
<template>
  <img 
    :src="placeholderUrl"
    :alt="alt"
    loading="lazy"
    class="placeholder-image"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: { type: Number, default: 400 },
  height: { type: Number, default: 300 },
  text: { type: String, default: '' },
  bg: { type: String, default: '7C3AED' },
  fg: { type: String, default: 'FFFFFF' }
})

const placeholderUrl = computed(() => {
  const base = '${API_URL}'
  let url = \`\${base}/\${props.width}x\${props.height}/\${props.bg}/\${props.fg}\`
  if (props.text) {
    url += \`?text=\${encodeURIComponent(props.text)}\`
  }
  return url
})
</script>`
  },
  
  css: {
    label: 'CSS',
    code: `/* CSS fallback image */
.hero-placeholder {
  background-image: url('${API_URL}/1920x1080');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

/* Avatar placeholder with gradient border */
.avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #7C3AED, #3B82F6);
  border-radius: 50%;
  z-index: -1;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Loading skeleton animation */
@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-loader {
  background-image: url('${API_URL}/animated/skeleton/400x250');
  animation: skeleton-shimmer 2s infinite;
}`
  },
  
  javascript: {
    label: 'JavaScript',
    code: `// Dynamic placeholder generator class
class PlaceholderGenerator {
  constructor(baseUrl = '${API_URL}') {
    this.baseUrl = baseUrl;
  }
  
  // Generate standard placeholder
  generate(width, height, options = {}) {
    const { 
      bg = '7C3AED', 
      fg = 'FFFFFF', 
      text = '',
      format = 'png'
    } = options;
    
    let url = \`\${this.baseUrl}/\${width}x\${height}\`;
    
    if (bg !== '7C3AED' || fg !== 'FFFFFF') {
      url += \`/\${bg}/\${fg}\`;
    }
    
    if (format !== 'png') {
      url += \`.\${format}\`;
    }
    
    const params = [];
    if (text) params.push(\`text=\${encodeURIComponent(text)}\`);
    
    if (params.length > 0) {
      url += \`?\${params.join('&')}\`;
    }
    
    return url;
  }
  
  // Generate AI-powered placeholder
  generateAI(width, height, context, mood = 'professional') {
    return \`\${this.baseUrl}/ai/\${width}x\${height}?context=\${context}&mood=\${mood}\`;
  }
  
  // Preload multiple placeholders
  async preloadImages(configs) {
    const promises = configs.map(config => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = this.generate(config.width, config.height, config.options);
      });
    });
    
    return Promise.all(promises);
  }
}

// Usage
const generator = new PlaceholderGenerator();

// Basic placeholder
const basicUrl = generator.generate(800, 600);

// Custom placeholder
const customUrl = generator.generate(1200, 400, {
  bg: '10B981',
  text: 'Hero Banner',
  format: 'webp'
});

// AI placeholder
const aiUrl = generator.generateAI(800, 600, 'e-commerce', 'minimal');

// Preload multiple images
generator.preloadImages([
  { width: 400, height: 300 },
  { width: 800, height: 600, options: { text: 'Product' } }
]).then(images => {
  console.log('Images preloaded:', images.length);
});`
  },
  
  curl: {
    label: 'cURL',
    code: `# Basic placeholder
curl -O ${API_URL}/400x300.png

# Custom colors and text
curl -O "${API_URL}/800x600/3B82F6/FFFFFF?text=API+Test"

# AI-generated placeholder
curl -O "${API_URL}/ai/1200x400?context=tech&mood=vibrant"

# Download multiple sizes
for size in "400x300" "800x600" "1200x400"; do
  curl -O "${API_URL}/$size.png"
done

# Generate avatar set
for i in {1..10}; do
  curl -o "avatar_$i.png" \\
    "${API_URL}/avatar/200?text=U$i"
done`
  }
};

export default function CodeExamplesEnhanced() {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const copyToClipboard = async () => {
    const code = examples[activeTab as keyof typeof examples].code;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const activeExample = examples[activeTab as keyof typeof examples];
  
  return (
    <section className="bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">Implementation examples</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Integration in seconds
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-400">
            Works with any framework, any language, anywhere.
          </p>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-white/10 bg-black/30 scrollbar-hide" role="tablist" aria-label="Code examples">
            {Object.entries(examples).map(([key, example]) => (
              <button
                key={key}
                id={`example-tab-${key}`}
                type="button"
                onClick={() => setActiveTab(key)}
                role="tab"
                aria-selected={activeTab === key}
                aria-controls={`example-panel-${key}`}
                className={`
                  relative whitespace-nowrap px-5 py-4 text-sm font-semibold transition
                  hover:bg-white/5
                  ${activeTab === key 
                    ? 'bg-white/5 text-white' 
                    : 'text-gray-400 hover:text-white'}
                `}
                aria-label={`View ${example.label} example`}
              >
                <span>{example.label}</span>
                {activeTab === key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
                )}
              </button>
            ))}
          </div>
          
          {/* Code Display */}
          <div className="relative">
            {/* Language Badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="code-lang bg-white/10 text-gray-300">
                {activeExample.label}
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className={`
                  rounded-md px-3 py-1.5 text-sm font-semibold transition
                  ${copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-950 hover:bg-gray-100'}
                `}
                aria-label="Copy code to clipboard"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            {/* Code Block */}
            <div
              id={`example-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`example-tab-${activeTab}`}
              className="overflow-x-auto p-6"
            >
              <pre className="text-gray-100 font-mono text-sm leading-relaxed">
                <code 
                  dangerouslySetInnerHTML={{ 
                    __html: mounted 
                      ? highlightCode(activeExample.code, activeTab)
                      : activeExample.code
                  }}
                />
              </pre>
            </div>
            
            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 opacity-80" />
          </div>
        </div>
        
        {/* Quick Reference Cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              URL Patterns
            </h3>
            <div className="space-y-2">
              {[
                { pattern: '/400x300', desc: 'Basic dimensions' },
                { pattern: '/400x300.webp', desc: 'With format' },
                { pattern: '/square/400', desc: 'Square preset' },
                { pattern: '/avatar/200', desc: 'Avatar preset' },
                { pattern: '/animated/skeleton/400x300', desc: 'Animated loader' },
                { pattern: '/ai/800x600', desc: 'AI generated' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <code className="bg-gray-800 px-3 py-1.5 rounded text-green-400 text-sm font-mono">
                    {item.pattern}
                  </code>
                  <span className="text-gray-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Parameters
            </h3>
            <div className="space-y-2">
              {[
                { param: '?text=Custom+Text', desc: 'Custom text' },
                { param: '?bg=FF0000', desc: 'Background color' },
                { param: '?fg=FFFFFF', desc: 'Text color' },
                { param: '?context=tech', desc: 'AI context' },
                { param: '?mood=minimal', desc: 'AI style' },
                { param: '?format=webp', desc: 'Image format' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <code className="bg-gray-800 px-3 py-1.5 rounded text-blue-400 text-sm font-mono">
                    {item.param}
                  </code>
                  <span className="text-gray-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .code-lang {
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}
