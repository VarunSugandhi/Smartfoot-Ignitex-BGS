import React from 'react';

interface DummyMapBackgroundProps {
  children?: React.ReactNode;
}

const DummyMapBackground: React.FC<DummyMapBackgroundProps> = ({ children }) => {
  return (
    <div className="relative w-full h-full bg-[#f8f9fa]">
      {/* Base map SVG */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Background grid for blocks */}
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e9ecef" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Major Roads */}
        <g className="roads-major">
          {/* Horizontal major roads */}
          <path d="M 0,150 L 1000,150" stroke="#ffd43b" strokeWidth="6" />
          <path d="M 0,350 L 1000,350" stroke="#ffd43b" strokeWidth="6" />
          
          {/* Vertical major roads */}
          <path d="M 200,0 L 200,600" stroke="#ffd43b" strokeWidth="6" />
          <path d="M 600,0 L 600,600" stroke="#ffd43b" strokeWidth="6" />
        </g>

        {/* Minor Roads */}
        <g className="roads-minor">
          {Array.from({ length: 8 }).map((_, i) => (
            <React.Fragment key={`road-h-${i}`}>
              <path 
                d={`M 0,${i * 75} L 1000,${i * 75}`} 
                stroke="#dee2e6" 
                strokeWidth="2"
              />
            </React.Fragment>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <React.Fragment key={`road-v-${i}`}>
              <path 
                d={`M ${i * 75},0 L ${i * 75},600`} 
                stroke="#dee2e6" 
                strokeWidth="2"
              />
            </React.Fragment>
          ))}
        </g>

        {/* Parks and water bodies */}
        <g className="parks-and-water">
          <path d="M 50,50 L 150,50 L 150,150 L 50,150 Z" fill="#b2f2bb" fillOpacity="0.3" />
          <path d="M 450,250 L 500,250 L 500,300 L 450,300 Z" fill="#b2f2bb" fillOpacity="0.3" />
          <path d="M 300,100 Q 350,125 300,150" stroke="#74c0fc" strokeWidth="2" fill="none" />
          <path d="M 700,300 Q 750,325 700,350" stroke="#74c0fc" strokeWidth="2" fill="none" />
        </g>

        {/* Curved roads */}
        <g className="roads-curved">
          <path 
            d="M 300,200 Q 400,250 300,300" 
            stroke="#dee2e6" 
            strokeWidth="2" 
            fill="none"
          />
          <path 
            d="M 500,100 Q 600,150 500,200" 
            stroke="#dee2e6" 
            strokeWidth="2" 
            fill="none"
          />
        </g>
      </svg>

      {/* Map content overlay (routes, markers, etc) */}
      {children}
    </div>
  );
};

export default DummyMapBackground; 