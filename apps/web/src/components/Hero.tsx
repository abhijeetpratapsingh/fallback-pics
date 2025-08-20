import React, { useState } from 'react';
import { API_URL } from '../config';

export default function Hero() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  
  const imageUrl = `${API_URL}/${width}x${height}`;
  
  return (
    <section className="bg-gradient-primary text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Never Show Broken Images Again
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Lightning-fast placeholder images for developers. Simple URLs, instant results, zero configuration.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <a 
            href="#demo"
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Try It Now
          </a>
          <a 
            href="#docs"
            className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition border border-white/30"
          >
            Documentation
          </a>
        </div>
        
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="bg-white/20 text-white px-3 py-2 rounded w-24 text-center"
              min="1"
              max="5000"
            />
            <span className="text-white/80">×</span>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="bg-white/20 text-white px-3 py-2 rounded w-24 text-center"
              min="1"
              max="5000"
            />
          </div>
          <code className="block bg-black/30 p-3 rounded text-sm font-mono mb-4">
            {imageUrl}
          </code>
          <img 
            src={imageUrl} 
            alt="Placeholder preview"
            className="rounded-lg shadow-lg mx-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </section>
  );
}