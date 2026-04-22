'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* 
  Full-screen WebGL background that renders an animated, 
  scroll-reactive noise/wave displacement plane.
*/
export default function WebGLBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ──────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene ─────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    /* ── Shader ─────────────────────────────────────── */
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScroll;
      uniform vec2  uMouse;

      // ── Simple 2D hash ───────────────────────────────
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      // ── Value noise ──────────────────────────────────
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
          mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
          u.y
        );
      }

      // ── FBM ─────────────────────────────────────────
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = vUv;
        st.y += uScroll * 0.0003;

        // Mouse distortion
        vec2 mouseDist = st - uMouse;
        float mLen = length(mouseDist);
        st += mouseDist * 0.05 * (1.0 / (mLen * 8.0 + 1.0));

        vec2 q = vec2(
          fbm(st + vec2(0.0, 0.0) + uTime * 0.06),
          fbm(st + vec2(5.2, 1.3) + uTime * 0.04)
        );
        vec2 r = vec2(
          fbm(st + 4.0 * q + vec2(1.7, 9.2) + uTime * 0.05),
          fbm(st + 4.0 * q + vec2(8.3, 2.8) + uTime * 0.03)
        );

        float f = fbm(st + 4.0 * r);

        // Color gradient: deep navy → black with subtle cyan/violet tones
        vec3 col = mix(
          vec3(0.0, 0.0, 0.0),
          vec3(0.02, 0.05, 0.12),
          clamp(f * f * 4.0, 0.0, 1.0)
        );
        col = mix(col,
          vec3(0.0, 0.06, 0.1),
          clamp(length(q), 0.0, 1.0)
        );
        col = mix(col,
          vec3(0.01, 0.04, 0.08),
          clamp(r.x, 0.0, 1.0)
        );

        gl_FragColor = vec4(col, 0.9 + f * 0.1);
      }
    `;

    const uniforms = {
      uTime:   { value: 0 },
      uScroll: { value: 0 },
      uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms,
      transparent: true,
    });

    const geo  = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    /* ── Events ─────────────────────────────────────── */
    const onScroll = () => {
      uniforms.uScroll.value = window.scrollY;
    };
    const onMouse = (e: MouseEvent) => {
      uniforms.uMouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);

    /* ── Animate ─────────────────────────────────────── */
    let raf: number;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
