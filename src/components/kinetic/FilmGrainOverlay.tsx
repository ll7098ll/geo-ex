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
        className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: FILM_GRAIN_DATA_URI, backgroundRepeat: 'repeat' }}
      />
    </div>
  );
};
