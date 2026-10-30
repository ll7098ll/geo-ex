import React, { useEffect } from 'react';
import { ChevronUp, ChevronDown, Compass, MapPin, Box, BookOpen } from 'lucide-react';

export interface SlideItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SLIDE_ITEMS: SlideItem[] = [
  {
    id: 'section-main',
    number: '01',
    title: '메인 화면',
    subtitle: '지형 카테고리 & 탐색',
    icon: Compass,
  },
  {
    id: 'section-map',
    number: '02',
    title: '구글 위성지도',
    subtitle: '100% 뷰포트 위성 탐방',
    icon: MapPin,
  },
  {
    id: 'section-3d',
    number: '03',
    title: '3D 입체 지형',
    subtitle: '인터랙티브 디오라마',
    icon: Box,
  },
  {
    id: 'section-guide',
    number: '04',
    title: '상세 지형 해설',
    subtitle: '형성 과정 & 탐방 가이드',
    icon: BookOpen,
  },
];

interface SlideNavigationDockProps {
  activeSlideIndex: number;
  onNavigate: (index: number) => void;
}

export const SlideNavigationDock: React.FC<SlideNavigationDockProps> = ({
  activeSlideIndex,
  onNavigate,
}) => {
  // Global Keyboard Navigation (ArrowUp/Down, PageUp/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when focusing inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (activeSlideIndex < SLIDE_ITEMS.length - 1) {
          e.preventDefault();
          onNavigate(activeSlideIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeSlideIndex > 0) {
          e.preventDefault();
          onNavigate(activeSlideIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, onNavigate]);

  return (
    <aside
      aria-label="슬라이드 네비게이션"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 select-none"
    >
      {/* Up Arrow */}
      <button
        onClick={() => onNavigate(Math.max(0, activeSlideIndex - 1))}
        disabled={activeSlideIndex === 0}
        aria-label="이전 슬라이드로 이동"
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          activeSlideIndex === 0
            ? 'opacity-20 cursor-not-allowed text-white/40'
            : 'bg-black/60 hover:bg-[#FFCC00] text-white hover:text-black border border-white/10 hover:border-[#FFCC00] backdrop-blur-md shadow-lg active:scale-90'
        }`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Dots Strip Container */}
      <div className="bg-[#0e0e14]/80 backdrop-blur-xl border border-white/15 rounded-full px-2.5 py-4 shadow-2xl flex flex-col items-center gap-3.5">
        {SLIDE_ITEMS.map((slide, idx) => {
          const isActive = activeSlideIndex === idx;
          const Icon = slide.icon;

          return (
            <div key={slide.id} className="relative group flex items-center">
              {/* Tooltip on hover (left side) */}
              <div className="absolute right-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14141c]/95 border border-white/20 shadow-xl backdrop-blur-md whitespace-nowrap z-50">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFCC00]' : 'text-slate-300'}`} />
                <span className="text-[11px] font-bold text-[#FFCC00] font-mono">{slide.number}</span>
                <span className="text-xs font-semibold text-white">{slide.title}</span>
                <span className="text-[11px] text-slate-400 font-light hidden md:inline">· {slide.subtitle}</span>
              </div>

              {/* Dot / Pill Button */}
              <button
                onClick={() => onNavigate(idx)}
                aria-label={`${slide.number} ${slide.title} 슬라이드로 이동`}
                className={`transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'w-3 h-7 bg-[#FFCC00] rounded-full shadow-[0_0_12px_rgba(255,204,0,0.8)]'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/80 rounded-full hover:scale-125'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Down Arrow */}
      <button
        onClick={() => onNavigate(Math.min(SLIDE_ITEMS.length - 1, activeSlideIndex + 1))}
        disabled={activeSlideIndex === SLIDE_ITEMS.length - 1}
        aria-label="다음 슬라이드로 이동"
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          activeSlideIndex === SLIDE_ITEMS.length - 1
            ? 'opacity-20 cursor-not-allowed text-white/40'
            : 'bg-black/60 hover:bg-[#FFCC00] text-white hover:text-black border border-white/10 hover:border-[#FFCC00] backdrop-blur-md shadow-lg active:scale-90'
        }`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Current Page Tag (Mobile / Small view helper) */}
      <div className="text-[10px] font-mono font-bold text-[#FFCC00] bg-black/60 border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-md">
        0{activeSlideIndex + 1}/04
      </div>
    </aside>
  );
};
