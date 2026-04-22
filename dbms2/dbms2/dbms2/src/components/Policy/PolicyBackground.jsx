import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Floating geometric shapes — policy/document themed
function FloatingShape({ position, shape, color, speed, rotSpeed }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.4
    meshRef.current.rotation.x += rotSpeed * 0.008
    meshRef.current.rotation.y += rotSpeed * 0.012
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case 'octahedron': return <octahedronGeometry args={[0.3, 0]} />
      case 'tetrahedron': return <tetrahedronGeometry args={[0.35, 0]} />
      case 'icosahedron': return <icosahedronGeometry args={[0.28, 0]} />
      default: return <dodecahedronGeometry args={[0.25, 0]} />
    }
  }, [shape])

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.2}
        transparent
        opacity={0.35}
        wireframe={Math.random() > 0.5}
      />
    </mesh>
  )
}

// Grid of glowing lines
function GridLines() {
  const linesRef = useRef()

  useFrame((state) => {
    if (!linesRef.current) return
    linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
  })

  const geometry = useMemo(() => {
    const points = []
    const size = 20
    const divisions = 12
    const step = size / divisions

    for (let i = 0; i <= divisions; i++) {
      const x = -size / 2 + i * step
      points.push(new THREE.Vector3(x, -3, -size / 2))
      points.push(new THREE.Vector3(x, -3, size / 2))
    }
    for (let i = 0; i <= divisions; i++) {
      const z = -size / 2 + i * step
      points.push(new THREE.Vector3(-size / 2, -3, z))
      points.push(new THREE.Vector3(size / 2, -3, z))
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [])

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.08} />
    </lineSegments>
  )
}

const SHAPES_DATA = [
  { position: [-6, 2, -4], shape: 'octahedron', color: '#7c3aed', speed: 0.4, rotSpeed: 1 },
  { position: [6, 1, -5], shape: 'tetrahedron', color: '#3b82f6', speed: 0.3, rotSpeed: 0.8 },
  { position: [-4, -1, -3], shape: 'icosahedron', color: '#a855f7', speed: 0.5, rotSpeed: 1.2 },
  { position: [5, 3, -6], shape: 'dodecahedron', color: '#6366f1', speed: 0.35, rotSpeed: 0.9 },
  { position: [0, 4, -7], shape: 'octahedron', color: '#8b5cf6', speed: 0.25, rotSpeed: 0.7 },
  { position: [-7, -2, -5], shape: 'tetrahedron', color: '#2563eb', speed: 0.45, rotSpeed: 1.1 },
  { position: [3, -3, -4], shape: 'icosahedron', color: '#7c3aed', speed: 0.38, rotSpeed: 0.85 },
  { position: [-2, 5, -8], shape: 'dodecahedron', color: '#4f46e5', speed: 0.28, rotSpeed: 0.95 },
]

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#7c3aed" />
      <pointLight position={[-5, 0, -5]} intensity={0.8} color="#3b82f6" />

      <GridLines />

      {SHAPES_DATA.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  )
}

export default function PolicyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
