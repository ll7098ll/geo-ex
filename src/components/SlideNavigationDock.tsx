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
      className="fixed right-4 sm:right-6 top-[calc(50%+28px)] -translate-y-1/2 z-40 flex flex-col items-center gap-2 select-none"
    >
      {/* Up Arrow */}
      <button
        onClick={() => onNavigate(Math.max(0, activeSlideIndex - 1))}
        disabled={activeSlideIndex === 0}
        aria-label="이전 챕터로 이동"
        className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all cursor-pointer ${
          activeSlideIndex === 0
            ? 'opacity-20 cursor-not-allowed text-white/40'
            : 'bg-black/70 hover:bg-[#FFCC00] text-white hover:text-black border border-white/20 hover:border-[#FFCC00] backdrop-blur-md shadow-lg active:scale-95'
        }`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Editorial Chapter Strip Container */}
      <div className="bg-[#0b0b10]/90 backdrop-blur-xl border border-white/20 rounded-sm px-2 py-3.5 shadow-2xl flex flex-col items-center gap-3">
        <span className="text-[8px] font-mono tracking-widest text-[#FFCC00] uppercase font-bold writing-mode-vertical">
          CH
        </span>
        <div className="w-3.5 h-[1px] bg-white/20 my-0.5" />
        {SLIDE_ITEMS.map((slide, idx) => {
          const isActive = activeSlideIndex === idx;
          const Icon = slide.icon;

          return (
            <div key={slide.id} className="relative group flex items-center">
              {/* Tooltip on hover (left side) with Magazine Chapter preview */}
              <div className="absolute right-9 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-[#111118]/95 border border-[#FFCC00]/40 shadow-2xl backdrop-blur-md whitespace-nowrap z-50">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFCC00]' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold text-[#FFCC00] font-mono">CHAPTER {slide.number}</span>
                <span className="text-xs font-semibold text-white font-serif">{slide.title}</span>
                <span className="text-[11px] text-zinc-400 font-light hidden md:inline">· {slide.subtitle}</span>
              </div>

              {/* Magazine Index Button */}
              <button
                onClick={() => onNavigate(idx)}
                aria-label={`Chapter ${slide.number}: ${slide.title}`}
                className={`transition-all duration-300 flex items-center justify-center cursor-pointer font-mono text-[11px] font-bold ${
                  isActive
                    ? 'w-6 h-6 bg-[#FFCC00] text-black shadow-[0_0_12px_rgba(255,204,0,0.6)]'
                    : 'w-6 h-6 text-white/50 hover:text-white hover:bg-white/10'
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
        onClick={() => onNavigate(Math.min(SLIDE_ITEMS.length - 1, activeSlideIndex + 1))}
        disabled={activeSlideIndex === SLIDE_ITEMS.length - 1}
        aria-label="다음 챕터로 이동"
        className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all cursor-pointer ${
          activeSlideIndex === SLIDE_ITEMS.length - 1
            ? 'opacity-20 cursor-not-allowed text-white/40'
            : 'bg-black/70 hover:bg-[#FFCC00] text-white hover:text-black border border-white/20 hover:border-[#FFCC00] backdrop-blur-md shadow-lg active:scale-95'
        }`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Issue Index Indicator */}
      <div className="text-[10px] font-mono font-bold text-[#FFCC00] bg-black/80 border border-[#FFCC00]/40 px-2 py-0.5 rounded-sm backdrop-blur-md">
        P.0{activeSlideIndex + 1}
      </div>
    </aside>
  );
};
