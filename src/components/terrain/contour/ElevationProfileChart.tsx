import React, { useState, useMemo, useRef } from 'react';
import {
  TrendingUp,
  Mountain,
  Ruler,
  Maximize2,
  Navigation,
  Info,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  TerrainElevationField,
  CrossSectionResult,
  CrossSectionSample,
  CrossSectionPreset,
} from '../../../types/contour';
import { computeCrossSection } from './crossSectionMath';

interface ElevationProfileChartProps {
  field: TerrainElevationField;
  line: { p1: [number, number]; p2: [number, number] };
  hoverSample: CrossSectionSample | null;
  onHoverSample?: (sample: CrossSectionSample | null) => void;
  onSelectPreset?: (preset: CrossSectionPreset) => void;
  onClearCustomLine?: () => void;
  isCompact?: boolean;
}

export const ElevationProfileChart: React.FC<ElevationProfileChartProps> = ({
  field,
  line,
  hoverSample,
  onHoverSample,
  onSelectPreset,
  isCompact = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute profile data
  const result: CrossSectionResult = useMemo(() => {
    return computeCrossSection(field, line.p1, line.p2, 120);
  }, [field, line.p1, line.p2]);

  const [mouseSample, setMouseSample] = useState<CrossSectionSample | null>(null);

  // Chart dimensions
  const svgWidth = 560;
  const svgHeight = isCompact ? 130 : 170;
  const padLeft = 46;
  const padRight = 24;
  const padTop = 18;
  const padBottom = 28;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const minH = result.minElevation;
  const maxH = result.maxElevation;
  const rangeH = Math.max(0.5, maxH - minH);

  // Map sample to SVG coordinates
  const getSvgX = (sample: CrossSectionSample) => padLeft + sample.t * plotWidth;
  const getSvgY = (elevation: number) => {
    const norm = (elevation - minH) / rangeH;
    return padTop + plotHeight * (1 - norm);
  };

  // Build SVG path
  const areaPath = useMemo(() => {
    if (result.samples.length < 2) return '';
    const points = result.samples.map((s) => `${getSvgX(s)},${getSvgY(s.elevation)}`);
    const firstX = getSvgX(result.samples[0]);
    const lastX = getSvgX(result.samples[result.samples.length - 1]);
    const bottomY = padTop + plotHeight;
    return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
  }, [result, plotWidth, plotHeight, minH, rangeH]);

  const linePath = useMemo(() => {
    if (result.samples.length < 2) return '';
    const points = result.samples.map((s) => `${getSvgX(s)},${getSvgY(s.elevation)}`);
    return `M ${points.join(' L ')}`;
  }, [result, plotWidth, plotHeight, minH, rangeH]);

  // Handle SVG mouse scrub
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const relX = clientX / rect.width;
    const svgRelX = (relX * svgWidth - padLeft) / plotWidth;
    const clampedT = Math.max(0, Math.min(1, svgRelX));

    const sampleIdx = Math.min(
      result.samples.length - 1,
      Math.max(0, Math.round(clampedT * (result.samples.length - 1)))
    );
    const sample = result.samples[sampleIdx];
    setMouseSample(sample);
    if (onHoverSample) onHoverSample(sample);
  };

  const handleMouseLeave = () => {
    setMouseSample(null);
    if (onHoverSample) onHoverSample(null);
  };

  const activeSample = hoverSample || mouseSample;

  return (
    <div
      ref={containerRef}
      id="elevation-profile-chart-panel"
      className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 sm:p-4 text-white shadow-2xl transition-all"
    >
      {/* Top Header: Title & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight text-slate-100">
                지형 횡단면도 (Elevation Cross-Section)
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-cyan-800/60">
                A({line.p1[0].toFixed(1)}, {line.p1[1].toFixed(1)}) → B({line.p2[0].toFixed(1)}, {line.p2[1].toFixed(1)})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              절단선을 따라 등고선의 수직 기복 및 경사도를 분석합니다.
            </p>
          </div>
        </div>

        {/* Preset buttons */}
        {field.crossSectionPresets && field.crossSectionPresets.length > 0 && onSelectPreset && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">추천 단면:</span>
            {field.crossSectionPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
                title={preset.description}
              >
                <span>{preset.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Metric Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2.5">
        <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-2 flex flex-col">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Ruler className="w-3 h-3 text-emerald-400" /> 총 수평 거리
          </span>
          <span className="text-sm font-mono font-bold text-slate-100 mt-0.5">
            {result.totalDistance.toLocaleString()} m
          </span>
        </div>

        <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-2 flex flex-col">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Mountain className="w-3 h-3 text-amber-400" /> 단면 표고차 (ΔH)
          </span>
          <span className="text-sm font-mono font-bold text-amber-300 mt-0.5">
            {result.reliefDelta.toFixed(1)} m{' '}
            <span className="text-[10px] font-normal text-slate-400">
              ({result.minElevation.toFixed(1)} ~ {result.maxElevation.toFixed(1)})
            </span>
          </span>
        </div>

        <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-2 flex flex-col">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-rose-400" /> 최대 경사각
          </span>
          <span className="text-sm font-mono font-bold text-rose-300 mt-0.5">
            {result.maxSlopeAngle}°{' '}
            <span className="text-[10px] font-normal text-slate-400">
              {result.maxSlopeAngle > 25 ? '(급경사)' : '(완경사)'}
            </span>
          </span>
        </div>

        <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-2 flex flex-col">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> 평균 경사각
          </span>
          <span className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
            {result.avgSlopeAngle}°
          </span>
        </div>
      </div>

      {/* SVG Elevation Profile Chart */}
      <div className="relative bg-slate-950/80 border border-slate-800 rounded-lg p-2 overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Ground Area Fill Gradient */}
            <linearGradient id="profileGroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
            </linearGradient>

            {/* Profile Line Glow */}
            <filter id="profileLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines (horizontal elevations) */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
            const hVal = minH + ratio * rangeH;
            const y = padTop + plotHeight * (1 - ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + plotWidth}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {hVal.toFixed(1)}m
                </text>
              </g>
            );
          })}

          {/* Vertical distance grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((t) => {
            const x = padLeft + t * plotWidth;
            const dist = Math.round(t * result.totalDistance);
            return (
              <g key={t}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + plotHeight}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padTop + plotHeight + 14}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {dist}m
                </text>
              </g>
            );
          })}

          {/* Ground Fill Area */}
          <path d={areaPath} fill="url(#profileGroundGrad)" />

          {/* Main Topographic Profile Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#profileLineGlow)"
          />

          {/* Point A Marker (Start - Amber) */}
          <g transform={`translate(${getSvgX(result.samples[0])}, ${getSvgY(result.samples[0].elevation)})`}>
            <circle r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <text x="0" y="-8" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
              A
            </text>
          </g>

          {/* Point B Marker (End - Cyan) */}
          <g
            transform={`translate(${getSvgX(
              result.samples[result.samples.length - 1]
            )}, ${getSvgY(result.samples[result.samples.length - 1].elevation)})`}
          >
            <circle r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <text x="0" y="-8" fill="#06b6d4" fontSize="10" fontWeight="bold" textAnchor="middle">
              B
            </text>
          </g>

          {/* Hover Scrubbing Cursor */}
          {activeSample && (
            <g transform={`translate(${getSvgX(activeSample)}, 0)`}>
              {/* Vertical Guide Line */}
              <line
                x1="0"
                y1={padTop}
                x2="0"
                y2={padTop + plotHeight}
                stroke="#e2e8f0"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Glowing Target Circle on the profile line */}
              <circle
                cy={getSvgY(activeSample.elevation)}
                r="6"
                fill="#facc15"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Floating Tooltip Box */}
              <g
                transform={`translate(${
                  activeSample.t > 0.75 ? -100 : activeSample.t < 0.25 ? 10 : -45
                }, ${Math.max(padTop + 6, getSvgY(activeSample.elevation) - 34)})`}
              >
                <rect
                  width="90"
                  height="30"
                  rx="4"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                />
                <text x="6" y="13" fill="#f8fafc" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  고도: {activeSample.elevation.toFixed(1)}m
                </text>
                <text x="6" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  거리: {Math.round(activeSample.distance)}m ({activeSample.slopeAngle}°)
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Hover Status Bar at bottom */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
          <div className="flex items-center gap-2">
            <span>시작 A ({line.p1[0].toFixed(1)}, {line.p1[1].toFixed(1)})</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>도착 B ({line.p2[0].toFixed(1)}, {line.p2[1].toFixed(1)})</span>
          </div>
          {activeSample ? (
            <div className="flex items-center gap-3 text-cyan-300 font-semibold">
              <span>표고: {activeSample.elevation.toFixed(2)}m</span>
              <span>거리: {Math.round(activeSample.distance)}m</span>
              <span>
                경사: {activeSample.slopeAngle}°{' '}
                {activeSample.slopeAngle > 20 ? (
                  <span className="text-rose-400">(급경사)</span>
                ) : (
                  <span className="text-emerald-400">(완경사)</span>
                )}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 text-[10px]">
              단면도 위를 마우스로 드래그/호버하면 2D 및 3D 모델과 실시간 연동됩니다.
            </span>
          )}
        </div>
      </div>

      {/* Educational Pedagogical Tip */}
      <div className="mt-2.5 p-2 bg-slate-800/40 border border-slate-700/40 rounded-lg flex items-start gap-2 text-[11px] text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">독도법 핵심 원리:</span> 등고선 간격이 빽빽한 구간은 단면도 상에서 가파른 수직 낭떠러지(급경사)를 만들고, 등고선 간격이 널찍한 구간은 완만한 평지나 안부를 형성합니다.
        </div>
      </div>
    </div>
  );
};
