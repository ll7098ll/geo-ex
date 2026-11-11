import React from 'react';

export const FilmGrainOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* 3% Subtle Film Grain SVG Noise Layer */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="film-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-filter)" />
      </svg>

      {/* Architectural Viewport Corner Crosshair Marks */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-white/30 font-bold tracking-tighter">
        + [0,0]
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-white/30 font-bold tracking-tighter">
        [W,0] +
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/30 font-bold tracking-tighter">
        + [0,H]
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/30 font-bold tracking-tighter">
        [W,H] +
      </div>

      {/* Hairline Technical Boundary Guides */}
      <div className="absolute inset-x-6 top-0 h-[1px] bg-white/5" />
      <div className="absolute inset-x-6 bottom-0 h-[1px] bg-white/5" />
    </div>
  );
};
