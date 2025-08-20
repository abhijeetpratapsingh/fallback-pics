import React, { useState, useEffect } from 'react';

function LiveDemo() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState('#9333ea');
  const [textColor, setTextColor] = useState('#ffffff');
  const [text, setText] = useState('');
  const [format, setFormat] = useState('svg');
  
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Build the URL based on current settings
    let url = `https://fallback.pics/${width}x${height}`;
    
    // Add format if not SVG
    if (format !== 'svg') {
      url += `.${format}`;
    }
    
    // Add colors
    const bg = bgColor.replace('#', '');
    const txt = textColor.replace('#', '');
    url += `/${bg}/${txt}`;
    
    // Add text if provided
    if (text) {
      url += `?text=${encodeURIComponent(text)}`;
    }
    
    setImageUrl(url);
  }, [width, height, bgColor, textColor, text, format]);

  return (
    <section id="demo" className="demo-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">Live Demo</span>
          </h2>
          <p className="section-subtitle">
            Customize your placeholder image in real-time
          </p>
        </div>

        <div className="demo-content">
          {/* Controls Panel */}
          <div className="controls-panel card">
            <h3 className="panel-title">Image Settings</h3>
            
            <div className="control-grid">
              {/* Dimensions */}
              <div className="control-group">
                <label htmlFor="width">Width (px)</label>
                <input
                  type="number"
                  id="width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  min="10"
                  max="2000"
                />
              </div>

              <div className="control-group">
                <label htmlFor="height">Height (px)</label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="10"
                  max="2000"
                />
              </div>

              {/* Colors */}
              <div className="control-group">
                <label htmlFor="bgColor">Background</label>
                <div className="color-input">
                  <input
                    type="color"
                    id="bgColor"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#9333ea"
                  />
                </div>
              </div>

              <div className="control-group">
                <label htmlFor="textColor">Text Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    id="textColor"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="control-group span-2">
                <label htmlFor="text">Custom Text (optional)</label>
                <input
                  type="text"
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Your text here..."
                />
              </div>

              {/* Format */}
              <div className="control-group span-2">
                <label htmlFor="format">Format</label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="svg">SVG</option>
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="presets">
              <h4 className="presets-title">Quick Presets</h4>
              <div className="preset-buttons">
                <button 
                  className="preset-btn"
                  onClick={() => {
                    setWidth(1920);
                    setHeight(1080);
                  }}
                >
                  HD 1920×1080
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => {
                    setWidth(800);
                    setHeight(600);
                  }}
                >
                  Blog 800×600
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => {
                    setWidth(400);
                    setHeight(400);
                  }}
                >
                  Square 400×400
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => {
                    setWidth(1200);
                    setHeight(630);
                  }}
                >
                  Social 1200×630
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="preview-panel">
            <div className="url-display card">
              <div className="url-label">Generated URL:</div>
              <div className="url-content">
                <code className="url-text">{imageUrl}</code>
                <button 
                  className="copy-url-btn"
                  onClick={() => navigator.clipboard.writeText(imageUrl)}
                >
                  Copy URL
                </button>
              </div>
            </div>

            <div className="image-preview card">
              <div className="preview-wrapper">
                {/* Simulated preview since actual service isn't running */}
                <div 
                  className="simulated-preview"
                  style={{
                    background: bgColor,
                    color: textColor,
                    aspectRatio: `${width}/${height}`,
                    maxWidth: '100%',
                    maxHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  {text || `${width} × ${height}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-section {
          padding: 4rem 0;
          background: var(--bg-secondary);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: var(--gray-600);
        }

        .demo-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .controls-panel {
          padding: 2rem;
        }

        .panel-title {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: var(--gray-800);
        }

        .control-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
        }

        .control-group.span-2 {
          grid-column: span 2;
        }

        .control-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 0.5rem;
        }

        .control-group input,
        .control-group select {
          padding: 0.625rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        .control-group input:focus,
        .control-group select:focus {
          outline: none;
          border-color: var(--primary-400);
        }

        .color-input {
          display: flex;
          gap: 0.5rem;
        }

        .color-input input[type="color"] {
          width: 50px;
          height: 42px;
          padding: 0.25rem;
          cursor: pointer;
        }

        .color-input input[type="text"] {
          flex: 1;
        }

        .presets {
          border-top: 2px solid var(--gray-100);
          padding-top: 1.5rem;
        }

        .presets-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 1rem;
        }

        .preset-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .preset-btn {
          padding: 0.625rem;
          background: var(--primary-50);
          color: var(--primary-700);
          border: 2px solid var(--primary-200);
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .preset-btn:hover {
          background: var(--primary-100);
          border-color: var(--primary-300);
        }

        .preview-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .url-display {
          padding: 1.5rem;
        }

        .url-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 0.75rem;
        }

        .url-content {
          display: flex;
          gap: 0.75rem;
        }

        .url-text {
          flex: 1;
          padding: 0.75rem;
          background: var(--gray-100);
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          word-break: break-all;
        }

        .copy-url-btn {
          padding: 0.75rem 1.25rem;
          background: var(--primary-600);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .copy-url-btn:hover {
          background: var(--primary-700);
        }

        .image-preview {
          padding: 2rem;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .simulated-preview {
          width: 100%;
        }

        @media (max-width: 968px) {
          .demo-content {
            grid-template-columns: 1fr;
          }

          .preset-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default LiveDemo;