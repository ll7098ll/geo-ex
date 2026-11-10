import { TerrainElevationField } from '../../../types/contour';
import {
  evaluateTerrainPoint,
  resolveTerrainKey,
} from '../terrainGenerators';
import { getTerrainContourMeta } from './terrainContourMetadata';

// Cache to prevent re-allocating DEM arrays on every render frame
const DEM_CACHE: Map<string, TerrainElevationField> = new Map();

/**
 * 표준 수치표고모델(DEM) 표고 필드 생성기
 * 고해상도(기본 240x240) 고도 행렬 및 버텍스 색상, 등고선 메타데이터를 정규화하여 반환
 */
export function generateTerrainElevationField(
  category: string,
  subTerrain: string,
  reliefScale = 1.0,
  evolutionStage = 4,
  segments = 240,
  worldSize = 20,
  placeContext?: string
): TerrainElevationField {
  const normSub = resolveTerrainKey(subTerrain, placeContext);
  const cacheKey = `${category}-${normSub}-${reliefScale.toFixed(2)}-stage:${evolutionStage}-seg:${segments}`;

  const cached = DEM_CACHE.get(cacheKey);
  if (cached) {
    return cached;
  }

  const halfSize = worldSize / 2;
  const step = worldSize / segments;
  const numGridVerts = (segments + 1) * (segments + 1);

  const stageMorph =
    evolutionStage === 1 ? 0.45 : evolutionStage === 2 ? 0.7 : evolutionStage === 3 ? 0.88 : 1.0;
  const effectiveRelief = reliefScale * stageMorph;

  const elevations = new Float32Array(numGridVerts);
  const colors = new Float32Array(numGridVerts * 3);

  let minElevation = Infinity;
  let maxElevation = -Infinity;

  let idx = 0;
  for (let j = 0; j <= segments; j++) {
    const y = -halfSize + j * step;
    for (let i = 0; i <= segments; i++) {
      const x = -halfSize + i * step;

      const evalResult = evaluateTerrainPoint(normSub, category, x, y, effectiveRelief);
      const h = evalResult.height;

      elevations[idx] = h;
      colors[idx * 3] = evalResult.color.r;
      colors[idx * 3 + 1] = evalResult.color.g;
      colors[idx * 3 + 2] = evalResult.color.b;

      if (h < minElevation) minElevation = h;
      if (h > maxElevation) maxElevation = h;

      idx++;
    }
  }

  const reliefRange = maxElevation - minElevation;
  const meta = getTerrainContourMeta(normSub);

  const field: TerrainElevationField = {
    terrainKey: normSub,
    category,
    segments,
    worldSize,
    step,
    elevations,
    colors,
    minElevation,
    maxElevation,
    reliefRange,
    contourSettings: meta.contourSettings,
    features: meta.features,
    contourReadingTips: meta.contourReadingTips,
    crossSectionPresets: meta.crossSectionPresets || [],
  };

  if (DEM_CACHE.size > 20) {
    const firstKey = DEM_CACHE.keys().next().value;
    if (firstKey) DEM_CACHE.delete(firstKey);
  }
  DEM_CACHE.set(cacheKey, field);

  return field;
}
