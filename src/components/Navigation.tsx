import React from 'react';
import { Globe } from 'lucide-react';
import { Region } from '../types';

interface NavigationProps {
  region: Region;
  setRegion: (region: Region) => void;
  onReset: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ region, setRegion, onReset }) => {
  return (
    <header className="w-full h-14 shrink-0 px-6 sm:px-12 flex items-center justify-between bg-[#07070a] border-b border-[#FFCC00]/30 z-40 select-none shadow-md">
      {/* Editorial Masthead */}
      <button
        onClick={onReset}
        className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        title="매거진 커버 화면으로 돌아가기"
      >
        {/* Iconic Yellow Magazine Border Frame */}
        <div className="w-7 h-9 border-[2.5px] border-[#FFCC00] flex items-center justify-center bg-black shadow-[0_0_10px_rgba(255,204,0,0.3)] group-hover:bg-[#FFCC00] transition-all shrink-0">
          <Globe className="w-4 h-4 text-white group-hover:text-black transition-colors" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-black tracking-[0.2em] text-white uppercase font-serif drop-shadow-md group-hover:text-[#FFCC00] transition-colors leading-tight">
            GEOGRAPHY EXPLORER
          </span>
          <span className="text-[9px] tracking-[0.25em] uppercase font-mono text-[#FFCC00]/90 leading-tight">
            Field Expedition Journal · Vol. 2026
          </span>
        </div>
      </button>
      
      {/* Magazine Edition Selector */}
      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 border border-white/15 shadow-xl">
        <button
          onClick={() => { setRegion('korea'); onReset(); }}
          className={`px-4 sm:px-5 py-1.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
            region === 'korea'
              ? 'bg-[#FFCC00] text-black font-extrabold shadow-[0_0_10px_rgba(255,204,0,0.4)]'
              : 'text-zinc-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="font-mono text-[10px] opacity-75">KR</span>
          <span>대한민국</span>
        </button>
        <button
          onClick={() => { setRegion('world'); onReset(); }}
          className={`px-4 sm:px-5 py-1.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
            region === 'world'
              ? 'bg-[#FFCC00] text-black font-extrabold shadow-[0_0_10px_rgba(255,204,0,0.4)]'
              : 'text-zinc-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="font-mono text-[10px] opacity-75">WD</span>
          <span>전 세계</span>
        </button>
      </div>
    </header>
  );
};
