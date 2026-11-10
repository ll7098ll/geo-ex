import * as THREE from 'three';
import {
  fbm,
  warpedFbm,
  ridgedFbm,
  voronoi2D,
  smoothstep,
  smax,
  clamp,
  mixColor,
  TerrainEvalResult,
} from '../terrainMath';

export const KARST_TOWER_SPECS = [
  { tx: -3.2, ty: -0.8, rx: 1.85, ry: 1.55, h: 5.45, phase: 0.4 },  // 중앙 서측 주봉
  { tx: -4.4, ty: 0.9, rx: 1.35, ry: 1.25, h: 4.15, phase: 1.7 },   // 주봉과 안부로 이어진 연봉(봉총/Fengcong)
  { tx: 3.1, ty: 0.6, rx: 1.65, ry: 1.45, h: 5.05, phase: 2.3 },    // 동측 거봉
  { tx: -0.4, ty: 4.2, rx: 1.75, ry: 1.50, h: 4.85, phase: 0.9 },   // 후면 중앙 첨봉
  { tx: 3.8, ty: -3.4, rx: 1.45, ry: 1.25, h: 4.35, phase: 3.1 },   // 전면 동측 탑봉
  { tx: -4.8, ty: -4.2, rx: 1.30, ry: 1.15, h: 3.95, phase: 4.2 },  // 전면 서측 탑봉
  { tx: 4.9, ty: 4.6, rx: 1.55, ry: 1.35, h: 4.55, phase: 1.2 },    // 후면 동측 탑봉
  { tx: -5.6, ty: 4.8, rx: 1.45, ry: 1.35, h: 4.25, phase: 2.8 },   // 후면 서측 탑봉
  { tx: 0.35, ty: -2.6, rx: 0.88, ry: 0.76, h: 2.95, phase: 0.6 },  // 강물 한가운데 솟은 수중 잔구(도담삼봉/제임스본드섬 스타일!)
  { tx: -7.2, ty: -0.6, rx: 1.25, ry: 1.15, h: 3.55, phase: 3.7 },  // 외곽 보조 봉우리
];

export function evalKarstTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // =========================================================================
  // 1. 돌리네 (석회암 고원 용식 깔때기 와지 & 복합 우발라 & 포노르 & 테라로사: 문경 돌리네, 단양)
  // 단독 원형 돌리네 + 격벽이 허물어져 하나로 합쳐진 땅콩형 우발라(Uvala) + 급경사 함몰 싱크홀
  // =========================================================================
  if (normSub === '돌리네') {
    // 기복 있는 석회암 카르스트 고원 (회백색 석회암 노두가 군데군데 드러남)
    const plateau = 3.75 + warpedFbm(x * 0.35, y * 0.35, 4) * 0.42 + fbm(x * 1.4, y * 1.4) * 0.10;

    // 1) 우발라(Uvala): 인접한 두 돌리네((-2.2, 1.1) 및 (1.2, -0.5))가 용식 확장되어 중간 격벽이 낮게 허물어진 복합 와지!
    const dUv1 = Math.hypot((x + 2.2) / 3.15, (y - 1.1) / 2.75);
    const dUv2 = Math.hypot((x - 1.2) / 2.85, (y + 0.5) / 2.55);
    const depUv1 = dUv1 < 1.0 ? Math.pow(Math.cos(dUv1 * Math.PI * 0.5), 1.45) * 2.35 : 0;
    const depUv2 = dUv2 < 1.0 ? Math.pow(Math.cos(dUv2 * Math.PI * 0.5), 1.45) * 2.15 : 0;
    const uvalaDep = smax(depUv1, depUv2, 0.55);

    // 2) 단독 깔때기형 용식 돌리네 (Solution Doline: (4.6, 3.6))
    const dSol = Math.hypot((x - 4.6) / 2.05, (y - 3.6) / 1.95);
    const solDep = dSol < 1.0 ? Math.pow(Math.cos(dSol * Math.PI * 0.5), 1.55) * 1.85 : 0;

    // 3) 동굴 천장 붕괴형 급경사 함몰 돌리네 (Collapse Doline / Cenote형: (-4.8, -3.8))
    const dCol = Math.hypot(x + 4.8, y + 3.8);
    const colDep = (1.0 - smoothstep(1.05, 1.55, dCol)) * 2.35;

    const totalDep = Math.max(uvalaDep, Math.max(solDep, colDep));

    // 와지 최저점 지하 배수구 포노르 (Ponor / Swallow hole)
    const p1 = Math.hypot(x + 2.2, y - 1.1);
    const p2 = Math.hypot(x - 1.2, y + 0.5);
    const p3 = Math.hypot(x - 4.6, y - 3.6);
    const minPonorDist = Math.min(p1, Math.min(p2, p3));
    const ponorThroat = (1.0 - smoothstep(0.16, 0.52, minPonorDist)) * 0.62;

    const rawH = Math.max(0.24, plateau - totalDep - ponorThroat);
    h = rawH * reliefScale;

    if (minPonorDist < 0.42 || dCol < 1.05) {
      // 지하 수계로 직결되는 암흑색 포노르 수직 절리 구멍 및 붕괴구 그늘
      color.set(mixColor('#171311', '#2b2420', fbm(x * 6, y * 6)));
    } else if (dCol < 1.52) {
      // 함몰 돌리네 수직 석회암 절벽 단면
      color.set(mixColor('#6e706a', '#969991', fbm(x * 6, y * 6)));
    } else if (totalDep > 1.25) {
      // 돌리네·우발라 바닥: 불용성 산화철이 집적된 비옥한 적갈색 테라로사(Terra Rossa) 점토층 및 밭경작 패치
      const cropRow = Math.sin((x + y) * 6.5) * 0.5 + 0.5;
      color.set(mixColor('#782a1a', '#9e3f28', cropRow * 0.45 + fbm(x * 4, y * 4) * 0.55));
    } else if (totalDep > 0.35) {
      // 돌리네 내측 완사면 초지 및 석회암 전석
      color.set(mixColor('#4c6335', '#677d48', fbm(x * 3, y * 3)));
    } else {
      // 고원 상부: 회백색 카르스트 석회암 노두(양떼바위)와 온대 관목림 교차
      const limestoneOutcrop = smoothstep(0.56, 0.74, ridgedFbm(x * 1.3, y * 1.3, 3));
      const veg = mixColor('#3c572c', '#51703c', fbm(x * 2.2, y * 2.2));
      color.copy(veg).lerp(new THREE.Color('#a6a9a2'), limestoneOutcrop * 0.78);
    }
    return { height: h, color };
  }

  // =========================================================================
  // 2. 탑 카르스트 (열대·아열대 수직 석회암 봉림·봉총과 비취색 카르스트 강: 구이린 리강, 하롱베이, 도담삼봉)
  // 굽이치는 에메랄드 강/만 위로 비대칭 자연 단면의 10기 수직 석회암 탑봉이 웅장하게 솟구침
  // =========================================================================
  if (normSub === '탑 카르스트') {
    // 석봉 사이를 유유히 감싸 흐르는 에메랄드 카르스트 강(리강 스타일)
    const riverX = 0.25 + Math.sin(y * 0.32) * 2.15 + Math.cos(y * 0.18) * 0.65;
    const d1x = 0.32 * 2.15 * Math.cos(y * 0.32) - 0.18 * 0.65 * Math.sin(y * 0.18);
    const perpRiver = Math.abs(x - riverX) / Math.sqrt(1.0 + d1x * d1x);
    const riverHalfW = 1.65;
    const riverCarve = (1.0 - smoothstep(riverHalfW * 0.65, riverHalfW + 0.45, perpRiver)) * 0.42;

    const corrosionPlain = 0.62 - riverCarve + fbm(x * 0.8, y * 0.8) * 0.08;

    let towerH = 0;
    let towerCrownT = 0;
    for (const t of KARST_TOWER_SPECS) {
      const dx = x - t.tx;
      const dy = y - t.ty;
      const ang = Math.atan2(dy, dx);
      // 원통이 아닌 자연스러운 수직 절리·용식 비대칭 단면
      const lobeMod =
        1.0 +
        0.16 * Math.sin(ang * 3.0 + t.phase) +
        0.10 * Math.cos(ang * 5.0 - t.phase * 0.7) +
        (fbm(x * 0.9, y * 0.9, 2) - 0.5) * 0.14;
      const normD = Math.hypot(dx / (t.rx * lobeMod), dy / (t.ry * lobeMod));

      if (normD < 1.15) {
        const talusFoot = smoothstep(1.15, 0.88, normD) * 0.55;
        let thisH = corrosionPlain + talusFoot;
        if (normD < 1.0) {
          // 78~85° 초급경사 기둥 벽면과 둥근 돔형 정상부(Mogote / Fenglin profile)
          const core = clamp(1.0 - Math.pow(normD, 3.8), 0.0, 1.0);
          const dome = Math.pow(core, 0.38);
          const fluting = Math.sin(ang * 14.0 + fbm(x * 2, y * 2) * 2.0) * 0.08 * smoothstep(0.4, 0.95, normD);
          thisH = Math.max(thisH, 0.45 + dome * (t.h - 0.45) + fluting + ridgedFbm(x * 1.6, y * 1.6, 3) * 0.18 * core);
          if (thisH > towerH) {
            towerCrownT = core;
          }
        }
        towerH = smax(towerH, thisH, 0.22);
      }
    }

    const rawH = Math.max(0.18, Math.max(corrosionPlain, towerH));
    h = rawH * reliefScale;

    if (rawH < 0.53) {
      // 비취빛 카르스트 수면 바닥
      color.set(mixColor('#0f4240', '#1b6661', fbm(x * 4, y * 4)));
    } else if (towerH > 1.05) {
      if (towerCrownT > 0.48 && rawH > 2.6) {
        // 석봉 정상부 및 암벽 턱에 매달린 짙은 아열대 석회암 상록수림
        const rockPeek = smoothstep(0.62, 0.82, ridgedFbm(x * 2.5, y * 2.5, 3));
        color.copy(mixColor('#1b451f', '#2d6331', fbm(x * 4, y * 4))).lerp(new THREE.Color('#8a8f91'), rockPeek * 0.5);
      } else {
        // 수직 석회암 거벽: 빗물 용식 줄무늬(흑회색 남조류 흔적)와 회백색 탄산염 암면 교차
        const streak = Math.sin(x * 7.5 + y * 7.5 + fbm(x * 3, y * 3) * 3.0) * 0.5 + 0.5;
        color.set(mixColor('#464a4d', '#94999c', streak * 0.7 + fbm(x * 6, y * 6) * 0.3));
      }
    } else {
      // 평탄한 용식 평원 논밭과 수변 대나무·초지
      color.set(mixColor('#356134', '#4d7d47', fbm(x * 2.5, y * 2.5)));
    }
    return { height: h, color };
  }

  // =========================================================================
  // 3. 석회동굴 (카르스트 산체 지표 돌리네·카렌 + 전면 절개 지하 공동 바닥 & 휴석단구: 환선굴, 고수동굴)
  // (동굴 상부를 덮는 아치형 층리 석회암 천장 돔과 수직 종유석·석순·석주는 3D 볼륨 메쉬로 완벽 결합!)
  // =========================================================================
  if (normSub === '석회동굴') {
    // 후면(y > 3.2) 및 좌우 측면(|x| > 4.5)은 높은 카르스트 석회암 산체로 감싸고,
    // 중앙~전면(|x| < 4.2, y ∈ [-6.5, +3.0])은 절개된 지하 석회동굴 바닥과 휴석단구(Rimstone pools), 동굴 하천 형성!
    const mountainBase =
      4.05 +
      warpedFbm(x * 0.35, y * 0.35, 4) * 0.68 +
      smoothstep(-2.0, 7.5, y) * 0.55;

    // 산 정상부(후면 y ≈ 5.6, x ≈ -1.2)에 동굴 수계로 빗물을 공급하는 지표 돌리네 싱크홀 배치!
    const dSurfaceSink = Math.hypot(x + 1.2, y - 5.6);
    const surfaceSink = dSurfaceSink < 2.1 ? Math.pow(Math.cos((dSurfaceSink / 2.1) * Math.PI * 0.5), 1.6) * 1.45 : 0;

    // 동굴 공동 바닥 절개 영역 (전면 y = -10 계곡으로 열려 있어 기본 카메라에서 동굴 내부가 한눈에 보임!)
    const caveHalfW = 3.85 + Math.sin(y * 0.45) * 0.35;
    const crossMask = 1.0 - smoothstep(caveHalfW - 0.65, caveHalfW + 0.55, Math.abs(x));
    const backWallMask = 1.0 - smoothstep(2.35, 3.45, y);
    // 전면(y < -4.2)은 동굴 입구 밖 카르스트 협곡으로 이어짐
    const canyonHalfW = 2.15 + Math.sin(y * 0.4) * 0.35;
    const frontGorgeMask =
      y < -4.0
        ? (1.0 - smoothstep(canyonHalfW - 0.4, canyonHalfW + 0.9, Math.abs(x))) * smoothstep(-3.6, -5.0, y)
        : 0;

    const carveMask = clamp(Math.max(crossMask * backWallMask, frontGorgeMask), 0.0, 1.0);

    // 동굴 내부 바닥 지형: 안쪽(y=+2.4, h=1.08)에서 입구(y=-4.2, h=0.46)로 계단식으로 내려오는 탄산염 휴석단구(Rimstone Terraces)!
    const terraceArc = y + 0.14 * x * x;
    const step1 = smoothstep(-3.4, -3.0, terraceArc) * 0.15;
    const step2 = smoothstep(-1.9, -1.5, terraceArc) * 0.16;
    const step3 = smoothstep(-0.4, 0.0, terraceArc) * 0.16;
    const step4 = smoothstep(1.1, 1.5, terraceArc) * 0.15;
    // 동굴 서편을 따라 흐르는 지하수 수로(Subterranean stream)
    const caveStreamX = -1.15 + Math.sin(y * 0.5) * 0.45;
    const streamCut = (1.0 - smoothstep(0.35, 0.85, Math.abs(x - caveStreamX))) * 0.22;

    const caveFloorH = 0.46 + step1 + step2 + step3 + step4 - streamCut + fbm(x * 2.8, y * 2.8) * 0.04;
    const rawH = Math.max(0.20, (mountainBase - surfaceSink) * (1.0 - carveMask) + caveFloorH * carveMask);
    h = rawH * reliefScale;

    if (carveMask > 0.72) {
      if (Math.abs(x - caveStreamX) < 0.65 && rawH < 0.55) {
        // 지하 동굴 하천 및 유출 계류
        color.set(mixColor('#0d3b47', '#185e6e', fbm(x * 5, y * 5)));
      } else if (y > -3.8 && y < 2.2 && Math.abs(x) < 2.8) {
        // 탄산칼슘 침전 휴석(Travertine / Flowstone) 황백색·황토색 동굴 바닥
        const sinterRipple = Math.sin(terraceArc * 12.0) * 0.5 + 0.5;
        color.set(mixColor('#594936', '#9e8462', sinterRipple * 0.65 + fbm(x * 5, y * 5) * 0.35));
      } else {
        // 동굴 어두운 습윤 암반 바닥
        color.set(mixColor('#1f1c19', '#36302a', fbm(x * 5, y * 5)));
      }
    } else if (carveMask > 0.12) {
      // 동굴 내벽 및 입구 협곡 석회암 층리 절벽
      const bed = Math.sin(rawH * 9.5) * 0.5 + 0.5;
      color.set(mixColor('#4a4843', '#7d7a72', bed));
    } else if (dSurfaceSink < 1.35) {
      // 상부 돌리네 테라로사 적색토
      color.set(mixColor('#752c1d', '#943c29', fbm(x * 4, y * 4)));
    } else {
      // 지표 카르스트 산림 및 백색 카렌 석회암 노두
      const karrenRock = smoothstep(0.58, 0.76, ridgedFbm(x * 1.5, y * 1.5, 3));
      color.copy(mixColor('#2f5224', '#456e35', fbm(x * 2.2, y * 2.2))).lerp(
        new THREE.Color('#a8aba4'),
        karrenRock * 0.72
      );
    }
    return { height: h, color };
  }

  // =========================================================================
  // 4. 카렌 (빗물 용식으로 조각된 석회암 포장 클린트·그라이크 & 침봉 석림: 조령산 카렌, 더 버런, 칭기·석림)
  // 부드러운 안티에일리어싱 절리 그라이크(테라로사 틈새) + 빗살 용식구(Rinnenkarren) 침봉 군락
  // =========================================================================
  if (normSub === '카렌') {
    // 후면으로 완만히 높아지는 계단형 석회암 대지 기저면
    const benchBase =
      1.85 +
      smoothstep(-9.0, 9.0, y) * 0.95 +
      Math.floor((y + 10.0) / 5.5) * 0.12 +
      warpedFbm(x * 0.28, y * 0.28, 3) * 0.38;

    // 1) 직교·사교 지질 절리망을 따라 깊게 녹아 파인 그라이크(Grykes / 용식 틈새)
    const warpX = (fbm(x * 0.35, y * 0.35, 3) - 0.5) * 0.85;
    const warpY = (fbm(y * 0.35 + 5.2, x * 0.35, 3) - 0.5) * 0.85;
    const jA = Math.abs(Math.sin((x + warpX) * 1.55 + y * 0.18));
    const jB = Math.abs(Math.sin((y + warpY) * 1.48 - x * 0.22));

    // smoothstep으로 0.083m 그리드 해상도보다 충분히 넓게 전이하여 메쉬 스파이크 원천 차단!
    const grykeA = 1.0 - smoothstep(0.08, 0.34, jA);
    const grykeB = 1.0 - smoothstep(0.08, 0.34, jB);
    const grykeMask = Math.max(grykeA, grykeB); // 1 = 깊은 틈새 바닥, 0 = 석회암 클린트 블록 상부

    // 2) 클린트 블록 상부의 빗물 용식 침봉(Spitzkarren / Stone Forest Pinnacles) & 용식구(Rinnenkarren)
    const vor = voronoi2D(x * 0.85, y * 0.85, 0.75);
    const pinnacleHeight = (0.55 + vor.cellId * 0.85) * (1.0 - grykeMask);
    const rinnenFlutes = ridgedFbm(x * 2.4, y * 2.4, 3) * 0.42 * (1.0 - grykeMask);

    const rawH = Math.max(
      0.32,
      benchBase - grykeMask * 0.72 + pinnacleHeight + rinnenFlutes
    );
    h = rawH * reliefScale;

    if (grykeMask > 0.58) {
      // 깊은 용식 틈새(Gryke) 바닥: 산화철 적갈색 테라로사 토양과 틈새 양치·초본 식생
      const cleftGrass = smoothstep(0.45, 0.72, fbm(x * 4.5, y * 4.5, 3));
      color.copy(mixColor('#782f1e', '#943e29', fbm(x * 5, y * 5))).lerp(
        new THREE.Color('#395c27'),
        cleftGrass * 0.65
      );
    } else if (grykeMask > 0.18) {
      // 수직 용식구(Rinnenkarren) 측면: 빗물이 흘러내린 청회색~암회색 석회암 벽면
      color.set(mixColor('#686d70', '#8b9094', fbm(x * 6, y * 6)));
    } else {
      // 빗물에 씻겨 하얗고 날카롭게 빛나는 순수 탄산칼슘 석회암 클린트·침봉 정상부!
      const tipBright = smoothstep(0.35, 0.95, pinnacleHeight + rinnenFlutes);
      color.set(mixColor('#9fa39e', '#d9dcd7', tipBright * 0.8 + fbm(x * 5, y * 5) * 0.2));
    }
    return { height: h, color };
  }

  return null;
}
