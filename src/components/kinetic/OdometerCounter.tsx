import React from 'react';
import { motion } from 'motion/react';

interface OdometerCounterProps {
  value: number;
  prefix?: string;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface SingleDigitWheelProps {
  digit: number;
}

const SingleDigitWheel: React.FC<SingleDigitWheelProps> = ({ digit }) => {
  return (
    <span className="inline-block h-[1.1em] overflow-hidden leading-none relative">
      <motion.span
        className="flex flex-col"
        animate={{ y: `-${digit * 10}%` }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 24,
          mass: 0.8,
        }}
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            className="h-[1.1em] flex items-center justify-center font-mono font-bold"
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

export const OdometerCounter: React.FC<OdometerCounterProps> = ({
  value,
  prefix = 'Specimen',
  className = '',
}) => {
  const formatted = String(Math.max(0, value)).padStart(2, '0');
  const tens = parseInt(formatted[formatted.length - 2], 10) || 0;
  const ones = parseInt(formatted[formatted.length - 1], 10) || 0;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans text-xs font-semibold tracking-wide select-none ${className}`}
    >
      {prefix && <span className="text-zinc-200">{prefix}</span>}
      <span className="inline-flex items-center px-1.5 py-0.5 bg-[#FFCC00] text-black font-mono font-bold text-[11px]">
        <SingleDigitWheel digit={tens} />
        <SingleDigitWheel digit={ones} />
      </span>
    </span>
  );
};
