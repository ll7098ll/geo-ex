import React from 'react';
import { Globe, Archive } from 'lucide-react';
import { Region } from '../types';
import { OdometerCounter } from './kinetic/OdometerCounter';

interface NavigationProps {
  region: Region;
  setRegion: (region: Region) => void;
  onReset: () => void;
  specimensCount?: number;
  onOpenDrawer?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  region,
  setRegion,
  onReset,
  specimensCount = 0,
  onOpenDrawer,
}) => {
  return (
    <header className="w-full h-14 shrink-0 px-4 sm:px-8 lg:px-12 flex items-center justify-between bg-[#08080A] hairline-border-b z-40 select-none shadow-2xl">
      {/* National Geographic Editorial Masthead */}
      <button
        onClick={onReset}
        className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        title="매거진 커버 화면으로 돌아가기"
      >
        {/* Iconic NatGeo Yellow Portrait Frame */}
        <div className="w-6 h-8 border-[2.5px] border-[#FFCC00] flex items-center justify-center bg-black group-hover:bg-[#FFCC00] transition-colors duration-200 shrink-0">
          <Globe className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors duration-200" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-black tracking-[0.18em] text-white uppercase font-sans group-hover:text-[#FFCC00] transition-colors duration-200 leading-tight">
            GEOGRAPHY EXPLORER
          </span>
          <span className="text-[10px] tracking-[0.22em] uppercase font-sans text-zinc-400 leading-tight hidden sm:inline">
            FIELD EXPEDITION JOURNAL
          </span>
        </div>
      </button>

      {/* Right Controls: Region Selector + Specimen Archive HUD Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Edition Switcher */}
        <div className="flex items-center bg-[#131418] hairline-border">
          <button
            onClick={() => {
              setRegion('korea');
              onReset();
            }}
            className={`px-3 sm:px-4 py-1.5 text-xs font-sans font-bold tracking-wide transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
              region === 'korea'
                ? 'bg-[#FFCC00] text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>대한민국</span>
          </button>
          <button
            onClick={() => {
              setRegion('world');
              onReset();
            }}
            className={`px-3 sm:px-4 py-1.5 text-xs font-sans font-bold tracking-wide transition-colors duration-200 flex items-center gap-1.5 cursor-pointer border-l border-white/10 ${
              region === 'world'
                ? 'bg-[#FFCC00] text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>전 세계</span>
          </button>
        </div>

        {/* Specimen Archive HUD Button with Odometer */}
        {onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-[#131418] hairline-border hover:border-[#FFCC00] transition-colors duration-200 cursor-pointer group"
            title="수집된 지형 표본 아카이브 열기"
          >
            <Archive className="w-3.5 h-3.5 text-[#FFCC00] group-hover:scale-110 transition-transform duration-200" />
            <OdometerCounter value={specimensCount} prefix="표본함" />
          </button>
        )}
      </div>
    </header>
  );
};
