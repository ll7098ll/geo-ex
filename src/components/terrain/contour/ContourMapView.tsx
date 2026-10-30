import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Download,
  Info,
  Maximize2,
  X,
  TrendingUp,
  Compass,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  TerrainElevationField,
  CrossSectionSample,
  CrossSectionPreset,
} from '../../../types/contour';
import { extractContours, ContourDataset, ContourPath } from './marchingSquares';
import { ElevationProfileChart } from './ElevationProfileChart';

interface ContourMapViewProps {
  field: TerrainElevationField;
  width?: number;
  height?: number;
  isCompact?: boolean;
  onHoverElevation?: (elevation: number | null) => void;
  onSelectContour?: (contour: ContourPath | null) => void;
  crossSectionLine?: { p1: [number, number]; p2: [number, number] } | null;
  onCrossSectionChange?: (line: { p1: [number, number]; p2: [number, number] } | null) => void;
  crossSectionHoverPoint?: { x: number; y: number; z: number; t: number } | null;
  onCrossSectionHover?: (sample: CrossSectionSample | null) => void;
  onOpenReadingGuide?: () => void;
  onClose?: () => void;
}

type BackgroundMode = 'natural' | 'hypsometric' | 'paper' | 'dark';

export const ContourMapView: React.FC<ContourMapViewProps> = ({
  field,
  isCompact = false,
  onHoverElevation,
  crossSectionLine: propCrossSectionLine,
  onCrossSectionChange,
  crossSectionHoverPoint,
  onCrossSectionHover,
  onOpenReadingGuide,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // View state: Pan & Zoom
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mode: 'explore' (pan/hover) or 'crossSection' (draw cutting line)
  const [interactionMode, setInteractionMode] = useState<'explore' | 'crossSection'>('explore');
  const [drawPointA, setDrawPointA] = useState<[number, number] | null>(null);

  // Local fallback cross-section line if not managed by parent
  const [localLine, setLocalLine] = useState<{ p1: [number, number]; p2: [number, number] } | null>(
    field.crossSectionPresets && field.crossSectionPresets.length > 0
      ? { p1: field.crossSectionPresets[0].p1, p2: field.crossSectionPresets[0].p2 }
      : { p1: [-8, 0], p2: [8, 0] }
  );

  const activeCrossSectionLine = propCrossSectionLine !== undefined ? propCrossSectionLine : localLine;

  const updateLine = (line: { p1: [number, number]; p2: [number, number] } | null) => {
    setLocalLine(line);
    if (onCrossSectionChange) onCrossSectionChange(line);
  };

  // Map display settings
  const [bgMode, setBgMode] = useState<BackgroundMode>('natural');
  const [intervalMultiplier, setIntervalMultiplier] = useState<number>(1.0); // 0.5 (dense), 1.0 (standard), 2.0 (sparse)
  const [showLabels, setShowLabels] = useState(true);
  const [showHachures, setShowHachures] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showProfileDrawer, setShowProfileDrawer] = useState(!isCompact);

  const [hoveredPos, setHoveredPos] = useState<{ x: number; y: number; elevation: number; slope: number } | null>(null);

  // Cached contours calculation based on interval
  const contourData: ContourDataset = useMemo(() => {
    const step = Math.max(0.05, field.contourSettings.intermediateInterval * intervalMultiplier);
    const index = Math.max(0.1, field.contourSettings.indexInterval * intervalMultiplier);
    return extractContours(field, step, index);
  }, [field, intervalMultiplier]);

  // Pre-generate background image for fast canvas rendering
  const bgImageBitmap = useMemo(() => {
    const { segments, elevations, colors, minElevation, maxElevation } = field;
    const canvas = document.createElement('canvas');
    canvas.width = segments + 1;
    canvas.height = segments + 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const data = imgData.data;
    const relief = Math.max(0.01, maxElevation - minElevation);

    for (let j = 0; j <= segments; j++) {
      const rowInvert = segments - j;
      for (let i = 0; i <= segments; i++) {
        const srcIdx = j * (segments + 1) + i;
        const targetIdx = (rowInvert * canvas.width + i) * 4;

        if (bgMode === 'natural') {
          data[targetIdx] = Math.round(colors[srcIdx * 3] * 255);
          data[targetIdx + 1] = Math.round(colors[srcIdx * 3 + 1] * 255);
          data[targetIdx + 2] = Math.round(colors[srcIdx * 3 + 2] * 255);
          data[targetIdx + 3] = 255;
        } else if (bgMode === 'hypsometric') {
          const normH = Math.max(0, Math.min(1, (elevations[srcIdx] - minElevation) / relief));
          const [r, g, b] = getHypsometricRGB(normH);
          data[targetIdx] = r;
          data[targetIdx + 1] = g;
          data[targetIdx + 2] = b;
          data[targetIdx + 3] = 255;
        } else if (bgMode === 'paper') {
          const normH = Math.max(0, Math.min(1, (elevations[srcIdx] - minElevation) / relief));
          const v = Math.round(248 - normH * 32);
          data[targetIdx] = v;
          data[targetIdx + 1] = v - 6;
          data[targetIdx + 2] = v - 16;
          data[targetIdx + 3] = 255;
        } else {
          // dark
          const normH = Math.max(0, Math.min(1, (elevations[srcIdx] - minElevation) / relief));
          const v = Math.round(18 + normH * 35);
          data[targetIdx] = v;
          data[targetIdx + 1] = v + 4;
          data[targetIdx + 2] = v + 12;
          data[targetIdx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }, [field, bgMode]);

  // Coordinate transformations
  const worldToCanvas = useCallback(
    (wx: number, wy: number, cWidth: number, cHeight: number): [number, number] => {
      const halfWorld = field.worldSize / 2;
      const baseScale = Math.min(cWidth, cHeight) / field.worldSize;
      const scale = baseScale * zoom;
      const originX = cWidth / 2 + pan.x;
      const originY = cHeight / 2 + pan.y;
      const cx = originX + wx * scale;
      const cy = originY - wy * scale;
      return [cx, cy];
    },
    [field.worldSize, zoom, pan]
  );

  const canvasToWorld = useCallback(
    (cx: number, cy: number, cWidth: number, cHeight: number): [number, number] => {
      const baseScale = Math.min(cWidth, cHeight) / field.worldSize;
      const scale = baseScale * zoom;
      const originX = cWidth / 2 + pan.x;
      const originY = cHeight / 2 + pan.y;
      const wx = (cx - originX) / scale;
      const wy = -(cy - originY) / scale;
      return [wx, wy];
    },
    [field.worldSize, zoom, pan]
  );

  // Main Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;

    if (canvas.width !== Math.round(cWidth * dpr) || canvas.height !== Math.round(cHeight * dpr)) {
      canvas.width = Math.round(cWidth * dpr);
      canvas.height = Math.round(cHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Background clearing
    const isDarkTheme = bgMode === 'dark' || bgMode === 'natural';
    ctx.fillStyle = isDarkTheme ? '#090d16' : '#f8fafc';
    ctx.fillRect(0, 0, cWidth, cHeight);

    // 2. Draw DEM Raster Underlay
    if (bgImageBitmap) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      const [leftX, topY] = worldToCanvas(-field.worldSize / 2, field.worldSize / 2, cWidth, cHeight);
      const [rightX, bottomY] = worldToCanvas(field.worldSize / 2, -field.worldSize / 2, cWidth, cHeight);
      const renderW = rightX - leftX;
      const renderH = bottomY - topY;

      ctx.drawImage(bgImageBitmap, leftX, topY, renderW, renderH);

      // Diorama perimeter boundary box
      ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(leftX, topY, renderW, renderH);
      ctx.restore();
    }

    // 3. Render Contour Polylines
    const indexStrokeColor = isDarkTheme ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.95)';
    const intermediateStrokeColor = isDarkTheme ? 'rgba(255, 255, 255, 0.35)' : 'rgba(71, 85, 105, 0.45)';
    const hachureStrokeColor = isDarkTheme ? 'rgba(248, 113, 113, 0.85)' : 'rgba(220, 38, 38, 0.85)';

    contourData.contours.forEach((contour) => {
      const isIndex = contour.isIndex;
      ctx.strokeStyle = isIndex ? indexStrokeColor : intermediateStrokeColor;
      ctx.lineWidth = isIndex ? 1.8 : 0.9;
      ctx.beginPath();

      contour.polylines.forEach((poly) => {
        if (poly.length < 2) return;
        poly.forEach(([wx, wy], idx) => {
          const [cx, cy] = worldToCanvas(wx, wy, cWidth, cHeight);
          if (idx === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
      });
      ctx.stroke();

      // Hachure ticks (요지 빗금 for depression contours)
      if (showHachures && contour.isDepression) {
        ctx.save();
        ctx.strokeStyle = hachureStrokeColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        contour.polylines.forEach((poly) => {
          for (let p = 0; p < poly.length - 1; p += 3) {
            const pt1 = poly[p];
            const pt2 = poly[p + 1];
            const [x1, y1] = worldToCanvas(pt1[0], pt1[1], cWidth, cHeight);
            const [x2, y2] = worldToCanvas(pt2[0], pt2[1], cWidth, cHeight);
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy);
            if (len > 0.5) {
              const nx = -dy / len;
              const ny = dx / len;
              ctx.moveTo(x1, y1);
              ctx.lineTo(x1 + nx * 4, y1 + ny * 4);
            }
          }
        });
        ctx.stroke();
        ctx.restore();
      }

      // Elevation labels on index contours
      if (showLabels && isIndex && contour.polylines.length > 0) {
        ctx.save();
        ctx.font = '600 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelText = `${contour.elevation >= 0 ? '+' : ''}${contour.elevation.toFixed(1)}m`;

        const longestPoly = contour.polylines.reduce((a, b) => (a.length > b.length ? a : b));
        if (longestPoly.length >= 6) {
          const midIdx = Math.floor(longestPoly.length / 2);
          const pA = longestPoly[midIdx];
          const pB = longestPoly[midIdx + 1] || longestPoly[midIdx - 1];
          const [lx, ly] = worldToCanvas(pA[0], pA[1], cWidth, cHeight);
          const [lx2, ly2] = worldToCanvas(pB[0], pB[1], cWidth, cHeight);

          let angle = Math.atan2(ly2 - ly, lx2 - lx);
          if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;

          ctx.translate(lx, ly);
          ctx.rotate(angle);

          const textWidth = ctx.measureText(labelText).width;
          ctx.fillStyle = isDarkTheme ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)';
          ctx.fillRect(-textWidth / 2 - 3, -7, textWidth + 6, 14);

          ctx.fillStyle = indexStrokeColor;
          ctx.fillText(labelText, 0, 0);
          ctx.restore();
        }
      }
    });

    // 4. Geomorphic Feature Vectors
    if (showFeatures && field.features.length > 0) {
      field.features.forEach((feat) => {
        if (feat.points.length === 1) {
          const [ptX, ptY] = feat.points[0];
          const [pCanvasX, pCanvasY] = worldToCanvas(ptX, ptY, cWidth, cHeight);

          ctx.save();
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;

          if (feat.type === 'crater' || feat.type === 'sinkhole') {
            ctx.beginPath();
            ctx.arc(pCanvasX, pCanvasY, 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(pCanvasX, pCanvasY, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(pCanvasX, pCanvasY - 6);
            ctx.lineTo(pCanvasX - 5, pCanvasY + 4);
            ctx.lineTo(pCanvasX + 5, pCanvasY + 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          ctx.font = '700 11px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = 'rgba(0,0,0,0.8)';
          ctx.lineWidth = 3;
          ctx.strokeText(feat.name, pCanvasX, pCanvasY - 11);
          ctx.fillText(feat.name, pCanvasX, pCanvasY - 11);
          ctx.restore();
        } else if (feat.points.length > 1) {
          ctx.save();
          ctx.beginPath();
          feat.points.forEach((pt, idx) => {
            const [fx, fy] = worldToCanvas(pt[0], pt[1], cWidth, cHeight);
            if (idx === 0) ctx.moveTo(fx, fy);
            else ctx.lineTo(fx, fy);
          });

          if (feat.type === 'fault_line') {
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 3]);
          } else if (feat.type === 'channel') {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
          } else {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.0;
            ctx.setLineDash([4, 2]);
          }
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    // 5. Cross-Section Cutting Line (A -> B)
    if (activeCrossSectionLine) {
      const { p1, p2 } = activeCrossSectionLine;
      const [ax, ay] = worldToCanvas(p1[0], p1[1], cWidth, cHeight);
      const [bx, by] = worldToCanvas(p2[0], p2[1], cWidth, cHeight);

      ctx.save();
      // Cyan glowing laser line
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point A Marker (Amber)
      ctx.beginPath();
      ctx.arc(ax, ay, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('A', ax, ay);

      // Point B Marker (Cyan)
      ctx.beginPath();
      ctx.arc(bx, by, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B', bx, by);

      // Point A/B Labels below
      ctx.font = '600 10px sans-serif';
      ctx.fillStyle = '#fcd34d';
      ctx.fillText('시작 A', ax, ay + 17);
      ctx.fillStyle = '#67e8f9';
      ctx.fillText('도착 B', bx, by + 17);

      ctx.restore();
    }

    // Interactive Drawing Line Preview if in drawing mode
    if (interactionMode === 'crossSection' && drawPointA && hoveredPos) {
      const [dax, day] = worldToCanvas(drawPointA[0], drawPointA[1], cWidth, cHeight);
      const [dhx, dhy] = worldToCanvas(hoveredPos.x, hoveredPos.y, cWidth, cHeight);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(dax, day);
      ctx.lineTo(dhx, dhy);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Point A marker
      ctx.beginPath();
      ctx.arc(dax, day, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();
    }

    // 6. Cross-Section Hover Point Cursor (Scrubbed on Profile Chart)
    if (crossSectionHoverPoint) {
      const [hx, hy] = worldToCanvas(crossSectionHoverPoint.x, crossSectionHoverPoint.y, cWidth, cHeight);
      ctx.save();
      // Target pulse ring
      ctx.beginPath();
      ctx.arc(hx, hy, 9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    // 7. North Arrow
    ctx.save();
    const northX = cWidth - 36;
    const northY = 38;
    ctx.translate(northX, northY);
    ctx.fillStyle = isDarkTheme ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(4, 0);
    ctx.lineTo(0, -2);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(-4, 0);
    ctx.lineTo(0, -2);
    ctx.closePath();
    ctx.fillStyle = '#b91c1c';
    ctx.fill();

    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, 10);
    ctx.restore();

    // 8. Scale Bar
    ctx.save();
    const scaleBarX = 16;
    const scaleBarY = cHeight - 20;
    const [p0_x] = worldToCanvas(0, 0, cWidth, cHeight);
    const [p1_x] = worldToCanvas(5, 0, cWidth, cHeight);
    const barWidth = Math.abs(p1_x - p0_x);

    ctx.fillStyle = isDarkTheme ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.fillRect(scaleBarX - 4, scaleBarY - 12, barWidth + 8, 18);
    ctx.strokeRect(scaleBarX - 4, scaleBarY - 12, barWidth + 8, 18);

    ctx.fillStyle = isDarkTheme ? '#ffffff' : '#000000';
    ctx.fillRect(scaleBarX, scaleBarY, barWidth / 2, 3);
    ctx.fillStyle = isDarkTheme ? '#64748b' : '#cbd5e1';
    ctx.fillRect(scaleBarX + barWidth / 2, scaleBarY, barWidth / 2, 3);

    ctx.font = '8px sans-serif';
    ctx.fillStyle = isDarkTheme ? '#f1f5f9' : '#0f172a';
    ctx.fillText('0', scaleBarX - 2, scaleBarY - 3);
    ctx.fillText('500m', scaleBarX + barWidth - 14, scaleBarY - 3);
    ctx.restore();

    // 9. Hover Crosshair
    if (hoveredPos && interactionMode === 'explore') {
      const [hX, hY] = worldToCanvas(hoveredPos.x, hoveredPos.y, cWidth, cHeight);
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(hX, 0);
      ctx.lineTo(hX, cHeight);
      ctx.moveTo(0, hY);
      ctx.lineTo(cWidth, hY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(hX, hY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }, [
    field,
    contourData,
    bgImageBitmap,
    bgMode,
    zoom,
    pan,
    showLabels,
    showHachures,
    showFeatures,
    hoveredPos,
    activeCrossSectionLine,
    interactionMode,
    drawPointA,
    crossSectionHoverPoint,
    worldToCanvas,
  ]);

  // Mouse Interaction: Pan, Zoom, Cross-Section Drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const [wx, wy] = canvasToWorld(cx, cy, rect.width, rect.height);

    if (interactionMode === 'crossSection') {
      if (!drawPointA) {
        // First click: Set Point A
        setDrawPointA([wx, wy]);
      } else {
        // Second click: Set Point B and finish line
        updateLine({ p1: drawPointA, p2: [wx, wy] });
        setDrawPointA(null);
        setInteractionMode('explore');
      }
      return;
    }

    // Default: Pan dragging
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    const [wx, wy] = canvasToWorld(cx, cy, rect.width, rect.height);
    const halfWorld = field.worldSize / 2;

    if (wx >= -halfWorld && wx <= halfWorld && wy >= -halfWorld && wy <= halfWorld) {
      const normI = ((wx + halfWorld) / field.worldSize) * field.segments;
      const normJ = ((wy + halfWorld) / field.worldSize) * field.segments;

      const i = Math.max(0, Math.min(field.segments, Math.round(normI)));
      const j = Math.max(0, Math.min(field.segments, Math.round(normJ)));
      const idx = j * (field.segments + 1) + i;

      const elev = field.elevations[idx];

      const step = field.step;
      const hRight = field.elevations[j * (field.segments + 1) + Math.min(field.segments, i + 1)];
      const hTop = field.elevations[Math.min(field.segments, j + 1) * (field.segments + 1) + i];
      const dzdx = (hRight - elev) / step;
      const dzdy = (hTop - elev) / step;
      const slopeDeg = Math.round((Math.atan(Math.hypot(dzdx, dzdy)) * 180) / Math.PI);

      setHoveredPos({ x: wx, y: wy, elevation: elev, slope: slopeDeg });
      if (onHoverElevation) onHoverElevation(elev);
    } else {
      setHoveredPos(null);
      if (onHoverElevation) onHoverElevation(null);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.max(0.6, Math.min(5.0, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setDrawPointA(null);
    setInteractionMode('explore');
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${field.terrainKey}_contour_map.png`;
    a.click();
  };

  return (
    <div
      id="contour-map-view-container"
      className="flex flex-col h-full w-full bg-slate-900/90 text-white select-none overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">{field.terrainKey} 정밀 등고선도</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-medium border border-cyan-500/30">
                2D DEM
              </span>
            </div>
            {!isCompact && (
              <p className="text-[10px] text-slate-400">
                주곡선 {contourData.indexInterval.toFixed(1)}m • 계곡선 {contourData.stepInterval.toFixed(1)}m
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {onOpenReadingGuide && (
            <button
              onClick={onOpenReadingGuide}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1"
              title="독도법 5대 원칙 및 퀴즈 열기"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>독도법 가이드</span>
            </button>
          )}

          <button
            onClick={handleExportPNG}
            className="p-1.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            title="등고선 지도 PNG 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            title="화면 배율 및 위치 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              title="닫기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Control Ribbon (Background, Density, Cut Tool, Profile Drawer Toggle) */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 text-xs">
        {/* Tool: Cross-Section Cut Line Tool */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => {
              if (interactionMode === 'crossSection') {
                setInteractionMode('explore');
                setDrawPointA(null);
              } else {
                setInteractionMode('crossSection');
                setDrawPointA(null);
              }
            }}
            className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-all flex items-center gap-1.5 ${
              interactionMode === 'crossSection'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-cyan-300'
            }`}
            title="지도 위를 클릭하여 새로운 단면도 절단선(A-B)을 그립니다."
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {interactionMode === 'crossSection'
                ? drawPointA
                  ? '도착점 B 클릭'
                  : '시작점 A 클릭'
                : '단면도 절단선 그리기'}
            </span>
          </button>

          {activeCrossSectionLine && (
            <button
              onClick={() => setShowProfileDrawer(!showProfileDrawer)}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors flex items-center gap-1 ${
                showProfileDrawer
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
              title="지형 횡단면도 패널 보이기/숨기기"
            >
              <span>단면도</span>
              {showProfileDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Background Mode Selector */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          {(['natural', 'hypsometric', 'paper', 'dark'] as BackgroundMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setBgMode(mode)}
              className={`px-2 py-0.5 text-[11px] rounded font-medium transition-all ${
                bgMode === mode
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {mode === 'natural' ? '지형' : mode === 'hypsometric' ? '채색' : mode === 'paper' ? '지적' : '다크'}
            </button>
          ))}
        </div>

        {/* Contour Density / Interval Selector */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          <span className="text-[10px] text-slate-400 px-1 font-medium">간격:</span>
          {[
            { label: '0.5x', val: 0.5 },
            { label: '1.0x', val: 1.0 },
            { label: '2.0x', val: 2.0 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setIntervalMultiplier(item.val)}
              className={`px-2 py-0.5 text-[11px] rounded font-medium transition-all ${
                intervalMultiplier === item.val
                  ? 'bg-sky-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive 2D Canvas Area */}
      <div className="relative flex-1 min-h-[280px] w-full rounded-xl overflow-hidden border border-white/10 bg-slate-950">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`w-full h-full touch-none ${
            interactionMode === 'crossSection' ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
          }`}
        />

        {/* Drawing Mode Guide Badge */}
        {interactionMode === 'crossSection' && (
          <div className="absolute left-3 top-3 z-10 bg-cyan-950/90 border border-cyan-500/80 px-3 py-1.5 rounded-lg text-cyan-200 text-xs font-semibold shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>
              {drawPointA
                ? '지도 위의 원하는 지점을 클릭하여 도착점(B)을 지정하세요.'
                : '단면도 절단선의 시작점(A)을 클릭하세요.'}
            </span>
          </div>
        )}

        {/* Live Pinpoint HUD Box */}
        {hoveredPos && interactionMode === 'explore' && (
          <div className="absolute left-3 top-3 bg-slate-900/90 backdrop-blur-md border border-sky-400/40 px-3 py-2 rounded-lg text-white shadow-xl pointer-events-none flex items-center gap-3">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">표고 (Elevation)</div>
              <div className="text-sm font-black text-amber-300">
                {hoveredPos.elevation >= 0 ? '+' : ''}
                {hoveredPos.elevation.toFixed(2)}m
              </div>
            </div>
            <div className="w-[1px] h-6 bg-white/20" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">사면 경사</div>
              <div className="text-sm font-bold text-sky-300">
                {hoveredPos.slope}° {hoveredPos.slope > 30 ? '(급경사)' : hoveredPos.slope > 15 ? '(완경사)' : '(평탄)'}
              </div>
            </div>
          </div>
        )}

        {/* Zoom Controls Overlay */}
        <div className="absolute right-3 bottom-3 flex flex-col gap-1">
          <button
            onClick={() => setZoom((prev) => Math.min(4.5, prev * 1.2))}
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-white/20 shadow-lg transition-colors"
            title="확대"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.6, prev / 1.2))}
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-white/20 shadow-lg transition-colors"
            title="축소"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Docked Elevation Profile Chart (Phase 4) */}
      {showProfileDrawer && activeCrossSectionLine && (
        <div className="mt-2 shrink-0 animate-in slide-in-from-bottom duration-200">
          <ElevationProfileChart
            field={field}
            line={activeCrossSectionLine}
            hoverSample={null}
            onHoverSample={onCrossSectionHover}
            onSelectPreset={(preset: CrossSectionPreset) => {
              updateLine({ p1: preset.p1, p2: preset.p2 });
            }}
            isCompact={isCompact}
          />
        </div>
      )}
    </div>
  );
};

function getHypsometricRGB(t: number): [number, number, number] {
  if (t < 0.25) {
    const k = t / 0.25;
    return [Math.round(46 + k * 40), Math.round(117 + k * 60), Math.round(89 - k * 30)];
  } else if (t < 0.5) {
    const k = (t - 0.25) / 0.25;
    return [Math.round(86 + k * 120), Math.round(177 + k * 10), Math.round(59 - k * 20)];
  } else if (t < 0.75) {
    const k = (t - 0.5) / 0.25;
    return [Math.round(206 + k * 25), Math.round(187 - k * 80), Math.round(39 + k * 30)];
  } else {
    const k = (t - 0.75) / 0.25;
    return [Math.round(231 + k * 24), Math.round(107 + k * 140), Math.round(69 + k * 186)];
  }
}
