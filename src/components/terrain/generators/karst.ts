import * as THREE from 'three';
import { fbm, smoothstep, mixColor, TerrainEvalResult } from '../terrainMath';

export function evalKarstTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const color = new THREE.Color();
  let h = 0;

  // 1. 돌리네 & 우발라 (석회암 용식 함몰 깔때기 지형 - 단양 도담삼봉 부근, 문경 돌리네 습지)
  if (normSub === '돌리네') {
    // 석회암 고원 지형
    const plateau = 3.6 + fbm(x * 0.4, y * 0.4) * 0.4;

    // 돌리네 1 (중앙 깔때기형 돌리네)
    const d1 = Math.sqrt(Math.pow(x + 1.2, 2) + Math.pow(y + 0.8, 2));
    const doline1 = d1 < 2.4 ? Math.cos((d1 / 2.4) * Math.PI * 0.5) * 2.8 : 0;
    
    // 돌리네 2 (인접한 돌리네가 합쳐져 복합 와지가 된 우발라/Uvala 연결부)
    const d2 = Math.sqrt(Math.pow(x - 2.8, 2) + Math.pow(y - 1.4, 2));
    const doline2 = d2 < 2.2 ? Math.cos((d2 / 2.2) * Math.PI * 0.5) * 2.4 : 0;

    // 돌리네 3 (소형 돌리네)
    const d3 = Math.sqrt(Math.pow(x + 3.2, 2) + Math.pow(y - 2.5, 2));
    const doline3 = d3 < 1.6 ? Math.cos((d3 / 1.6) * Math.PI * 0.5) * 1.8 : 0;

    // 중심 배수구(Ponor / 싱크홀 구멍)
    const isPonor = (d1 < 0.5) || (d2 < 0.45);
    const ponorDrop = isPonor ? 0.6 : 0;

    h = Math.max(0.28, (plateau - Math.max(doline1, doline2, doline3) - ponorDrop + fbm(x * 1.5, y * 1.5) * 0.12) * reliefScale);

    if (isPonor) {
      // 지하수 유입구 폰오르(Ponor) 암석 틈
      color.set(mixColor('#1c1714', '#2b231f', fbm(x * 6, y * 6)));
    } else if (d1 < 1.8 || d2 < 1.6) {
      // 돌리네 바닥: 석회암 풍화로 집적된 붉은색 테라로사(Terra Rossa) 잔적토
      color.set(mixColor('#7a2b1b', '#963926', fbm(x * 4, y * 4)));
    } else if (h > 3.2 * reliefScale) {
      // 석회암 노두(Outcrop) 회백색 암치와 초본류
      color.set(mixColor('#7d8076', '#999c92', fbm(x * 4, y * 4)));
    } else {
      // 고원 식생
      color.set(mixColor('#415731', '#546e40', fbm(x * 2, y * 2)));
    }
    return { height: h, color };
  }

  // 2. 탑 카르스트 (열대 석회암 잔구 봉림 - 중국 구이린, 베트남 하롱베이)
  if (normSub === '탑 카르스트') {
    // 평탄한 용식 평야 또는 에메랄드빛 카르스트 만(Bay) 기저면
    h = (0.42 + fbm(x * 0.5, y * 0.5) * 0.1) * reliefScale;

    // 수직으로 우뚝 솟아오른 웅장한 모놀리스 석회암 석봉(Towers) 4기
    const towers = [
      { tx: -2.5, ty: -1.5, r: 1.8, h: 5.4 }, // 중앙 주봉
      { tx: 2.8, ty: 1.8, r: 1.5, h: 4.6 },   // 제2 석봉
      { tx: -2.2, ty: 3.2, r: 1.2, h: 3.8 },  // 제3 석봉
      { tx: 3.2, ty: -2.8, r: 1.3, h: 4.0 },  // 제4 석봉
    ];

    let maxTowerH = 0;
    for (const t of towers) {
      const td = Math.sqrt(Math.pow(x - t.tx, 2) + Math.pow(y - t.ty, 2));
      if (td < t.r) {
        // 급경사 수직 기둥 벽면과 상부의 완만한 돔 (Mogote / Peak profile)
        const profile = Math.pow(Math.cos((td / t.r) * Math.PI * 0.5), 0.28);
        
        // 수평 용식 홈(Solution notches)
        const notch = Math.sin(profile * 12.0) * 0.15;
        maxTowerH = Math.max(maxTowerH, profile * t.h + notch);
      }
    }

    h = Math.max(h, (maxTowerH + fbm(x * 2, y * 2) * 0.15) * reliefScale);

    if (maxTowerH > 1.2) {
      if (maxTowerH > 3.6) {
        // 탑 정상부: 울창한 아열대 석회암 상록활엽수림
        color.set(mixColor('#1d4722', '#2a5e30', fbm(x * 5, y * 5)));
      } else {
        // 수직 암벽: 회백색 석회암과 검은색 조류/균류 줄무늬 (Solution fluting)
        color.set(mixColor('#545759', '#707478', fbm(x * 7, y * 7)));
      }
    } else {
      // 기저부 평야 논밭 및 비취색 완충 수면
      color.set(mixColor('#2b5735', '#3a7347', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 3. 석회동굴 (단양 고수동굴, 삼척 환선굴, 울진 성류굴)
  if (normSub === '석회동굴') {
    // 웅장한 석회암 산지 및 동굴 입구 협곡
    const canyonX = Math.sin(y * 0.4) * 1.5;
    const distToCanyon = Math.abs(x - canyonX);

    // 산체 높이
    const mountainH = 3.8 + fbm(x * 0.6, y * 0.6) * 0.8;

    // 동굴 입구 거대 아치 개구부 (Cave Portal at y = 0)
    const portalDist = Math.sqrt(Math.pow(x - canyonX, 2) + Math.pow(y, 2));
    const inPortal = portalDist < 2.2;
    const portalHollow = inPortal ? Math.cos((portalDist / 2.2) * Math.PI * 0.5) * 3.2 : 0;

    h = Math.max(0.4, (mountainH - portalHollow + fbm(x * 1.5, y * 1.5) * 0.15) * reliefScale);

    if (inPortal && portalDist < 1.5) {
      // 동굴 입구 그늘 및 암흑의 심연
      color.set(mixColor('#0a0908', '#171412', fbm(x * 6, y * 6)));
    } else if (distToCanyon < 2.0) {
      // 석회암 절벽면 및 탄산칼슘 유석 노출면
      color.set(mixColor('#575249', '#736d62', fbm(x * 5, y * 5)));
    } else {
      // 온대 석회암 카르스트 산림
      color.set(mixColor('#384e2a', '#4c693a', fbm(x * 2, y * 2)));
    }
    return { height: h, color };
  }

  // 4. 카렌 (빗물에 녹아 뼈처럼 드러난 석회암 노두 - 평창 백룡동굴 지표, 일본 아키요시대)
  if (normSub === '카렌') {
    // 기복이 완만한 석회암 고원
    const baseH = 2.4 + fbm(x * 0.3, y * 0.3) * 0.4;

    // 홈 모양 용식구(Rinnenkarren) 및 깊은 십자형 용식 틈새(Grykes)
    const fx = Math.abs(Math.sin(x * 2.8 + fbm(y * 0.5, 0) * 1.2));
    const fy = Math.abs(Math.sin(y * 2.8 + fbm(0, x * 0.5) * 1.2));
    const isClint = fx > 0.35 && fy > 0.35; // 평평한 석회암 기둥 블록(Clints)
    const isGryke = !isClint;               // 틈새(Gryke)

    const clintH = isClint ? 0.75 : 0;
    const grykeDepth = isGryke ? -0.45 : 0;

    h = (baseH + clintH + grykeDepth + fbm(x * 2, y * 2) * 0.1) * reliefScale;

    if (isClint) {
      // 빗물에 씻겨 하얗게 드러난 순수 석회암 블록 (Clint)
      color.set(mixColor('#a6a8a3', '#c2c4bf', fbm(x * 6, y * 6)));
    } else {
      // 깊은 틈새에 채워진 붉은 테라로사 토양과 틈새 잡초
      color.set(mixColor('#783424', '#475430', fbm(x * 4, y * 4)));
    }
    return { height: h, color };
  }

  return null;
}
