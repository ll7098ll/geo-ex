# 📐 절차적 3D 지형 생성 수식 및 셰이더 가이드 (Procedural Terrain Math & Shaders)

> **지형 탐험가 (Geography Explorer)**의 핵심 렌더링 엔진인 **수학적 노이즈 알고리즘**, **26종 세부 지형의 표고 수식 모델($z = f(x, y)$)**, 그리고 **커스텀 GLSL 등고선 셰이더** 파이프라인의 수식과 구현 원리를 상세히 기술합니다.

---

## 📌 1. 수치 노이즈 기반 엔진 (`src/components/terrain/terrainMath.ts`)

지형의 불규칙한 자연 경관과 지표 요철은 결정론적 의사 난수(PRNG)와 다차원 보간 노이즈 함수를 기반으로 연산됩니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Math Pipeline Hierarchy                         │
├────────────────────────────────────────────────────────────────────────┤
│  [1. PRNG]         random(seed) ──▶ sin-based deterministic hash       │
│  [2. Value Noise]  noise(x, y)  ──▶ Bilinear Smoothstep Interpolation  │
│  [3. Multi-Octave] fbm(x, y)    ──▶ Amplitude Decay & Frequency Double │
│  [4. Non-linear]   warpedFbm()  ──▶ Domain Warping Fluid Fold          │
│  [5. Cellular]     hexVoronoi() ──▶ Hexagonal Tessellation (Basalt)   │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.1 결정론적 의사 난수 생성기 (PRNG)
부동 소수점 삼각함수의 소수점 잔차(Fractional part)를 활용하여 시드에 따라 항상 동일한 의사 난수를 반환합니다.
$$R(s) = \operatorname{fract}(\sin(s) \times 43758.5453123)$$

### 1.2 2D 밸류 노이즈 및 스무스스텝 보간
2차원 정수 격자점 $(i, j)$의 해시값에 대해 Hermite 스무스스텝 곡선 $S(t) = 3t^2 - 2t^3$을 적용하여 부드러운 바이리니어 보간을 수행합니다.
$$u = S(x - \lfloor x \rfloor), \quad v = S(y - \lfloor y \rfloor)$$
$$N(x, y) = (1-u)(1-v)H_{00} + u(1-v)H_{10} + (1-u)vH_{01} + uvH_{11}$$

### 1.3 분수 브라운 운동 (Fractional Brownian Motion, fBm)
옥타브 $k$가 증가할 때마다 진폭은 지수적으로 감쇠($\text{persistence} = 0.5$)하고 주파수는 2배씩 증가($\text{lacunarity} = 2.0$)시켜 자연스러운 다중 스케일 프랙탈 질감을 생성합니다.
$$\operatorname{fBm}(x, y) = \sum_{k=0}^{M-1} A_0 \cdot p^k \cdot N(x \cdot l^k, y \cdot l^k)$$

### 1.4 도메인 왜곡 (Domain Warping)
노이즈 함수의 입력 좌표를 또 다른 2차원 노이즈 벡터장으로 비틀어줌으로써 지각의 횡압력 습곡이나 점성 유체의 복잡한 침식 패턴을 생성합니다.
$$q = \begin{pmatrix} \operatorname{fBm}(x, y) \\ \operatorname{fBm}(x + 5.2, y + 1.3) \end{pmatrix}$$
$$r = \begin{pmatrix} \operatorname{fBm}(x + 4.0 q_x + 1.7, y + 4.0 q_y + 9.2) \\ \operatorname{fBm}(x + 4.0 q_x + 8.3, y + 4.0 q_y + 2.8) \end{pmatrix}$$
$$W(x, y) = \operatorname{fBm}(x + 4.0 r_x, y + 4.0 r_y)$$

### 1.5 6각형 보로노이 격자 (`hexVoronoi`)
주상절리의 냉각 수축 육각 기둥 패턴을 생성하기 위해 정삼각형 격자의 이중 축을 비틀어 가장 가까운 육각 격자 중심점까지의 거리 $d_{\min}$를 연산합니다.

---

## 🏔️ 2. 26종 세부 지형 표고 수식 모델 ($z = f(x, y)$)

좌표계는 중심이 원점 $(0, 0)$이고 $x, y \in [-1, 1]$ 정규화된 3D 쿼드 그리드(기본 80x80) 상에서 정의됩니다. 반환값 $z$는 기준 높이 스케일(기본 $z \in [0, 1.2]$)로 정규화됩니다.

### 2.1 화산 지형군 (`generators/volcanic.ts`)
1. **순상/성층 화산 (`generateVolcano`)**:
   - 가우스 벨 곡선(Gaussian Cone) + 정상 분화구(Crater) 함몰 + 방사상 용암류 골짜기:
     $$r = \sqrt{x^2 + y^2}$$
     $$z_{\text{cone}} = H \cdot \exp\left(-\frac{r^2}{2\sigma^2}\right)$$
     $$z_{\text{crater}} = C_{\text{depth}} \cdot \exp\left(-\frac{r^2}{2r_c^2}\right)$$
     $$z = \max\left(0, z_{\text{cone}} - z_{\text{crater}} + 0.15 \cdot \operatorname{fBm}(3x, 3y)\right)$$
2. **칼데라 (`generateCaldera`)**:
   - 광폭 외륜산 테두리 고리(Ring) 융기 + 칼데라호 중심 저지대 평탄화:
     $$z_{\text{ring}} = H \cdot \exp\left(-\frac{(r - r_{\text{rim}})^2}{2\sigma_{\text{rim}}^2}\right)$$
     $$z = \max(Z_{\text{water}}, z_{\text{ring}} + 0.08 \cdot \operatorname{fBm}(4x, 4y))$$
3. **주상절리 (`generateColumnarJointing`)**:
   - 육각 보로노이 셀 거리 $d_{\text{hex}}$에 따른 수직 단차 계단화(Quantization):
     $$z = \operatorname{round}(N(x, y) \cdot K) / K - 0.05 \cdot d_{\text{hex}}$$
4. **단층 산맥 (`generateFaultMountain`)**:
   - 중앙 단층선 $x=0$을 기준으로 비대칭 융기 및 단층애(Fault Scarp) 형성:
     $$z = \frac{1}{1 + \exp(-k \cdot x)} \cdot H_{\text{scarp}} + \text{fBm}(2x, 2y)$$

---

### 2.2 해안 지형군 (`generators/coastal.ts`)
1. **갯벌 (`generateTidalFlat`)**:
   - 극도로 완만한 조간대 평면 사면 + 수지상 조석 갯골(Tidal Drainage Channels):
     $$z_{\text{base}} = 0.05 \cdot (1 - y)$$
     $$\text{channels} = \left|\operatorname{warpedFbm}(4x, 4y) - 0.5\right|$$
     $$z = \max\left(0.01, z_{\text{base}} - 0.08 \cdot \exp(-20 \cdot \text{channels}^2)\right)$$
2. **해식애 & 파식대 (`generateSeaCliff`)**:
   - 해식 절벽 스텝 함수 $S(x)$와 절벽 밑 해수면 부근 파식대 평탄화:
     $$z = \operatorname{smoothstep}(-0.2, 0.2, x) \cdot H_{\text{cliff}} + 0.05 \cdot \text{noise}(4x, 4y)$$
3. **시스택 (`generateSeaStack`)**:
   - 해안선 인근 고립된 바위 기둥 원통형 융기:
     $$z = H_{\text{stack}} \cdot \exp\left(-\frac{(x - x_0)^2 + (y - y_0)^2}{2r_s^2}\right) \cdot (1 + 0.2 \cdot \text{noise}(6x, 6y))$$

---

### 2.3 하천 지형군 (`generators/fluvial.ts`)
1. **선상지 (`generateAlluvialFan`)**:
   - 산지 골짜기 출구(선정 $y=1$)로부터 평지(선단 $y=-1$)로 펼쳐지는 방사상 부채꼴 콘:
     $$\theta = \arctan2(x, y - 1)$$
     $$z = \max\left(0, (1 - r) \cdot H \cdot \cos^2(\theta) + 0.05 \cdot \text{fBm}(5x, 5y)\right)$$
2. **곡류천 및 우각호 (`generateMeander`)**:
   - 사인파 기반 사행 수로 궤적 $x_{\text{river}}(y) = A \sin(\omega y) + B \sin(2\omega y)$:
     $$d_{\text{river}} = |x - x_{\text{river}}(y)|$$
     $$z = H_{\text{floodplain}} \cdot \left(1 - \exp\left(-\frac{d_{\text{river}}^2}{2w^2}\right)\right)$$
3. **하안단구 (`generateRiverTerrace`)**:
   - 수직 침식과 주기적 융기에 따른 다단 계단식(Staircase) 양안 평탄면:
     $$z = \lfloor z_{\text{raw}} \cdot N_{\text{levels}}\rfloor / N_{\text{levels}} + \text{slope}(y)$$

---

### 2.4 카르스트, 빙하, 건조 지형군
- **돌리네/싱크홀 (`generators/karst.ts`)**:
  - 완만한 석회암 고원에 국소적 깔때기형 역원추 음의 변위 주입:
    $$z = z_{\text{plateau}} - \sum_{k} D_k \cdot \exp\left(-\frac{(x - x_k)^2 + (y - y_k)^2}{2R_k^2}\right)$$
- **U자곡 (`generators/glacial.ts`)**:
  - 빙하의 강력한 침식력에 의한 포물선 또는 고차 다항 단면 수로:
    $$z(x, y) = H_{\text{valley}} \cdot \left(\frac{x}{w}\right)^4 + \text{fBm}(2x, 2y)$$
- **바르한 사구 (`generators/arid.ts`)**:
  - 탁월풍 방향에 따른 완경사 풍상측과 급경사 슬립페이스(Slip face) 비대칭 초승달 곡면.

---

## 🎨 3. 커스텀 GLSL 등고선 셰이더 (`src/components/terrain/contour/terrainContourShader.ts`)

3D 디오라마 상에 실시간으로 등고선 밴드를 투영하기 위해 표준 Three.js 셰이더를 커스텀 머티리얼로 확장합니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GLSL Shader Pipeline                            │
├────────────────────────────────────────────────────────────────────────┤
│  [Vertex Shader]                                                       │
│    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;           │
│    vElevation = position.z; // 표고값 정규화 전달                       │
│                                                                        │
│  [Fragment Shader]                                                     │
│    fractElevation = fract(vElevation * contourFrequency);             │
│    // 주곡선(Index) 및 간곡선(Intermediate) 안티앨리어싱 선폭 연산     │
│    float lineIntensity = smoothstep(0.0, fwidth(fractElevation), ...); │
│    gl_FragColor = mix(surfaceColor, contourLineColor, lineIntensity);  │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 등고선 간격 및 선폭 안티앨리어싱
주곡선과 간곡선이 카메라 시점 거리나 줌 레벨에 상관없이 깨짐 없이 미려하게 표현되도록 화면 공간 미분 함수 `fwidth()`를 사용합니다:

```glsl
uniform float uMajorInterval;    // 주곡선 주기
uniform float uMinorInterval;    // 간곡선 주기
uniform vec3 uMajorLineColor;    // 주곡선 색상 (황금색 #F59E0B)
uniform vec3 uMinorLineColor;    // 간곡선 색상 (연회색 #94A3B8)

void main() {
    float majorMod = abs(fract(vElevation / uMajorInterval - 0.5) - 0.5);
    float majorWidth = fwidth(vElevation / uMajorInterval) * 1.5;
    float isMajor = 1.0 - smoothstep(0.0, majorWidth, majorMod);

    float minorMod = abs(fract(vElevation / uMinorInterval - 0.5) - 0.5);
    float minorWidth = fwidth(vElevation / uMinorInterval) * 1.0;
    float isMinor = 1.0 - smoothstep(0.0, minorWidth, minorMod);

    vec3 finalColor = baseSurfaceColor;
    finalColor = mix(finalColor, uMinorLineColor, isMinor * 0.4);
    finalColor = mix(finalColor, uMajorLineColor, isMajor * 0.85);
    gl_FragColor = vec4(finalColor, 1.0);
}
```

### 3.2 고도 색채환 (Hypsometric Tinting)
해발 고도에 따라 색상을 연속 보간하는 5단계 색채환 램프(Color Ramp)를 정의합니다:
- **저지대/해안 (0.0 ~ 0.2)**: 짙은 녹색 (`#15803D`) ~ 연녹색 (`#86EFAC`)
- **중위 구릉 (0.2 ~ 0.5)**: 담황색 (`#FDE047`) ~ 황갈색 (`#D97706`)
- **고위 산악 (0.5 ~ 0.8)**: 암적갈색 (`#78350F`) ~ 암회색 (`#475569`)
- **만년설 정상 (0.8 ~ 1.0)**: 백설색 (`#F8FAFC`)

---

## 📊 4. 2D Marching Squares 등고선 추출 (`marchingSquares.ts`)

$80 \times 80$ DEM 격자의 인접한 4개 정점 표고가 특정 등고선 임계값 $z_{\text{iso}}$보다 높은지 낮은지에 따라 $2^4 = 16$가지 셀 토폴로지 케이스를 판별합니다.

```
       v0 --------- v1
       |     e0     |
       |            |
       e3          e1
       |            |
       |     e2     |
       v3 --------- v2
```

1. **상태 인덱스(Case Index)**:
   $$\text{index} = (v_0 > z_{\text{iso}} ? 8 : 0) | (v_1 > z_{\text{iso}} ? 4 : 0) | (v_2 > z_{\text{iso}} ? 2 : 0) | (v_3 > z_{\text{iso}} ? 1 : 0)$$
2. **모서리 선형 보간**:
   등고선이 지나는 모서리 분할점 $P$의 위치는 두 정점의 표고값으로부터 선형 보간됩니다:
   $$t = \frac{z_{\text{iso}} - Z_A}{Z_B - Z_A}, \quad P = P_A + t(P_B - P_A)$$
3. **벡터 세그먼트 생성**:
   추출된 선분 세그먼트들을 2D Canvas의 `stroke()` 패스로 렌더링하여 주곡선은 2.5px 굵은 선으로, 간곡선은 1.0px 얇은 선으로 고속 작도합니다.
