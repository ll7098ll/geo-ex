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
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#1F34FF] text-white flex flex-col justify-between p-8 sm:p-14 select-none pointer-events-none"
        >
          {/* Top Technical Metadata Bar */}
          <div className="flex items-center justify-between border-b border-white/30 pb-4 font-mono text-xs tracking-widest uppercase">
            <span className="flex items-center gap-2 font-bold">
              <span className="inline-block w-2.5 h-2.5 bg-white" />
              <span>[ POLARITY CUT // 01-FRAME TRANSITION ]</span>
            </span>
            <span className="hidden sm:inline font-mono opacity-80">
              SYS_TELEMETRY // ACT {chapterNumber}
            </span>
            <span className="font-bold text-[#96D0FF]">
              [ SPEC: 100% EXPOSURE ]
            </span>
          </div>

          {/* Center Giant Typographic Curtain */}
          <div className="my-auto max-w-6xl">
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.18, delay: 0.04 }}
            >
              <div className="text-xs sm:text-sm font-mono text-[#96D0FF] tracking-[0.3em] font-black uppercase mb-2">
                CHAPTER [ {chapterNumber} ]
              </div>
              <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-sans tracking-tighter uppercase leading-none break-words">
                {chapterTitle}
              </h2>
              {subtitle && (
                <p className="mt-4 text-sm sm:text-xl font-mono tracking-wider text-white/90 font-medium">
                  // {subtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Bottom Hairline Coordinates */}
          <div className="border-t border-white/30 pt-4 flex flex-wrap items-center justify-between font-mono text-[11px] tracking-wider text-white/80">
            <span>[ LAT 19.421°N // LON 155.287°W ]</span>
            <span className="uppercase text-[#96D0FF] font-bold">
              SWISS BRUTALIST KINETIC ARCHIVE
            </span>
            <span className="hidden md:inline">240×240 HIGH-DENSITY MESH</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
