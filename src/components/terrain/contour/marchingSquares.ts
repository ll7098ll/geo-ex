import { TerrainElevationField, ContourIntervalSettings } from '../../../types/contour';

export interface ContourSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ContourPath {
  elevation: number;
  isIndex: boolean;
  segments: ContourSegment[];
  /** Continuous polyline points for label placement and hachure drawing */
  polylines: [number, number][][];
  isDepression?: boolean;
}

export interface ContourDataset {
  fieldKey: string;
  minElevation: number;
  maxElevation: number;
  stepInterval: number;
  indexInterval: number;
  contours: ContourPath[];
}

/**
 * Fast Marching Squares implementation operating on normalized elevation grid
 */
export function extractContours(
  field: TerrainElevationField,
  customStepInterval?: number,
  customIndexInterval?: number
): ContourDataset {
  const { segments, elevations, minElevation, maxElevation, worldSize, contourSettings, features } = field;
  const numVertsX = segments + 1;
  const halfSize = worldSize / 2;
  const cellSize = worldSize / segments;

  const stepInterval = customStepInterval ?? contourSettings.intermediateInterval;
  const indexInterval = customIndexInterval ?? contourSettings.indexInterval;

  // Determine levels to extract
  const startLevel = Math.ceil(minElevation / stepInterval) * stepInterval;
  const levels: number[] = [];
  for (let l = startLevel; l <= maxElevation; l += stepInterval) {
    // avoid float precision issues
    const rounded = Math.round(l * 1000) / 1000;
    if (rounded >= minElevation && rounded <= maxElevation) {
      levels.push(rounded);
    }
  }

  // Pre-check depression zones from metadata (e.g. crater, sinkhole)
  const depressionPoints = features
    .filter((f) => f.hasHachures || f.type === 'crater' || f.type === 'sinkhole' || f.type === 'depression_zone')
    .flatMap((f) => f.points);

  const contourPaths: ContourPath[] = [];

  for (const h of levels) {
    // Check if this level is an index contour (multiples of indexInterval)
    const ratio = Math.abs(h / indexInterval);
    const isIndex = Math.abs(ratio - Math.round(ratio)) < 0.05;

    const segmentsList: ContourSegment[] = [];

    // Traverse grid cells
    for (let j = 0; j < segments; j++) {
      const y0 = -halfSize + j * cellSize;
      const y1 = y0 + cellSize;

      for (let i = 0; i < segments; i++) {
        const x0 = -halfSize + i * cellSize;
        const x1 = x0 + cellSize;

        // Vertex elevations
        // 0: bottom-left (i, j)
        // 1: bottom-right (i+1, j)
        // 2: top-right (i+1, j+1)
        // 3: top-left (i, j+1)
        const v0 = elevations[j * numVertsX + i];
        const v1 = elevations[j * numVertsX + (i + 1)];
        const v2 = elevations[(j + 1) * numVertsX + (i + 1)];
        const v3 = elevations[(j + 1) * numVertsX + i];

        let caseIndex = 0;
        if (v0 >= h) caseIndex |= 1;
        if (v1 >= h) caseIndex |= 2;
        if (v2 >= h) caseIndex |= 4;
        if (v3 >= h) caseIndex |= 8;

        if (caseIndex === 0 || caseIndex === 15) continue;

        // Linear interpolation points along 4 cell edges:
        // Edge 0: bottom (v0 -> v1), along y0
        // Edge 1: right (v1 -> v2), along x1
        // Edge 2: top (v3 -> v2), along y1
        // Edge 3: left (v0 -> v3), along x0
        const getP0 = (): [number, number] => {
          const t = Math.abs(v1 - v0) < 1e-6 ? 0.5 : (h - v0) / (v1 - v0);
          return [x0 + t * (x1 - x0), y0];
        };
        const getP1 = (): [number, number] => {
          const t = Math.abs(v2 - v1) < 1e-6 ? 0.5 : (h - v1) / (v2 - v1);
          return [x1, y0 + t * (y1 - y0)];
        };
        const getP2 = (): [number, number] => {
          const t = Math.abs(v2 - v3) < 1e-6 ? 0.5 : (h - v3) / (v2 - v3);
          return [x0 + t * (x1 - x0), y1];
        };
        const getP3 = (): [number, number] => {
          const t = Math.abs(v3 - v0) < 1e-6 ? 0.5 : (h - v0) / (v3 - v0);
          return [x0, y0 + t * (y1 - y0)];
        };

        switch (caseIndex) {
          case 1: // v0 >= h (edge 3 to edge 0)
          case 14: {
            const pA = getP3();
            const pB = getP0();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            break;
          }
          case 2: // v1 >= h (edge 0 to edge 1)
          case 13: {
            const pA = getP0();
            const pB = getP1();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            break;
          }
          case 3: // v0, v1 >= h (edge 3 to edge 1)
          case 12: {
            const pA = getP3();
            const pB = getP1();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            break;
          }
          case 4: // v2 >= h (edge 1 to edge 2)
          case 11: {
            const pA = getP1();
            const pB = getP2();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            break;
          }
          case 5: {
            // Saddle point case: v0, v2 >= h
            const pA = getP3();
            const pB = getP2();
            const pC = getP0();
            const pD = getP1();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            segmentsList.push({ x1: pC[0], y1: pC[1], x2: pD[0], y2: pD[1] });
            break;
          }
          case 6: // v1, v2 >= h (edge 0 to edge 2)
          case 9: {
            const pA = getP0();
            const pB = getP2();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            break;
          }
          case 7: // v0, v1, v2 >= h (edge 3 to edge 2)
          case 8: {
            const pA = getP3();
            const pB = getP2();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            break;
          }
          case 10: {
            // Saddle point case: v1, v3 >= h
            const pA = getP0();
            const pB = getP3();
            const pC = getP1();
            const pD = getP2();
            segmentsList.push({ x1: pA[0], y1: pA[1], x2: pB[0], y2: pB[1] });
            segmentsList.push({ x1: pC[0], y1: pC[1], x2: pD[0], y2: pD[1] });
            break;
          }
        }
      }
    }

    if (segmentsList.length === 0) continue;

    // Stitch segments into polylines for smooth rendering and label placement
    const polylines = stitchSegments(segmentsList);

    // Check depression property: if any polyline surrounds a depression point
    let isDepression = false;
    if (depressionPoints.length > 0) {
      for (const poly of polylines) {
        if (poly.length >= 8) {
          for (const [dpX, dpY] of depressionPoints) {
            if (isPointInPolygon(dpX, dpY, poly)) {
              isDepression = true;
              break;
            }
          }
        }
        if (isDepression) break;
      }
    }

    contourPaths.push({
      elevation: h,
      isIndex,
      segments: segmentsList,
      polylines,
      isDepression,
    });
  }

  return {
    fieldKey: field.terrainKey,
    minElevation,
    maxElevation,
    stepInterval,
    indexInterval,
    contours: contourPaths,
  };
}

/**
 * Stitch arbitrary line segments into ordered polylines
 */
function stitchSegments(segments: ContourSegment[], tolerance = 0.08): [number, number][][] {
  const remaining = [...segments];
  const polylines: [number, number][][] = [];

  while (remaining.length > 0) {
    const first = remaining.pop()!;
    const line: [number, number][] = [
      [first.x1, first.y1],
      [first.x2, first.y2],
    ];

    let extended = true;
    while (extended) {
      extended = false;
      const head = line[0];
      const tail = line[line.length - 1];

      for (let i = remaining.length - 1; i >= 0; i--) {
        const seg = remaining[i];
        // Check tail match
        if (distSq(tail[0], tail[1], seg.x1, seg.y1) < tolerance * tolerance) {
          line.push([seg.x2, seg.y2]);
          remaining.splice(i, 1);
          extended = true;
          break;
        } else if (distSq(tail[0], tail[1], seg.x2, seg.y2) < tolerance * tolerance) {
          line.push([seg.x1, seg.y1]);
          remaining.splice(i, 1);
          extended = true;
          break;
        }
        // Check head match
        else if (distSq(head[0], head[1], seg.x2, seg.y2) < tolerance * tolerance) {
          line.unshift([seg.x1, seg.y1]);
          remaining.splice(i, 1);
          extended = true;
          break;
        } else if (distSq(head[0], head[1], seg.x1, seg.y1) < tolerance * tolerance) {
          line.unshift([seg.x2, seg.y2]);
          remaining.splice(i, 1);
          extended = true;
          break;
        }
      }
    }

    if (line.length >= 2) {
      polylines.push(line);
    }
  }

  return polylines;
}

function distSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return dx * dx + dy * dy;
}

function isPointInPolygon(x: number, y: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
