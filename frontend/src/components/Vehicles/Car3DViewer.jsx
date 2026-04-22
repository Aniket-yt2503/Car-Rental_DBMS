import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Sparkles,
  MeshReflectorMaterial,
  useGLTF,
  Center,
} from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// ─── Drift sound via Web Audio API ───────────────────────────────────────────
function playDriftSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // Tire squeal — high-pitched sweep down
    const osc1 = ctx.createOscillator()
    const g1 = ctx.createGain()
    osc1.connect(g1); g1.connect(ctx.destination)
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(1800, now)
    osc1.frequency.exponentialRampToValueAtTime(400, now + 0.8)
    g1.gain.setValueAtTime(0.15, now)
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
    osc1.start(now); osc1.stop(now + 1)

    // Engine rumble — low growl
    const osc2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    const dist = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) { const x = (i * 2) / 256 - 1; curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x)) }
    dist.curve = curve
    osc2.connect(dist); dist.connect(g2); g2.connect(ctx.destination)
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(80, now)
    osc2.frequency.linearRampToValueAtTime(160, now + 0.4)
    osc2.frequency.linearRampToValueAtTime(100, now + 0.9)
    g2.gain.setValueAtTime(0.08, now)
    g2.gain.exponentialRampToValueAtTime(0.001, now + 1.0)
    osc2.start(now); osc2.stop(now + 1.1)

    // Whoosh
    const bufSize = ctx.sampleRate * 0.6
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.04
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const nGain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3000, now)
    filter.frequency.linearRampToValueAtTime(800, now + 0.6)
    noise.connect(filter); filter.connect(nGain); nGain.connect(ctx.destination)
    nGain.gain.setValueAtTime(0.12, now)
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    noise.start(now); noise.stop(now + 0.7)
  } catch (e) { /* silent */ }
}

// ─── Accent colors per class ──────────────────────────────────────────────────
const CLASS_ACCENT = {
  Subcompact: '#818cf8',
  Compact:    '#38bdf8',
  Sedan:      '#a78bfa',
  Luxury:     '#fbbf24',
}

const CLASS_ENV = {
  Subcompact: 'city',
  Compact:    'city',
  Sedan:      'night',
  Luxury:     'warehouse',
}

// ─── Real Lexus GLB model ─────────────────────────────────────────────────────
function LexusModel({ bodyColor, headlightsOn, autoRotate }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/lexus_es350.glb')

  // Clone scene so multiple instances don't share state
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    return c
  }, [scene])

  // Apply body color to paint meshes
  useEffect(() => {
    const color = new THREE.Color(bodyColor)
    cloned.traverse((child) => {
      if (!child.isMesh) return
      const name = (child.name || '').toLowerCase()
      const matName = (child.material?.name || '').toLowerCase()
      // Target body paint meshes — skip glass, chrome, interior
      if (
        matName.includes('paint') ||
        matName.includes('body') ||
        matName.includes('exterior') ||
        name.includes('body') ||
        name.includes('hood') ||
        name.includes('door') ||
        name.includes('fender') ||
        name.includes('trunk') ||
        name.includes('roof')
      ) {
        if (child.material) {
          child.material = child.material.clone()
          child.material.color = color
          child.material.metalness = 0.85
          child.material.roughness = 0.12
          child.material.needsUpdate = true
        }
      }
      // Headlights
      if (matName.includes('headlight') || name.includes('headlight')) {
        if (child.material) {
          child.material = child.material.clone()
          child.material.emissive = new THREE.Color(headlightsOn ? '#fffde7' : '#000')
          child.material.emissiveIntensity = headlightsOn ? 3 : 0
          child.material.needsUpdate = true
        }
      }
    })
  }, [cloned, bodyColor, headlightsOn])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.03
    if (autoRotate) groupRef.current.rotation.y += delta * 0.35
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={cloned} scale={1.0} />
      </Center>
      {/* Neon underglow */}
      <pointLight position={[0, -0.4, 0]} color="#a78bfa" intensity={4} distance={3} />
      <pointLight position={[1.5, -0.4, 0]} color="#3b82f6" intensity={2} distance={2} />
      <pointLight position={[-1.5, -0.4, 0]} color="#3b82f6" intensity={2} distance={2} />
      {headlightsOn && (
        <>
          <pointLight position={[2.2, 0.2, 0.5]} color="#fffde7" intensity={3} distance={5} />
          <pointLight position={[2.2, 0.2, -0.5]} color="#fffde7" intensity={3} distance={5} />
        </>
      )}
    </group>
  )
}

// Preload the model
useGLTF.preload('/lexus_es350.glb')

// ─── Showroom floor ───────────────────────────────────────────────────────────
function ShowroomFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={50}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#04040f"
        metalness={0.9}
      />
    </mesh>
  )
}

// ─── Floor rings ─────────────────────────────────────────────────────────────
function FloorRing({ radius, color, y = 0.01 }) {
  const pts = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 80; i++) {
      const a = (i / 80) * Math.PI * 2
      arr.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius))
    }
    return arr
  }, [radius, y])
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts])
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </line>
  )
}

// ─── Camera intro ─────────────────────────────────────────────────────────────
function CameraIntro() {
  const { camera } = useThree()
  const t = useRef(0)
  const done = useRef(false)
  useFrame((_, delta) => {
    if (done.current) return
    t.current = Math.min(t.current + delta * 0.7, 1)
    const ease = 1 - Math.pow(1 - t.current, 3)
    camera.position.set(
      THREE.MathUtils.lerp(9, 5.5, ease),
      THREE.MathUtils.lerp(5, 2.5, ease),
      THREE.MathUtils.lerp(9, 5.5, ease)
    )
    camera.lookAt(0, 0.5, 0)
    if (t.current >= 1) done.current = true
  })
  return null
}

// ─── Full scene ───────────────────────────────────────────────────────────────
function Scene({ carClass, bodyColor, headlightsOn, autoRotate }) {
  const accent = CLASS_ACCENT[carClass] ?? '#a78bfa'
  const envPreset = CLASS_ENV[carClass] ?? 'night'

  return (
    <>
      <PerspectiveCamera makeDefault position={[9, 5, 9]} fov={38} />
      <CameraIntro />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 10, 6]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-6, 4, -6]} intensity={0.8} color="#a855f7" />
      <spotLight position={[0, 10, 0]} angle={0.35} penumbra={0.6} intensity={4} castShadow color="#ffffff" />
      <pointLight position={[0, 6, 6]} intensity={1.2} color="#3b82f6" />
      <pointLight position={[0, 6, -6]} intensity={1} color="#8b5cf6" />

      {/* Real Lexus model */}
      <LexusModel bodyColor={bodyColor} headlightsOn={headlightsOn} autoRotate={autoRotate} />

      {/* Floor */}
      <ShowroomFloor />
      <FloorRing radius={3} color={accent} />
      <FloorRing radius={4.8} color={accent} y={0.02} />

      {/* Particles */}
      <Sparkles count={60} scale={[12, 7, 12]} size={1.2} speed={0.25} opacity={0.4} color={accent} />

      {/* Contact shadow */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.9} scale={14} blur={3} far={2} color="#000" />

      <Environment preset={envPreset} />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3.5}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        makeDefault
      />
    </>
  )
}

// ─── Color palette ────────────────────────────────────────────────────────────
const COLORS = [
  { label: 'Midnight',  hex: '#1e1b4b' },
  { label: 'Obsidian',  hex: '#0f172a' },
  { label: 'Crimson',   hex: '#7f1d1d' },
  { label: 'Pearl',     hex: '#f1f5f9' },
  { label: 'Forest',    hex: '#14532d' },
  { label: 'Gold',      hex: '#92400e' },
  { label: 'Cobalt',    hex: '#1e3a8a' },
  { label: 'Violet',    hex: '#4c1d95' },
  { label: 'Rose',      hex: '#881337' },
  { label: 'Slate',     hex: '#334155' },
  { label: 'Teal',      hex: '#134e4a' },
  { label: 'Bronze',    hex: '#78350f' },
]

const CLASS_DEFAULT_COLOR = {
  Subcompact: '#1e1b4b',
  Compact:    '#1e3a8a',
  Sedan:      '#4c1d95',
  Luxury:     '#0f172a',
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function ModelLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030712] z-10">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-2 border-purple-500/30 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-2 border-t-purple-500 border-r-purple-500 rounded-full animate-spin" />
        <div className="absolute inset-2 w-12 h-12 border border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-white/50 text-sm font-medium">Loading 3D Model</p>
      <p className="text-white/25 text-xs mt-1">2021 Lexus ES 350 F-Sport</p>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Car3DViewer({ car, onClose }) {
  const [bodyColor, setBodyColor] = useState(CLASS_DEFAULT_COLOR[car.carClass] ?? '#1e1b4b')
  const [headlightsOn, setHeadlightsOn] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [canvasReady, setCanvasReady] = useState(false)
  const accent = CLASS_ACCENT[car.carClass] ?? '#a78bfa'

  useEffect(() => {
    playDriftSound()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: '#030712' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 bg-black/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
          <div>
            <h2 className="text-white font-bold text-base leading-tight">
              {car.year} {car.make} {car.model}
            </h2>
            <p className="text-white/40 text-xs">{car.carClass} · {car.id} · {car.licensePlate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHeadlightsOn(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${headlightsOn ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'}`}
          >
            💡 Lights
          </button>
          <button
            onClick={() => setAutoRotate(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${autoRotate ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'}`}
          >
            ⟳ Rotate
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 85%, ${accent}18 0%, transparent 60%)` }} />

        {!canvasReady && <ModelLoader />}

        <Canvas
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={() => setCanvasReady(true)}
          style={{ background: '#030712' }}
        >
          <Suspense fallback={null}>
            <Scene
              carClass={car.carClass}
              bodyColor={bodyColor}
              headlightsOn={headlightsOn}
              autoRotate={autoRotate}
            />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/20 text-xs flex items-center gap-2 pointer-events-none select-none">
          ⟳ Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* Bottom panel */}
      <div className="shrink-0 border-t border-white/8 bg-black/50 backdrop-blur-sm px-5 py-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs uppercase tracking-widest shrink-0">Paint</span>
          <div className="flex flex-wrap gap-1.5">
            {COLORS.map(c => (
              <button
                key={c.hex}
                title={c.label}
                onClick={() => setBodyColor(c.hex)}
                className="w-5 h-5 rounded-full border-2 transition-all duration-150 cursor-pointer hover:scale-110"
                style={{
                  background: c.hex,
                  borderColor: bodyColor === c.hex ? accent : 'rgba(255,255,255,0.12)',
                  boxShadow: bodyColor === c.hex ? `0 0 8px ${accent}` : 'none',
                  transform: bodyColor === c.hex ? 'scale(1.3)' : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 ml-auto">
          {[
            ['Class', car.carClass],
            ['Year', car.year],
            ['Color', car.color],
            ['Seats', car.seats ?? 5],
            ['Trans.', car.transmission ?? 'Automatic'],
            ['ID', car.id],
            ['Plate', car.licensePlate],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-white/25 text-[10px] uppercase tracking-wider">{k}</span>
              <span className="text-white/70 text-xs font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
