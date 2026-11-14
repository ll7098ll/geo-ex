import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PolarityCutGateProps {
  isVisible: boolean;
  chapterNumber: string;
  chapterTitle: string;
  subtitle?: string;
  onComplete?: () => void;
}

export const PolarityCutGate: React.FC<PolarityCutGateProps> = ({
  isVisible,
  chapterNumber,
  chapterTitle,
  subtitle,
  onComplete,
}) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="polarity-cut-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#FFCC00] text-[#08080A] flex flex-col justify-between p-8 sm:p-14 select-none pointer-events-none"
        >
          {/* Top Editorial Masthead Bar */}
          <div className="flex items-center justify-between border-b border-black/20 pb-4 text-xs tracking-[0.2em] uppercase font-sans font-bold">
            <span className="flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-4 bg-[#08080A]" />
              <span>GEOGRAPHY EXPLORER</span>
            </span>
            <span className="opacity-70 font-serif">
              CHAPTER {chapterNumber}
            </span>
          </div>

          {/* Center Editorial Chapter Title */}
          <div className="my-auto max-w-5xl">
            <motion.div
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-xs sm:text-sm font-sans tracking-[0.28em] font-black uppercase mb-3 text-black/70">
                CHAPTER {chapterNumber}
              </div>
              <h2 className="text-4xl sm:text-7xl md:text-8xl font-black font-sans tracking-tight uppercase leading-none break-words text-[#08080A]">
                {chapterTitle}
              </h2>
              {subtitle && (
                <p className="mt-4 text-base sm:text-xl font-serif tracking-normal text-black/80 font-medium">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Bottom Editorial Footer */}
          <div className="border-t border-black/20 pt-4 flex items-center justify-between text-xs tracking-[0.18em] uppercase font-sans font-semibold text-black/70">
            <span>NATURAL LANDFORM ARCHIVE</span>
            <span className="hidden sm:inline">FIELD EXPEDITION JOURNAL</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
