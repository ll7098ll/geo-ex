import * as THREE from 'three';

export type Contour3DTheme = 'gold' | 'ink' | 'cyan';

export interface ContourShaderParams {
  showContours: boolean;
  contourInterval: number;
  indexInterval: number;
  highlightElevation: number | null;
  waterLevel?: number | null;
  theme?: Contour3DTheme;
  thickness?: number;
  indexThickness?: number;
  showValleyRidgeGuide?: boolean;
  showSlopeHeat?: boolean;
}

export interface TerrainShaderUniforms {
  uShowContours: { value: number };
  uContourInterval: { value: number };
  uIndexInterval: { value: number };
  uHighlightElevation: { value: number };
  uWaterLevel: { value: number };
  uIndexColor: { value: THREE.Color };
  uIntermediateColor: { value: THREE.Color };
  uHighlightColor: { value: THREE.Color };
  uThickness: { value: number };
  uIndexThickness: { value: number };
  uShowValleyRidge: { value: number };
  uShowSlopeHeat: { value: number };
}

/**
 * Creates standardized uniform objects for the 3D contour isoline & cliff micro-detail shader
 */
export function createContourShaderUniforms(params: ContourShaderParams): TerrainShaderUniforms {
  const themeColors = getThemeColors(params.theme || 'gold');

  return {
    uShowContours: { value: params.showContours ? 1.0 : 0.0 },
    uContourInterval: { value: Math.max(0.01, params.contourInterval) },
    uIndexInterval: { value: Math.max(0.02, params.indexInterval) },
    uHighlightElevation: { value: params.highlightElevation ?? -999.0 },
    uWaterLevel: { value: params.waterLevel ?? -999.0 },
    uIndexColor: { value: themeColors.index },
    uIntermediateColor: { value: themeColors.intermediate },
    uHighlightColor: { value: themeColors.highlight },
    uThickness: { value: params.thickness ?? 1.45 },
    uIndexThickness: { value: params.indexThickness ?? 2.35 },
    uShowValleyRidge: { value: params.showValleyRidgeGuide ? 1.0 : 0.0 },
    uShowSlopeHeat: { value: params.showSlopeHeat ? 1.0 : 0.0 },
  };
}

/**
 * Updates uniforms safely without shader recompilation
 */
export function updateContourShaderUniforms(
  uniforms: TerrainShaderUniforms,
  params: ContourShaderParams
) {
  uniforms.uShowContours.value = params.showContours ? 1.0 : 0.0;
  uniforms.uContourInterval.value = Math.max(0.01, params.contourInterval);
  uniforms.uIndexInterval.value = Math.max(0.02, params.indexInterval);
  uniforms.uHighlightElevation.value = params.highlightElevation ?? -999.0;
  uniforms.uWaterLevel.value = params.waterLevel ?? -999.0;
  uniforms.uShowValleyRidge.value = params.showValleyRidgeGuide ? 1.0 : 0.0;
  uniforms.uShowSlopeHeat.value = params.showSlopeHeat ? 1.0 : 0.0;

  const themeColors = getThemeColors(params.theme || 'gold');
  uniforms.uIndexColor.value.copy(themeColors.index);
  uniforms.uIntermediateColor.value.copy(themeColors.intermediate);
  uniforms.uHighlightColor.value.copy(themeColors.highlight);

  if (params.thickness !== undefined) uniforms.uThickness.value = params.thickness;
  if (params.indexThickness !== undefined) uniforms.uIndexThickness.value = params.indexThickness;
}

function getThemeColors(theme: Contour3DTheme) {
  switch (theme) {
    case 'ink':
      return {
        index: new THREE.Color('#1c1917'),
        intermediate: new THREE.Color('#44403c'),
        highlight: new THREE.Color('#0284c7'),
      };
    case 'cyan':
      return {
        index: new THREE.Color('#38bdf8'),
        intermediate: new THREE.Color('#94a3b8'),
        highlight: new THREE.Color('#facc15'),
      };
    case 'gold':
    default:
      return {
        index: new THREE.Color('#f59e0b'),
        intermediate: new THREE.Color('#ffffff'),
        highlight: new THREE.Color('#00f0ff'),
      };
  }
}

/**
 * Injects triplanar cliff micro-relief shading + 3D contour isoline GLSL into MeshStandardMaterial
 */
export function injectContourShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  uniforms: TerrainShaderUniforms
) {
  Object.assign(shader.uniforms, uniforms);

  shader.vertexShader = `
    varying vec3 vTerrainLocalPos;
    varying vec3 vTerrainNormal;
    ${shader.vertexShader}
  `.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    vTerrainLocalPos = position;
    vTerrainNormal = normal;
    `
  );

  shader.fragmentShader = `
    varying vec3 vTerrainLocalPos;
    varying vec3 vTerrainNormal;

    uniform float uShowContours;
    uniform float uContourInterval;
    uniform float uIndexInterval;
    uniform float uHighlightElevation;
    uniform float uWaterLevel;
    uniform vec3 uIndexColor;
    uniform vec3 uIntermediateColor;
    uniform vec3 uHighlightColor;
    uniform float uThickness;
    uniform float uIndexThickness;
    uniform float uShowValleyRidge;
    uniform float uShowSlopeHeat;

    float terrainHash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float terrainValueNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(terrainHash(i + vec2(0.0, 0.0)), terrainHash(i + vec2(1.0, 0.0)), u.x),
        mix(terrainHash(i + vec2(0.0, 1.0)), terrainHash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    ${shader.fragmentShader}
  `.replace(
    '#include <dithering_fragment>',
    `
    #include <dithering_fragment>

    vec3 nrm = normalize(vTerrainNormal);
    bool isOuterSkirt = (abs(vTerrainLocalPos.x) > 9.985 || abs(vTerrainLocalPos.y) > 9.985 || vTerrainLocalPos.z < -1.30);
    bool isTopTerrain = !isOuterSkirt && nrm.z > 0.015;

    // 0. Triplanar-style steep rock cliff micro-bedding & crevice detail (prevents UV stretch on vertical cliffs!)
    if (isTopTerrain) {
      float cliffWeight = smoothstep(0.78, 0.25, nrm.z);
      if (cliffWeight > 0.01) {
        float triX = terrainValueNoise(vec2(vTerrainLocalPos.y * 5.5, vTerrainLocalPos.z * 14.0));
        float triY = terrainValueNoise(vec2(vTerrainLocalPos.x * 5.5, vTerrainLocalPos.z * 14.0));
        float strataGrain = mix(triX, triY, abs(nrm.y) / max(0.001, abs(nrm.x) + abs(nrm.y)));
        float rockShade = 0.88 + 0.24 * strataGrain;
        gl_FragColor.rgb *= mix(1.0, rockShade, cliffWeight * 0.65);
      }
      // Subtle ambient-occlusion darkening in deep narrow canyons & craters
      float cavityAO = smoothstep(-0.2, 1.1, vTerrainLocalPos.z);
      gl_FragColor.rgb *= (0.90 + 0.10 * cavityAO);
    }

    // 1. Slope Heatmap Overlay
    if (uShowSlopeHeat > 0.5 && isTopTerrain) {
      float cosTheta = clamp(nrm.z, 0.0, 1.0);
      float slopeDeg = acos(cosTheta) * 57.29578;
      vec3 slopeColor;
      if (slopeDeg < 15.0) {
        slopeColor = mix(vec3(0.12, 0.68, 0.38), vec3(0.42, 0.78, 0.22), slopeDeg / 15.0);
      } else if (slopeDeg < 32.0) {
        slopeColor = mix(vec3(0.92, 0.76, 0.12), vec3(0.96, 0.48, 0.12), (slopeDeg - 15.0) / 17.0);
      } else {
        slopeColor = mix(vec3(0.92, 0.22, 0.18), vec3(0.68, 0.06, 0.25), clamp((slopeDeg - 32.0) / 24.0, 0.0, 1.0));
      }
      gl_FragColor.rgb = mix(gl_FragColor.rgb, slopeColor, 0.45);
    }

    // 2. Valley & Ridge Guidance Overlay
    if (uShowValleyRidge > 0.5 && isTopTerrain && nrm.z > 0.08) {
      vec3 dNdx = dFdx(nrm);
      vec3 dNdy = dFdy(nrm);
      float divN = (dNdx.x + dNdy.y) * 4.5;
      float ridgeWeight = smoothstep(0.06, 0.24, divN);
      float valleyWeight = smoothstep(0.06, 0.24, -divN);

      if (valleyWeight > 0.05) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.04, 0.78, 0.96), valleyWeight * 0.72);
      } else if (ridgeWeight > 0.05) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.98, 0.32, 0.12), ridgeWeight * 0.72);
      }
    }

    // 3. 3D Contour Isolines (Suppressed on outer strata walls and submerged seafloors/riverbeds)
    bool aboveWater = (uWaterLevel < -900.0) || (vTerrainLocalPos.z >= uWaterLevel - 0.015);
    if (uShowContours > 0.5 && isTopTerrain && aboveWater) {
      float elev = vTerrainLocalPos.z;
      float df = max(fwidth(elev), 0.0004);

      float safeInter = max(0.005, uContourInterval);
      float distInter = abs(fract(elev / safeInter + 0.5) - 0.5) * safeInter;
      float lineInter = 1.0 - smoothstep(0.0, df * uThickness, distInter);

      float safeIndex = max(0.01, uIndexInterval);
      float distIndex = abs(fract(elev / safeIndex + 0.5) - 0.5) * safeIndex;
      float lineIndex = 1.0 - smoothstep(0.0, df * uIndexThickness, distIndex);

      float lineHighlight = 0.0;
      if (uHighlightElevation > -900.0) {
        float distHl = abs(elev - uHighlightElevation);
        lineHighlight = 1.0 - smoothstep(0.0, df * (uIndexThickness * 1.8), distHl);
      }

      // Attenuate intermediate lines slightly on near-vertical cliffs so clustered lines stay readable
      float cliffFade = smoothstep(0.015, 0.18, nrm.z);

      if (lineHighlight > 0.01) {
        vec3 hlGlow = uHighlightColor * 1.35;
        gl_FragColor.rgb = mix(gl_FragColor.rgb, hlGlow, lineHighlight * 0.95);
      } else if (lineIndex > 0.01) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uIndexColor, lineIndex * 0.88 * (0.45 + 0.55 * cliffFade));
      } else if (lineInter > 0.01) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uIntermediateColor, lineInter * 0.62 * cliffFade);
      }
    }
    `
  );
}
