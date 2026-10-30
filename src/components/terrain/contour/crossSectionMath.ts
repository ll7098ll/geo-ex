import {
  TerrainElevationField,
  CrossSectionResult,
  CrossSectionSample,
} from '../../../types/contour';

/**
 * DEM 표고 필드에서 임의의 (x, y) 좌표 표고를 쌍선형 보간(Bilinear Interpolation)으로 고속 계산
 * x, y 범위: [-worldSize/2, worldSize/2]
 */
export function getElevationAt(
  field: TerrainElevationField,
  x: number,
  y: number
): number {
  const { worldSize, segments, elevations } = field;
  const halfSize = worldSize / 2;

  // Clamp within boundary
  const cx = Math.max(-halfSize, Math.min(halfSize, x));
  const cy = Math.max(-halfSize, Math.min(halfSize, y));

  // Normalized grid floating coordinates [0, segments]
  const gx = ((cx + halfSize) / worldSize) * segments;
  const gy = ((cy + halfSize) / worldSize) * segments;

  const i0 = Math.min(segments - 1, Math.floor(gx));
  const j0 = Math.min(segments - 1, Math.floor(gy));
  const i1 = i0 + 1;
  const j1 = j0 + 1;

  const fx = gx - i0;
  const fy = gy - j0;

  const rowStride = segments + 1;
  const h00 = elevations[j0 * rowStride + i0];
  const h10 = elevations[j0 * rowStride + i1];
  const h01 = elevations[j1 * rowStride + i0];
  const h11 = elevations[j1 * rowStride + i1];

  // Bilinear interpolation
  const top = h00 * (1 - fx) + h10 * fx;
  const bottom = h01 * (1 - fx) + h11 * fx;

  return top * (1 - fy) + bottom * fy;
}

/**
 * 시작점 P1(x1, y1)과 끝점 P2(x2, y2) 사이를 N등분하여 지형 단면도(Elevation Profile) 데이터 생성
 * 수평 거리, 고도 곡선, 국소 경사도(Slope angle in degrees) 정밀 산출
 */
export function computeCrossSection(
  field: TerrainElevationField,
  p1: [number, number],
  p2: [number, number],
  numSamples = 100
): CrossSectionResult {
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const totalWorldDist = Math.hypot(dx, dy);

  // 1 unit in diorama space is mapped to ~100m in real-world educational scale
  const metersPerUnit = 100;
  const totalDistance = Math.max(1, totalWorldDist * metersPerUnit);

  const samples: CrossSectionSample[] = [];

  let minElevation = Infinity;
  let maxElevation = -Infinity;

  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    const elevation = getElevationAt(field, x, y);
    const distance = t * totalDistance;

    if (elevation < minElevation) minElevation = elevation;
    if (elevation > maxElevation) maxElevation = elevation;

    samples.push({
      t,
      x,
      y,
      elevation,
      distance,
      slopeAngle: 0, // calculated in second pass
    });
  }

  // Second pass: Calculate local slope angles
  let maxSlopeAngle = 0;
  let slopeSum = 0;

  for (let i = 0; i < samples.length; i++) {
    const prev = samples[Math.max(0, i - 1)];
    const next = samples[Math.min(samples.length - 1, i + 1)];
    const distDelta = Math.max(0.1, next.distance - prev.distance);
    const elevDelta = next.elevation - prev.elevation;

    // Slope angle theta = arctan(|dh| / dd)
    const angleRad = Math.atan2(Math.abs(elevDelta), distDelta);
    const angleDeg = parseFloat(((angleRad * 180) / Math.PI).toFixed(1));

    samples[i].slopeAngle = angleDeg;
    if (angleDeg > maxSlopeAngle) maxSlopeAngle = angleDeg;
    slopeSum += angleDeg;
  }

  const avgSlopeAngle = parseFloat((slopeSum / samples.length).toFixed(1));
  const reliefDelta = parseFloat((maxElevation - minElevation).toFixed(2));

  return {
    p1,
    p2,
    totalDistance: Math.round(totalDistance),
    minElevation: parseFloat(minElevation.toFixed(2)),
    maxElevation: parseFloat(maxElevation.toFixed(2)),
    reliefDelta,
    maxSlopeAngle,
    avgSlopeAngle,
    samples,
  };
}
