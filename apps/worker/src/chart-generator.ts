/**
 * Advanced Chart Generation for fallback.pics
 * Creates sophisticated, realistic-looking chart visualizations
 */

import { createSeededRandom } from "./utils";

type RandomFn = () => number;

interface ChartColors {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  background: string;
  grid: string;
  text: string;
}

// Professional color schemes for charts
const CHART_THEMES: Record<string, ChartColors> = {
  default: {
    primary: '#7C3AED',
    secondary: '#3B82F6',
    tertiary: '#10B981',
    quaternary: '#F59E0B',
    background: '#FFFFFF',
    grid: '#E5E7EB',
    text: '#374151'
  },
  dark: {
    primary: '#8B5CF6',
    secondary: '#60A5FA',
    tertiary: '#34D399',
    quaternary: '#FBBF24',
    background: '#1F2937',
    grid: '#374151',
    text: '#F3F4F6'
  },
  finance: {
    primary: '#059669',
    secondary: '#0891B2',
    tertiary: '#7C3AED',
    quaternary: '#DC2626',
    background: '#FFFFFF',
    grid: '#E5E7EB',
    text: '#111827'
  },
  vibrant: {
    primary: '#EC4899',
    secondary: '#8B5CF6',
    tertiary: '#3B82F6',
    quaternary: '#10B981',
    background: '#FAFAFA',
    grid: '#E5E7EB',
    text: '#1F2937'
  }
};

export function generateChartSVG(
  width: number,
  height: number,
  type: string = 'bar',
  bgColor?: string,
  primaryColor?: string,
  text?: string
): string {
  // Determine theme based on colors or use default
  const theme = bgColor && bgColor.toLowerCase() === '#1f2937' ? 'dark' : 'default';
  const random = createSeededRandom(`${width}x${height}-${type}-${text || ''}`);
  
  switch (type) {
    case 'bar':
      return generateBarChart(width, height, theme);
    case 'pie':
      return generatePieChart(width, height, false, theme, random);
    case 'line':
      return generateLineChart(width, height, theme, random);
    case 'area':
      return generateAreaChart(width, height, theme, random);
    case 'donut':
      return generatePieChart(width, height, true, theme, random);
    case 'scatter':
      return generateScatterChart(width, height, theme, random);
    case 'radar':
      return generateRadarChart(width, height, theme, random);
    case 'heatmap':
      return generateHeatmap(width, height, theme, random);
    default:
      return generateBarChart(width, height, theme);
  }
}

// Generate realistic bar chart with axes and labels
function generateBarChart(width: number, height: number, theme: string = 'default'): string {
  const colors = CHART_THEMES[theme] || CHART_THEMES.default;
  const padding = Math.min(width, height) * 0.1;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Generate realistic data
  const data = [65, 82, 73, 91, 68, 87, 75, 94, 79, 85];
  const maxValue = 100;
  const barWidth = chartWidth / (data.length * 1.5);
  const gap = barWidth * 0.5;
  
  let bars = '';
  let labels = '';
  
  data.forEach((value, i) => {
    const barHeight = (value / maxValue) * chartHeight * 0.8;
    const x = padding + i * (barWidth + gap) + gap;
    const y = height - padding - barHeight;
    
    // Bar with gradient
    bars += `
      <defs>
        <linearGradient id="barGrad${i}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.8"/>
        </linearGradient>
      </defs>
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
            fill="url(#barGrad${i})" rx="2"/>
      <text x="${x + barWidth/2}" y="${y - 5}" 
            font-family="system-ui" font-size="${height * 0.03}" 
            fill="${colors.text}" text-anchor="middle">${value}</text>
    `;
    
    // X-axis labels
    labels += `
      <text x="${x + barWidth/2}" y="${height - padding + 15}" 
            font-family="system-ui" font-size="${height * 0.03}" 
            fill="${colors.text}" text-anchor="middle">${String.fromCharCode(65 + i)}</text>
    `;
  });
  
  // Grid lines
  let grid = '';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight * 0.8 * i / 5);
    grid += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" 
                   stroke="${colors.grid}" stroke-width="1" opacity="0.3"/>`;
    grid += `<text x="${padding - 10}" y="${y + 4}" 
                   font-family="system-ui" font-size="${height * 0.03}" 
                   fill="${colors.text}" text-anchor="end">${100 - i * 20}</text>`;
  }
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${colors.background}"/>
    ${grid}
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" 
          stroke="${colors.text}" stroke-width="2"/>
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" 
          stroke="${colors.text}" stroke-width="2"/>
    ${bars}
    ${labels}
    <text x="${width/2}" y="${padding/2}" 
          font-family="system-ui" font-size="${height * 0.04}" font-weight="bold"
          fill="${colors.text}" text-anchor="middle">Sales Performance</text>
  </svg>`;
}

// Generate realistic pie/donut chart
function generatePieChart(
  width: number,
  height: number,
  isDonut: boolean = false,
  theme: string = 'default',
  random: RandomFn = Math.random,
): string {
  const colors = CHART_THEMES[theme] || CHART_THEMES.default;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  
  // Generate deterministic slice values
  const sliceCount = 4 + Math.floor(random() * 3);
  const values = Array.from({ length: sliceCount }, () => random());
  const total = values.reduce((a, b) => a + b, 0);
  const percentages = values.map(v => v / total);
  
  const sliceColors = generateColorPalette(colors.primary, sliceCount, random);
  
  let slices = '';
  let currentAngle = -90; // Start from top
  
  for (let i = 0; i < sliceCount; i++) {
    const angle = percentages[i] * 360;
    const endAngle = currentAngle + angle;
    
    const startX = centerX + radius * Math.cos(currentAngle * Math.PI / 180);
    const startY = centerY + radius * Math.sin(currentAngle * Math.PI / 180);
    const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
    const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    slices += `<path d="M ${centerX},${centerY} 
                        L ${startX},${startY} 
                        A ${radius},${radius} 0 ${largeArc},1 ${endX},${endY} 
                        Z" 
                     fill="${sliceColors[i]}" 
                     opacity="0.9" 
                     stroke="${colors.background}" 
                     stroke-width="2"/>`;
    
    currentAngle = endAngle;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${colors.background}"/>
  
  <!-- Pie slices -->
  ${slices}
  
  <!-- Title -->
  <text x="${width/2}" y="${height * 0.1}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width, height) * 0.04}" 
        fill="#374151" 
        text-anchor="middle">Pie Chart</text>
</svg>`;
}

// Generate sophisticated line chart
function generateLineChart(
  width: number,
  height: number,
  theme: string = 'default',
  random: RandomFn = Math.random,
): string {
  const colors = CHART_THEMES[theme] || CHART_THEMES.default;
  const padding = Math.min(width, height) * 0.1;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const pointCount = 8 + Math.floor(random() * 5);
  
  // Generate smooth deterministic data with trend
  const trend = random() > 0.5 ? 1 : -1;
  const points: { x: number; y: number }[] = [];
  let currentY = 0.5;
  
  for (let i = 0; i < pointCount; i++) {
    const x = padding + (i / (pointCount - 1)) * chartWidth;
    currentY += (random() - 0.5) * 0.3 + trend * 0.05;
    currentY = Math.max(0.1, Math.min(0.9, currentY));
    const y = padding + (1 - currentY) * chartHeight;
    points.push({ x, y });
  }
  
  // Create path
  const path = points.map((p, i) => 
    i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`
  ).join(' ');
  
  // Create area fill
  const areaPath = path + ` L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${colors.background}"/>
  
  <!-- Grid lines -->
  ${generateGridLines(padding, width - padding, padding, height - padding, 5)}
  
  <!-- Area fill -->
  <path d="${areaPath}" fill="${colors.primary}" opacity="0.1"/>
  
  <!-- Line -->
  <path d="${path}" 
        fill="none" 
        stroke="${colors.primary}" 
        stroke-width="3" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
  
  <!-- Points -->
  ${points.map(p => 
    `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${colors.primary}" stroke="${colors.background}" stroke-width="2"/>`
  ).join('\n  ')}
  
  <!-- Axes -->
  <line x1="${padding}" y1="${height - padding}" 
        x2="${width - padding}" y2="${height - padding}" 
        stroke="#E5E7EB" stroke-width="2"/>
  <line x1="${padding}" y1="${padding}" 
        x2="${padding}" y2="${height - padding}" 
        stroke="#E5E7EB" stroke-width="2"/>
  
  <!-- Title -->
  <text x="${width/2}" y="${padding/2}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width, height) * 0.04}" 
        fill="#374151" 
        text-anchor="middle">Line Chart</text>
</svg>`;
}

// Generate area chart
function generateAreaChart(
  width: number,
  height: number,
  theme: string = 'default',
  random: RandomFn = Math.random,
): string {
  const colors = CHART_THEMES[theme] || CHART_THEMES.default;
  const padding = Math.min(width, height) * 0.1;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Generate multiple area series
  const seriesCount = 3;
  const pointCount = 10;
  const seriesColors = generateColorPalette(colors.primary, seriesCount, random);
  
  let areas = '';
  
  for (let s = 0; s < seriesCount; s++) {
    const points: { x: number; y: number }[] = [];
    let baseY = 0.3 + s * 0.2;
    
    for (let i = 0; i < pointCount; i++) {
      const x = padding + (i / (pointCount - 1)) * chartWidth;
      const variation = Math.sin(i * 0.5 + s) * 0.2 + random() * 0.1;
      const y = padding + (1 - (baseY + variation)) * chartHeight;
      points.push({ x, y });
    }
    
    const path = points.map((p, i) => 
      i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`
    ).join(' ');
    
    const areaPath = path + ` L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
    
    areas += `<path d="${areaPath}" fill="${seriesColors[s]}" opacity="${0.6 - s * 0.15}"/>`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${colors.background}"/>
  
  <!-- Grid lines -->
  ${generateGridLines(padding, width - padding, padding, height - padding, 5)}
  
  <!-- Areas -->
  ${areas}
  
  <!-- Axes -->
  <line x1="${padding}" y1="${height - padding}" 
        x2="${width - padding}" y2="${height - padding}" 
        stroke="#E5E7EB" stroke-width="2"/>
  <line x1="${padding}" y1="${padding}" 
        x2="${padding}" y2="${height - padding}" 
        stroke="#E5E7EB" stroke-width="2"/>
  
  <!-- Title -->
  <text x="${width/2}" y="${padding/2}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width, height) * 0.04}" 
        fill="#374151" 
        text-anchor="middle">Area Chart</text>
</svg>`;
}

// Generate donut chart (now handled by generatePieChart)
function generateDonutChart(width: number, height: number, theme: string = 'default'): string {
  return generatePieChart(width, height, true, theme);
}

// Original donut function (deprecated)
function generateDonutChartOld(width: number, height: number, bgColor: string, primaryColor: string): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) * 0.35;
  const innerRadius = outerRadius * 0.6;
  
  // Generate random slice values
  const sliceCount = 4 + Math.floor(Math.random() * 2);
  const values = Array.from({ length: sliceCount }, () => Math.random());
  const total = values.reduce((a, b) => a + b, 0);
  const percentages = values.map(v => v / total);
  
  const sliceColors = generateColorPalette(primaryColor, sliceCount);
  
  let slices = '';
  let currentAngle = -90; // Start from top
  
  for (let i = 0; i < sliceCount; i++) {
    const angle = percentages[i] * 360;
    const endAngle = currentAngle + angle;
    
    const startOuterX = centerX + outerRadius * Math.cos(currentAngle * Math.PI / 180);
    const startOuterY = centerY + outerRadius * Math.sin(currentAngle * Math.PI / 180);
    const endOuterX = centerX + outerRadius * Math.cos(endAngle * Math.PI / 180);
    const endOuterY = centerY + outerRadius * Math.sin(endAngle * Math.PI / 180);
    
    const startInnerX = centerX + innerRadius * Math.cos(currentAngle * Math.PI / 180);
    const startInnerY = centerY + innerRadius * Math.sin(currentAngle * Math.PI / 180);
    const endInnerX = centerX + innerRadius * Math.cos(endAngle * Math.PI / 180);
    const endInnerY = centerY + innerRadius * Math.sin(endAngle * Math.PI / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    slices += `<path d="M ${startInnerX},${startInnerY}
                        L ${startOuterX},${startOuterY}
                        A ${outerRadius},${outerRadius} 0 ${largeArc},1 ${endOuterX},${endOuterY}
                        L ${endInnerX},${endInnerY}
                        A ${innerRadius},${innerRadius} 0 ${largeArc},0 ${startInnerX},${startInnerY}
                        Z" 
                     fill="${sliceColors[i]}" 
                     opacity="0.9" 
                     stroke="${bgColor}" 
                     stroke-width="2"/>`;
    
    currentAngle = endAngle;
  }
  
  // Center text
  const centerValue = Math.floor(Math.random() * 90 + 10);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${bgColor}"/>
  
  <!-- Donut slices -->
  ${slices}
  
  <!-- Center text -->
  <text x="${centerX}" y="${centerY}" 
        font-family="system-ui, sans-serif" 
        font-size="${innerRadius * 0.5}" 
        font-weight="bold"
        fill="#374151" 
        text-anchor="middle" 
        dominant-baseline="middle">${centerValue}%</text>
  
  <!-- Title -->
  <text x="${width/2}" y="${height * 0.1}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width, height) * 0.04}" 
        fill="#374151" 
        text-anchor="middle">Donut Chart</text>
</svg>`;
}

// Generate scatter plot
function generateScatterChart(
  width: number,
  height: number,
  theme: string = 'default',
  random: RandomFn = Math.random,
): string {
  const colors = CHART_THEMES[theme] || CHART_THEMES.default;
  const padding = Math.min(width, height) * 0.1;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const pointCount = 30 + Math.floor(random() * 20);
  
  // Generate clusters of points
  const clusters = 2 + Math.floor(random() * 2);
  const clusterColors = generateColorPalette(colors.primary, clusters, random);
  let points = '';
  
  for (let c = 0; c < clusters; c++) {
    const centerX = 0.2 + random() * 0.6;
    const centerY = 0.2 + random() * 0.6;
    const spread = 0.15 + random() * 0.1;
    const clusterPoints = Math.floor(pointCount / clusters);
    
    for (let i = 0; i < clusterPoints; i++) {
      const x = padding + (centerX + (random() - 0.5) * spread) * chartWidth;
      const y = padding + (1 - (centerY + (random() - 0.5) * spread)) * chartHeight;
      const size = 3 + random() * 4;
      
      points += `<circle cx="${x}" cy="${y}" r="${size}" 
                        fill="${clusterColors[c]}" 
                        opacity="0.6"/>`;
    }
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${colors.background}"/>
  
  <!-- Grid lines -->
  ${generateGridLines(padding, width - padding, padding, height - padding, 5)}
  
  <!-- Points -->
  ${points}
  
  <!-- Axes -->
  <line x1="${padding}" y1="${height - padding}" 
        x2="${width - padding}" y2="${height - padding}" 
        stroke="#E5E7EB" stroke-width="2"/>
  <line x1="${padding}" y1="${padding}" 
        x2="${padding}" y2="${height - padding}" 
        stroke="#E5E7EB" stroke-width="2"/>
  
  <!-- Title -->
  <text x="${width/2}" y="${padding/2}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width, height) * 0.04}" 
        fill="#374151" 
        text-anchor="middle">Scatter Plot</text>
</svg>`;
}

// Generate radar/spider chart  
function generateRadarChart(
  width: number,
  height: number,
  theme: string = 'default',
  random: RandomFn = Math.random,
): string {
  const colors = CHART_THEMES[theme] || CHART_THEMES.default;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const axes = 6;
  const levels = 5;
  
  // Generate grid
  let grid = '';
  for (let level = 1; level <= levels; level++) {
    const levelRadius = (radius / levels) * level;
    let polygon = '';
    
    for (let i = 0; i < axes; i++) {
      const angle = (i * 360 / axes - 90) * Math.PI / 180;
      const x = centerX + levelRadius * Math.cos(angle);
      const y = centerY + levelRadius * Math.sin(angle);
      polygon += `${x},${y} `;
    }
    
    grid += `<polygon points="${polygon}" 
                      fill="none" 
                      stroke="#E5E7EB" 
                      stroke-width="1" 
                      opacity="0.5"/>`;
  }
  
  // Generate axes lines
  let axesLines = '';
  for (let i = 0; i < axes; i++) {
    const angle = (i * 360 / axes - 90) * Math.PI / 180;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    axesLines += `<line x1="${centerX}" y1="${centerY}" 
                        x2="${x}" y2="${y}" 
                        stroke="#E5E7EB" 
                        stroke-width="1" 
                        opacity="0.5"/>`;
  }
  
  // Generate data polygon
  let dataPoints = '';
  let dataPolygon = '';
  
  for (let i = 0; i < axes; i++) {
    const value = 0.3 + random() * 0.6;
    const angle = (i * 360 / axes - 90) * Math.PI / 180;
    const x = centerX + radius * value * Math.cos(angle);
    const y = centerY + radius * value * Math.sin(angle);
    
    dataPolygon += `${x},${y} `;
    dataPoints += `<circle cx="${x}" cy="${y}" r="4" 
                           fill="${colors.primary}" 
                           stroke="${colors.background}" 
                           stroke-width="2"/>`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${colors.background}"/>
  
  <!-- Grid -->
  ${grid}
  
  <!-- Axes -->
  ${axesLines}
  
  <!-- Data -->
  <polygon points="${dataPolygon}" 
           fill="${colors.primary}" 
           fill-opacity="0.3" 
           stroke="${colors.primary}" 
           stroke-width="2"/>
  
  <!-- Data points -->
  ${dataPoints}
  
  <!-- Title -->
  <text x="${width/2}" y="${height * 0.1}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width, height) * 0.04}" 
        fill="#374151" 
        text-anchor="middle">Radar Chart</text>
</svg>`;
}

// Generate heatmap
function generateHeatmap(
  width: number,
  height: number,
  theme: string = 'default',
  random: RandomFn = Math.random,
): string {
  const colors = CHART_THEMES[theme] || CHART_THEMES.default;
  const padding = Math.min(width, height) * 0.1;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const cols = 10 + Math.floor(random() * 5);
  const rows = 8 + Math.floor(random() * 4);
  const cellWidth = chartWidth / cols;
  const cellHeight = chartHeight / rows;
  
  const baseColor = hexToRgb(colors.primary);
  let cells = '';
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const intensity = random();
      const x = padding + col * cellWidth;
      const y = padding + row * cellHeight;
      
      // Create gradient from light to primary color
      const r = Math.floor(255 - (255 - baseColor.r) * intensity);
      const g = Math.floor(255 - (255 - baseColor.g) * intensity);
      const b = Math.floor(255 - (255 - baseColor.b) * intensity);
      const color = `rgb(${r},${g},${b})`;
      
      cells += `<rect x="${x}" y="${y}" 
                     width="${cellWidth}" height="${cellHeight}" 
                     fill="${color}" 
                     stroke="${colors.background}" 
                     stroke-width="1"/>`;
    }
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${colors.background}"/>
  
  <!-- Heatmap cells -->
  ${cells}
  
  <!-- Title -->
  <text x="${width/2}" y="${padding/2}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width, height) * 0.04}" 
        fill="#374151" 
        text-anchor="middle">Heatmap</text>
</svg>`;
}

// Helper functions
function generateGridLines(x1: number, x2: number, y1: number, y2: number, count: number): string {
  let lines = '';
  
  // Horizontal lines
  for (let i = 0; i <= count; i++) {
    const y = y1 + (y2 - y1) * i / count;
    lines += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" 
                   stroke="#E5E7EB" stroke-width="1" opacity="0.3"/>`;
  }
  
  // Vertical lines
  for (let i = 0; i <= count; i++) {
    const x = x1 + (x2 - x1) * i / count;
    lines += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" 
                   stroke="#E5E7EB" stroke-width="1" opacity="0.3"/>`;
  }
  
  return lines;
}

function generateColorPalette(
  baseColor: string,
  count: number,
  random: RandomFn = Math.random,
): string[] {
  const colors: string[] = [];
  const rgb = hexToRgb(baseColor);
  
  for (let i = 0; i < count; i++) {
    const factor = 1 - (i / count) * 0.5;
    const r = Math.floor(rgb.r * factor);
    const g = Math.floor(rgb.g * factor);
    const b = Math.floor(rgb.b * factor);
    
    // Add some variation
    const variation = 20;
    const vr = Math.min(255, Math.max(0, r + random() * variation - variation/2));
    const vg = Math.min(255, Math.max(0, g + random() * variation - variation/2));
    const vb = Math.min(255, Math.max(0, b + random() * variation - variation/2));
    
    colors.push(`rgb(${vr},${vg},${vb})`);
  }
  
  return colors;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 }; // Default to blue
}