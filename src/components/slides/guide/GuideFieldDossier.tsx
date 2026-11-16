import React from 'react';
import { Layers, Compass, Globe, Calendar, ShieldAlert } from 'lucide-react';
import { LevelContent } from '../../../utils/educationLevelHelper';
import { GuideThemeTokens } from './guideTheme';

interface GuideFieldDossierProps {
  dossierRef: React.RefObject<HTMLElement | null>;
  content: LevelContent;
  theme: GuideThemeTokens;
}

export const GuideFieldDossier: React.FC<GuideFieldDossierProps> = ({
  dossierRef,
  content,
  theme,
}) => {
  return (
    <aside ref={dossierRef} className="lg:col-span-5 scroll-mt-20 lg:sticky lg:top-20 space-y-6">
      {/* Geological Profile Fact Sheet */}
      <div className={`border ${theme.border} border-t-[3px] border-t-[#FFCC00] ${theme.card} p-6 space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-current/10">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.18em] text-[#FFCC00] bg-black px-2 py-0.5 inline-block mb-1.5">
              FIELD DOSSIER
            </span>
            <h3 className="font-serif font-black text-lg">지질 프로필 팩트시트</h3>
          </div>
          <Layers className="w-5 h-5 text-[#FFCC00]" />
        </div>

        <dl className={`divide-y ${theme.border} text-xs sm:text-sm font-sans`}>
          <div className="py-2.5 flex items-baseline justify-between gap-4">
            <dt className={`shrink-0 ${theme.subtle}`}>지질 시대</dt>
            <dd className="font-semibold text-right">{content.factSheet.geologicalAge}</dd>
          </div>
          <div className="py-2.5 flex items-baseline justify-between gap-4">
            <dt className={`shrink-0 ${theme.subtle}`}>암석 분류</dt>
            <dd className="font-semibold text-right">{content.factSheet.rockType}</dd>
          </div>
          <div className="py-2.5 flex items-baseline justify-between gap-4">
            <dt className={`shrink-0 ${theme.subtle}`}>지체 구조</dt>
            <dd className="font-semibold text-right">{content.factSheet.tectonicSetting}</dd>
          </div>
          <div className="py-2.5 flex items-baseline justify-between gap-4">
            <dt className={`shrink-0 ${theme.subtle}`}>형성 인자</dt>
            <dd className="font-semibold text-right">{content.factSheet.geomorphicAgent}</dd>
          </div>
          {content.factSheet.scale && (
            <div className="py-2.5 flex items-baseline justify-between gap-4">
              <dt className={`shrink-0 ${theme.subtle}`}>대표 규모</dt>
              <dd className="font-bold text-right">{content.factSheet.scale}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Field Observation Checkpoints */}
      <div className={`border ${theme.border} ${theme.card} p-6 space-y-4`}>
        <div className="flex items-center gap-2 pb-2.5 border-b border-current/10">
          <Compass className="w-4 h-4 text-[#FFCC00]" />
          <h3 className="font-serif font-bold text-base">현장 탐방 관찰 포인트</h3>
        </div>
        <ul className="space-y-3 text-xs sm:text-sm font-serif">
          {content.fieldNotes.observationPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-3 leading-relaxed">
              <span className="font-mono text-[11px] font-bold bg-[#FFCC00] text-black px-1.5 py-0.5 shrink-0 mt-0.5">
                0{i + 1}
              </span>
              <span className={theme.muted}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Satellite Photo Reading Tips */}
      <div className={`border ${theme.border} ${theme.card} p-6 space-y-4`}>
        <div className="flex items-center gap-2 pb-2.5 border-b border-current/10">
          <Globe className="w-4 h-4 text-[#FFCC00]" />
          <h3 className="font-serif font-bold text-base">위성사진 판독 핵심 지표</h3>
        </div>
        <ul className="space-y-3 text-xs sm:text-sm font-serif">
          {content.fieldNotes.satellitePoints.map((chk, i) => (
            <li key={i} className="flex items-start gap-3 leading-relaxed">
              <span className="font-mono text-[11px] font-bold bg-[#FFCC00] text-black px-1.5 py-0.5 shrink-0 mt-0.5">
                0{i + 1}
              </span>
              <span className={theme.muted}>{chk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Visiting Season & Conservation Notes */}
      {(content.fieldNotes.bestSeason || content.fieldNotes.cautionNote) && (
        <div className={`border ${theme.border} ${theme.surface} p-5 space-y-3 text-xs font-sans`}>
          {content.fieldNotes.bestSeason && (
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">추천 탐방 시기</span>
                <span className={theme.muted}>{content.fieldNotes.bestSeason}</span>
              </div>
            </div>
          )}
          {content.fieldNotes.cautionNote && (
            <div className={`flex items-start gap-2.5 pt-2.5 border-t ${theme.border}`}>
              <ShieldAlert className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">지질 보존 및 안전 수칙</span>
                <span className={theme.muted}>{content.fieldNotes.cautionNote}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
