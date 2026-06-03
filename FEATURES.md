# 🚀 Fallback.pics - Complete Feature List

## Core Features

### 📏 Image Dimensions
- **Size Range**: 10x10px to 4000x4000px
- **Custom Dimensions**: `https://fallback.pics/api/v1/400x300`
- **Square Images**: `https://fallback.pics/api/v1/400` (creates 400x400)

### 🎨 Image Formats
Supports all modern image formats:
- **SVG** (default) - Vector format, infinitely scalable
- **PNG** - Lossless compression, transparency support
- **JPEG/JPG** - Lossy compression, smaller file sizes
- **WebP** - Modern format, excellent compression
- **AVIF** - Next-gen format, superior compression
- **GIF** - Legacy format, animation support

Example: `https://fallback.pics/api/v1/400x300.webp`

### 🎨 Color Customization
- **Background & Text Colors**: Use hex codes or CSS color names
- **Transparent Backgrounds**: `bg=transparent`
- **CSS Color Names**: black, white, red, blue, green, yellow, etc.
- **Hex Colors**: 3 or 6 character codes (without #)

Examples:
```
https://fallback.pics/api/v1/400x300/3B82F6/FFFFFF
https://fallback.pics/api/v1/400x300?bg=red&fg=white
https://fallback.pics/api/v1/400x300?bg=transparent
```

### 📝 Text Customization
- **Custom Text**: Replace default dimensions text
- **Multi-line Support**: Use `\n` for line breaks
- **Font Selection**: 11 font families available
- **Font Size**: Customizable via `fontSize` parameter

Fonts available:
- system, sans, serif, mono
- inter, roboto, lato, montserrat
- opensans, raleway, poppins

Examples:
```
https://fallback.pics/api/v1/400x300?text=Product+Image
https://fallback.pics/api/v1/400x300?text=Line+1\nLine+2
https://fallback.pics/api/v1/400x300?font=roboto&fontSize=24
```

### 🔍 Retina Support
- **@2x and @3x**: High-resolution displays
- **Parameter**: `?retina=2` or `?retina=3`

Example: `https://fallback.pics/api/v1/400x300?retina=2`

## Advanced Features

### 🎯 Presets

#### Square Images
`https://fallback.pics/api/v1/square/400`

#### Avatar Placeholders
```
https://fallback.pics/api/v1/avatar/200
https://fallback.pics/api/v1/avatar/200?text=JD
```

#### Banner Images
```
https://fallback.pics/api/v1/banner/1200x400
https://fallback.pics/api/v1/banner
```

#### Blur Effect
`https://fallback.pics/api/v1/blur/400x300`

#### Skeleton Loaders
`https://fallback.pics/api/v1/skeleton/400x300`

### 🤖 AI-Powered Contextual Images
Generate industry-specific placeholders:

```
https://fallback.pics/api/v1/ai/400x300?context=e-commerce
https://fallback.pics/api/v1/ai/400x300?context=tech&mood=minimal
https://fallback.pics/api/v1/ai/400x300?context=healthcare&mood=professional
```

Contexts: e-commerce, tech, healthcare, education, finance, travel, food, fashion
Moods: vibrant, minimal, professional, playful, elegant, bold, calm, futuristic

### ✨ Animated Placeholders
CSS-only animations with reduced motion support:

```
https://fallback.pics/api/v1/animated/skeleton/400x300
https://fallback.pics/api/v1/animated/pulse/200x200
https://fallback.pics/api/v1/animated/wave/600x200
https://fallback.pics/api/v1/animated/shimmer/400x300
https://fallback.pics/api/v1/animated/gradient/400x300
https://fallback.pics/api/v1/animated/dots/300x300
```

Add `?reducedMotion=true` for accessibility.

### 📊 Data Visualization Placeholders
Professional chart mockups:

```
https://fallback.pics/api/v1/chart/bar/600x400
https://fallback.pics/api/v1/chart/pie/400x400
https://fallback.pics/api/v1/chart/line/800x300
https://fallback.pics/api/v1/chart/area/600x400
https://fallback.pics/api/v1/chart/donut/400x400
https://fallback.pics/api/v1/chart/scatter/600x400
https://fallback.pics/api/v1/chart/radar/500x500
https://fallback.pics/api/v1/chart/heatmap/600x400
```

## Performance & Infrastructure

### ⚡ Speed
- **Generation Time**: <50ms at the edge
- **Global CDN**: 200+ locations worldwide
- **Caching**: Aggressive caching with immutable headers
- **No Authentication**: Direct URL access

### 🔒 Privacy
- **No Cookies Required for Image Delivery**: Placeholder image responses do not require a client SDK or delivery cookie
- **Configurable Analytics**: Google Analytics can track website engagement and aggregate Worker URL calls when enabled
- **Query-Safe Worker Events**: API telemetry strips query strings before sending URL metadata

## URL Parameter Reference

| Parameter | Description | Example |
|-----------|-------------|---------|
| `bg` or `bgColor` | Background color | `?bg=FF0000` |
| `fg` or `textColor` | Text/foreground color | `?fg=FFFFFF` |
| `text` or `label` | Custom text | `?text=Sample` |
| `font` | Font family | `?font=roboto` |
| `fontSize` | Font size in pixels | `?fontSize=24` |
| `retina` | Retina multiplier (2 or 3) | `?retina=2` |
| `context` | AI context (with /ai preset) | `?context=tech` |
| `mood` | AI mood (with /ai preset) | `?mood=minimal` |
| `reducedMotion` | Disable animations | `?reducedMotion=true` |

## Format Comparison with Placehold.co

| Feature | Fallback.pics | Placehold.co |
|---------|--------------|--------------|
| **Size Range** | ✅ 10x10 to 4000x4000 | ✅ 10x10 to 4000x4000 |
| **SVG Format** | ✅ Yes | ✅ Yes |
| **PNG Format** | ✅ Yes | ✅ Yes |
| **JPEG Format** | ✅ Yes | ✅ Yes |
| **WebP Format** | ✅ Yes | ✅ Yes |
| **AVIF Format** | ✅ Yes | ✅ Yes |
| **GIF Format** | ✅ Yes | ✅ Yes |
| **Transparent BG** | ✅ Yes | ✅ Yes |
| **CSS Colors** | ✅ Yes | ✅ Yes |
| **Custom Text** | ✅ Yes | ✅ Yes |
| **Newline Support** | ✅ Yes | ✅ Yes |
| **Font Selection** | ✅ 11 fonts | ✅ 12 fonts |
| **Retina Support** | ✅ Yes | ✅ Yes |
| **AI Generation** | ✅ Yes | ❌ No |
| **Animations** | ✅ Yes | ❌ No |
| **Chart Mockups** | ✅ Yes | ❌ No |
| **Global CDN** | ✅ 200+ locations | ❓ Not specified |
| **Response Time** | ✅ <50ms | ❓ Not specified |
| **Privacy Focus** | ✅ No cookies required for image delivery | ❓ Not specified |

## Examples

### Basic Usage
```html
<img src="https://fallback.pics/api/v1/400x300" alt="Placeholder">
```

### Custom Colors & Text
```html
<img src="https://fallback.pics/api/v1/600x400/3B82F6/FFFFFF?text=Product+Image" alt="Product">
```

### Transparent Background with Custom Font
```html
<img src="https://fallback.pics/api/v1/400x300?bg=transparent&fg=333333&font=montserrat" alt="Transparent">
```

### Multi-line Text
```html
<img src="https://fallback.pics/api/v1/400x300?text=Header\nSubheader\nFooter" alt="Multi-line">
```

### Retina Display
```html
<img src="https://fallback.pics/api/v1/200x200?retina=2" 
     width="200" height="200" alt="Retina">
```

### Modern Format (WebP)
```html
<img src="https://fallback.pics/api/v1/800x600.webp" alt="WebP Image">
```

### AI-Powered E-commerce Placeholder
```html
<img src="https://fallback.pics/api/v1/ai/400x300?context=e-commerce&mood=minimal" alt="Product">
```

### Animated Loading Placeholder
```html
<img src="https://fallback.pics/api/v1/animated/pulse/200x200" alt="Loading">
```

### Chart Mockup
```html
<img src="https://fallback.pics/api/v1/chart/bar/600x400" alt="Sales Chart">
```

## Browser Support

All modern browsers are supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Legacy format fallbacks:
- Use JPEG/PNG for older browsers
- SVG works in all modern browsers
- WebP/AVIF for cutting-edge optimization

## API Limits

- **Free Tier**: Unlimited requests
- **Rate Limiting**: None currently
- **Max Image Size**: 4000x4000 pixels
- **Min Image Size**: 10x10 pixels

## Quick Start

No setup required! Just use the URLs directly:

```html
<!-- Basic placeholder -->
<img src="https://fallback.pics/api/v1/400x300">

<!-- Custom everything -->
<img src="https://fallback.pics/api/v1/800x600.webp?bg=gradient&fg=white&text=Loading...&font=inter">

<!-- Avatar with initials -->
<img src="https://fallback.pics/api/v1/avatar/100?text=JD">

<!-- Animated skeleton loader -->
<img src="https://fallback.pics/api/v1/animated/skeleton/400x200">
```

---

**Website**: https://fallback.pics  
**API Base**: https://fallback.pics/api/v1  
**Documentation**: https://fallback.pics  
**Support**: support@fallback.pics  

© 2025 Fallback.pics - Never show broken images again! 🎨
