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
    subtitle: '지형 카테고리 & 셔터 탐색',
    icon: Compass,
  },
  {
    id: 'section-map',
    number: '02',
    title: '구글 위성지도',
    subtitle: '100% 뷰포트 위성 텔레메트리',
    icon: MapPin,
  },
  {
    id: 'section-3d',
    number: '03',
    title: '3D 입체 지형',
    subtitle: '인터랙티브 디오라마 & 3D 플립',
    icon: Box,
  },
  {
    id: 'section-guide',
    number: '04',
    title: '상세 지형 해설',
    subtitle: '4단 아코디언 & 지질 리포트',
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
      className="fixed right-4 sm:right-6 top-[calc(50%+28px)] -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 select-none"
    >
      {/* Up Arrow */}
      <button
        onClick={() => onNavigate(Math.max(0, activeSlideIndex - 1))}
        disabled={activeSlideIndex === 0}
        aria-label="이전 챕터로 이동"
        className={`w-8 h-8 flex items-center justify-center transition-all cursor-pointer ${
          activeSlideIndex === 0
            ? 'opacity-20 cursor-not-allowed text-white/40 border border-white/5 bg-black/40'
            : 'bg-[#131418] hover:bg-[#FFCC00] text-white hover:text-black hairline-border hover:border-[#FFCC00] shadow-lg active:scale-95'
        }`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Editorial Chapter Strip Container */}
      <div className="bg-[#08080A] hairline-border p-1.5 shadow-2xl flex flex-col items-center gap-2 corner-ticks">
        <span className="text-[8px] font-mono tracking-widest text-[#FFCC00] uppercase font-bold py-1">
          ACT
        </span>
        <div className="w-4 h-[1px] bg-white/10" />

        {SLIDE_ITEMS.map((slide, idx) => {
          const isActive = activeSlideIndex === idx;
          const Icon = slide.icon;

          return (
            <div key={slide.id} className="relative group flex items-center">
              {/* Tooltip on hover (left side) with Swiss Brutalist Preview */}
              <div className="absolute right-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-[#131418] hairline-border shadow-2xl backdrop-blur-md whitespace-nowrap z-50">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#FFCC00]' : 'text-zinc-400'
                  }`}
                />
                <span className="text-[11px] font-bold text-[#FFCC00] font-mono">
                  [ ACT {slide.number} ]
                </span>
                <span className="text-xs font-semibold text-white font-sans">
                  {slide.title}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
                  // {slide.subtitle}
                </span>
              </div>

              {/* Chapter Index Button */}
              <button
                onClick={() => onNavigate(idx)}
                aria-label={`Act ${slide.number}: ${slide.title}`}
                className={`transition-all duration-200 flex items-center justify-center cursor-pointer font-mono text-[11px] font-bold ${
                  isActive
                    ? 'w-7 h-7 bg-[#FFCC00] text-black shadow-[0_0_10px_rgba(255,204,0,0.5)]'
                    : 'w-7 h-7 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {slide.number}
              </button>
            </div>
          );
        })}
      </div>

      {/* Down Arrow */}
      <button
        onClick={() =>
          onNavigate(Math.min(SLIDE_ITEMS.length - 1, activeSlideIndex + 1))
        }
        disabled={activeSlideIndex === SLIDE_ITEMS.length - 1}
        aria-label="다음 챕터로 이동"
        className={`w-8 h-8 flex items-center justify-center transition-all cursor-pointer ${
          activeSlideIndex === SLIDE_ITEMS.length - 1
            ? 'opacity-20 cursor-not-allowed text-white/40 border border-white/5 bg-black/40'
            : 'bg-[#131418] hover:bg-[#FFCC00] text-white hover:text-black hairline-border hover:border-[#FFCC00] shadow-lg active:scale-95'
        }`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Act Tag */}
      <div className="text-[10px] font-mono font-bold text-[#FFCC00] bg-black hairline-border px-2 py-0.5">
        [ 0{activeSlideIndex + 1} ]
      </div>
    </aside>
  );
};
