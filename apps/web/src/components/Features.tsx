import React from 'react';

const features = [
  {
    icon: '🤖',
    title: 'Contextual SVG Patterns',
    description: 'Context-aware patterns based on industry and mood'
  },
  {
    icon: '⚡',
    title: 'Edge-Friendly SVG',
    description: 'Dependency-light placeholders designed for Worker runtimes'
  },
  {
    icon: '🎨',
    title: 'Customizable SVG',
    description: 'Colors, text, presets, and sizes'
  },
  {
    icon: '🚀',
    title: 'Developer Friendly',
    description: 'Simple URL API, no authentication needed'
  },
  {
    icon: '🌍',
    title: 'Self-Hostable',
    description: 'Deploy your own Cloudflare Worker'
  },
  {
    icon: '🔒',
    title: 'No Client SDK',
    description: 'Use the URL directly in your img tags'
  }
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Why Developers Love Fallback.pics</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
