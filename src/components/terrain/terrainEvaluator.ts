import * as THREE from 'three';
import { evalVolcanicTerrain } from './generators/volcanic';
import { evalCoastalTerrain } from './generators/coastal';
import { evalFluvialTerrain } from './generators/fluvial';
import { evalKarstTerrain } from './generators/karst';
import { evalGlacialTerrain } from './generators/glacial';
import { evalAridTerrain } from './generators/arid';
import { fbm, TerrainEvalResult } from './terrainMath';

const CATEGORY_EVALUATORS = [
  evalVolcanicTerrain,
  evalCoastalTerrain,
  evalFluvialTerrain,
  evalKarstTerrain,
  evalGlacialTerrain,
  evalAridTerrain,
] as const;

export function evaluateTerrainPoint(
  normSub: string,
  x: number,
  y: number,
  reliefScale = 1.0
): TerrainEvalResult {
  for (const evaluate of CATEGORY_EVALUATORS) {
    const result = evaluate(normSub, x, y, reliefScale);
    if (result) return result;
  }

  // Generic fallback mountain landscape
  const h = fbm(x * 0.6, y * 0.6) * 3.0 * reliefScale;
  return { height: h, color: new THREE.Color('#666666') };
}
