/**
 * AI-Powered Intelligent Placeholder Generation
 * Creates context-aware, sophisticated SVG placeholders
 */

import { createSeededRandom, escapeXml } from "./utils";

interface AIContext {
  name: string;
  layout: 'product' | 'hero' | 'card' | 'dashboard' | 'profile' | 'gallery';
  elements: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Context-aware templates with intelligent layouts
const AI_CONTEXTS: Record<string, AIContext> = {
  'e-commerce': {
    name: 'E-commerce',
    layout: 'product',
    elements: ['image', 'price', 'title', 'rating', 'button'],
    primaryColor: '#FF6B6B',
    secondaryColor: '#FFA07A',
    accentColor: '#FFD700'
  },
  'e-commerce product': {
    name: 'Product',
    layout: 'product',
    elements: ['gallery', 'price', 'description', 'reviews', 'addToCart'],
    primaryColor: '#FF6B6B',
    secondaryColor: '#FFA07A',
    accentColor: '#4CAF50'
  },
  'tech': {
    name: 'Technology',
    layout: 'hero',
    elements: ['grid', 'code', 'terminal', 'metrics'],
    primaryColor: '#4ECDC4',
    secondaryColor: '#44A3D7',
    accentColor: '#556270'
  },
  'blog': {
    name: 'Blog Post',
    layout: 'card',
    elements: ['header', 'text', 'author', 'date', 'tags'],
    primaryColor: '#45B7D1',
    secondaryColor: '#DCEDC8',
    accentColor: '#FFA07A'
  },
  'portfolio': {
    name: 'Portfolio',
    layout: 'gallery',
    elements: ['grid', 'projects', 'filters', 'hover'],
    primaryColor: '#96CEB4',
    secondaryColor: '#DDA0DD',
    accentColor: '#FFD700'
  },
  'dashboard': {
    name: 'Analytics',
    layout: 'dashboard',
    elements: ['charts', 'metrics', 'graphs', 'kpi'],
    primaryColor: '#667EEA',
    secondaryColor: '#764BA2',
    accentColor: '#F093FB'
  },
  'social': {
    name: 'Social Media',
    layout: 'card',
    elements: ['avatar', 'post', 'likes', 'comments', 'share'],
    primaryColor: '#F093FB',
    secondaryColor: '#F5576C',
    accentColor: '#4FACFE'
  },
  'healthcare': {
    name: 'Healthcare',
    layout: 'dashboard',
    elements: ['vitals', 'charts', 'appointments', 'records'],
    primaryColor: '#4CAF50',
    secondaryColor: '#81C784',
    accentColor: '#00BCD4'
  },
  'education': {
    name: 'Education',
    layout: 'card',
    elements: ['courses', 'progress', 'lessons', 'quiz'],
    primaryColor: '#2196F3',
    secondaryColor: '#03A9F4',
    accentColor: '#00BCD4'
  },
  'finance': {
    name: 'Finance',
    layout: 'dashboard',
    elements: ['charts', 'balance', 'transactions', 'trends'],
    primaryColor: '#00BCD4',
    secondaryColor: '#00ACC1',
    accentColor: '#4CAF50'
  },
  'real estate': {
    name: 'Property',
    layout: 'card',
    elements: ['image', 'price', 'location', 'specs', 'contact'],
    primaryColor: '#795548',
    secondaryColor: '#8D6E63',
    accentColor: '#FF9800'
  },
  'travel': {
    name: 'Travel',
    layout: 'hero',
    elements: ['destination', 'dates', 'price', 'booking'],
    primaryColor: '#FFC107',
    secondaryColor: '#FFB300',
    accentColor: '#03A9F4'
  },
  'food': {
    name: 'Food & Dining',
    layout: 'product',
    elements: ['menu', 'price', 'ingredients', 'nutrition', 'order'],
    primaryColor: '#FF9800',
    secondaryColor: '#FFB74D',
    accentColor: '#4CAF50'
  },
  'fashion': {
    name: 'Fashion',
    layout: 'gallery',
    elements: ['lookbook', 'model', 'details', 'sizes', 'cart'],
    primaryColor: '#E91E63',
    secondaryColor: '#F48FB1',
    accentColor: '#FFD700'
  },
  'sports': {
    name: 'Sports',
    layout: 'dashboard',
    elements: ['scores', 'stats', 'players', 'standings'],
    primaryColor: '#4CAF50',
    secondaryColor: '#66BB6A',
    accentColor: '#FF5722'
  },
  'entertainment': {
    name: 'Entertainment',
    layout: 'hero',
    elements: ['video', 'title', 'rating', 'play', 'duration'],
    primaryColor: '#9C27B0',
    secondaryColor: '#AB47BC',
    accentColor: '#FF4081'
  },
  'news': {
    name: 'News',
    layout: 'card',
    elements: ['headline', 'article', 'author', 'time', 'category'],
    primaryColor: '#424242',
    secondaryColor: '#616161',
    accentColor: '#F44336'
  },
  'gaming': {
    name: 'Gaming',
    layout: 'hero',
    elements: ['character', 'score', 'level', 'achievements'],
    primaryColor: '#673AB7',
    secondaryColor: '#7E57C2',
    accentColor: '#FFC107'
  },
  'automotive': {
    name: 'Automotive',
    layout: 'product',
    elements: ['vehicle', 'specs', 'price', 'features', 'gallery'],
    primaryColor: '#607D8B',
    secondaryColor: '#78909C',
    accentColor: '#FF5722'
  }
};

// Generate intelligent layout based on context
function generateProductLayout(w: number, h: number, ctx: AIContext, mood: string): string {
  const padding = Math.min(w, h) * 0.05;
  const imageHeight = h * 0.6;
  const contentY = imageHeight + padding;
  
  return `
    <!-- Product Image Area -->
    <rect x="${padding}" y="${padding}" width="${w - padding * 2}" height="${imageHeight - padding}" 
          fill="${ctx.secondaryColor}" opacity="0.3" rx="8"/>
    <rect x="${padding * 2}" y="${padding * 2}" width="${w * 0.15}" height="${h * 0.08}" 
          fill="${ctx.accentColor}" rx="4"/>
    <text x="${padding * 2.5}" y="${padding * 2.5 + h * 0.04}" font-family="system-ui" 
          font-size="${h * 0.03}" fill="white" font-weight="bold">SALE</text>
    
    <!-- Product Details -->
    <rect x="${padding}" y="${contentY}" width="${w - padding * 2}" height="${h * 0.06}" 
          fill="${ctx.primaryColor}" opacity="0.2" rx="4"/>
    <rect x="${padding}" y="${contentY + h * 0.08}" width="${w * 0.6}" height="${h * 0.04}" 
          fill="#e0e0e0" rx="2"/>
    
    <!-- Price and Rating -->
    <text x="${padding}" y="${contentY + h * 0.18}" font-family="system-ui" 
          font-size="${h * 0.06}" fill="${ctx.primaryColor}" font-weight="bold">$99.99</text>
    ${generateStarRating(w - padding * 2 - w * 0.3, contentY + h * 0.15, h * 0.04, ctx.accentColor)}
    
    <!-- Add to Cart Button -->
    <rect x="${padding}" y="${h - padding - h * 0.08}" width="${w - padding * 2}" height="${h * 0.08}" 
          fill="${ctx.primaryColor}" rx="4"/>
    <text x="${w/2}" y="${h - padding - h * 0.04}" font-family="system-ui" 
          font-size="${h * 0.035}" fill="white" text-anchor="middle" font-weight="bold">Add to Cart</text>
  `;
}

function generateHeroLayout(w: number, h: number, ctx: AIContext, mood: string): string {
  const gridSize = Math.min(w, h) * 0.02;
  
  return `
    <!-- Background Pattern -->
    <defs>
      <pattern id="grid" x="0" y="0" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
        <rect width="${gridSize}" height="${gridSize}" fill="none" stroke="${ctx.secondaryColor}" stroke-width="0.5" opacity="0.3"/>
      </pattern>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${ctx.primaryColor};stop-opacity:0.8"/>
        <stop offset="100%" style="stop-color:${ctx.secondaryColor};stop-opacity:0.8"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#heroGrad)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    
    <!-- Hero Content -->
    <rect x="${w * 0.1}" y="${h * 0.3}" width="${w * 0.35}" height="${h * 0.08}" 
          fill="white" opacity="0.2" rx="4"/>
    <rect x="${w * 0.1}" y="${h * 0.42}" width="${w * 0.5}" height="${h * 0.04}" 
          fill="white" opacity="0.15" rx="2"/>
    <rect x="${w * 0.1}" y="${h * 0.48}" width="${w * 0.45}" height="${h * 0.04}" 
          fill="white" opacity="0.15" rx="2"/>
    
    <!-- CTA Buttons -->
    <rect x="${w * 0.1}" y="${h * 0.6}" width="${w * 0.2}" height="${h * 0.08}" 
          fill="white" rx="4"/>
    <rect x="${w * 0.32}" y="${h * 0.6}" width="${w * 0.2}" height="${h * 0.08}" 
          fill="transparent" stroke="white" stroke-width="2" rx="4"/>
    
    <!-- Decorative Elements -->
    <circle cx="${w * 0.8}" cy="${h * 0.2}" r="${Math.min(w, h) * 0.15}" 
            fill="${ctx.accentColor}" opacity="0.2"/>
    <circle cx="${w * 0.85}" cy="${h * 0.8}" r="${Math.min(w, h) * 0.1}" 
            fill="${ctx.secondaryColor}" opacity="0.3"/>
  `;
}

function generateCardLayout(w: number, h: number, ctx: AIContext, mood: string): string {
  const padding = Math.min(w, h) * 0.05;
  const headerHeight = h * 0.35;
  
  return `
    <!-- Card Background -->
    <rect width="100%" height="100%" fill="white" rx="8"/>
    <rect width="100%" height="${headerHeight}" fill="${ctx.primaryColor}" opacity="0.1" rx="8 8 0 0"/>
    
    <!-- Image Placeholder -->
    <rect x="${padding}" y="${padding}" width="${w - padding * 2}" height="${headerHeight - padding * 2}" 
          fill="${ctx.secondaryColor}" opacity="0.3" rx="4"/>
    
    <!-- Content Lines -->
    <rect x="${padding}" y="${headerHeight + padding}" width="${w * 0.7}" height="${h * 0.04}" 
          fill="#333" opacity="0.8" rx="2"/>
    <rect x="${padding}" y="${headerHeight + padding * 2 + h * 0.04}" width="${w - padding * 2}" height="${h * 0.03}" 
          fill="#666" opacity="0.4" rx="2"/>
    <rect x="${padding}" y="${headerHeight + padding * 3 + h * 0.08}" width="${w * 0.9}" height="${h * 0.03}" 
          fill="#666" opacity="0.3" rx="2"/>
    
    <!-- Meta Info -->
    <circle cx="${padding + h * 0.04}" cy="${h - padding - h * 0.04}" r="${h * 0.04}" 
            fill="${ctx.accentColor}" opacity="0.3"/>
    <rect x="${padding * 2 + h * 0.08}" y="${h - padding - h * 0.06}" width="${w * 0.3}" height="${h * 0.03}" 
          fill="#999" opacity="0.3" rx="2"/>
    
    <!-- Category Tag -->
    <rect x="${w - padding - w * 0.25}" y="${padding}" width="${w * 0.2}" height="${h * 0.06}" 
          fill="${ctx.accentColor}" rx="3"/>
  `;
}

function generateDashboardLayout(w: number, h: number, ctx: AIContext, mood: string): string {
  const padding = Math.min(w, h) * 0.03;
  const cardWidth = (w - padding * 4) / 3;
  const cardHeight = h * 0.25;
  const random = createSeededRandom(`${w}x${h}-${mood}-dashboard`);
  
  return `
    <!-- KPI Cards -->
    ${[0, 1, 2].map(i => `
      <rect x="${padding + i * (cardWidth + padding)}" y="${padding}" 
            width="${cardWidth}" height="${cardHeight}" 
            fill="${i === 0 ? ctx.primaryColor : i === 1 ? ctx.secondaryColor : ctx.accentColor}" 
            opacity="0.1" rx="4"/>
      <rect x="${padding * 1.5 + i * (cardWidth + padding)}" y="${padding * 2}" 
            width="${cardWidth * 0.4}" height="${cardHeight * 0.3}" 
            fill="${i === 0 ? ctx.primaryColor : i === 1 ? ctx.secondaryColor : ctx.accentColor}" 
            opacity="0.3" rx="2"/>
      <text x="${padding * 1.5 + i * (cardWidth + padding) + cardWidth * 0.2}" 
            y="${padding * 2 + cardHeight * 0.5}" 
            font-family="system-ui" font-size="${h * 0.06}" 
            fill="${i === 0 ? ctx.primaryColor : i === 1 ? ctx.secondaryColor : ctx.accentColor}" 
            text-anchor="middle" font-weight="bold">
        ${i === 0 ? '↑12%' : i === 1 ? '2.4K' : '$45K'}
      </text>
      <rect x="${padding * 1.5 + i * (cardWidth + padding)}" 
            y="${padding + cardHeight * 0.7}" 
            width="${cardWidth * 0.8}" height="${cardHeight * 0.15}" 
            fill="#999" opacity="0.2" rx="2"/>
    `).join('')}
    
    <!-- Chart Area -->
    <rect x="${padding}" y="${cardHeight + padding * 2}" 
          width="${w * 0.65}" height="${h - cardHeight - padding * 3}" 
          fill="${ctx.primaryColor}" opacity="0.05" rx="4"/>
    
    <!-- Chart Bars -->
    ${[0, 1, 2, 3, 4].map(i => {
      const barHeight = random() * (h - cardHeight - padding * 6) * 0.7 + (h - cardHeight - padding * 6) * 0.2;
      const barX = padding * 2 + i * (w * 0.65 - padding * 3) / 5;
      return `<rect x="${barX}" y="${h - padding - barHeight}" 
                    width="${(w * 0.65 - padding * 3) / 6}" height="${barHeight}" 
                    fill="${ctx.primaryColor}" opacity="0.4" rx="2"/>`;
    }).join('')}
    
    <!-- Side Panel -->
    <rect x="${w * 0.68}" y="${cardHeight + padding * 2}" 
          width="${w * 0.3}" height="${h - cardHeight - padding * 3}" 
          fill="${ctx.secondaryColor}" opacity="0.05" rx="4"/>
    
    <!-- List Items -->
    ${[0, 1, 2].map(i => `
      <rect x="${w * 0.7}" y="${cardHeight + padding * 3 + i * h * 0.08}" 
            width="${w * 0.26}" height="${h * 0.05}" 
            fill="${ctx.secondaryColor}" opacity="0.2" rx="2"/>
    `).join('')}
  `;
}

function generateGalleryLayout(w: number, h: number, ctx: AIContext, mood: string): string {
  const padding = Math.min(w, h) * 0.03;
  const cols = 3;
  const rows = 2;
  const itemWidth = (w - padding * (cols + 1)) / cols;
  const itemHeight = (h - padding * (rows + 1)) / rows;
  
  return `
    <!-- Gallery Grid -->
    ${Array.from({ length: rows * cols }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = padding + col * (itemWidth + padding);
      const y = padding + row * (itemHeight + padding);
      const opacity = 0.1 + (i * 0.1);
      
      return `
        <rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" 
              fill="${i % 3 === 0 ? ctx.primaryColor : i % 3 === 1 ? ctx.secondaryColor : ctx.accentColor}" 
              opacity="${opacity}" rx="4"/>
        <rect x="${x + itemWidth * 0.1}" y="${y + itemHeight * 0.1}" 
              width="${itemWidth * 0.8}" height="${itemHeight * 0.6}" 
              fill="white" opacity="0.2" rx="2"/>
        <rect x="${x + itemWidth * 0.1}" y="${y + itemHeight * 0.75}" 
              width="${itemWidth * 0.6}" height="${itemHeight * 0.1}" 
              fill="white" opacity="0.3" rx="2"/>
      `;
    }).join('')}
  `;
}

function generateProfileLayout(w: number, h: number, ctx: AIContext, mood: string): string {
  const centerX = w / 2;
  const avatarRadius = Math.min(w, h) * 0.15;
  
  return `
    <!-- Background Gradient -->
    <defs>
      <linearGradient id="profileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${ctx.primaryColor};stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:white;stop-opacity:1"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#profileGrad)"/>
    
    <!-- Cover Area -->
    <rect width="100%" height="${h * 0.3}" fill="${ctx.primaryColor}" opacity="0.2"/>
    
    <!-- Avatar -->
    <circle cx="${centerX}" cy="${h * 0.3}" r="${avatarRadius}" 
            fill="white" stroke="${ctx.primaryColor}" stroke-width="4"/>
    <circle cx="${centerX}" cy="${h * 0.3}" r="${avatarRadius - 5}" 
            fill="${ctx.secondaryColor}" opacity="0.3"/>
    
    <!-- Name Placeholder -->
    <rect x="${centerX - w * 0.2}" y="${h * 0.3 + avatarRadius + 20}" 
          width="${w * 0.4}" height="${h * 0.05}" 
          fill="#333" opacity="0.7" rx="2"/>
    
    <!-- Bio Lines -->
    <rect x="${w * 0.2}" y="${h * 0.55}" width="${w * 0.6}" height="${h * 0.03}" 
          fill="#666" opacity="0.3" rx="2"/>
    <rect x="${w * 0.15}" y="${h * 0.6}" width="${w * 0.7}" height="${h * 0.03}" 
          fill="#666" opacity="0.2" rx="2"/>
    
    <!-- Stats -->
    ${[0, 1, 2].map(i => `
      <rect x="${w * 0.15 + i * w * 0.25}" y="${h * 0.7}" 
            width="${w * 0.2}" height="${h * 0.1}" 
            fill="${ctx.accentColor}" opacity="${0.1 + i * 0.1}" rx="4"/>
      <text x="${w * 0.25 + i * w * 0.25}" y="${h * 0.75}" 
            font-family="system-ui" font-size="${h * 0.04}" 
            fill="${ctx.primaryColor}" text-anchor="middle" font-weight="bold">
        ${i === 0 ? '1.2K' : i === 1 ? '856' : '432'}
      </text>
    `).join('')}
  `;
}

// Helper function to generate star rating
function generateStarRating(x: number, y: number, size: number, color: string): string {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const starX = x + i * (size + 2);
    const filled = i < 4; // 4 stars filled
    stars.push(`
      <polygon points="${starX},${y} ${starX + size * 0.4},${y - size * 0.3} ${starX + size * 0.5},${y - size * 0.8} 
                       ${starX + size * 0.6},${y - size * 0.3} ${starX + size},${y} 
                       ${starX + size * 0.7},${y + size * 0.3} ${starX + size * 0.5},${y + size * 0.5} 
                       ${starX + size * 0.3},${y + size * 0.3}"
               fill="${filled ? color : '#ddd'}" opacity="${filled ? 0.8 : 0.3}"/>
    `);
  }
  return stars.join('');
}

// Main function to generate AI-powered SVG
export function generateAISVG(
  width: number,
  height: number,
  context: string = 'tech',
  mood: string = 'default',
  customText?: string,
  customBgColor?: string,
  customTextColor?: string
): string {
  const baseCtx = AI_CONTEXTS[context.toLowerCase()] || AI_CONTEXTS['tech'];
  const ctx = {
    ...baseCtx,
    primaryColor: customBgColor || baseCtx.primaryColor,
    accentColor: customTextColor || baseCtx.accentColor,
  };
  
  // Select layout based on context
  let layoutContent = '';
  switch (ctx.layout) {
    case 'product':
      layoutContent = generateProductLayout(width, height, ctx, mood);
      break;
    case 'hero':
      layoutContent = generateHeroLayout(width, height, ctx, mood);
      break;
    case 'card':
      layoutContent = generateCardLayout(width, height, ctx, mood);
      break;
    case 'dashboard':
      layoutContent = generateDashboardLayout(width, height, ctx, mood);
      break;
    case 'gallery':
      layoutContent = generateGalleryLayout(width, height, ctx, mood);
      break;
    case 'profile':
      layoutContent = generateProfileLayout(width, height, ctx, mood);
      break;
    default:
      layoutContent = generateCardLayout(width, height, ctx, mood);
  }
  
  // Apply mood modifications
  let filter = '';
  if (mood === 'dark') {
    filter = '<filter id="darken"><feComponentTransfer><feFuncR type="linear" slope="0.5"/><feFuncG type="linear" slope="0.5"/><feFuncB type="linear" slope="0.5"/></feComponentTransfer></filter>';
    layoutContent = `<g filter="url(#darken)">${layoutContent}</g>`;
  } else if (mood === 'vibrant') {
    filter = '<filter id="saturate"><feColorMatrix type="saturate" values="2"/></filter>';
    layoutContent = `<g filter="url(#saturate)">${layoutContent}</g>`;
  } else if (mood === 'minimal') {
    filter = '<filter id="desaturate"><feColorMatrix type="saturate" values="0.3"/></filter>';
    layoutContent = `<g filter="url(#desaturate)">${layoutContent}</g>`;
  }
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>${filter}</defs>
    <rect width="100%" height="100%" fill="#fafafa"/>
    ${layoutContent}
    ${customText ? `<text x="${width/2}" y="${height - 10}" font-family="system-ui" font-size="10" fill="#999" text-anchor="middle">${escapeXml(customText)}</text>` : ''}
  </svg>`;
}