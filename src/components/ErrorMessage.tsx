import React from 'react';
import { Info } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="p-6 bg-red-900/90 backdrop-blur-md border border-red-500 text-white flex items-start gap-4 rounded-sm shadow-2xl">
        <Info className="w-6 h-6 shrink-0 mt-0.5 text-red-300" />
        <p className="font-medium text-lg">{error}</p>
      </div>
    </div>
  );
};
