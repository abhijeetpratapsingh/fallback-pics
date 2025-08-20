import React from 'react';

function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Global CDN with <10ms response times. Images generated on-the-fly and cached at edge locations worldwide.'
    },
    {
      icon: '🎨',
      title: 'Fully Customizable',
      description: 'Control every aspect - dimensions, colors, text, formats. Support for PNG, JPG, SVG, and WebP.'
    },
    {
      icon: '🔗',
      title: 'Simple URLs',
      description: 'Intuitive URL structure that just makes sense. No API keys, no registration, just use it.'
    },
    {
      icon: '📱',
      title: 'Responsive Ready',
      description: 'Perfect for responsive designs. Generate any size from 10×10 to 4000×4000 pixels.'
    },
    {
      icon: '🚀',
      title: '99.9% Uptime',
      description: 'Built on Cloudflare Workers for incredible reliability and global availability.'
    },
    {
      icon: '💸',
      title: 'Free Forever',
      description: 'Core features will always be free. Optional premium features for power users.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Why developers <span className="gradient-text">love</span> Fallback.pics
          </h2>
          <p className="section-subtitle">
            Built by developers, for developers. Every feature designed with DX in mind.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat">
            <div className="stat-number gradient-text">10M+</div>
            <div className="stat-label">Images Served</div>
          </div>
          <div className="stat">
            <div className="stat-number gradient-text"><10ms</div>
            <div className="stat-label">Response Time</div>
          </div>
          <div className="stat">
            <div className="stat-number gradient-text">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          <div className="stat">
            <div className="stat-number gradient-text">150+</div>
            <div className="stat-label">Edge Locations</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .features-section {
          padding: 4rem 0;
          background: var(--bg-primary);
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

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .feature-card {
          padding: 2rem;
          text-align: center;
          transition: all var(--transition-base);
          border: 2px solid transparent;
        }

        .feature-card:hover {
          border-color: var(--primary-200);
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--gray-800);
        }

        .feature-description {
          color: var(--gray-600);
          line-height: 1.6;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          padding: 3rem;
          background: var(--gradient-mesh);
          border-radius: var(--radius-xl);
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: var(--gray-600);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}

export default Features;