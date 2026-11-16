import React from 'react';
import { Plus, Check } from 'lucide-react';
import { PlaceInfo } from '../../types';

interface SpecimenCollectButtonProps {
  placeInfo?: PlaceInfo;
  isCollected: boolean;
  onAddSpecimen?: (place: PlaceInfo) => void;
  variant?: 'full' | 'compact' | 'editorial';
  collectedLabel?: string;
  idleLabel?: string;
  idleSurfaceClassName?: string;
}

export const SpecimenCollectButton: React.FC<SpecimenCollectButtonProps> = ({
  placeInfo,
  isCollected,
  onAddSpecimen,
  variant = 'compact',
  collectedLabel = '수집 완료',
  idleLabel = '표본 수집',
  idleSurfaceClassName,
}) => {
  if (!placeInfo || !onAddSpecimen) return null;

  const baseClass =
    variant === 'full'
      ? 'w-full py-2.5 px-4 font-sans text-xs font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hairline-border active:scale-[0.99]'
      : variant === 'editorial'
      ? 'px-3 py-1.5 text-xs font-sans font-bold transition-colors duration-200 flex items-center gap-1 cursor-pointer border'
      : 'px-3 py-1 text-xs font-sans font-bold transition-colors duration-200 flex items-center gap-1 cursor-pointer hairline-border';

  const stateClass = isCollected
    ? 'bg-[#FFCC00] text-black border-[#FFCC00]'
    : idleSurfaceClassName ||
      'bg-[#131418] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00]';

  const iconSize = variant === 'full' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <button onClick={() => onAddSpecimen(placeInfo)} className={`${baseClass} ${stateClass}`}>
      {isCollected ? (
        <>
          <Check className={iconSize} />
          <span className={variant === 'editorial' ? 'hidden sm:inline' : undefined}>
            {collectedLabel}
          </span>
        </>
      ) : (
        <>
          <Plus
            className={`${iconSize} ${variant === 'editorial' ? 'text-[#FFCC00]' : ''}`}
          />
          <span className={variant === 'editorial' ? 'hidden sm:inline' : undefined}>
            {idleLabel}
          </span>
        </>
      )}
    </button>
  );
};
