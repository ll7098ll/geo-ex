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
          <div className="w-16 h-24 border-4 border-[#FFCC00] mb-8 relative overflow-hidden">
            <motion.div
              animate={{ y: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 bg-[#FFCC00]/40"
            />
          </div>
          <h2 className="text-3xl font-serif mb-4 tracking-wide">탐험 준비 중...</h2>
          <p className="text-gray-400 tracking-widest uppercase text-sm">
            {region === 'korea' ? '대한민국' : '전 세계'}의 <span className="text-[#FFCC00]">{selectedTerrain}</span> 데이터를 분석하고 있습니다
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
