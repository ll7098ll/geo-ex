import React from 'react';
import { Map as MapIcon, Globe, MapPin } from 'lucide-react';
import { Region } from '../types';

interface HeaderProps {
  region: Region;
  setRegion: (region: Region) => void;
}

export const Header: React.FC<HeaderProps> = ({ region, setRegion }) => {
  return (
    <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <MapIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            지형 탐험가 <span className="text-white/50 font-normal">| Earth Explorer</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setRegion('world')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              region === 'world' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            전 세계
          </button>
          <button
            onClick={() => setRegion('korea')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              region === 'korea' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" />
            대한민국
          </button>
        </div>
      </div>
    </header>
  );
};
