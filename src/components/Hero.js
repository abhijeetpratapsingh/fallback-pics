import React from 'react';

function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Floating elements for visual interest */}
          <div className="floating-elements">
            <div className="float-element float-1">🖼️</div>
            <div className="float-element float-2">🎨</div>
            <div className="float-element float-3">📐</div>
          </div>

          {/* Main content */}
          <div className="hero-text">
            <h1 className="hero-title">
              Never show <span className="gradient-text">broken images</span> again
            </h1>
            <p className="hero-subtitle">
              Lightning-fast placeholder images for developers. Simple URLs, instant results.
              Built for the modern web.
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons">
              <a href="#demo" className="btn btn-primary btn-lg">
                Try Live Demo
                <svg className="ml-2" width="20" height="20" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#docs" className="btn btn-secondary btn-lg">
                View Documentation
              </a>
            </div>

            {/* Quick Example */}
            <div className="quick-example">
              <div className="example-label">Quick Example:</div>
              <code className="example-code">
                https://fallback.pics/400x300
              </code>
              <button className="copy-btn" onClick={() => {
                navigator.clipboard.writeText('https://fallback.pics/400x300');
              }}>
                Copy
              </button>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="hero-visual">
            <div className="browser-mockup">
              <div className="browser-header">
                <div className="browser-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <div className="browser-url">fallback.pics/600x400</div>
              </div>
              <div className="browser-content">
                <div className="placeholder-preview">
                  <svg width="600" height="400" viewBox="0 0 600 400">
                    <rect width="600" height="400" fill="url(#preview-gradient)" />
                    <text x="50%" y="50%" textAnchor="middle" fill="white" 
                          fontSize="24" fontWeight="600" dy=".3em">
                      600 × 400
                    </text>
                    <defs>
                      <linearGradient id="preview-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          padding: 4rem 0 6rem;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .float-element {
          position: absolute;
          font-size: 3rem;
          opacity: 0.1;
          animation: float 20s ease-in-out infinite;
        }

        .float-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .float-2 {
          top: 60%;
          right: 10%;
          animation-delay: 7s;
        }

        .float-3 {
          bottom: 20%;
          left: 50%;
          animation-delay: 14s;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--gray-600);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .ml-2 {
          margin-left: 0.5rem;
        }

        .quick-example {
          background: var(--bg-primary);
          border: 2px solid var(--primary-200);
          border-radius: var(--radius-lg);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .example-label {
          font-weight: 600;
          color: var(--gray-700);
        }

        .example-code {
          flex: 1;
          background: var(--gray-100);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
        }

        .copy-btn {
          padding: 0.5rem 1rem;
          background: var(--primary-600);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .copy-btn:hover {
          background: var(--primary-700);
        }

        .browser-mockup {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 60px -10px rgba(147, 51, 234, 0.3);
          overflow: hidden;
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .browser-header {
          background: var(--gray-100);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .browser-dots {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--gray-300);
        }

        .browser-url {
          flex: 1;
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          text-align: center;
        }

        .browser-content {
          background: var(--gray-50);
          aspect-ratio: 3/2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-preview {
          width: 100%;
          height: 100%;
        }

        .placeholder-preview svg {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 968px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
          }

          .hero-visual {
            max-width: 500px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;