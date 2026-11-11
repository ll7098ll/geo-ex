import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowUpRight, Box, Compass, Layers } from 'lucide-react';
import { PlaceInfo } from '../../types';

interface SpecimenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  specimens: PlaceInfo[];
  onRemoveSpecimen: (placeName: string) => void;
  onClearAll: () => void;
  onSelectSpecimen: (specimen: PlaceInfo) => void;
}

export const SpecimenDrawer: React.FC<SpecimenDrawerProps> = ({
  isOpen,
  onClose,
  specimens,
  onRemoveSpecimen,
  onClearAll,
  onSelectSpecimen,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-out Architectural Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#08080A] border-l border-white/15 text-white flex flex-col justify-between shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#131418]">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#FFCC00] uppercase font-bold">
                  <Box className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>FIELD DISPATCH ARCHIVE</span>
                </div>
                <h3 className="text-lg font-black font-mono tracking-tight uppercase mt-1">
                  SPECIMEN [ {String(specimens.length).padStart(2, '0')} ]
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="w-8 h-8 border border-white/20 bg-black hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Specimen Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {specimens.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/15">
                  <Layers className="w-10 h-10 text-white/30 mb-3" />
                  <p className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">
                    [ NO SPECIMENS COLLECTED ]
                  </p>
                  <p className="text-xs text-zinc-500 font-serif leading-relaxed">
                    지형 탐험 중 각 슬라이드의 [ + COLLECT SPECIMEN ] 버튼을 눌러 표본을 수집하세요.
                  </p>
                </div>
              ) : (
                specimens.map((item, idx) => (
                  <div
                    key={`${item.placeName}-${idx}`}
                    className="border border-white/15 bg-[#131418] p-4 relative group hover:border-[#FFCC00] transition-colors corner-ticks"
                  >
                    {/* Item Department & Index */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-2 border-b border-white/5 pb-2">
                      <span className="text-[#FFCC00] font-bold">
                        SPECIMEN #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>[ {item.terrain} ]</span>
                    </div>

                    {/* Title & Location */}
                    <h4 className="text-base font-bold font-serif text-white group-hover:text-[#FFCC00] transition-colors">
                      {item.placeName}
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {item.countryOrArea}
                    </p>

                    {/* Geological Specs Snippet */}
                    {item.geology && (
                      <div className="mt-3 pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                        <div>
                          <span className="text-white/40 block">암석 분류</span>
                          <span className="text-zinc-200 truncate block">
                            {item.geology.rockType || '미분류'}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/40 block">지질 시대</span>
                          <span className="text-zinc-200 truncate block">
                            {item.geology.geologicalAge || '제4기'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onSelectSpecimen(item);
                          onClose();
                        }}
                        className="px-3 py-1 bg-black border border-white/20 hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] text-[11px] font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>탐색 바로가기</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onRemoveSpecimen(item.placeName)}
                        title="표본 삭제"
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            {specimens.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-[#08080A] flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  TOTAL SPECIMENS: <strong className="text-white">{specimens.length}</strong>
                </span>
                <button
                  onClick={onClearAll}
                  className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  [ CLEAR ARCHIVE ]
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
