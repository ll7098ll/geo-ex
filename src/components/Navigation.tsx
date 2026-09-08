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
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-14 border-[3px] border-[#FFCC00] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-widest text-white uppercase font-serif drop-shadow-md">
          GeoDiscover
        </span>
      </div>
      
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
