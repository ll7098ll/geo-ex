import * as THREE from 'three';
import { fbm, hexVoronoi, smoothstep, mixColor, TerrainEvalResult } from '../terrainMath';

export function evalAridTerrain(
  normSub: string,
  x: number,
  y: number,
  reliefScale: number
): TerrainEvalResult | null {
  const d = Math.sqrt(x * x + y * y);
  const color = new THREE.Color();
  let h = 0;

  // 1. 사막 (바르한 초승달 사구군 - 사하라, 둔황 명사산)
  if (normSub === '사막') {
    // 바르한 사구 함수: 양쪽 뿔(Horns)이 바람 부는 방향(남쪽 y > 0)을 향함
    const barchan = (cx: number, cy: number, scale: number) => {
      const dx = (x - cx) / scale;
      const dy = (y - cy) / scale;
      const parabola = dy - 0.45 * dx * dx;
      if (parabola > -1.2 && parabola < 0.6 && Math.abs(dx) < 1.6) {
        // 완만한 바람받이 사면(Windward, 10-14도) vs 가파른 사태면(Slip face, 34도 안식각)
        const windward = parabola < 0 ? Math.exp(parabola * 2.2) : Math.exp(-parabola * 4.5);
        return windward * 3.4 * scale;
      }
      return 0;
    };

    const d1 = barchan(-1.5, 0.5, 1.4);
    const d2 = barchan(3.2, 2.5, 1.0);
    const d3 = barchan(-3.5, -2.8, 1.1);

    // 바람에 날린 정교한 모래 물결 무늬 (Eolian Sand Ripples)
    const ripples = Math.sin(x * 6.0 - y * 2.2) * 0.055;

    h = Math.max(0.3, (0.35 + Math.max(d1, d2, d3) + ripples + fbm(x * 0.8, y * 0.8) * 0.15) * reliefScale);

    // 붉은 황금빛 석영 사막 모래 톤
    color.set(mixColor('#cc964f', '#e5b36e', smoothstep(0.4, 3.2, h) + fbm(x * 4, y * 4) * 0.15));
    return { height: h, color };
  }

  // 2. 버섯바위 (바람에 날린 모래의 마식작용으로 밑동이 깎인 지형 - 대만 야류 여왕머리, 이집트 백사막)
  if (normSub === '버섯바위') {
    // 풍식 암반 평원
    h = (0.55 + fbm(x * 0.5, y * 0.5) * 0.18) * reliefScale;

    // 주 버섯바위(원점)와 보조 버섯바위(x=4.2, y=3.0)의 기저 마운드
    const p1 = Math.sqrt(x * x + y * y);
    const p2 = Math.sqrt(Math.pow(x - 4.2, 2) + Math.pow(y - 3.0, 2));

    if (p1 < 2.0) {
      // 버섯바위 지지대 기저 암반 마운드
      const baseRock = Math.pow(Math.cos((p1 / 2.0) * Math.PI * 0.5), 2.0) * 1.4;
      h = Math.max(h, (0.55 + baseRock) * reliefScale);
    }
    if (p2 < 1.4) {
      const baseRock2 = Math.pow(Math.cos((p2 / 1.4) * Math.PI * 0.5), 2.0) * 1.1;
      h = Math.max(h, (0.55 + baseRock2) * reliefScale);
    }

    if (p1 < 2.2 || p2 < 1.6) {
      // 사암(Sandstone) 풍화 잔적토와 삼릉석(Ventifacts)
      color.set(mixColor('#b5834e', '#cfa068', fbm(x * 5, y * 5)));
    } else {
      // 건조한 자갈 사막 지표면 (Reg / Desert Pavement)
      color.set(mixColor('#9e794b', '#87653d', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 3. 메사·뷰트 (수평 지층의 차별침식으로 형성된 탁자 모양 산과 잔구 - 미국 모뉴먼트 밸리)
  if (normSub === '메사·뷰트') {
    // 메사(Mesa): 넓은 수평 저항성 경암층 상부면과 수직 절벽 및 35도 애추(Talus apron) 사면
    const mesaDist = Math.max(Math.abs(x - (-3.0)) / 3.2, Math.abs(y - (-1.0)) / 2.4);
    let mesaH = 0;
    if (mesaDist < 0.65) {
      // 평평한 메사 정상면 (Tableland)
      mesaH = 4.5 + fbm(x * 0.8, y * 0.8) * 0.12;
    } else if (mesaDist < 0.95) {
      // 수직 낭떠러지 단애 (Vertical Rimrock Cliff)
      const prog = (0.95 - mesaDist) / 0.3;
      mesaH = 2.6 + prog * 1.9;
    } else if (mesaDist < 1.65) {
      // 무너져 내린 암설이 쌓인 애추(Talus Scree Apron, 35도 경사)
      const prog = (1.65 - mesaDist) / 0.7;
      mesaH = 0.65 + prog * 1.95;
    }

    // 뷰트(Butte): 메사가 침식되어 좁아진 고립된 탑 모양 잔구
    const butteDist = Math.sqrt(Math.pow(x - 4.2, 2) + Math.pow(y - 2.4, 2));
    let butteH = 0;
    if (butteDist < 0.75) {
      butteH = 4.2 + fbm(x * 2, y * 2) * 0.12;
    } else if (butteDist < 1.25) {
      butteH = 2.2 + ((1.25 - butteDist) / 0.5) * 2.0;
    } else if (butteDist < 2.3) {
      butteH = 0.65 + ((2.3 - butteDist) / 1.05) * 1.55;
    }

    const desertPlain = 0.55 + fbm(x * 0.4, y * 0.4) * 0.15;
    h = Math.max(desertPlain, Math.max(mesaH, butteH)) * reliefScale;

    // 퇴적암 수평 층리(Strata): 적갈색 사암과 황갈색 셰일 호층
    const strata = Math.sin(h * 6.0) * 0.5 + 0.5;
    if (h > 4.1 * reliefScale) {
      color.set(mixColor('#c4743f', '#d98a54', fbm(x * 5, y * 5)));
    } else if (h > 2.2 * reliefScale) {
      color.set(mixColor('#a34928', '#c25a34', strata));
    } else if (h > 0.9 * reliefScale) {
      color.set(mixColor('#b87349', '#cc8558', fbm(x * 4, y * 4)));
    } else {
      color.set(mixColor('#cfa067', '#dbae77', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 4. 와디 (건조 기후 지역의 건천 협곡 - 요르단 페트라 시크, 아라비아 와디)
  if (normSub === '와디') {
    // 깊게 굽이치며 파고든 슬롯 캐니언(Slot Canyon) 유로
    const wadiCurve = Math.sin(y * 0.42) * 2.6 + Math.cos(y * 0.2) * 1.0;
    const distToWadi = Math.abs(x - wadiCurve);
    const plateauH = 3.8 + fbm(x * 0.5, y * 0.5) * 0.5;

    if (distToWadi < 1.0) {
      // 평상시 바싹 마른 건천 하상 자갈 바닥
      h = (0.5 + fbm(x * 2, y * 2) * 0.1) * reliefScale;
      color.set(mixColor('#8c7e6f', '#a39485', fbm(x * 6, y * 6)));
    } else if (distToWadi < 2.0) {
      // 플래시 플러드(돌발 홍수)가 깎아낸 수직 사암 협곡 벽
      const wallProg = (distToWadi - 1.0) / 1.0;
      h = (0.5 + Math.pow(wallProg, 0.75) * 3.3) * reliefScale;
      const strata = Math.sin(h * 7.0) * 0.5 + 0.5;
      color.set(mixColor('#9c4527', '#bd5a39', strata));
    } else {
      // 건조한 사암 고원 지표
      h = plateauH * reliefScale;
      color.set(mixColor('#bd8750', '#d19a62', fbm(x * 3, y * 3)));
    }
    return { height: h, color };
  }

  // 5. 오아시스 (사막 한가운데 지하수가 솟아 형성된 생명의 오아시스 - 이집트 시와 오아시스)
  if (normSub === '오아시스') {
    // 사구로 둘러싸인 분지 형태
    const duneRim = Math.sin(x * 0.38) * Math.cos(y * 0.38) * 1.8 + fbm(x * 0.5, y * 0.5) * 0.5;
    const basinDrop = Math.exp(-d * d * 0.16) * 3.6;

    h = Math.max(0.38, (2.6 + duneRim - basinDrop) * reliefScale);

    if (d < 1.7) {
      // 맑고 투명한 에메랄드빛 오아시스 천연 담수호
      color.set(mixColor('#0c6375', '#168599', fbm(x * 4, y * 4)));
    } else if (d < 3.4) {
      // 대추야자(Date Palm) 나무와 수생 식생 띠
      color.set(mixColor('#225916', '#317321', fbm(x * 5, y * 5)));
    } else {
      // 바깥쪽 작열하는 황금빛 사막 모래
      color.set(mixColor('#d9a65f', '#ecbe7a', fbm(x * 2, y * 2)));
    }
    return { height: h, color };
  }

  // 6. 플라야 (건조 분지의 증발로 형성된 백색 염호 평원 - 볼리비아 우유니 소금사막, 데스밸리 배드워터)
  if (normSub === '플라야') {
    h = 0.28 * reliefScale;

    // 소금 결정의 수축으로 생성된 기하학적 육각형 다각형 소금 능선(Salt Polygons)
    const { dist } = hexVoronoi(x * 2.2, y * 2.2);
    const ridge = smoothstep(0.78, 0.95, dist);

    h += (ridge * 0.09 + fbm(x * 0.5, y * 0.5) * 0.03) * reliefScale;

    if (ridge > 0.4) {
      // 솟아오른 새하얀 암염 결정 융기선
      color.set(mixColor('#f2eeea', '#ffffff', fbm(x * 6, y * 6)));
    } else {
      // 얇은 물막이 거울처럼 하늘을 반사하는 평탄한 소금 대지
      color.set(mixColor('#d9d2c5', '#ece6db', fbm(x * 4, y * 4)));
    }
    return { height: h, color };
  }

  return null;
}
