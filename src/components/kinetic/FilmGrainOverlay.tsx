import React from 'react';

const FILM_GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const FilmGrainOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* 3% Subtle Film Grain Layer (static CSS tile to avoid continuous GPU filter recomputation) */}
      <div
        className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: FILM_GRAIN_DATA_URI, backgroundRepeat: 'repeat' }}
      />

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
