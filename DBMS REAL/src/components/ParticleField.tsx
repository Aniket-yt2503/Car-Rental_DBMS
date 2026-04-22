'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  color?: string;
  count?: number;
  shape?: 'sphere' | 'ring' | 'cloud' | 'helix';
  size?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParticleField({
  color = '#00f0ff',
  count = 3000,
  shape = 'sphere',
  size = 0.018,
  speed = 0.3,
  className = '',
  style = {},
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Scene ────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Particles ────────────────────────────────── */
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const threeColor = new THREE.Color(color);

    const buildPositions = () => {
      for (let i = 0; i < count; i++) {
        let x = 0, y = 0, z = 0;
        if (shape === 'sphere') {
          const theta = Math.random() * Math.PI * 2;
          const phi   = Math.acos(2 * Math.random() - 1);
          const r     = 0.8 + Math.random() * 0.4;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else if (shape === 'ring') {
          const theta = Math.random() * Math.PI * 2;
          const r = 0.9 + (Math.random() - 0.5) * 0.3;
          x = r * Math.cos(theta);
          y = (Math.random() - 0.5) * 0.15;
          z = r * Math.sin(theta);
        } else if (shape === 'cloud') {
          x = (Math.random() - 0.5) * 2.5;
          y = (Math.random() - 0.5) * 2.5;
          z = (Math.random() - 0.5) * 2.5;
        } else if (shape === 'helix') {
          const t = (i / count) * Math.PI * 8;
          x = Math.cos(t) * 0.8;
          y = (i / count) * 2 - 1;
          z = Math.sin(t) * 0.8;
        }
        positions[i*3]   = x;
        positions[i*3+1] = y;
        positions[i*3+2] = z;

        // Color variation
        const bright = 0.7 + Math.random() * 0.3;
        colors[i*3]   = threeColor.r * bright;
        colors[i*3+1] = threeColor.g * bright;
        colors[i*3+2] = threeColor.b * bright;
      }
    };

    buildPositions();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ── Mouse ────────────────────────────────────── */
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── Resize ───────────────────────────────────── */
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Animate ──────────────────────────────────── */
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      points.rotation.y = t * speed * 0.2;
      points.rotation.x += (mouse.y * 0.4 - points.rotation.x) * 0.05;
      points.rotation.z += (mouse.x * 0.2 - points.rotation.z) * 0.05;

      // Breathing scale
      const scale = 1 + Math.sin(t * 0.8) * 0.04;
      points.scale.setScalar(scale);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [color, count, shape, size, speed]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}
