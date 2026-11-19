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

const KARST_TOWER_SPECS = [
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
        0.18 * Math.sin(ang * 3.0 + t.phase) +
        0.11 * Math.cos(ang * 5.0 - t.phase * 0.7) +
        (fbm(x * 0.9, y * 0.9, 2) - 0.5) * 0.15;
      const normD = Math.hypot(dx / (t.rx * lobeMod), dy / (t.ry * lobeMod));

      if (normD < 1.24) {
        const talusFoot = smoothstep(1.24, 0.86, normD) * 0.58;
        let thisH = corrosionPlain + talusFoot;
        if (normD < 1.06) {
          // 72~80° 급경사 석회암 봉우리와 비대칭 암릉 정상부 (smoothstep 기반 유한 기울기로 격자 계단·스파이크 제거!)
          const core = smoothstep(1.06, 0.58, normD);
          const shoulder = Math.pow(core, 0.85);
          const cragPeak =
            (ridgedFbm(x * 1.45 + t.phase, y * 1.45 - t.phase, 4) * 0.44 +
              Math.sin(ang * 2.0 + t.phase) * 0.14 * (1.0 - core)) *
            core;
          const fluting = Math.sin(ang * 13.0 + fbm(x * 2, y * 2) * 2.0) * 0.06 * smoothstep(0.35, 0.90, normD) * core;
          thisH = Math.max(thisH, 0.45 + shoulder * (t.h - 0.58) + cragPeak + fluting);
          if (thisH > towerH) {
            towerCrownT = core;
          }
        }
        towerH = smax(towerH, thisH, 0.26);
      }
    }

    const rawH = Math.max(0.18, Math.max(corrosionPlain, towerH));
    h = rawH * reliefScale;

    if (rawH < 0.53) {
      // 비취빛 카르스트 수면 바닥
      color.set(mixColor('#0f4240', '#1b6661', fbm(x * 4, y * 4)));
    } else if (towerH > 1.05) {
      if (towerCrownT > 0.45 && rawH > 2.4) {
        // 석봉 정상부 및 암벽 턱에 매달린 짙은 아열대 석회암 상록수림
        const rockPeek = smoothstep(0.58, 0.80, ridgedFbm(x * 2.5, y * 2.5, 3));
        color.copy(mixColor('#1b451f', '#2d6331', fbm(x * 4, y * 4))).lerp(new THREE.Color('#8a8f91'), rockPeek * 0.55);
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
    // 중앙~전면(|x| < 4.2, y ∈ [-4.2, +3.0])은 절개된 지하 석회동굴 바닥과 휴석단구(Rimstone pools), 동굴 하천 형성!
    const mountainBase =
      4.05 +
      warpedFbm(x * 0.35, y * 0.35, 4) * 0.68 +
      smoothstep(-2.0, 7.5, y) * 0.55;

    // 산 정상부(후면 y ≈ 5.6, x ≈ -1.2)에 동굴 수계로 빗물을 공급하는 지표 돌리네 싱크홀 배치!
    const dSurfaceSink = Math.hypot(x + 1.2, y - 5.6);
    const surfaceSink = dSurfaceSink < 2.1 ? Math.pow(Math.cos((dSurfaceSink / 2.1) * Math.PI * 0.5), 1.6) * 1.45 : 0;

    // 동굴 공동 바닥 절개 영역 (전면 y = -4.1 밖으로는 자연스러운 S자 카르스트 출구 계곡으로 단절 없이 연결!)
    const caveHalfW = 3.85 + Math.sin(y * 0.45) * 0.35;
    const crossMask = 1.0 - smoothstep(caveHalfW - 0.65, caveHalfW + 0.55, Math.abs(x));
    const backWallMask = 1.0 - smoothstep(2.35, 3.45, y);
    const frontPortalTaper = smoothstep(-5.6, -4.1, y);
    const caveChamberMask = crossMask * backWallMask * frontPortalTaper;

    // 동굴 입구 밖(y < -3.6) 자연스럽게 구부러지며 넓어지는 V자형 카르스트 계곡 (직사각형 도랑 및 문턱 단차 제거!)
    const exitT = clamp((-3.6 - y) / 6.4, 0.0, 1.0);
    const exitCenterX = -0.35 * exitT + Math.sin((y + 3.6) * 0.45) * 0.65 * exitT;
    const exitDistX = Math.abs(x - exitCenterX);
    const exitInnerW = 2.15 + exitT * 0.85;
    const exitOuterW = 3.85 + exitT * 1.95;
    const frontGorgeMask =
      (1.0 - smoothstep(exitInnerW, exitOuterW, exitDistX)) * smoothstep(-2.6, -4.1, y);

    const carveMask = clamp(Math.max(caveChamberMask, frontGorgeMask), 0.0, 1.0);

    // 동굴 내부 바닥 지형: 안쪽(y=+2.4, h=1.08)에서 입구(y=-4.2, h=0.46)로 계단식으로 내려오는 탄산염 휴석단구(Rimstone Terraces)!
    const terraceArc = y + 0.14 * x * x;
    const step1 = smoothstep(-3.4, -3.0, terraceArc) * 0.15;
    const step2 = smoothstep(-1.9, -1.5, terraceArc) * 0.16;
    const step3 = smoothstep(-0.4, 0.0, terraceArc) * 0.16;
    const step4 = smoothstep(1.1, 1.5, terraceArc) * 0.15;
    // 동굴 서편을 따라 흘러 출구 계곡으로 빠져나가는 지하수 수로(Subterranean stream)
    const caveStreamX = -1.15 + Math.sin(y * 0.5) * 0.45 + smoothstep(-3.8, -9.5, y) * 0.55;
    const streamCut = (1.0 - smoothstep(0.34, 0.90, Math.abs(x - caveStreamX))) * 0.25;

    const exitValleyLift =
      smoothstep(-4.4, -9.5, y) *
      smoothstep(1.25, 3.2, exitDistX) *
      smoothstep(0.45, 0.95, Math.abs(x - caveStreamX)) *
      0.65;
    const caveFloorH =
      0.46 + step1 + step2 + step3 + step4 - streamCut + exitValleyLift + fbm(x * 2.8, y * 2.8) * 0.04;
    const rawH = Math.max(0.18, (mountainBase - surfaceSink) * (1.0 - carveMask) + caveFloorH * carveMask);
    h = rawH * reliefScale;

    if (carveMask > 0.68) {
      if (Math.abs(x - caveStreamX) < 0.72 && rawH < 0.54) {
        // 지하 동굴 하천 및 유출 계류
        color.set(mixColor('#0d3b47', '#185e6e', fbm(x * 5, y * 5)));
      } else if (y > -3.8 && y < 2.2 && Math.abs(x) < 2.95) {
        // 탄산칼슘 침전 휴석(Travertine / Flowstone) 황백색·황토색 동굴 바닥
        const sinterRipple = Math.sin(terraceArc * 12.0) * 0.5 + 0.5;
        color.set(mixColor('#594936', '#9e8462', sinterRipple * 0.65 + fbm(x * 5, y * 5) * 0.35));
      } else if (y <= -4.1) {
        // 동굴 출구 밖 이끼 낀 석회암 계곡 바닥 및 수변 초지
        const moss = smoothstep(0.55, 1.35, exitDistX);
        color.copy(mixColor('#4f4c45', '#736f65', fbm(x * 5, y * 5))).lerp(
          mixColor('#2e5225', '#426b35', fbm(x * 3, y * 3)),
          moss * 0.78
        );
      } else {
        // 동굴 어두운 습윤 암반 바닥
        color.set(mixColor('#1f1c19', '#36302a', fbm(x * 5, y * 5)));
      }
    } else if (carveMask > 0.10) {
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
  // 연속 Voronoi edgeDist + 도메인 워프 사교 절리망 + 부드러운 모따기 그라이크로 스파이크 0!
  // =========================================================================
  if (normSub === '카렌') {
    // 후면으로 완만히 높아지는 연속 석회암 층리 계단(Limestone Pavement Benches — Math.floor 불연속 제거!)
    const benchSteps =
      smoothstep(-6.2, -4.4, y) * 0.36 +
      smoothstep(-0.4, 1.4, y) * 0.42 +
      smoothstep(5.0, 6.8, y) * 0.38;
    const benchBase =
      1.68 +
      smoothstep(-9.5, 9.5, y) * 0.65 +
      benchSteps +
      warpedFbm(x * 0.26, y * 0.26, 3) * 0.36;

    // 1) 강한 도메인 워프를 적용한 사교 지질 절리망 + 연속 Voronoi 용식 그라이크(Grykes)
    const warpX = (warpedFbm(x * 0.22 + 1.3, y * 0.22 - 0.7, 3) - 0.5) * 1.65;
    const warpY = (warpedFbm(y * 0.22 + 4.1, x * 0.22 + 2.2, 3) - 0.5) * 1.65;
    const uJoint = (x + warpX) * 0.72 + (y + warpY) * 0.22;
    const vJoint = -(x + warpX) * 0.24 + (y + warpY) * 0.68;

    const jA = Math.abs(Math.sin(uJoint * 1.05));
    const jB = Math.abs(Math.sin(vJoint * 0.88 + 0.75));
    const grykeA = 1.0 - smoothstep(0.08, 0.44, jA);
    const grykeB = 1.0 - smoothstep(0.08, 0.44, jB);

    // 연속 함수 vor.edgeDist (f2 - f1)만 사용 — 충분한 베벨 폭으로 0.083m 격자 위에서 스파이크 0!
    const vor = voronoi2D((x + warpX * 0.38) * 0.42, (y + warpY * 0.38) * 0.42, 0.78);
    const vorGryke = 1.0 - smoothstep(0.06, 0.34, vor.edgeDist);
    const grykeMask = clamp(Math.max(Math.max(grykeA, grykeB * 0.84), vorGryke * 0.90), 0.0, 1.0);

    // 2) 클린트 평탄 석회암 반석(Clints) + 후면·능선부 빗물 용식 침봉(Spitzkarren / Rinnenkarren)
    const clintInterior = smoothstep(0.12, 0.46, vor.edgeDist) * (1.0 - grykeMask);
    const blockRelief = 0.36 + fbm(x * 0.40 + 2.0, y * 0.40 - 1.5, 3) * 0.26;
    const pinnacleCluster = smoothstep(0.32, 0.80, warpedFbm(x * 0.22 - 1.8, y * 0.22 + 1.2, 3));
    const spitzkarren =
      clintInterior *
      pinnacleCluster *
      smoothstep(-3.8, 5.2, y) *
      (0.45 + ridgedFbm(x * 1.05, y * 1.05, 3) * 0.42);
    const rinnenFlutes = ridgedFbm(x * 1.45, y * 1.45, 3) * 0.16 * clintInterior;

    const rawH = Math.max(
      0.34,
      benchBase - grykeMask * 0.50 + clintInterior * blockRelief + spitzkarren + rinnenFlutes
    );
    h = rawH * reliefScale;

    if (grykeMask > 0.55) {
      // 깊은 용식 틈새(Gryke) 바닥: 산화철 적갈색 테라로사 토양과 틈새 양치·초본 식생
      const cleftGrass = smoothstep(0.42, 0.72, fbm(x * 4.2, y * 4.2, 3));
      color.copy(mixColor('#782f1e', '#943e29', fbm(x * 5, y * 5))).lerp(
        new THREE.Color('#355925'),
        cleftGrass * 0.68
      );
    } else if (grykeMask > 0.16) {
      // 수직 용식구(Rinnenkarren) 측면: 빗물이 흘러내린 청회색~암회색 석회암 벽면
      color.set(mixColor('#666d72', '#8c9296', fbm(x * 5.5, y * 5.5)));
    } else {
      // 빗물에 씻겨 하얗고 선명하게 풍화된 석회암 클린트 반석 및 침봉 정상부!
      const tipBright = smoothstep(0.18, 0.95, spitzkarren + rinnenFlutes + blockRelief * 0.35);
      const lichen = smoothstep(0.62, 0.82, fbm(x * 1.6, y * 1.6, 3)) * (1.0 - smoothstep(0.25, 0.65, spitzkarren));
      color
        .copy(mixColor('#a3a8a3', '#dde0db', tipBright * 0.82 + fbm(x * 4.5, y * 4.5) * 0.18))
        .lerp(new THREE.Color('#77806c'), lichen * 0.28);
    }
    return { height: h, color };
  }

  return null;
}
