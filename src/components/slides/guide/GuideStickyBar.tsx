import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Award, Compass, Sun, Moon } from 'lucide-react';
import { PlaceInfo } from '../../../types';
import { EducationLevel, EDUCATION_LEVELS } from '../../../utils/educationLevelHelper';
import { SpecimenCollectButton } from '../../common/SpecimenCollectButton';
import { GuideThemeTokens } from './guideTheme';

interface GuideStickyBarProps {
  placeInfo: PlaceInfo;
  level: EducationLevel;
  onLevelChange: (level: EducationLevel) => void;
  isPaperMode: boolean;
  onTogglePaperMode: () => void;
  isCollected: boolean;
  onAddSpecimen?: (place: PlaceInfo) => void;
  onJumpToSection: (section: 'intro' | 'timeline' | 'essay' | 'dossier') => void;
  theme: GuideThemeTokens;
}

const LEVEL_ICONS: Record<EducationLevel, React.ComponentType<{ className?: string }>> = {
  elementary: GraduationCap,
  middle: BookOpen,
  high: Award,
  general: Compass,
};

const TOC_ITEMS: ReadonlyArray<{ id: 'intro' | 'timeline' | 'essay' | 'dossier'; label: string }> = [
  { id: 'intro', label: '서문' },
  { id: 'timeline', label: '형성과정' },
  { id: 'essay', label: '심층해설' },
  { id: 'dossier', label: '현장도감' },
];

export const GuideStickyBar: React.FC<GuideStickyBarProps> = ({
  placeInfo,
  level,
  onLevelChange,
  isPaperMode,
  onTogglePaperMode,
  isCollected,
  onAddSpecimen,
  onJumpToSection,
  theme,
}) => {
  return (
    <div
      className={`sticky top-[2px] z-30 border-b ${theme.border} ${theme.stickyBg} backdrop-blur-md transition-colors duration-500`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Article Title & Section Anchors */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-4 bg-[#FFCC00] shrink-0" />
            <span className="font-serif font-bold text-xs sm:text-sm truncate">
              {placeInfo.placeName}
            </span>
          </div>

          <nav
            aria-label="기사 목차"
            className={`hidden md:flex items-center gap-3 text-xs font-sans border-l ${theme.border} pl-4 ${theme.subtle}`}
          >
            {TOC_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onJumpToSection(item.id)}
                className="hover:text-[#FFCC00] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Reader Level Pill + Paper/Dark Mode + Collect */}
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="해설 수준 선택"
            className={`flex items-center p-0.5 border ${theme.border} ${theme.surface}`}
          >
            {EDUCATION_LEVELS.map((lvl) => {
              const isSelected = level === lvl.id;
              const Icon = LEVEL_ICONS[lvl.id];
              return (
                <button
                  key={lvl.id}
                  onClick={() => onLevelChange(lvl.id)}
                  title={lvl.subLabel}
                  className={`relative flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-semibold transition-colors cursor-pointer ${
                    isSelected ? 'text-black font-bold' : theme.levelIdle
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="guide-level-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 bg-[#FFCC00]"
                    />
                  )}
                  <Icon className="w-3 h-3 relative z-10 shrink-0" />
                  <span className="relative z-10">{lvl.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onTogglePaperMode}
            title={isPaperMode ? '다크 에디토리얼 모드로 전환' : '페이퍼 매거진 모드로 전환'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border ${theme.border} ${theme.surface} text-xs font-sans font-semibold hover:border-[#FFCC00] transition-colors cursor-pointer`}
          >
            {isPaperMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#181715]" />
                <span className="hidden sm:inline">다크</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span className="hidden sm:inline">페이퍼</span>
              </>
            )}
          </button>

          <SpecimenCollectButton
            placeInfo={placeInfo}
            isCollected={isCollected}
            onAddSpecimen={onAddSpecimen}
            variant="editorial"
            collectedLabel="수집됨"
            idleSurfaceClassName={`${theme.surface} ${theme.border} hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00]`}
          />
        </div>
      </div>
    </div>
  );
};
