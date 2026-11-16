import React from 'react';
import { LevelContent } from '../../../utils/educationLevelHelper';
import { GuideThemeTokens } from './guideTheme';

interface GuideTimelineSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  stages: LevelContent['stages'];
  expandedStage: number;
  onSelectStage: (index: number) => void;
  isPaperMode: boolean;
  theme: GuideThemeTokens;
}

export const GuideTimelineSection: React.FC<GuideTimelineSectionProps> = ({
  sectionRef,
  stages,
  expandedStage,
  onSelectStage,
  isPaperMode,
  theme,
}) => {
  return (
    <section ref={sectionRef} className={`scroll-mt-20 pt-10 border-t ${theme.border} space-y-6`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#FFCC00] mb-1.5 flex items-center gap-2">
            <span className="inline-block w-4 h-[2px] bg-[#FFCC00]" />
            <span>PART I · CHRONOLOGY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
            지형이 완성되기까지의 4단계 연대기
          </h2>
        </div>
        <p className={`text-xs font-sans ${theme.subtle}`}>
          단계를 선택하면 형성 과정과 지형학적 특징을 자세히 볼 수 있습니다
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 w-full">
        {stages.map((stage, idx) => {
          const isExpanded = expandedStage === idx;
          return (
            <div
              key={stage.stageNumber}
              onMouseEnter={() => onSelectStage(idx)}
              onClick={() => onSelectStage(idx)}
              className={`border p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-[flex-grow,background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isExpanded
                  ? `lg:flex-[2.4] ${theme.card} border-[#FFCC00]`
                  : `lg:flex-1 ${theme.surface} ${theme.border} opacity-85 hover:opacity-100`
              }`}
            >
              <div>
                <div className={`flex items-baseline justify-between gap-2 pb-3 mb-4 border-b ${theme.border}`}>
                  <span
                    className={`font-serif font-black text-2xl sm:text-3xl leading-none ${
                      isExpanded ? 'text-[#FFCC00] bg-black px-2 py-1' : theme.subtle
                    }`}
                  >
                    0{stage.stageNumber}
                  </span>
                  {stage.timeframe && (
                    <span className={`text-[11px] font-sans font-medium text-right ${theme.subtle}`}>
                      {stage.timeframe}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg mb-2.5 leading-snug">
                  {stage.title}
                </h3>

                <p
                  className={`font-serif text-sm leading-[1.8] transition-colors ${
                    isExpanded ? theme.muted : `${theme.subtle} line-clamp-3`
                  }`}
                >
                  {stage.process}
                </p>
              </div>

              <div className={`mt-5 pt-3 border-t ${theme.border} flex items-center justify-between gap-2`}>
                <span
                  className={`text-xs font-sans font-medium ${
                    isExpanded
                      ? isPaperMode
                        ? 'text-[#181715]'
                        : 'text-[#FFCC00]'
                      : theme.subtle
                  }`}
                >
                  핵심 특징 · {stage.visualKeyFeature}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
