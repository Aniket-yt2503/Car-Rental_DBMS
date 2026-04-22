import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function NebulaOrb({ position, color, size, speed }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.4
    meshRef.current.rotation.z += 0.0005
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} />
    </mesh>
  )
}

function Debris() {
  const pieces = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    pos: [(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8 - 5],
    size: 0.03 + Math.random() * 0.1,
    speed: 0.15 + Math.random() * 0.35,
    phase: Math.random() * Math.PI * 2,
  })), [])

  return (
    <>
      {pieces.map(p => <DebrisPiece key={p.id} {...p} />)}
    </>
  )
}

function DebrisPiece({ pos, size, speed, phase }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.006 * speed
    ref.current.rotation.y += 0.004 * speed
    ref.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * speed + phase) * 0.35
  })
  return (
    <mesh ref={ref} position={pos}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color="#1e1b4b" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[-4, 2, 2]} intensity={1} color="#7c3aed" />
      <pointLight position={[4, -1, 1]} intensity={0.8} color="#2563eb" />

      <Stars radius={90} depth={70} count={4000} factor={4} saturation={0.2} fade speed={0.3} />

      <NebulaOrb position={[-6, 1, -10]} color="#7c3aed" size={7} speed={0.12} />
      <NebulaOrb position={[7, -2, -12]} color="#2563eb" size={6} speed={0.1} />
      <NebulaOrb position={[0, 4, -14]} color="#4f46e5" size={8} speed={0.08} />

      <Debris />
    </>
  )
}

export default function SpaceScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  )
}
