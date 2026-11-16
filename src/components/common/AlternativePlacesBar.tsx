import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { PlaceInfo } from '../../types';

interface AlternativePlacesBarProps {
  places?: PlaceInfo[];
  onSelectPlace?: (place: PlaceInfo) => void;
  variant?: 'card' | 'strip';
}

export const AlternativePlacesBar: React.FC<AlternativePlacesBarProps> = ({
  places,
  onSelectPlace,
  variant = 'card',
}) => {
  if (!places || places.length === 0) return null;

  if (variant === 'strip') {
    return (
      <div className="hidden lg:flex items-center gap-1.5 bg-[#131418]/95 backdrop-blur-md hairline-border px-3 py-1">
        <span className="text-[11px] font-sans text-zinc-400 font-semibold pl-0.5 flex items-center gap-1 shrink-0">
          <Layers className="w-3 h-3 text-[#FFCC00]" />
          연관 지형
        </span>
        {places.map((alt) => (
          <button
            key={alt.id}
            onClick={() => onSelectPlace?.(alt)}
            className="px-2 py-0.5 text-xs font-sans bg-white/5 hover:bg-[#FFCC00] text-zinc-200 hover:text-black transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            {alt.placeName}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 pt-3.5 hairline-border-t">
      <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-zinc-400 mb-2">
        <Layers className="w-3.5 h-3.5 text-[#FFCC00]" />
        <span>함께 둘러볼 연관 명소</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {places.map((alt, idx) => (
          <button
            key={alt.id}
            onClick={() => onSelectPlace?.(alt)}
            className="group flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans bg-[#131418] hover:bg-[#FFCC00] text-zinc-200 hover:text-black hairline-border hover:border-[#FFCC00] transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <span className="text-[#FFCC00] font-mono text-[11px] font-bold group-hover:text-black">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span>{alt.placeName}</span>
            <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
