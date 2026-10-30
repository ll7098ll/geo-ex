import * as THREE from 'three';

export type Contour3DTheme = 'gold' | 'ink' | 'cyan';

export interface ContourShaderParams {
  showContours: boolean;
  contourInterval: number;
  indexInterval: number;
  highlightElevation: number | null;
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
  uIndexColor: { value: THREE.Color };
  uIntermediateColor: { value: THREE.Color };
  uHighlightColor: { value: THREE.Color };
  uThickness: { value: number };
  uIndexThickness: { value: number };
  uShowValleyRidge: { value: number };
  uShowSlopeHeat: { value: number };
}

/**
 * Creates standardized uniform objects for the 3D contour isoline shader
 */
export function createContourShaderUniforms(params: ContourShaderParams): TerrainShaderUniforms {
  const themeColors = getThemeColors(params.theme || 'gold');

  return {
    uShowContours: { value: params.showContours ? 1.0 : 0.0 },
    uContourInterval: { value: Math.max(0.01, params.contourInterval) },
    uIndexInterval: { value: Math.max(0.02, params.indexInterval) },
    uHighlightElevation: { value: params.highlightElevation ?? -999.0 },
    uIndexColor: { value: themeColors.index },
    uIntermediateColor: { value: themeColors.intermediate },
    uHighlightColor: { value: themeColors.highlight },
    uThickness: { value: params.thickness ?? 1.5 },
    uIndexThickness: { value: params.indexThickness ?? 2.4 },
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
        index: new THREE.Color('#1c1917'), // dark charcoal ink
        intermediate: new THREE.Color('#44403c'), // medium charcoal
        highlight: new THREE.Color('#0284c7'), // sky blue
      };
    case 'cyan':
      return {
        index: new THREE.Color('#38bdf8'), // bright cyan
        intermediate: new THREE.Color('#94a3b8'), // subtle silver slate
        highlight: new THREE.Color('#facc15'), // bright amber
      };
    case 'gold':
    default:
      return {
        index: new THREE.Color('#f59e0b'), // warm amber gold
        intermediate: new THREE.Color('#ffffff'), // crisp white
        highlight: new THREE.Color('#00f0ff'), // neon laser cyan
      };
  }
}

/**
 * Injects 3D contour isoline GLSL into Three.js MeshStandardMaterial shader
 */
export function injectContourShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  uniforms: TerrainShaderUniforms
) {
  // Bind uniform references
  Object.assign(shader.uniforms, uniforms);

  // 1. Vertex Shader Injection: export local position & normal
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

  // 2. Fragment Shader Injection: Isoline, Valley/Ridge & Slope pixel shader calculation
  shader.fragmentShader = `
    varying vec3 vTerrainLocalPos;
    varying vec3 vTerrainNormal;

    uniform float uShowContours;
    uniform float uContourInterval;
    uniform float uIndexInterval;
    uniform float uHighlightElevation;
    uniform vec3 uIndexColor;
    uniform vec3 uIntermediateColor;
    uniform vec3 uHighlightColor;
    uniform float uThickness;
    uniform float uIndexThickness;
    uniform float uShowValleyRidge;
    uniform float uShowSlopeHeat;

    ${shader.fragmentShader}
  `.replace(
    '#include <dithering_fragment>',
    `
    #include <dithering_fragment>

    // 1. Slope Heatmap Overlay (Gentle <15 deg, Moderate 15-32 deg, Steep >32 deg)
    if (uShowSlopeHeat > 0.5 && vTerrainNormal.z > 0.05 && vTerrainLocalPos.z > -1.15) {
      float cosTheta = clamp(vTerrainNormal.z, 0.0, 1.0);
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

    // 2. Valley (계곡) & Ridge (능선) Guidance Overlay
    if (uShowValleyRidge > 0.5 && vTerrainNormal.z > 0.08 && vTerrainLocalPos.z > -1.15) {
      vec3 dNdx = dFdx(vTerrainNormal);
      vec3 dNdy = dFdy(vTerrainNormal);
      // Divergence of surface normal gives convex (ridge) vs concave (valley)
      float divN = (dNdx.x + dNdy.y) * 4.5;
      float ridgeWeight = smoothstep(0.06, 0.24, divN);
      float valleyWeight = smoothstep(0.06, 0.24, -divN);

      if (valleyWeight > 0.05) {
        vec3 valleyWaterBlue = vec3(0.04, 0.78, 0.96);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, valleyWaterBlue, valleyWeight * 0.72);
      } else if (ridgeWeight > 0.05) {
        vec3 ridgeAmberRed = vec3(0.98, 0.32, 0.12);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, ridgeAmberRed, ridgeWeight * 0.72);
      }
    }

    // 3. 3D Contour Isolines (Intermediate, Index & Highlight)
    if (uShowContours > 0.5 && vTerrainNormal.z > 0.10 && vTerrainLocalPos.z > -1.15) {
      float elev = vTerrainLocalPos.z;
      // Screen-space derivative for constant pixel thickness regardless of camera distance
      float df = max(fwidth(elev), 0.0004);

      // Intermediate contour lines
      float safeInter = max(0.005, uContourInterval);
      float distInter = abs(fract(elev / safeInter + 0.5) - 0.5) * safeInter;
      float lineInter = 1.0 - smoothstep(0.0, df * uThickness, distInter);

      // Index contour lines (every 5th interval)
      float safeIndex = max(0.01, uIndexInterval);
      float distIndex = abs(fract(elev / safeIndex + 0.5) - 0.5) * safeIndex;
      float lineIndex = 1.0 - smoothstep(0.0, df * uIndexThickness, distIndex);

      // Highlighted single contour line (e.g. hovered elevation)
      float lineHighlight = 0.0;
      if (uHighlightElevation > -900.0) {
        float distHl = abs(elev - uHighlightElevation);
        lineHighlight = 1.0 - smoothstep(0.0, df * (uIndexThickness * 1.8), distHl);
      }

      // Blend contour lines smoothly with lighting
      if (lineHighlight > 0.01) {
        vec3 hlGlow = uHighlightColor * 1.35;
        gl_FragColor.rgb = mix(gl_FragColor.rgb, hlGlow, lineHighlight * 0.95);
      } else if (lineIndex > 0.01) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uIndexColor, lineIndex * 0.88);
      } else if (lineInter > 0.01) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uIntermediateColor, lineInter * 0.62);
      }
    }
    `
  );
}
