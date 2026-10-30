import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Play, Pause, ChevronDown } from 'lucide-react';
import { TerrainCategory } from '../types';

interface HeroSlideshowProps {
  categories: TerrainCategory[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  onExplore: (terrain: string, categoryId: string) => void;
  onScrollNext?: () => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  categories,
  activeIndex,
  setActiveIndex,
  isAutoPlaying,
  setIsAutoPlaying,
  onExplore,
  onScrollNext,
}) => {
  const activeCategory = categories[activeIndex];
  const ActiveIcon = activeCategory.icon;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence>
        <motion.img
          key={activeIndex}
          src={activeCategory.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      {/* Gradients for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-36 sm:pb-40 md:pb-44 lg:pb-48 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto w-full z-30 pointer-events-none">
        <motion.div
          key={`content-${activeIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pointer-events-auto"
        >
          <div className="flex items-center gap-2.5 mb-2.5 text-[#FFCC00]">
            <ActiveIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="uppercase tracking-[0.25em] text-xs sm:text-sm font-bold">{activeCategory.id}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-3 sm:mb-5 leading-tight drop-shadow-2xl break-words">
            {activeCategory.name}
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-200 max-w-3xl mb-6 sm:mb-8 leading-relaxed drop-shadow-md font-light break-words">
            {activeCategory.description}
          </p>

          <div className="flex flex-wrap gap-2.5 relative z-40 max-w-4xl">
            {activeCategory.items.map(item => (
              <button
                key={item}
                onClick={() => onExplore(item, activeCategory.id)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-sm bg-black/50 hover:bg-[#FFCC00] hover:text-black border border-white/30 hover:border-[#FFCC00] backdrop-blur-md text-white font-bold tracking-wider transition-all duration-300 flex items-center gap-2 group cursor-pointer text-xs sm:text-sm whitespace-nowrap shadow-lg active:scale-95"
              >
                <span>{item}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Thumbnails / Controls */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent pt-32 pb-8 px-8 md:px-16 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pointer-events-auto">
          <div className="flex flex-wrap gap-4 pb-4 w-full md:w-auto">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => { setActiveIndex(idx); setIsAutoPlaying(false); }}
                className={`relative w-32 h-20 rounded-sm overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                  idx === activeIndex 
                    ? 'border-[#FFCC00] scale-105 shadow-[0_0_15px_rgba(255,204,0,0.5)]' 
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs font-bold tracking-wider drop-shadow-md text-center px-1">
                    {cat.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            {onScrollNext && (
              <button
                onClick={onScrollNext}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 hover:bg-[#FFCC00] text-white hover:text-black border border-white/20 hover:border-[#FFCC00] backdrop-blur-md text-xs font-semibold transition-all shadow-lg cursor-pointer group active:scale-95"
                title="구글 위성 지도 슬라이드로 바로 이동"
              >
                <span>구글 위성 지도 둘러보기</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors" />
              </button>
            )}

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
