import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
      <div className="p-4 sm:p-5 bg-[#131418]/95 backdrop-blur-md border border-red-500/70 text-white flex items-start gap-3 shadow-2xl corner-ticks">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-400">
            [ SYSTEM ALERT // ERROR ]
          </div>
          <p className="font-sans text-sm text-zinc-200 leading-relaxed">{error}</p>
        </div>
      </div>
    </div>
  );
};
