import React, { useState } from 'react';
import { API_URL } from '../config';

const examples = {
  html: `<!-- Basic usage -->
<img src="${API_URL}/400x300" alt="Placeholder">

<!-- With custom colors -->
<img src="${API_URL}/400x300/3B82F6/FFFFFF" 
     alt="Blue placeholder">

<!-- With custom text -->
<img src="${API_URL}/400x300?text=Product+Image" 
     alt="Product">

<!-- AI-Generated contextual image -->
<img src="${API_URL}/ai/400x300?context=e-commerce&mood=minimal" 
     alt="AI Generated">`,
  
  react: `// React component
function ProductImage({ width = 400, height = 300, text = "Product" }) {
  const baseUrl = '${API_URL}';
  return (
    <img 
      src={\`\${baseUrl}/\${width}x\${height}?text=\${text}\`}
      alt={text}
      loading="lazy"
    />
  );
}`,
  
  css: `/* CSS fallback image */
.placeholder {
  background-image: url('${API_URL}/1920x1080');
  background-size: cover;
  background-position: center;
}

/* Avatar placeholder */
.avatar {
  background-image: url('${API_URL}/avatar/100?text=JD');
  width: 100px;
  height: 100px;
  border-radius: 50%;
}`,
  
  javascript: `// Dynamic placeholder generation
function getPlaceholder(width, height, options = {}) {
  const baseUrl = '${API_URL}';
  const { bg = '7C3AED', fg = 'FFFFFF', text = '' } = options;
  let url = \`\${baseUrl}/\${width}x\${height}/\${bg}/\${fg}\`;
  
  if (text) {
    url += \`?text=\${encodeURIComponent(text)}\`;
  }
  
  return url;
}

// Usage
const imageUrl = getPlaceholder(800, 600, {
  bg: '10B981',
  text: 'Hero Image'
});`
};

export default function CodeExamples() {
  const [activeTab, setActiveTab] = useState('html');
  
  return (
    <section id="docs" className="py-12 sm:py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">Quick Start Examples</h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b scrollbar-hide">
            {Object.keys(examples).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-4 sm:px-6 py-3 font-medium capitalize transition whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                  activeTab === lang
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          
          <div className="p-3 sm:p-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <pre className="text-gray-100 p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm">
                <code>{examples[activeTab as keyof typeof examples]}</code>
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">URL Patterns</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">/400x300</code> - Basic dimensions</li>
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">/400x300.jpg</code> - With format</li>
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">/square/400</code> - Square preset</li>
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">/avatar/200</code> - Avatar preset</li>
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">/banner/1200x400</code> - Banner preset</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Parameters</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">?text=Custom+Text</code> - Custom text</li>
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">?bg=FF0000</code> - Background color</li>
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">?fg=FFFFFF</code> - Text color</li>
              <li><code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">/bg/fg</code> - Path-based colors</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}