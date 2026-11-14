import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Play, Pause, ChevronDown } from 'lucide-react';
import { TerrainCategory } from '../types';
import { HeroApertureCanvas } from './kinetic/HeroApertureCanvas';

interface HeroSlideshowProps {
  categories: TerrainCategory[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  onExplore: (terrain: string, categoryId: string) => void;
  onScrollNext?: () => void;
  isActive?: boolean;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  categories,
  activeIndex,
  setActiveIndex,
  isAutoPlaying,
  setIsAutoPlaying,
  onExplore,
  onScrollNext,
  isActive = true,
}) => {
  const activeCategory = categories[activeIndex];
  const ActiveIcon = activeCategory.icon;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#08080A] select-none">
      {/* 1. Smooth Cinematic Crossfade & Gentle Scale Slide Transition */}
      <div className="absolute inset-0 w-full h-full bg-[#08080A]">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex}
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={activeCategory.image}
              alt={activeCategory.name}
              className="w-full h-full object-cover filter contrast-105 brightness-90"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Interactive Topological Aperture Overlay */}
      <HeroApertureCanvas isActive={isActive} />

      {/* 3. Editorial Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080A]/75 via-transparent to-transparent h-36 pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/65 to-transparent pointer-events-none z-20" />

      {/* 4. Top Subtle Editorial Issue Kicker */}
      <div className="absolute top-5 left-6 sm:left-12 z-30 pointer-events-none flex items-center gap-2.5 text-xs font-sans tracking-[0.2em] uppercase text-zinc-300">
        <span className="inline-block w-1.5 h-4 bg-[#FFCC00]" />
        <span className="font-bold text-white/90">EARTH LANDFORM ARCHIVE</span>
      </div>

      {/* 5. Main Editorial Typography & Action Tags */}
      <div className="absolute inset-0 flex flex-col justify-end pb-36 sm:pb-40 md:pb-44 lg:pb-48 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto w-full z-30 pointer-events-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`content-${activeIndex}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto"
          >
            {/* Category Kicker */}
            <div className="flex items-center gap-2.5 mb-2.5 text-[#FFCC00] font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
              <ActiveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFCC00]" />
              <span>{String(activeIndex + 1).padStart(2, '0')} · {activeCategory.id}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-sans text-white mb-3 sm:mb-4 tracking-tight leading-none drop-shadow-2xl">
              {activeCategory.name}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-lg md:text-xl text-zinc-200 max-w-3xl mb-6 sm:mb-7 leading-relaxed font-serif font-light drop-shadow-md">
              {activeCategory.description}
            </p>

            {/* Specimen Sub-Terrain Buttons */}
            <div className="flex flex-wrap gap-2 relative z-40 max-w-4xl">
              {activeCategory.items.map((item) => (
                <button
                  key={item}
                  onClick={() => onExplore(item, activeCategory.id)}
                  className="px-4 py-2 bg-[#131418]/90 hover:bg-[#FFCC00] hover:text-black hairline-border hover:border-[#FFCC00] text-white font-sans font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center gap-2 group cursor-pointer shadow-xl active:scale-[0.98]"
                >
                  <span>{item}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black group-hover:translate-x-0.5 transition-all duration-200" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 6. Bottom Thumbnails & Controls */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#08080A] to-transparent pt-28 pb-6 px-6 sm:px-12 md:px-16 z-30 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pointer-events-auto">
          {/* Category Thumbnail Strips */}
          <div className="flex flex-wrap gap-2 pb-2 w-full md:w-auto">
            {categories.map((cat, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`relative w-28 sm:w-32 h-16 sm:h-20 overflow-hidden hairline-border transition-all duration-300 ease-out shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-[#FFCC00] ring-2 ring-[#FFCC00] scale-105 shadow-2xl opacity-100'
                      : 'opacity-55 hover:opacity-95 hover:border-white/50'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover filter contrast-115"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center p-1">
                    <span className="font-mono text-[10px] text-[#FFCC00] font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white text-xs font-bold tracking-wide font-sans text-center mt-0.5">
                      {cat.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Media Controls Bar */}
          <div className="flex items-center gap-2 font-sans">
            {onScrollNext && (
              <button
                onClick={onScrollNext}
                className="flex items-center gap-2 px-4 py-2 bg-[#131418] hover:bg-[#FFCC00] text-white hover:text-black hairline-border hover:border-[#FFCC00] text-xs font-bold tracking-wide transition-all duration-200 shadow-xl cursor-pointer group active:scale-[0.98]"
                title="위성 지도 슬라이드로 바로 이동"
              >
                <span>위성 지도 보기</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#FFCC00] group-hover:text-black transition-colors duration-200" />
              </button>
            )}

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-9 h-9 hairline-border bg-[#131418] flex items-center justify-center text-white hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] transition-colors duration-200 shrink-0 shadow-xl cursor-pointer"
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
              title={isAutoPlaying ? '슬라이드쇼 일시정지' : '슬라이드쇼 재생'}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
