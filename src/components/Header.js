import React from 'react';

function Header({ darkMode, setDarkMode }) {
  return (
    <header className="header">
      <nav className="container py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="logo flex items-center space-x-3">
            <div className="logo-icon">
              {/* SVG Logo inspired by GoTreasy style */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" className="gradient-bg" />
                <path
                  d="M12 12h16v16h-16z"
                  fill="white"
                  opacity="0.9"
                />
                <path
                  d="M16 20l3 3l5-6"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">Fallback.pics</span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#demo" className="nav-link">Demo</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#docs" className="nav-link">Documentation</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            <a
              href="https://github.com/fallbackpics"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(147, 51, 234, 0.1);
        }

        .nav-link {
          color: var(--gray-600);
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--primary-600);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          overflow: hidden;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .justify-between {
          justify-content: space-between;
        }

        .space-x-3 > * + * {
          margin-left: 0.75rem;
        }

        .space-x-4 > * + * {
          margin-left: 1rem;
        }

        .space-x-8 > * + * {
          margin-left: 2rem;
        }

        .py-6 {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }

        .p-2 {
          padding: 0.5rem;
        }

        .rounded-lg {
          border-radius: var(--radius-lg);
        }

        .transition {
          transition: all var(--transition-base);
        }

        @media (max-width: 768px) {
          .hidden.md\\:flex {
            display: none;
          }
        }

        @media (min-width: 769px) {
          .hidden.md\\:flex {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;