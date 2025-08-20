// Animated Placeholder Generators
// CSS-only animations for loading states

export function generateAnimatedSVG(
  width: number,
  height: number,
  type: string = 'skeleton',
  bgColor: string = '#F3F4F6',
  textColor: string = '#6B7280',
  reducedMotion: boolean = false
): string {
  switch (type) {
    case 'skeleton':
      return generateSkeletonAnimation(width, height, bgColor, reducedMotion);
    case 'pulse':
      return generatePulseAnimation(width, height, bgColor, textColor, reducedMotion);
    case 'wave':
      return generateWaveAnimation(width, height, bgColor, reducedMotion);
    case 'shimmer':
      return generateShimmerAnimation(width, height, bgColor, reducedMotion);
    case 'gradient':
      return generateGradientAnimation(width, height, bgColor, reducedMotion);
    case 'dots':
      return generateDotsAnimation(width, height, bgColor, reducedMotion);
    default:
      return generateSkeletonAnimation(width, height, bgColor, reducedMotion);
  }
}

function generateSkeletonAnimation(
  width: number,
  height: number,
  bgColor: string,
  reducedMotion: boolean
): string {
  const duration = reducedMotion ? '0s' : '2s';
  const shimmerColor = adjustBrightness(bgColor, 15);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @media (prefers-reduced-motion: reduce) {
        .shimmer-animation { animation-duration: 0s !important; }
      }
      .shimmer-animation {
        animation: shimmer ${duration} ease-in-out infinite;
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    </style>
    <linearGradient id="skeleton-gradient">
      <stop offset="0%" stop-color="${bgColor}" stop-opacity="1"/>
      <stop offset="50%" stop-color="${shimmerColor}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="${bgColor}"/>
  
  <!-- Shimmer overlay -->
  <rect class="shimmer-animation" 
        x="0" y="0" 
        width="${width}" height="${height}" 
        fill="url(#skeleton-gradient)" 
        opacity="0.8"/>
  
  <!-- Content blocks -->
  <rect x="${width * 0.1}" y="${height * 0.15}" 
        width="${width * 0.3}" height="${height * 0.08}" 
        fill="${shimmerColor}" rx="4"/>
  <rect x="${width * 0.1}" y="${height * 0.3}" 
        width="${width * 0.8}" height="${height * 0.05}" 
        fill="${shimmerColor}" rx="3"/>
  <rect x="${width * 0.1}" y="${height * 0.4}" 
        width="${width * 0.7}" height="${height * 0.05}" 
        fill="${shimmerColor}" rx="3"/>
  <rect x="${width * 0.1}" y="${height * 0.5}" 
        width="${width * 0.75}" height="${height * 0.05}" 
        fill="${shimmerColor}" rx="3"/>
</svg>`;
}

function generatePulseAnimation(
  width: number,
  height: number,
  bgColor: string,
  textColor: string,
  reducedMotion: boolean
): string {
  const duration = reducedMotion ? '0s' : '1.5s';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @media (prefers-reduced-motion: reduce) {
        .pulse { animation-duration: 0s !important; }
      }
      .pulse {
        animation: pulse ${duration} cubic-bezier(0.4, 0, 0.6, 1) infinite;
        transform-origin: center;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.95); }
      }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="${bgColor}"/>
  
  <!-- Pulsing circle -->
  <circle class="pulse" 
          cx="${width/2}" cy="${height/2}" 
          r="${Math.min(width, height) * 0.3}" 
          fill="${textColor}" 
          opacity="0.3"/>
  <circle class="pulse" 
          cx="${width/2}" cy="${height/2}" 
          r="${Math.min(width, height) * 0.2}" 
          fill="${textColor}" 
          opacity="0.5"
          style="animation-delay: 0.3s"/>
  <circle class="pulse" 
          cx="${width/2}" cy="${height/2}" 
          r="${Math.min(width, height) * 0.1}" 
          fill="${textColor}" 
          opacity="0.7"
          style="animation-delay: 0.6s"/>
</svg>`;
}

function generateWaveAnimation(
  width: number,
  height: number,
  bgColor: string,
  reducedMotion: boolean
): string {
  const duration = reducedMotion ? '0s' : '3s';
  const waveColor = adjustBrightness(bgColor, -10);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @media (prefers-reduced-motion: reduce) {
        .wave { animation-duration: 0s !important; }
      }
      .wave {
        animation: wave ${duration} linear infinite;
      }
      @keyframes wave {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${width}px); }
      }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="${bgColor}"/>
  
  <!-- Wave pattern -->
  <g class="wave">
    <path d="M 0,${height/2} 
             Q ${width/4},${height/2 - 30} ${width/2},${height/2}
             T ${width},${height/2}
             L ${width},${height}
             L 0,${height} Z" 
          fill="${waveColor}" 
          opacity="0.3"/>
    <path d="M ${width},${height/2} 
             Q ${width * 1.25},${height/2 - 30} ${width * 1.5},${height/2}
             T ${width * 2},${height/2}
             L ${width * 2},${height}
             L ${width},${height} Z" 
          fill="${waveColor}" 
          opacity="0.3"/>
  </g>
  
  <!-- Second wave with delay -->
  <g class="wave" style="animation-delay: -1.5s">
    <path d="M 0,${height/2 + 20} 
             Q ${width/4},${height/2 - 10} ${width/2},${height/2 + 20}
             T ${width},${height/2 + 20}
             L ${width},${height}
             L 0,${height} Z" 
          fill="${waveColor}" 
          opacity="0.2"/>
    <path d="M ${width},${height/2 + 20} 
             Q ${width * 1.25},${height/2 - 10} ${width * 1.5},${height/2 + 20}
             T ${width * 2},${height/2 + 20}
             L ${width * 2},${height}
             L ${width},${height} Z" 
          fill="${waveColor}" 
          opacity="0.2"/>
  </g>
</svg>`;
}

function generateShimmerAnimation(
  width: number,
  height: number,
  bgColor: string,
  reducedMotion: boolean
): string {
  const duration = reducedMotion ? '0s' : '2.5s';
  const shimmerColor = adjustBrightness(bgColor, 20);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @media (prefers-reduced-motion: reduce) {
        .shimmer-line { animation-duration: 0s !important; }
      }
      .shimmer-line {
        animation: shimmer-move ${duration} ease-in-out infinite;
      }
      @keyframes shimmer-move {
        0% { transform: translateX(-${width * 1.5}px) rotate(30deg); }
        100% { transform: translateX(${width * 1.5}px) rotate(30deg); }
      }
    </style>
    <linearGradient id="shimmer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${bgColor}" stop-opacity="0"/>
      <stop offset="40%" stop-color="${shimmerColor}" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="${shimmerColor}" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="${shimmerColor}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="${bgColor}"/>
  
  <!-- Shimmer effect -->
  <rect class="shimmer-line" 
        x="${-width/2}" y="0" 
        width="${width/3}" height="${height * 2}" 
        fill="url(#shimmer-grad)"/>
</svg>`;
}

function generateGradientAnimation(
  width: number,
  height: number,
  bgColor: string,
  reducedMotion: boolean
): string {
  const duration = reducedMotion ? '0s' : '4s';
  const colors = [
    bgColor,
    adjustBrightness(bgColor, 10),
    adjustBrightness(bgColor, -10),
    adjustBrightness(bgColor, 15)
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @media (prefers-reduced-motion: reduce) {
        .gradient-rotate { animation-duration: 0s !important; }
      }
      .gradient-rotate {
        animation: rotate ${duration} linear infinite;
        transform-origin: center;
      }
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
    <linearGradient id="animated-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="25%" stop-color="${colors[1]}"/>
      <stop offset="50%" stop-color="${colors[2]}"/>
      <stop offset="75%" stop-color="${colors[3]}"/>
      <stop offset="100%" stop-color="${colors[0]}"/>
    </linearGradient>
  </defs>
  
  <!-- Animated gradient background -->
  <rect class="gradient-rotate" 
        x="${-width/2}" y="${-height/2}" 
        width="${width * 2}" height="${height * 2}" 
        fill="url(#animated-gradient)"/>
</svg>`;
}

function generateDotsAnimation(
  width: number,
  height: number,
  bgColor: string,
  reducedMotion: boolean
): string {
  const duration = reducedMotion ? '0s' : '1.4s';
  const dotColor = adjustBrightness(bgColor, -20);
  const dotSize = Math.min(width, height) * 0.05;
  const centerY = height / 2;
  const centerX = width / 2;
  const spacing = dotSize * 3;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @media (prefers-reduced-motion: reduce) {
        .dot { animation-duration: 0s !important; }
      }
      .dot {
        animation: dot-bounce ${duration} ease-in-out infinite;
      }
      @keyframes dot-bounce {
        0%, 80%, 100% { 
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% { 
          transform: scale(1.2);
          opacity: 1;
        }
      }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="${bgColor}"/>
  
  <!-- Loading dots -->
  <circle class="dot" 
          cx="${centerX - spacing}" cy="${centerY}" 
          r="${dotSize}" 
          fill="${dotColor}"
          style="animation-delay: 0s"/>
  <circle class="dot" 
          cx="${centerX}" cy="${centerY}" 
          r="${dotSize}" 
          fill="${dotColor}"
          style="animation-delay: 0.2s"/>
  <circle class="dot" 
          cx="${centerX + spacing}" cy="${centerY}" 
          r="${dotSize}" 
          fill="${dotColor}"
          style="animation-delay: 0.4s"/>
</svg>`;
}

function adjustBrightness(hex: string, percent: number): string {
  // Handle transparent
  if (hex === 'transparent') return hex;
  
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse RGB values
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, Math.floor((num >> 16) + ((num >> 16) * percent / 100))));
  const g = Math.min(255, Math.max(0, Math.floor(((num >> 8) & 0x00FF) + (((num >> 8) & 0x00FF) * percent / 100))));
  const b = Math.min(255, Math.max(0, Math.floor((num & 0x0000FF) + ((num & 0x0000FF) * percent / 100))));
  
  // Convert back to hex
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase();
}