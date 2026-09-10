import * as THREE from 'three';

// ==========================================
// Math & Procedural Noise Helpers
// ==========================================
export const random = (x: number, y: number) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
};

export const noise = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);
  const a = random(ix, iy);
  const b = random(ix + 1, iy);
  const c = random(ix, iy + 1);
  const d = random(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy * (1.0 - ux) + (d - b) * ux * uy;
};

export const fbm = (x: number, y: number, octaves = 5) => {
  let v = 0;
  let a = 0.5;
  let shift = 100.0;
  for (let i = 0; i < octaves; i++) {
    v += a * noise(x, y);
    x = x * 2.0 + shift;
    y = y * 2.0 + shift;
    a *= 0.5;
  }
  return v;
};

export const warpedFbm = (x: number, y: number, octaves = 4) => {
  const wx = fbm(x + 1.7, y + 9.2, 3);
  const wy = fbm(x + 8.3, y + 2.8, 3);
  return fbm(x + 3.0 * wx, y + 3.0 * wy, octaves);
};

export const hexVoronoi = (x: number, y: number) => {
  const hx = x * (2.0 / Math.sqrt(3));
  const hy = y;
  const ix = Math.floor(hx);
  const iy = Math.floor(hy);
  let minDist = 10.0;
  let cellId = 0;
  let cellCenterX = 0;
  let cellCenterY = 0;

  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const px = ix + i;
      const py = iy + j;
      const jx = px + random(px, py) * 0.12;
      const jy = py + random(px + 7.1, py + 3.4) * 0.12;
      const dx = hx - jx;
      const dy = hy - jy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) {
        minDist = d;
        cellId = random(px * 13, py * 37);
        cellCenterX = jx;
        cellCenterY = jy;
      }
    }
  }
  return { dist: minDist, cellId, cellCenterX, cellCenterY };
};

export const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const mixColor = (c1: string, c2: string, t: number) => {
  const color1 = new THREE.Color(c1);
  const color2 = new THREE.Color(c2);
  color1.lerp(color2, clamp(t, 0, 1));
  return color1;
};

// Normalize and canonicalize terrain name
export const normalizeTerrainName = (name: string): string => {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
};

export const resolveTerrainKey = (name: string): string => {
  const norm = normalizeTerrainName(name);
  if (norm.includes('오름') || norm.includes('기생화산')) return '기생화산';
  if (norm.includes('사주') || norm.includes('사취')) return '사주·사취';
  if (norm.includes('석호')) return '석호';
  if (norm.includes('파식대')) return '파식대';
  if (norm.includes('해식애')) return '해식애';
  if (norm.includes('시스택')) return '시스택';
  if (norm.includes('해안 사구') || (norm.includes('사구') && !norm.includes('사막'))) return '해안 사구';
  if (norm.includes('감입곡류') || norm.includes('곡류')) return '곡류천';
  if (norm.includes('범람원')) return '범람원';
  if (norm.includes('선상지')) return '선상지';
  if (norm.includes('삼각주')) return '삼각주';
  if (norm.includes('하안단구')) return '하안단구';
  if (norm.includes('폭포')) return '폭포';
  if (norm.includes('석회동굴')) return '석회동굴';
  if (norm.includes('돌리네')) return '돌리네';
  if (norm.includes('카렌')) return '카렌';
  if (norm.includes('탑 카르스트') || norm.includes('탑카르스트')) return '탑 카르스트';
  if (norm.includes('U자곡') || norm.includes('유자곡')) return 'U자곡';
  if (norm.includes('피오르드')) return '피오르드';
  if (norm.includes('혼') || norm.includes('호른')) return '혼';
  if (norm.includes('권곡') || norm.includes('카르')) return '권곡';
  if (norm.includes('모레인') || norm.includes('빙퇴석')) return '모레인';
  if (norm.includes('메사') || norm.includes('뷰트')) return '메사·뷰트';
  if (norm.includes('와디')) return '와디';
  if (norm.includes('버섯바위')) return '버섯바위';
  if (norm.includes('오아시스')) return '오아시스';
  if (norm.includes('플라야')) return '플라야';
  if (norm.includes('사막')) return '사막';
  if (norm.includes('주상절리')) return '주상절리';
  if (norm.includes('용암동굴')) return '용암동굴';
  if (norm.includes('칼데라')) return '칼데라';
  if (norm.includes('단층 산맥') || norm.includes('단층')) return '단층 산맥';
  if (norm.includes('갯벌')) return '갯벌';
  if (norm.includes('화산')) return '화산';
  return norm;
};

// ==========================================
// Terrain Height & Vertex Color Evaluator
// ==========================================
export interface TerrainEvalResult {
  height: number;
  color: THREE.Color;
}

export function evaluateTerrainPoint(
  normSub: string,
  category: string,
  x: number,
  y: number,
  reliefScale = 1.0
): TerrainEvalResult {
  let h = 0;
  const d = Math.sqrt(x * x + y * y);
  const angle = Math.atan2(y, x);
  const color = new THREE.Color();

  // =====================================
  // 1. VOLCANIC
  // =====================================
  if (normSub === '기생화산') {
    // Classic Jeju Cinder Cone (Oreum) with 30-degree scoria slopes & circular summit crater lake
    const coneR = 7.5;
    const coneH = Math.max(0, 4.6 * (1.0 - Math.pow(d / coneR, 1.3)));
    
    // Deep crater bowl at the summit (금오름 / 다랑쉬오름 분화구)
    const craterR = 2.4;
    const craterDepth = d < craterR ? smoothstep(craterR, 0, d) * 2.8 : 0;
    
    // Horseshoe breach (말굽형 분화구 유출 틈새, 용암이 빠져나간 골짜기)
    const breachAngle = Math.atan2(y - 1.0, x - 2.5);
    const isBreach = Math.abs(breachAngle - 0.4) < 0.6 && d > 1.8 && d < 6.0;
    const breachCut = isBreach ? 1.2 * smoothstep(0.6, 0, Math.abs(breachAngle - 0.4)) : 0;
    
    // Scoria scree ribs
    const oreumRibs = Math.abs(Math.sin(angle * 5 + fbm(x * 0.5, y * 0.5) * 1.5)) * 0.25 * smoothstep(2.0, 6.5, d);
    
    h = Math.max(0.35, (coneH - craterDepth - breachCut + oreumRibs + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale);
    
    if (d < 1.1) {
      // Crater bottom wetland / crater lake bed (분화구 습지/화구호)
      color.set(mixColor('#1b382d', '#285444', fbm(x * 5, y * 5)));
    } else if (d < craterR + 0.6) {
      // Crater inner walls: dark red-brown scoria (송이석) and dark basalt
      color.set(mixColor('#542b1f', '#38160e', fbm(x * 6, y * 6)));
    } else if (h > 2.8 * reliefScale) {
      // Summit ridge: golden silver-grass (억새) & low shrubs
      color.set(mixColor('#7a8543', '#969950', fbm(x * 3, y * 3)));
    } else {
      // Slopes: green grassland (초원)
      color.set(mixColor('#385e2b', '#4c7a3a', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '화산') {
    // Grand stratovolcano with exponential cone + summit crater + radiating barrancos
    const cone = 5.4 * Math.exp(-d * 0.32);
    const craterR = 1.9;
    const crater = d < craterR ? smoothstep(craterR, 0, d) * 2.8 : 0;
    
    // Radial barrancos (fluvial ravines carved on volcano flanks)
    const barrancos = Math.abs(Math.sin(angle * 6 + fbm(x * 0.4, y * 0.4) * 2.0)) * 0.38 * smoothstep(1.5, 7.5, d);
    
    // Parasitic scoria cones (오름) on flanks
    const pc1 = Math.exp(-(Math.pow(x - 4.5, 2) + Math.pow(y - 2.0, 2)) * 0.8) * 1.5;
    const pc2 = Math.exp(-(Math.pow(x + 3.5, 2) + Math.pow(y + 3.0, 2)) * 1.0) * 1.2;

    h = (cone - crater + barrancos + pc1 + pc2 + fbm(x * 1.5, y * 1.5, 3) * 0.25) * reliefScale;

    if (d < 1.5) {
      // Deep inside crater: black volcanic rock & sulfur vents
      color.set(mixColor('#1f0d06', '#331206', fbm(x * 6, y * 6)));
    } else if (h > 3.8 * reliefScale) {
      // Summit volcanic ash & basalt scree
      color.set(mixColor('#382f28', '#25201b', fbm(x * 4, y * 4)));
    } else if (h > 1.8 * reliefScale) {
      // Mid-slope: sparse mountain vegetation & basalt scree
      color.set(mixColor('#4d5830', '#3b3226', fbm(x * 3, y * 3)));
    } else {
      // Base: lush sub-volcanic forest
      color.set(mixColor('#2d4722', '#3a5a2b', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '칼데라') {
    // Circular outer rim ridge with vast sunken caldera basin inside + central resurgent dome
    const rimR = 6.2;
    const distToRim = Math.abs(d - rimR);
    const rimHeight = Math.exp(-Math.pow(distToRim / 1.5, 2)) * 4.6;
    
    if (d < rimR) {
      // Sunken basin floor around height 0.6
      const basin = 0.6 + Math.exp(-Math.pow(d / 4.2, 2)) * 0.3;
      // Central resurgent dome (중앙화구구, e.g. Wizard Island / 알봉)
      const island = Math.exp(-(Math.pow(x - 1.8, 2) + Math.pow(y - 0.8, 2)) * 1.2) * 2.4;
      h = (basin + island + fbm(x * 2, y * 2) * 0.2) * reliefScale;
    } else {
      // Outer flank gently sloping down
      h = (rimHeight * 0.8 * Math.exp(-(d - rimR) * 0.3) + fbm(x * 1.5, y * 1.5) * 0.4) * reliefScale;
    }
    h += (rimHeight * 0.9) * reliefScale;

    if (d < rimR - 1.2) {
      // Basin floor / resurgent island
      if (h > 1.5 * reliefScale) color.set(mixColor('#5c6b42', '#3e4a2c', fbm(x * 4, y * 4)));
      else color.set(mixColor('#142a38', '#1c3d52', fbm(x * 3, y * 3)));
    } else if (distToRim < 1.8) {
      // Steep rim rocky walls
      color.set(mixColor('#4a433d', '#615850', fbm(x * 5, y * 5)));
    } else {
      // Outer green forest slopes
      color.set(mixColor('#345428', '#456b35', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '주상절리') {
    // Coastal hexagonal basalt prism terrace formation
    const { dist, cellId } = hexVoronoi(x * 1.5, y * 1.5);
    const jointGap = smoothstep(0.70, 0.95, dist);
    
    // Coastal edge dividing ocean and basalt plateau
    const coastX = fbm(y * 0.4, 0) * 1.8 - 0.8;
    
    if (x > coastX) {
      // Stepped quantized column height per cell!
      const quantizedH = 2.4 + cellId * 2.0;
      h = (quantizedH - jointGap * 0.9 + fbm(x * 0.8, y * 0.8) * 0.15) * reliefScale;
      
      // Dark basalt texture with mineral reflections
      if (jointGap > 0.4) color.set(mixColor('#0d0e10', '#18191c', fbm(x * 8, y * 8)));
      else color.set(mixColor('#2b2d30', '#3e4146', fbm(x * 4, y * 4) + cellId * 0.15));
    } else {
      // Sea floor under coastal surf
      h = (0.2 + fbm(x * 1.5, y * 1.5) * 0.3) * reliefScale;
      color.set(mixColor('#0a1e2d', '#102e44', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '용암동굴') {
    // Basaltic pahoehoe plain with an open collapsed lava tube trench & natural arch
    const tubeCurve = Math.sin(y * 0.4) * 2.5;
    const distToTube = Math.abs(x - tubeCurve);
    const isArch = Math.abs(y - 2.8) < 1.0;
    
    h = (2.2 + warpedFbm(x * 0.6, y * 0.6, 3) * 0.6) * reliefScale;
    
    if (distToTube < 1.6) {
      if (!isArch) {
        // Trench hollowed out revealing subterranean lava channel
        const trenchDepth = smoothstep(1.6, 0.2, distToTube) * 2.8;
        h -= trenchDepth * reliefScale;
        color.set(h < 0.5 * reliefScale ? mixColor('#18100c', '#0d0806', fbm(x * 6, y * 6)) : mixColor('#2a1e18', '#382820', fbm(x * 4, y * 4)));
      } else {
        // Natural basalt arch bridging across the trench
        color.set(mixColor('#3a2f26', '#4a3d32', fbm(x * 4, y * 4)));
      }
    } else {
      color.set(mixColor('#262320', '#38332c', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '단층 산맥') {
    // Tilted fault block: sheer vertical fault scarp cliff on one side, gentle dip slope on other
    const faultX = 0;
    if (x >= faultX) {
      // Gentle dip slope (완경사면)
      const dip = (x - faultX) / 10.0;
      h = (4.6 - dip * 3.6 + fbm(x * 0.8, y * 0.8) * 0.6) * reliefScale;
      color.set(mixColor('#385628', '#4b6e37', fbm(x * 2, y * 2)));
    } else {
      // Vertical fault scarp (단층애)
      const distToFault = faultX - x;
      if (distToFault < 0.85) {
        // Sheer cliff face with triangular facets
        h = (4.6 - distToFault * 4.6) * reliefScale;
        color.set(mixColor('#544d47', '#6e655c', fbm(x * 6, y * 6)));
      } else {
        // Graben valley floor
        h = (0.5 + fbm(x * 1.2, y * 1.2) * 0.3) * reliefScale;
        color.set(mixColor('#6e634d', '#7d7259', fbm(x * 3, y * 3)));
      }
    }
    if (h > 3.8 * reliefScale) color.set(mixColor('#827b74', '#9e9790', fbm(x * 4, y * 4)));
  }

  // =====================================
  // 2. COASTAL
  // =====================================
  else if (normSub === '갯벌') {
    // Intertidal mudflat with branching dendritic tidal channels (갯골)
    const slope = (1.0 - (x + 10) / 20.0) * 1.0;
    const creek1 = Math.abs(fbm(x * 0.35 + 2, y * 0.35, 3) - 0.5);
    const creek2 = Math.abs(fbm(x * 0.8 + 5, y * 0.8, 3) - 0.5);
    const channelCut = smoothstep(0.12, 0, creek1) * 0.65 + smoothstep(0.18, 0, creek2) * 0.35;
    
    h = Math.max(0.1, (slope - channelCut + 0.3) * reliefScale);
    
    if (channelCut > 0.15) {
      color.set(mixColor('#1f1914', '#15100c', fbm(x * 6, y * 6)));
    } else if (x > 5) {
      color.set(mixColor('#384d28', '#4b6436', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#473c33', '#3a312a', fbm(x * 5, y * 5)));
    }
  }
  else if (normSub === '해식애') {
    // Coastal plateau ending in vertical cliff + flat wave-cut platform below
    const cliffLine = fbm(y * 0.4, 0) * 2.0 - 0.5;
    
    if (x > cliffLine + 0.6) {
      h = (3.8 + fbm(x * 0.8, y * 0.8) * 0.5) * reliefScale;
      color.set(mixColor('#3c5e28', '#4f7535', fbm(x * 2, y * 2)));
    } else if (x >= cliffLine) {
      const cliffProgress = (x - cliffLine) / 0.6;
      h = (0.5 + cliffProgress * 3.3) * reliefScale;
      color.set(mixColor('#544f4a', '#6b645e', fbm(x * 6, y * 6)));
    } else {
      h = (0.35 + fbm(x * 2, y * 2) * 0.15) * reliefScale;
      color.set(mixColor('#303a42', '#1c2830', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '시스택') {
    // Sea with discrete vertical rock pillars & natural sea arch
    h = 0.3 * reliefScale;
    
    if (x < -5.5) {
      h = (3.5 - (x + 5.5) * 0.4 + fbm(x * 0.8, y * 0.8) * 0.5) * reliefScale;
      color.set(mixColor('#3a5428', '#4d6d37', fbm(x * 2, y * 2)));
    } else {
      const stacks = [
        { sx: 2.8, sy: -1.0, r: 1.5, h: 4.4 },
        { sx: 4.8, sy: 3.2, r: 1.2, h: 3.4 },
        { sx: -1.5, sy: 4.0, r: 1.0, h: 2.9 },
      ];
      for (const st of stacks) {
        const sd = Math.sqrt(Math.pow(x - st.sx, 2) + Math.pow(y - st.sy, 2));
        if (sd < st.r) {
          const stackShape = Math.cos((sd / st.r) * Math.PI * 0.5);
          h = Math.max(h, (0.4 + stackShape * st.h + fbm(x * 4, y * 4) * 0.3) * reliefScale);
        }
      }
      
      // Sea Arch
      const archDist = Math.sqrt(Math.pow(x - (-3.2), 2) + Math.pow(y - 1.5, 2));
      if (archDist < 1.9) {
        const archH = Math.cos((archDist / 1.9) * Math.PI * 0.5) * 3.5;
        if (archDist > 0.5) {
          h = Math.max(h, (archH + fbm(x * 3, y * 3) * 0.2) * reliefScale);
        }
      }

      if (h > 1.0 * reliefScale) {
        color.set(mixColor('#5c544d', '#786e65', fbm(x * 5, y * 5)));
      } else {
        color.set(mixColor('#0d2538', '#14364e', fbm(x * 2, y * 2)));
      }
    }
  }
  else if (normSub === '해안 사구') {
    // Coastal sand dunes: gentle windward slopes + steep slip faces
    const mainDune = Math.exp(-Math.pow((x - 1.0) / 2.5, 2)) * 3.3;
    const foreDune = Math.exp(-Math.pow((x + 4.5) / 2.0, 2)) * 2.1;
    const duneSlack = Math.exp(-Math.pow((x - 5.5) / 2.0, 2)) * 0.6;
    const windRipples = Math.sin(x * 4.0 - y * 1.5) * 0.08;
    
    h = Math.max(0.2, (mainDune + foreDune - duneSlack + windRipples + fbm(x * 0.8, y * 0.8) * 0.3) * reliefScale);
    
    if (x > 5.0) {
      color.set(mixColor('#5a783a', '#446028', fbm(x * 3, y * 3)));
    } else {
      color.set(mixColor('#d4b87c', '#e6cca0', fbm(x * 4, y * 4)));
    }
  }
  else if (normSub === '사주·사취') {
    // Sandspit & Tombolo connecting island to mainland
    const mainland = Math.exp(-(x + 7.5) * 0.6) * 3.0;
    const tiedIsland = Math.exp(-(Math.pow(x - 6.0, 2) + Math.pow(y - 4.0, 2)) * 0.3) * 3.8;
    const spitPath = -0.15 * Math.pow(x, 2) + 0.4 * x + 1.0;
    const distToSpit = Math.abs(y - spitPath);
    const spitRidge = (distToSpit < 1.6 && x > -6.5 && x < 5.5)
      ? Math.cos((distToSpit / 1.6) * Math.PI * 0.5) * 1.2
      : 0;

    h = Math.max(0.2, (mainland + tiedIsland + spitRidge + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale);

    if (spitRidge > 0.3) {
      color.set(mixColor('#e2cb91', '#f0deaf', fbm(x * 6, y * 6)));
    } else if (h > 1.8 * reliefScale) {
      color.set(mixColor('#4a5c37', '#635b50', fbm(x * 3, y * 3)));
    } else {
      color.set(mixColor('#0e2e42', '#184763', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '석호') {
    // Ocean -> Golden sand barrier spit -> Brackish lagoon basin -> Inland pine hills
    const barrierX = -2.5;
    const distToBarrier = Math.abs(x - barrierX);
    const isBarrier = distToBarrier < 1.4;
    const isTidalInlet = isBarrier && Math.abs(y - (-4.0)) < 1.2;
    const barrierHeight = (isBarrier && !isTidalInlet)
      ? Math.cos((distToBarrier / 1.4) * Math.PI * 0.5) * 1.5
      : 0;
    const inlandHills = x > 4.5 ? Math.exp((x - 4.5) * 0.4) * 0.8 + fbm(x * 0.8, y * 0.8) * 0.6 : 0;
    
    if (x < barrierX - 1.4) {
      h = (0.2 + fbm(x * 1.5, y * 1.5) * 0.15) * reliefScale;
      color.set(mixColor('#0a2436', '#123954', fbm(x * 3, y * 3)));
    } else if (isBarrier) {
      h = Math.max(0.3, (0.35 + barrierHeight + fbm(x * 2, y * 2) * 0.1) * reliefScale);
      if (isTidalInlet) {
        color.set(mixColor('#15425c', '#1d5573', fbm(x * 4, y * 4)));
      } else {
        color.set(mixColor('#dfc78d', '#eedcb0', fbm(x * 5, y * 5)));
      }
    } else if (x < 5.0) {
      h = (0.4 + fbm(x * 0.8, y * 0.8) * 0.12) * reliefScale;
      color.set(mixColor('#194a4f', '#246166', fbm(x * 3, y * 3)));
    } else {
      h = (1.2 + inlandHills) * reliefScale;
      color.set(mixColor('#38572d', '#4c733f', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '파식대') {
    // Extensive horizontal wave-cut rock platform exposed at low tide with bookstack cliffs
    const cliffLine = 3.5;
    
    if (x > cliffLine) {
      const cliffH = 4.4 + fbm(x * 0.8, y * 0.8) * 0.5;
      h = cliffH * reliefScale;
      const strata = Math.sin(y * 8.0 + h * 6.0) * 0.5 + 0.5;
      color.set(mixColor('#4a443e', '#736b63', strata));
    } else if (x > -6.0) {
      const jointFissures = (Math.sin(x * 3.5) * Math.cos(y * 3.0)) * 0.08;
      const tp1 = Math.exp(-(Math.pow(x + 3.0, 2) + Math.pow(y - 2.0, 2)) * 0.8) * 0.35;
      const tp2 = Math.exp(-(Math.pow(x + 0.5, 2) + Math.pow(y + 3.0, 2)) * 0.7) * 0.3;
      
      h = Math.max(0.35, (0.75 + jointFissures - tp1 - tp2 + fbm(x * 1.5, y * 1.5) * 0.08) * reliefScale);
      
      if (tp1 > 0.15 || tp2 > 0.15) {
        color.set(mixColor('#163b40', '#255259', fbm(x * 5, y * 5)));
      } else {
        color.set(mixColor('#3e4347', '#535b61', fbm(x * 4, y * 4)));
      }
    } else {
      h = (0.2 + fbm(x * 1.5, y * 1.5) * 0.15) * reliefScale;
      color.set(mixColor('#0a2133', '#11354f', fbm(x * 2, y * 2)));
    }
  }

  // =====================================
  // 3. FLUVIAL
  // =====================================
  else if (normSub === '선상지') {
    // Canyon mouth expanding into semicircular alluvial fan
    const apexY = -5.0;
    const fanDy = y - apexY;
    const fanDist = Math.sqrt(x * x + fanDy * fanDy);
    
    if (y < apexY) {
      h = (3.5 + Math.abs(x) * 0.6 - Math.exp(-x * x * 0.8) * 2.0 + fbm(x * 0.8, y * 0.8) * 0.8) * reliefScale;
      color.set(mixColor('#42453e', '#55584f', fbm(x * 3, y * 3)));
    } else {
      const fanSlope = Math.max(0, 3.2 - fanDist * 0.28);
      const fanAngle = Math.atan2(x, fanDy);
      const inFan = Math.abs(fanAngle) < 1.1 && fanDist < 12.0;
      const braided = Math.abs(Math.sin(fanAngle * 8.0 + fbm(x * 0.5, y * 0.5) * 3.0)) * 0.25;
      
      if (inFan) {
        h = Math.max(0.4, (fanSlope - braided + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale);
        if (fanDist < 4.0) {
          color.set(mixColor('#827668', '#998d7e', fbm(x * 6, y * 6)));
        } else if (fanDist > 9.0) {
          color.set(mixColor('#4a6e2e', '#5c843c', fbm(x * 3, y * 3)));
        } else {
          color.set(mixColor('#708a46', '#879e56', fbm(x * 4, y * 4)));
        }
      } else {
        h = (0.5 + fbm(x * 0.6, y * 0.6) * 0.3) * reliefScale;
        color.set(mixColor('#54733b', '#65844a', fbm(x * 2, y * 2)));
      }
    }
  }
  else if (normSub === '곡류천') {
    // Meandering river with cut banks, point bars, and cutoff oxbow lake
    const riverMeander = Math.sin(y * 0.55) * 3.8 + Math.sin(y * 0.2) * 1.5;
    const distToRiver = x - riverMeander;
    const curvature = -Math.sin(y * 0.55);
    const oxbowCenter = [-3.2, 2.5];
    const oxbowDist = Math.sqrt(Math.pow(x - oxbowCenter[0], 2) + Math.pow(y - oxbowCenter[1], 2));
    const inOxbow = Math.abs(oxbowDist - 1.8) < 0.65;
    
    h = (2.2 + fbm(x * 0.6, y * 0.6) * 0.4) * reliefScale;
    
    if (Math.abs(distToRiver) < 1.3) {
      h = (0.35 + fbm(x * 2, y * 2) * 0.1) * reliefScale;
      color.set(mixColor('#261f18', '#1a140e', fbm(x * 6, y * 6)));
    } else if (Math.abs(distToRiver) < 3.0) {
      if (distToRiver * curvature > 0) {
        h = (2.2 - smoothstep(1.3, 1.8, Math.abs(distToRiver)) * 1.8) * reliefScale;
        color.set(mixColor('#695745', '#7a6754', fbm(x * 4, y * 4)));
      } else {
        h = (2.2 - smoothstep(1.3, 3.0, Math.abs(distToRiver)) * 1.8) * reliefScale;
        color.set(mixColor('#d9c48f', '#ebd6a2', fbm(x * 5, y * 5)));
      }
    } else if (inOxbow) {
      h = 0.4 * reliefScale;
      color.set(mixColor('#1e3224', '#2a4432', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#3f612d', '#527a3c', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '범람원') {
    // Alluvial floodplain: river + natural levees on both banks + backswamps
    const riverPath = Math.sin(y * 0.45) * 3.5;
    const distToRiver = Math.abs(x - riverPath);
    const isLevee = distToRiver >= 1.2 && distToRiver < 3.2;
    const leveeHeight = isLevee ? Math.sin(((distToRiver - 1.2) / 2.0) * Math.PI) * 0.9 : 0;
    
    if (distToRiver < 1.2) {
      h = 0.35 * reliefScale;
      color.set(mixColor('#1f1812', '#140f0a', fbm(x * 6, y * 6)));
    } else if (isLevee) {
      h = (1.4 + leveeHeight + fbm(x * 1.5, y * 1.5) * 0.15) * reliefScale;
      color.set(mixColor('#829654', '#9eb06b', fbm(x * 4, y * 4)));
    } else {
      h = (0.75 + fbm(x * 0.8, y * 0.8) * 0.12) * reliefScale;
      color.set(mixColor('#2b4c34', '#3d6148', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '삼각주') {
    // River delta splitting into distributary branches entering the sea
    const riverMain = Math.abs(x - fbm(y * 0.3, 0) * 1.5);
    const ch1 = Math.abs(x - (y * 0.4 + 1.2));
    const ch2 = Math.abs(x - (-y * 0.4 - 1.2));
    const ch3 = Math.abs(x - (y * 0.7 + 3.0));
    const ch4 = Math.abs(x - (-y * 0.7 - 3.0));
    
    const isChannel = (y < -2 && riverMain < 1.2) ||
      (y >= -2 && (ch1 < 0.9 || ch2 < 0.9 || ch3 < 0.7 || ch4 < 0.7));

    const deltaFan = y > -2 ? Math.max(0, 1.2 - (y + 2) * 0.12 - Math.abs(x) * 0.12) : 1.4;
    
    if (isChannel) {
      h = 0.3 * reliefScale;
      color.set(mixColor('#211912', '#140f0a', fbm(x * 6, y * 6)));
    } else if (y > 6.0) {
      h = 0.2 * reliefScale;
      color.set(mixColor('#0e2b3d', '#133a52', fbm(x * 2, y * 2)));
    } else {
      h = (deltaFan + fbm(x * 1.2, y * 1.2) * 0.25) * reliefScale;
      color.set(mixColor('#3b5c2a', '#4d7537', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '하안단구') {
    // Step terraces dropping to incised river gorge
    const dist = Math.abs(x);
    
    if (dist < 1.2) {
      h = 0.4 * reliefScale;
      color.set(mixColor('#221c16', '#17120e', fbm(x * 6, y * 6)));
    } else if (dist < 3.2) {
      h = (1.5 + fbm(x * 1.2, y * 1.2) * 0.15) * reliefScale;
      color.set(mixColor('#486830', '#597c3c', fbm(x * 3, y * 3)));
    } else if (dist < 5.8) {
      h = (2.8 + fbm(x * 1.2, y * 1.2) * 0.15) * reliefScale;
      color.set(mixColor('#5a783e', '#6d8c4e', fbm(x * 3, y * 3)));
    } else {
      h = (4.2 + fbm(x * 1.2, y * 1.2) * 0.2) * reliefScale;
      color.set(mixColor('#6a864d', '#7c9a5d', fbm(x * 3, y * 3)));
    }
    
    if ((dist > 1.0 && dist < 1.5) || (dist > 3.0 && dist < 3.5) || (dist > 5.5 && dist < 6.0)) {
      color.set(mixColor('#63574c', '#75675a', fbm(x * 6, y * 6)));
    }
  }
  else if (normSub === '폭포') {
    // Plateau river dropping over sheer cliff into plunge pool and gorge
    const inRiver = Math.abs(x) < 1.4;
    
    if (y < -1.0) {
      h = (4.2 - (inRiver ? 0.6 : 0) + fbm(x * 0.8, y * 0.8) * 0.3) * reliefScale;
      color.set(inRiver ? mixColor('#32576b', '#416f87', fbm(x * 4, y * 4)) : mixColor('#3d5929', '#4f7236', fbm(x * 2, y * 2)));
    } else if (y <= 0.8) {
      const dropRatio = (y - (-1.0)) / 1.8;
      h = (4.2 - dropRatio * 3.4 - (inRiver ? 0.6 : 0)) * reliefScale;
      color.set(mixColor('#544c45', '#6b6158', fbm(x * 6, y * 6)));
    } else {
      const poolDist = Math.sqrt(x * x + Math.pow(y - 1.8, 2));
      const inPool = poolDist < 2.0;
      
      if (inPool) {
        h = 0.3 * reliefScale;
        color.set(mixColor('#1a3a47', '#285566', fbm(x * 4, y * 4)));
      } else if (inRiver && y > 1.8) {
        h = 0.5 * reliefScale;
        color.set(mixColor('#2b4959', '#386073', fbm(x * 4, y * 4)));
      } else {
        const gorgeWall = Math.min(3.2, Math.abs(x) * 1.2);
        h = (0.8 + gorgeWall + fbm(x * 0.8, y * 0.8) * 0.3) * reliefScale;
        color.set(mixColor('#59524a', '#435432', fbm(x * 3, y * 3)));
      }
    }
  }

  // =====================================
  // 4. KARST
  // =====================================
  else if (normSub === '석회동굴') {
    // Limestone karst landscape with cave entrance portal and sinkholes
    h = (3.4 + warpedFbm(x * 0.6, y * 0.6, 3) * 0.8) * reliefScale;
    const caveCenter = [0, 0];
    const caveDist = Math.sqrt(Math.pow(x - caveCenter[0], 2) + Math.pow(y - caveCenter[1], 2));
    
    if (caveDist < 2.8) {
      const caveDrop = Math.cos((caveDist / 2.8) * Math.PI * 0.5) * 3.6;
      h -= caveDrop * reliefScale;
      color.set(h < 1.0 * reliefScale ? mixColor('#0f0d0b', '#1a1612', fbm(x * 6, y * 6)) : mixColor('#635f59', '#7a756e', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#706f6b', '#5c634d', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '돌리네') {
    // Rolling limestone plateau with circular funnel sinkholes
    h = (3.2 + fbm(x * 0.5, y * 0.5) * 0.6) * reliefScale;
    const dolines = [
      { cx: 0, cy: 0, r: 3.2, depth: 2.5 },
      { cx: -4.5, cy: 3.5, r: 2.2, depth: 1.8 },
      { cx: 4.2, cy: -3.0, r: 2.5, depth: 2.0 },
    ];
    
    for (const dol of dolines) {
      const dd = Math.sqrt(Math.pow(x - dol.cx, 2) + Math.pow(y - dol.cy, 2));
      if (dd < dol.r) {
        const funnel = Math.cos((dd / dol.r) * Math.PI * 0.5) * dol.depth;
        h -= funnel * reliefScale;
        color.set(mixColor('#853b26', '#9c4832', fbm(x * 6, y * 6)));
      }
    }
    
    if (color.r < 0.4) {
      color.set(mixColor('#496632', '#5d7d42', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '탑 카르스트') {
    // Tower Karst: vertical monolithic towers rising out of flat plain/water
    h = 0.5 * reliefScale;
    const towers = [
      { tx: 0, ty: 0, r: 1.6, th: 4.8 },
      { tx: 4.2, ty: 2.8, r: 1.3, th: 4.0 },
      { tx: -4.0, ty: 3.5, r: 1.4, th: 4.3 },
      { tx: 4.5, ty: -3.2, r: 1.2, th: 3.6 },
      { tx: -3.8, ty: -3.8, r: 1.5, th: 4.5 },
    ];
    
    for (const tow of towers) {
      const td = Math.sqrt(Math.pow(x - tow.tx, 2) + Math.pow(y - tow.ty, 2));
      if (td < tow.r) {
        const towerShape = Math.exp(-Math.pow(td / (tow.r * 0.8), 6));
        h = Math.max(h, (0.5 + towerShape * tow.th + fbm(x * 3, y * 3) * 0.3) * reliefScale);
      }
    }

    if (h > 3.0 * reliefScale) {
      color.set(mixColor('#2b4d20', '#3b662d', fbm(x * 4, y * 4)));
    } else if (h > 0.8 * reliefScale) {
      color.set(mixColor('#696e6d', '#848a88', fbm(x * 5, y * 5)));
    } else {
      color.set(mixColor('#14453e', '#1c5e55', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '카렌') {
    // Sharp limestone pinnacles, solution flutes (Rinnen) and terra rossa clefts
    const fluteNoise = Math.sin(x * 2.8 + fbm(x * 0.5, y * 0.5) * 2.5) * 0.5 + 0.5;
    const { dist: cellDist, cellId } = hexVoronoi(x * 0.85, y * 0.85);
    const pinnacleProfile = Math.pow(Math.max(0, 1.0 - cellDist * 1.3), 2.2);
    const pinnacleHeight = 1.8 + cellId * 2.8;
    const microFlutes = Math.abs(Math.sin(y * 6.0 + x * 2.0)) * 0.35 * smoothstep(0.3, 0.9, pinnacleProfile);
    
    h = Math.max(0.4, (0.8 + pinnacleProfile * pinnacleHeight + microFlutes + fluteNoise * 0.3) * reliefScale);
    
    if (pinnacleProfile > 0.45) {
      color.set(mixColor('#7a7d80', '#9aa0a6', fbm(x * 6, y * 6)));
    } else if (pinnacleProfile > 0.15) {
      color.set(mixColor('#545759', '#666b6e', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#873926', '#9e4632', fbm(x * 5, y * 5)));
    }
  }

  // =====================================
  // 5. GLACIAL
  // =====================================
  else if (normSub === 'U자곡') {
    // Broad, flat-bottomed, steep-walled glacial trough valley
    const valleyWidth = 4.0;
    const distFromCenter = Math.abs(x);
    
    if (distFromCenter < valleyWidth) {
      h = (0.6 + fbm(x * 0.8, y * 0.8) * 0.2) * reliefScale;
      color.set(mixColor('#3d592b', '#4f7238', fbm(x * 3, y * 3)));
    } else {
      const wallDist = (distFromCenter - valleyWidth) / 4.0;
      h = (0.6 + Math.pow(clamp(wallDist, 0, 1.4), 1.6) * 4.2 + fbm(x * 0.8, y * 0.8) * 0.4) * reliefScale;
      
      if (h > 3.8 * reliefScale) {
        color.set(mixColor('#d9e6eb', '#ffffff', fbm(x * 4, y * 4)));
      } else {
        color.set(mixColor('#545b63', '#6c747d', fbm(x * 5, y * 5)));
      }
    }
  }
  else if (normSub === '피오르드') {
    // Drowned glacial canyon: steep cliffs rising directly out of sapphire blue water
    const fjordWidth = 3.2;
    const distFromCenter = Math.abs(x);
    
    if (distFromCenter < fjordWidth) {
      h = 0.5 * reliefScale;
      color.set(mixColor('#092233', '#0e314a', fbm(x * 2, y * 2)));
    } else {
      const wallDist = (distFromCenter - fjordWidth) / 4.0;
      h = (0.5 + Math.pow(clamp(wallDist, 0, 1.5), 1.4) * 4.6 + fbm(x * 0.8, y * 0.8) * 0.4) * reliefScale;
      
      if (h > 3.8 * reliefScale) {
        color.set(mixColor('#e0edf2', '#ffffff', fbm(x * 4, y * 4)));
      } else {
        color.set(mixColor('#4a5157', '#5f676e', fbm(x * 5, y * 5)));
      }
    }
  }
  else if (normSub === '혼') {
    // Sharp 3-sided pyramidal peak with knife-edge arêtes and cirques
    const a3 = angle * 3.0;
    const areteRidge = Math.cos(a3);
    const peakH = Math.max(0, 5.2 - d * 0.6);
    const cirqueHollow = (1.0 - areteRidge) * 0.55 * smoothstep(1.0, 6.0, d);
    
    h = Math.max(0.4, (peakH - cirqueHollow + fbm(x * 1.5, y * 1.5) * 0.3) * reliefScale);
    
    if (h > 3.8 * reliefScale) {
      color.set(mixColor('#e8f2f7', '#ffffff', fbm(x * 4, y * 4)));
    } else if (h > 2.0 * reliefScale) {
      color.set(mixColor('#485159', '#3b4249', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#384c2a', '#4b6139', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '권곡') {
    // Alpine Cirque: Amphitheater-shaped glacial basin with circular Tarn lake
    const bowlDist = Math.sqrt(x * x + Math.pow(y + 1.0, 2));
    const isHeadwall = y < 1.5 && (bowlDist > 3.8 && bowlDist < 8.5);
    const headwallH = isHeadwall
      ? Math.pow(smoothstep(3.8, 7.5, bowlDist), 1.4) * 4.8
      : (y < -3.5 ? 4.8 : 0);

    const isLip = Math.abs(y - 2.8) < 1.2 && Math.abs(x) < 3.5;
    const lipHeight = isLip ? 1.6 : 0;
    
    if (bowlDist <= 3.8) {
      h = (1.0 + Math.pow(bowlDist / 3.8, 2) * 0.4 + fbm(x * 1.5, y * 1.5) * 0.1) * reliefScale;
      color.set(mixColor('#195361', '#247a8c', fbm(x * 4, y * 4)));
    } else if (isHeadwall || y < -3.5) {
      h = Math.max(1.4, (1.2 + headwallH + fbm(x * 2, y * 2) * 0.4) * reliefScale);
      if (h > 4.2 * reliefScale) {
        color.set(mixColor('#d8e7ed', '#ffffff', fbm(x * 5, y * 5)));
      } else {
        color.set(mixColor('#464e54', '#5e6870', fbm(x * 6, y * 6)));
      }
    } else {
      const valleySlope = Math.max(0.6, 2.0 - (y - 2.0) * 0.28 + lipHeight);
      h = (valleySlope + fbm(x * 1.2, y * 1.2) * 0.25) * reliefScale;
      color.set(mixColor('#546944', '#706456', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '모레인') {
    // Crescent terminal moraine damming a turquoise meltwater lake
    const latMoraineL = Math.exp(-Math.pow((x + 4.5) / 1.5, 2)) * 3.2;
    const latMoraineR = Math.exp(-Math.pow((x - 4.5) / 1.5, 2)) * 3.2;
    const termDist = Math.abs(Math.sqrt(x * x + Math.pow(y - 2.0, 2)) - 4.5);
    const termMoraine = Math.exp(-Math.pow(termDist / 1.2, 2)) * 2.2;
    
    h = Math.max(0.5, (latMoraineL + latMoraineR + termMoraine + fbm(x * 1.2, y * 1.2) * 0.3) * reliefScale);
    
    if (y < 1.0 && Math.abs(x) < 3.5) {
      h = 1.0 * reliefScale;
      color.set(mixColor('#2c7a8c', '#3fa3ba', fbm(x * 3, y * 3)));
    } else if (termMoraine > 0.8 || latMoraineL > 1.2 || latMoraineR > 1.2) {
      color.set(mixColor('#6e6255', '#807466', fbm(x * 6, y * 6)));
    } else {
      color.set(mixColor('#466336', '#597945', fbm(x * 2, y * 2)));
    }
  }

  // =====================================
  // 6. ARID
  // =====================================
  else if (normSub === '사막') {
    // Crescent barchan dunes with wind ripples and sharp slip faces
    const barchan = (bx: number, by: number, scale: number) => {
      const dx = (x - bx) / scale;
      const dy = (y - by) / scale;
      const ridgeX = -dy * dy * 1.2;
      const dist = dx - ridgeX;
      const height = dist < 0
        ? Math.exp(-Math.pow(dist / 2.0, 2))
        : Math.exp(-Math.pow(dist / 0.6, 2));
      return height * Math.exp(-Math.pow(dy, 2) * 0.5) * scale * 1.6;
    };

    const d1 = barchan(0, 0, 2.8);
    const d2 = barchan(-4.5, 3.5, 2.0);
    const d3 = barchan(4.2, -3.0, 2.2);
    const ripples = Math.sin(x * 4.0 - y * 1.5) * 0.05;

    h = Math.max(0.3, (Math.max(d1, d2, d3) + ripples + fbm(x * 0.6, y * 0.6) * 0.2) * reliefScale);
    color.set(mixColor('#cc9b58', '#e2b372', smoothstep(0.4, 3.0, h) + fbm(x * 4, y * 4) * 0.15));
  }
  else if (normSub === '버섯바위') {
    // Desert bedrock plateau with undercut pedestal mushroom rock location
    h = (0.6 + fbm(x * 0.5, y * 0.5) * 0.2) * reliefScale;
    const mushroomPillars = [
      { mx: 0, my: 0, capR: 2.2, capH: 4.4 },
      { mx: 4.5, my: 3.2, capR: 1.5, capH: 3.2 },
    ];

    for (const m of mushroomPillars) {
      const md = Math.sqrt(Math.pow(x - m.mx, 2) + Math.pow(y - m.my, 2));
      if (md < m.capR) {
        const capShape = Math.exp(-Math.pow(md / m.capR, 4));
        h = Math.max(h, (capShape * m.capH + fbm(x * 3, y * 3) * 0.2) * reliefScale);
      }
    }

    if (h > 2.0 * reliefScale) {
      color.set(mixColor('#b88b56', '#cf9e67', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#a68453', '#8f6f43', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '메사·뷰트') {
    // Flat-topped Mesa tableland, isolated Butte pillar, and 45-degree talus scree aprons
    const mesaDist = Math.max(Math.abs(x - (-3.2)) / 3.4, Math.abs(y - (-1.0)) / 2.6);
    const isMesaTop = mesaDist < 0.7;
    const isMesaCliff = mesaDist >= 0.7 && mesaDist < 1.0;
    const isMesaTalus = mesaDist >= 1.0 && mesaDist < 1.7;
    
    let mesaH = 0;
    if (isMesaTop) {
      mesaH = 4.4 + fbm(x * 0.8, y * 0.8) * 0.15;
    } else if (isMesaCliff) {
      const cliffProg = (1.0 - mesaDist) / 0.3;
      mesaH = 2.4 + cliffProg * 2.0;
    } else if (isMesaTalus) {
      const talusProg = (1.7 - mesaDist) / 0.7;
      mesaH = 0.6 + talusProg * 1.8;
    }

    const butteDist = Math.sqrt(Math.pow(x - 4.2, 2) + Math.pow(y - 2.5, 2));
    let butteH = 0;
    if (butteDist < 0.9) {
      butteH = 3.9 + fbm(x * 2, y * 2) * 0.15;
    } else if (butteDist < 1.4) {
      butteH = 1.8 + ((1.4 - butteDist) / 0.5) * 2.1;
    } else if (butteDist < 2.5) {
      butteH = 0.6 + ((2.5 - butteDist) / 1.1) * 1.2;
    }

    const desertPlain = 0.5 + fbm(x * 0.4, y * 0.4) * 0.2;
    h = Math.max(desertPlain, Math.max(mesaH, butteH)) * reliefScale;

    const strata = Math.sin(h * 5.0) * 0.5 + 0.5;
    if (h > 4.0 * reliefScale) {
      color.set(mixColor('#c47743', '#d98b54', fbm(x * 5, y * 5)));
    } else if (h > 2.0 * reliefScale) {
      color.set(mixColor('#a64d2d', '#c25c36', strata));
    } else if (h > 0.9 * reliefScale) {
      color.set(mixColor('#b87349', '#cf885b', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#cfa067', '#dbb079', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '와디') {
    // Dry desert slot canyon incised into arid sandstone plateau
    const wadiCurve = Math.sin(y * 0.45) * 2.8 + Math.cos(y * 0.2) * 1.2;
    const distToWadi = Math.abs(x - wadiCurve);
    const plateauH = 3.6 + fbm(x * 0.5, y * 0.5) * 0.6;
    
    if (distToWadi < 1.1) {
      h = (0.5 + fbm(x * 2, y * 2) * 0.12) * reliefScale;
      color.set(mixColor('#948474', '#a89887', fbm(x * 6, y * 6)));
    } else if (distToWadi < 2.2) {
      const wallProg = (distToWadi - 1.1) / 1.1;
      h = (0.5 + Math.pow(wallProg, 0.8) * 3.1) * reliefScale;
      const strata = Math.sin(h * 6.0) * 0.5 + 0.5;
      color.set(mixColor('#a14728', '#bd5c3a', strata));
    } else {
      h = plateauH * reliefScale;
      color.set(mixColor('#bf8a54', '#d49e65', fbm(x * 3, y * 3)));
    }
  }
  else if (normSub === '오아시스') {
    // Deep desert dune basin cradling a fresh palm oasis pool
    const duneRim = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 2.0 + fbm(x * 0.5, y * 0.5) * 0.6;
    const basinDrop = Math.exp(-d * d * 0.15) * 3.5;
    
    h = Math.max(0.4, (2.8 + duneRim - basinDrop) * reliefScale);
    
    if (d < 1.8) {
      color.set(mixColor('#0f687a', '#178a9e', fbm(x * 4, y * 4)));
    } else if (d < 3.6) {
      color.set(mixColor('#255e1a', '#347825', fbm(x * 5, y * 5)));
    } else {
      color.set(mixColor('#d9a762', '#edbf7e', fbm(x * 2, y * 2)));
    }
  }
  else if (normSub === '플라야') {
    // Flat salt flat basin with hexagonal polygon desiccation crack patterns
    h = 0.25 * reliefScale;
    const { dist } = hexVoronoi(x * 2.2, y * 2.2);
    const crack = smoothstep(0.8, 0.95, dist);
    
    h += (crack * 0.08 + fbm(x * 0.5, y * 0.5) * 0.04) * reliefScale;
    
    if (crack > 0.4) {
      color.set(mixColor('#f0ece6', '#ffffff', fbm(x * 6, y * 6)));
    } else {
      color.set(mixColor('#d9d3c7', '#e8e2d8', fbm(x * 4, y * 4)));
    }
  }
  else {
    // Generic mountain landscape
    h = (fbm(x * 0.6, y * 0.6) * 3.0) * reliefScale;
    color.set('#666666');
  }

  return { height: h, color };
}

// ==========================================
// Complete Geological Block Diorama Generator
// Builds the top terrain surface PLUS 4 solid
// vertical side skirts showing geological strata!
// ==========================================
const GEOMETRY_CACHE: Record<string, THREE.BufferGeometry> = {};

export function generateTerrainDioramaGeometry(
  category: string,
  subTerrain: string,
  reliefScale = 1.0,
  showStrata = true,
  evolutionStage = 4
): THREE.BufferGeometry {
  const normSub = resolveTerrainKey(subTerrain);
  const cacheKey = `${category}-${normSub}-${reliefScale.toFixed(2)}-strata:${showStrata}-stage:${evolutionStage}`;
  if (GEOMETRY_CACHE[cacheKey]) return GEOMETRY_CACHE[cacheKey];

  const size = 20;
  const segments = 160; // 160x160 grid for optimal balance of crisp fidelity and 60fps performance
  const halfSize = size / 2;
  const step = size / segments;
  const numGridVerts = (segments + 1) * (segments + 1);

  // Evolution morphological factor (1: nascent stage, 2: building/uplift, 3: mature erosion, 4: modern)
  const stageMorph = evolutionStage === 1 ? 0.45 : evolutionStage === 2 ? 0.7 : evolutionStage === 3 ? 0.88 : 1.0;
  const effectiveRelief = reliefScale * stageMorph;

  // Grid vertex heights & colors cache
  const gridHeights: number[][] = [];
  const gridColors: THREE.Color[][] = [];

  for (let j = 0; j <= segments; j++) {
    gridHeights[j] = [];
    gridColors[j] = [];
    const y = -halfSize + j * step;
    for (let i = 0; i <= segments; i++) {
      const x = -halfSize + i * step;
      const res = evaluateTerrainPoint(normSub, category, x, y, effectiveRelief);
      gridHeights[j][i] = res.height;
      gridColors[j][i] = res.color;
    }
  }

  // Base elevation of the pedestal
  const baseZ = -1.2;

  // Let's count vertices:
  // Top plane: (segments + 1) * (segments + 1)
  // 4 Skirts: each skirt has (segments + 1) top vertices and (segments + 1) bottom vertices
  // Total skirt vertices = 4 * 2 * (segments + 1) = 8 * (segments + 1)
  // Bottom plate: (segments + 1) * (segments + 1) (or simple 2 triangles)
  const numSkirtVerts = 4 * (segments + 1) * 2;
  const totalVerts = numGridVerts + numSkirtVerts + 4; // plus bottom quad

  const positions = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const indices: number[] = [];

  let vertIdx = 0;

  // 1. TOP TERRAIN SURFACE
  for (let j = 0; j <= segments; j++) {
    const y = -halfSize + j * step;
    for (let i = 0; i <= segments; i++) {
      const x = -halfSize + i * step;
      const h = gridHeights[j][i];
      const col = gridColors[j][i];

      positions[vertIdx * 3] = x;
      positions[vertIdx * 3 + 1] = y;
      positions[vertIdx * 3 + 2] = h;

      colors[vertIdx * 3] = col.r;
      colors[vertIdx * 3 + 1] = col.g;
      colors[vertIdx * 3 + 2] = col.b;

      vertIdx++;
    }
  }

  // Top surface triangle indices
  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + 1;
      const c = (j + 1) * (segments + 1) + i;
      const d = c + 1;

      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  // Geological strata coloring helper for side skirts
  const getStrataColor = (x: number, y: number, z: number): THREE.Color => {
    if (!showStrata) {
      return new THREE.Color('#22242b');
    }

    // 1. 단층 산맥: 명확한 단층선 변위(Fault Displacement)와 단층 파쇄대(Gouge Zone)
    let effZ = z;
    if (normSub === '단층 산맥') {
      const faultX = Math.sin(y * 0.15) * 0.7; // 자연스러운 주향 굴곡
      const distToFault = Math.abs(x - faultX);
      if (distToFault < 0.38) {
        // 단층 마찰 파쇄대 (어두운 각력암 및 단층점토)
        const gouge = Math.sin(z * 16.0 + y * 2.0) * 0.5 + 0.5;
        return new THREE.Color('#141416').lerp(new THREE.Color('#382820'), gouge);
      }
      // 단층면 기준 상반/하반 층리 수직 변위 어긋남
      effZ = x < faultX ? z + 1.15 : z - 0.75;
    }

    // 2. 화산 지형: 중심부 지하 마그마 화도(Magma Conduit) 및 마그마방 관입 표현
    if (category === 'volcanic' || normSub === '화산' || normSub === '기생화산' || normSub === '칼데라') {
      const distToCenter = Math.sqrt(x * x + y * y);
      const conduitRadius = 1.35 + (z < 0 ? 0.75 : 0.15);
      if (distToCenter < conduitRadius) {
        const pulse = Math.sin(z * 5.0 + x * 2.0) * 0.5 + 0.5;
        const magmaCore = new THREE.Color('#ff3c00').lerp(new THREE.Color('#ff8c00'), pulse);
        const contactAureole = new THREE.Color('#2c140d');
        const factor = distToCenter / conduitRadius;
        return magmaCore.lerp(contactAureole, factor * factor);
      }
    }

    // 3. 지형 계열별 정밀 층리
    if (category === 'volcanic') {
      // 현무암질 용암류, 다공질 스코리아, 화산재 응회암 호층
      const layer = Math.sin(effZ * 4.4 + fbm(x * 0.3, y * 0.3) * 1.5) * 0.5 + 0.5;
      const subLayer = Math.sin(effZ * 14.0) * 0.5 + 0.5;
      const colA = new THREE.Color('#242120');
      const colB = new THREE.Color('#4c2920');
      const colC = new THREE.Color('#151618');
      return colA.lerp(colB, layer).lerp(colC, subLayer * 0.4);
    } else if (category === 'arid') {
      // 건조 사암의 사층리(Cross-bedding, 25도 경사)와 수평 이암층
      const crossBed = Math.sin((effZ * 4.8 + x * 0.7) + fbm(x * 0.25, effZ * 0.25) * 1.2) * 0.5 + 0.5;
      const planarBed = Math.sin(effZ * 2.0) * 0.5 + 0.5;
      const colA = new THREE.Color('#944e34');
      const colB = new THREE.Color('#b86e49');
      const colC = new THREE.Color('#d99c72');
      return colA.lerp(colB, crossBed).lerp(colC, planarBed * 0.4);
    } else if (category === 'karst') {
      // 후층 석회암의 수평 층리면과 수직 용식 절리(Joint Fissure), 테라로사 점토대
      const bed = Math.sin(effZ * 3.4) * 0.5 + 0.5;
      const isJoint = Math.sin(x * 2.5 + y * 0.3) > 0.88;
      const colA = new THREE.Color('#4c4f52');
      const colB = new THREE.Color('#676c70');
      const colTerra = new THREE.Color('#783428');
      const baseCol = colA.lerp(colB, bed);
      return isJoint ? baseCol.lerp(colTerra, 0.65) : baseCol;
    } else if (category === 'glacial') {
      // 결정질 화강편마암 기반암과 불규칙한 빙퇴석(Till) 혼재층
      const foliation = Math.sin(effZ * 5.5 + (x - y) * 0.35) * 0.5 + 0.5;
      const colA = new THREE.Color('#3c4247');
      const colB = new THREE.Color('#555e66');
      const colC = new THREE.Color('#25282c');
      return colA.lerp(colB, foliation).lerp(colC, (Math.sin(effZ * 15) * 0.5 + 0.5) * 0.35);
    } else {
      // 하천/해안: 점이층리(Graded bedding)와 모래/실트/점토 교호 퇴적층
      const bed = Math.sin(effZ * 4.6 + fbm(x * 0.2, y * 0.2) * 1.1) * 0.5 + 0.5;
      const fineBed = Math.sin(effZ * 16.0) * 0.5 + 0.5;
      const colA = new THREE.Color('#3f3730');
      const colB = new THREE.Color('#5d4f43');
      const colC = new THREE.Color('#7d6b58');
      return colA.lerp(colB, bed).lerp(colC, fineBed * 0.3);
    }
  };

  // Helper to add a side skirt wall
  const addSkirt = (
    coordAccessor: (t: number) => { x: number; y: number; h: number },
    segmentsCount: number,
    normalFlip: boolean
  ) => {
    const skirtStartIdx = vertIdx;

    for (let k = 0; k <= segmentsCount; k++) {
      const { x, y, h } = coordAccessor(k);

      // Top skirt vertex (matches the terrain surface edge)
      positions[vertIdx * 3] = x;
      positions[vertIdx * 3 + 1] = y;
      positions[vertIdx * 3 + 2] = h;
      const topCol = getStrataColor(x, y, h);
      colors[vertIdx * 3] = topCol.r;
      colors[vertIdx * 3 + 1] = topCol.g;
      colors[vertIdx * 3 + 2] = topCol.b;
      vertIdx++;

      // Bottom skirt vertex (at baseZ)
      positions[vertIdx * 3] = x;
      positions[vertIdx * 3 + 1] = y;
      positions[vertIdx * 3 + 2] = baseZ;
      const botCol = getStrataColor(x, y, baseZ);
      colors[vertIdx * 3] = botCol.r * 0.7; // slightly darker at bottom
      colors[vertIdx * 3 + 1] = botCol.g * 0.7;
      colors[vertIdx * 3 + 2] = botCol.b * 0.7;
      vertIdx++;
    }

    // Connect skirt quad triangles
    for (let k = 0; k < segmentsCount; k++) {
      const p1 = skirtStartIdx + k * 2;
      const p2 = p1 + 1;
      const p3 = p1 + 2;
      const p4 = p1 + 3;

      if (!normalFlip) {
        indices.push(p1, p2, p3);
        indices.push(p2, p4, p3);
      } else {
        indices.push(p1, p3, p2);
        indices.push(p2, p3, p4);
      }
    }
  };

  // 1. South Skirt (y = -halfSize, i goes 0 -> segments)
  addSkirt(
    (i) => ({
      x: -halfSize + i * step,
      y: -halfSize,
      h: gridHeights[0][i],
    }),
    segments,
    false
  );

  // 2. North Skirt (y = +halfSize, i goes segments -> 0)
  addSkirt(
    (i) => {
      const actualI = segments - i;
      return {
        x: -halfSize + actualI * step,
        y: halfSize,
        h: gridHeights[segments][actualI],
      };
    },
    segments,
    false
  );

  // 3. West Skirt (x = -halfSize, j goes segments -> 0)
  addSkirt(
    (j) => {
      const actualJ = segments - j;
      return {
        x: -halfSize,
        y: -halfSize + actualJ * step,
        h: gridHeights[actualJ][0],
      };
    },
    segments,
    false
  );

  // 4. East Skirt (x = +halfSize, j goes 0 -> segments)
  addSkirt(
    (j) => ({
      x: halfSize,
      y: -halfSize + j * step,
      h: gridHeights[j][segments],
    }),
    segments,
    false
  );

  // 5. Solid Base Bottom Plate (quad at baseZ)
  const b1 = vertIdx;
  positions[vertIdx * 3] = -halfSize;
  positions[vertIdx * 3 + 1] = -halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  vertIdx++;

  const b2 = vertIdx;
  positions[vertIdx * 3] = halfSize;
  positions[vertIdx * 3 + 1] = -halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  vertIdx++;

  const b3 = vertIdx;
  positions[vertIdx * 3] = halfSize;
  positions[vertIdx * 3 + 1] = halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  vertIdx++;

  const b4 = vertIdx;
  positions[vertIdx * 3] = -halfSize;
  positions[vertIdx * 3 + 1] = halfSize;
  positions[vertIdx * 3 + 2] = baseZ;
  colors[vertIdx * 3] = 0.08; colors[vertIdx * 3 + 1] = 0.08; colors[vertIdx * 3 + 2] = 0.1;
  vertIdx++;

  indices.push(b1, b2, b3);
  indices.push(b1, b3, b4);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  GEOMETRY_CACHE[cacheKey] = geo;
  return geo;
}
