import React from 'react';
import { X, Map as MapIcon, Maximize2, Layers } from 'lucide-react';
import { TerrainElevationField, CrossSectionSample } from '../../../types/contour';
import { ContourMapView } from './ContourMapView';

interface ContourMapModalProps {
  field: TerrainElevationField;
  isOpen: boolean;
  onClose: () => void;
  onHoverElevation?: (elevation: number | null) => void;
  crossSectionLine?: { p1: [number, number]; p2: [number, number] } | null;
  onCrossSectionChange?: (line: { p1: [number, number]; p2: [number, number] } | null) => void;
  crossSectionHoverPoint?: { x: number; y: number; z: number; t: number } | null;
  onCrossSectionHover?: (sample: CrossSectionSample | null) => void;
  onOpenReadingGuide?: () => void;
}

export const ContourMapModal: React.FC<ContourMapModalProps> = ({
  field,
  isOpen,
  onClose,
  onHoverElevation,
  crossSectionLine,
  onCrossSectionChange,
  crossSectionHoverPoint,
  onCrossSectionHover,
  onOpenReadingGuide,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-amber-400/40 rounded-2xl w-full max-w-4xl h-[92vh] max-h-[840px] shadow-2xl flex flex-col overflow-hidden p-3">
        <ContourMapView
          field={field}
          onHoverElevation={onHoverElevation}
          crossSectionLine={crossSectionLine}
          onCrossSectionChange={onCrossSectionChange}
          crossSectionHoverPoint={crossSectionHoverPoint}
          onCrossSectionHover={onCrossSectionHover}
          onOpenReadingGuide={onOpenReadingGuide}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
