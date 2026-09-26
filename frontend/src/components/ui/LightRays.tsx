import React, { useEffect, useRef } from "react";

export type RayOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "left-center"
  | "right-center"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "center";

export interface LightRaysProps {
  raysOrigin?: RayOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  let cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return [1.0, 1.0, 1.0];
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
};

const getOriginCoords = (origin: RayOrigin): [number, number] => {
  switch (origin) {
    case "top-left":
      return [0.0, 1.0];
    case "top-right":
      return [1.0, 1.0];
    case "top-center":
      return [0.5, 1.05];
    case "bottom-left":
      return [0.0, 0.0];
    case "bottom-right":
      return [1.0, 0.0];
    case "bottom-center":
      return [0.5, -0.05];
    case "left-center":
      return [-0.05, 0.5];
    case "right-center":
      return [1.05, 0.5];
    case "center":
    default:
      return [0.5, 0.5];
  }
};

export const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = "top-center",
  raysColor = "#ffffff",
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0,
  distortion = 0,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    const gl = (canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
      })) as WebGLRenderingContext | null;

    if (!gl) return;

    const syncSize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
      const h = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform vec2 u_origin;
      uniform vec3 u_color;
      uniform float u_speed;
      uniform float u_spread;
      uniform float u_length;
      uniform float u_pulsating;
      uniform float u_fade;
      uniform float u_saturation;
      uniform float u_mouse_influence;
      uniform float u_noise;
      uniform float u_distortion;

      // Pseudo-random noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Smooth noise for ray fluctuations
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = v_uv;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        // Responsive origin influenced by mouse
        vec2 mouseNorm = u_mouse / u_resolution;
        vec2 origin = u_origin + (mouseNorm - u_origin) * (u_mouse_influence * 0.25);

        vec2 dir = (uv - origin) * aspect;
        float dist = length(dir);

        // Angular calculation for downward volumetric rays
        float angle = atan(-dir.y, dir.x);

        // Apply distortion if enabled
        if (u_distortion > 0.0) {
          angle += sin(dist * 6.0 - u_time * u_speed * 1.5) * (u_distortion * 0.2);
        }

        float t = u_time * u_speed;

        // Volumetric ray harmonic streams with distinct peaks
        float b1 = sin(angle * (4.0 * u_spread) + t * 0.5);
        float b2 = sin(angle * (9.0 * u_spread) - t * 0.75);
        float b3 = sin(angle * (16.0 * u_spread) + t * 1.1);
        float b4 = cos(angle * (25.0 * u_spread) - t * 1.4);

        float beam = (b1 * 0.40 + b2 * 0.32 + b3 * 0.18 + b4 * 0.10);
        beam = smoothstep(-0.15, 0.85, beam);
        beam = pow(beam, 1.4);

        // Distance attenuation with strong forward projection
        float reach = max(u_length * 1.2, 1.5);
        float falloff = clamp(1.0 - (dist / reach), 0.0, 1.0);
        falloff = pow(falloff, 0.85) * u_fade;

        // Radiant origin core glow
        float coreGlow = exp(-dist * 2.2) * 1.3;

        // Ambient ray atmosphere
        float atmosphere = exp(-dist * 0.7) * 0.45;

        float totalLight = (beam * falloff * 2.2 + coreGlow + atmosphere * (beam * 0.9 + 0.3));

        // Pulsating effect modulation
        if (u_pulsating > 0.5) {
          totalLight *= (0.85 + 0.15 * sin(t * 2.5));
        }

        // Grain / Noise addition
        if (u_noise > 0.0) {
          float grain = hash(uv * 400.0 + fract(t)) * u_noise * 0.15;
          totalLight += grain;
        }

        // Color computation with vivid saturation
        vec3 baseColor = u_color;
        vec3 rayColor = baseColor * u_saturation;

        // Brilliant bright highlight along ray cores
        vec3 coreColor = mix(rayColor, vec3(0.92, 1.0, 0.92), clamp(coreGlow * 0.7, 0.0, 1.0));

        // Dark background base (#080c14)
        vec3 bg = vec3(0.035, 0.047, 0.08);

        vec3 finalColor = bg + coreColor * totalLight;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uOrigin = gl.getUniformLocation(prog, "u_origin");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uSpeed = gl.getUniformLocation(prog, "u_speed");
    const uSpread = gl.getUniformLocation(prog, "u_spread");
    const uLength = gl.getUniformLocation(prog, "u_length");
    const uPulsating = gl.getUniformLocation(prog, "u_pulsating");
    const uFade = gl.getUniformLocation(prog, "u_fade");
    const uSaturation = gl.getUniformLocation(prog, "u_saturation");
    const uMouseInfluence = gl.getUniformLocation(prog, "u_mouse_influence");
    const uNoise = gl.getUniformLocation(prog, "u_noise");
    const uDistortion = gl.getUniformLocation(prog, "u_distortion");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      if (!followMouse) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        mouse.x = (e.clientX - rect.left) * dpr;
        mouse.y = (rect.height - (e.clientY - rect.top)) * dpr;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const [ox, oy] = getOriginCoords(raysOrigin);
    const rgb = hexToRgb(raysColor);

    gl.disable(gl.BLEND);

    const render = (t: number) => {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);

      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uOrigin) gl.uniform2f(uOrigin, ox, oy);
      if (uColor) gl.uniform3f(uColor, rgb[0], rgb[1], rgb[2]);
      if (uSpeed) gl.uniform1f(uSpeed, raysSpeed);
      if (uSpread) gl.uniform1f(uSpread, lightSpread);
      if (uLength) gl.uniform1f(uLength, rayLength);
      if (uPulsating) gl.uniform1f(uPulsating, pulsating ? 1.0 : 0.0);
      if (uFade) gl.uniform1f(uFade, fadeDistance);
      if (uSaturation) gl.uniform1f(uSaturation, saturation);
      if (uMouseInfluence)
        gl.uniform1f(uMouseInfluence, followMouse ? mouseInfluence : 0.0);
      if (uNoise) gl.uniform1f(uNoise, noiseAmount);
      if (uDistortion) gl.uniform1f(uDistortion, distortion);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(buf);
    };
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none ${className}`}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};

export default LightRays;
