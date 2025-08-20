import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import Header from './components/Header';
import Hero from './components/Hero';
import LiveDemo from './components/LiveDemo';
import Features from './components/Features';
import Documentation from './components/Documentation';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className="mesh-bg min-h-screen">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Hero />
        <LiveDemo />
        <Features />
        <Documentation />
        <Footer />
      </div>
    </div>
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);