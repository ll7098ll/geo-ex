import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingOverlayProps {
  loading: boolean;
  region: string;
  selectedTerrain: string | null;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, region, selectedTerrain }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white"
        >
          <div className="w-14 h-20 border-4 border-[#FFCC00] mb-6 relative overflow-hidden shadow-[0_0_20px_rgba(255,204,0,0.4)]">
            <motion.div
              animate={{ y: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 bg-[#FFCC00]/40"
            />
          </div>
          <span className="text-xs font-mono tracking-[0.25em] text-[#FFCC00] uppercase font-bold mb-2">
            FIELD EXPEDITION RECONNAISSANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black mb-3 tracking-wide text-white">
            지형 탐험 데이터 분석 중...
          </h2>
          <p className="text-zinc-400 font-mono tracking-wider text-xs">
            {region === 'korea' ? '대한민국' : '전 세계'} / <span className="text-[#FFCC00] font-bold">{selectedTerrain}</span> 관측 자료 동기화
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
