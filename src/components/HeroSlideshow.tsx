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
      {/* 1. Kinetic Background: 4-Blade Shutter Slits */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            className="absolute inset-0 w-full h-full grid grid-cols-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {[0, 1, 2, 3].map((blade) => (
              <motion.div
                key={`blade-${blade}`}
                className="relative h-full overflow-hidden"
                initial={{ y: blade % 2 === 0 ? '-100%' : '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: blade % 2 === 0 ? '100%' : '-100%', opacity: 0 }}
                transition={{
                  duration: 0.75,
                  delay: blade * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div
                  className="absolute inset-0 h-full"
                  style={{
                    width: '400%',
                    left: `-${blade * 100}%`,
                  }}
                >
                  <img
                    src={activeCategory.image}
                    alt={activeCategory.name}
                    className="w-full h-full object-cover filter contrast-110 brightness-90"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* 1px Vertical Blade Divider */}
                <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. WebGL/Canvas Interactive Topological Aperture Overlay */}
      <HeroApertureCanvas isActive={isActive} />

      {/* 3. Architectural Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080A]/80 via-transparent to-transparent h-36 pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/60 to-transparent pointer-events-none z-20" />

      {/* 4. Top Telemetry Kicker */}
      <div className="absolute top-4 left-6 sm:left-12 z-30 pointer-events-none flex items-center gap-3 font-mono text-[11px] text-zinc-400">
        <span className="text-[#FFCC00] font-bold">
          [ ACT 01 // KINETIC COVER ]
        </span>
        <span className="text-white/20">|</span>
        <span className="hidden sm:inline">
          TOPOLOGICAL APERTURE : F/1.4 ENGAGED
        </span>
      </div>

      {/* 5. Main Editorial Typography & Action Tags */}
      <div className="absolute inset-0 flex flex-col justify-end pb-36 sm:pb-40 md:pb-44 lg:pb-48 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto w-full z-30 pointer-events-none">
        <motion.div
          key={`content-${activeIndex}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pointer-events-auto"
        >
          {/* Department Code */}
          <div className="flex items-center gap-2 mb-2 text-[#FFCC00] font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
            <ActiveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFCC00]" />
            <span>[ {String(activeIndex + 1).padStart(2, '0')} // {activeCategory.id} ]</span>
            <span className="text-white/30 hidden sm:inline">·</span>
            <span className="text-zinc-300 font-mono text-xs hidden sm:inline">
              SPEC: 460 GSM EDITION
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-sans text-white mb-3 sm:mb-4 tracking-tighter uppercase leading-none drop-shadow-2xl">
            {activeCategory.name}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-lg md:text-xl text-zinc-300 max-w-3xl mb-6 sm:mb-7 leading-relaxed font-serif font-light drop-shadow-md">
            {activeCategory.description}
          </p>

          {/* Specimen Sub-Terrain Buttons (0px Brutalist Rectangles) */}
          <div className="flex flex-wrap gap-2 relative z-40 max-w-4xl">
            {activeCategory.items.map((item) => (
              <button
                key={item}
                onClick={() => onExplore(item, activeCategory.id)}
                className="px-3.5 sm:px-4 py-2 bg-[#131418]/90 hover:bg-[#FFCC00] hover:text-black hairline-border hover:border-[#FFCC00] text-white font-mono text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 group cursor-pointer shadow-xl corner-ticks active:scale-95"
              >
                <span>[ {item} ]</span>
                <ArrowRight className="w-3 h-3 text-[#FFCC00] group-hover:text-black transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 6. Bottom Thumbnails & Kinetic Controls */}
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
                  className={`relative w-28 sm:w-32 h-16 sm:h-20 overflow-hidden hairline-border transition-all duration-200 shrink-0 corner-ticks cursor-pointer ${
                    isSelected
                      ? 'border-[#FFCC00] ring-1 ring-[#FFCC00] scale-105 shadow-2xl'
                      : 'opacity-50 hover:opacity-100 hover:border-white/50'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover filter contrast-125"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1">
                    <span className="font-mono text-[9px] text-[#FFCC00] font-bold">
                      [ {String(idx + 1).padStart(2, '0')} ]
                    </span>
                    <span className="text-white text-xs font-bold tracking-wider font-sans text-center mt-0.5">
                      {cat.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Media Controls Bar */}
          <div className="flex items-center gap-2 font-mono">
            {onScrollNext && (
              <button
                onClick={onScrollNext}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#131418] hover:bg-[#1F34FF] text-white hairline-border hover:border-[#1F34FF] text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-xl cursor-pointer group corner-ticks"
                title="위성 지도 슬라이드로 바로 이동"
              >
                <span>[ CH.02 위성 텔레메트리 ]</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#96D0FF] group-hover:text-white transition-colors" />
              </button>
            )}

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-9 h-9 hairline-border bg-[#131418] flex items-center justify-center text-white hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] transition-colors shrink-0 shadow-xl cursor-pointer corner-ticks"
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
