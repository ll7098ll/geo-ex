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
    <nav className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-4 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent backdrop-blur-xs pointer-events-auto">
      <button
        onClick={onReset}
        className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none"
        title="메인 화면으로 돌아가기"
      >
        <div className="w-9 h-11 border-[2.5px] border-[#FFCC00] flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-[#FFCC00] transition-colors">
          <Globe className="w-5 h-5 text-white group-hover:text-black transition-colors" />
        </div>
        <span className="text-lg sm:text-xl font-bold tracking-wider text-white uppercase font-serif drop-shadow-md group-hover:text-[#FFCC00] transition-colors">
          Geography Explorer
        </span>
      </button>
      
      <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-sm border border-white/10">
        <button
          onClick={() => { setRegion('korea'); onReset(); }}
          className={`px-5 py-2 text-sm font-bold tracking-wider uppercase transition-all ${
            region === 'korea' ? 'bg-[#FFCC00] text-black' : 'text-white hover:text-[#FFCC00]'
          }`}
        >
          대한민국
        </button>
        <button
          onClick={() => { setRegion('world'); onReset(); }}
          className={`px-5 py-2 text-sm font-bold tracking-wider uppercase transition-all ${
            region === 'world' ? 'bg-[#FFCC00] text-black' : 'text-white hover:text-[#FFCC00]'
          }`}
        >
          전 세계
        </button>
      </div>
    </nav>
  );
};
