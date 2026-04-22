import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ── Easing helpers ────────────────────────────────────────────────────────────
const easeOutExpo  = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
const easeOutQuart = t => 1 - Math.pow(1 - t, 4)
const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2

// ── Wheel ─────────────────────────────────────────────────────────────────────
function Wheel({ position }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.x -= delta * 18 // fast spin during race-in, slows naturally
  })
  return (
    <group position={position} ref={ref}>
      {/* Tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.10, 20, 48]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.1} roughness={0.95} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 0.07, 36]} />
        <meshStandardMaterial color="#111122" metalness={0.98} roughness={0.05} />
      </mesh>
      {/* 5 spokes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / 5) * Math.PI * 2]}>
          <boxGeometry args={[0.032, 0.34, 0.038]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1.6} metalness={0.9} roughness={0.08} />
        </mesh>
      ))}
      {/* Centre cap */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.09, 16]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2.5} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.20, 0.016, 10, 40]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1.0} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// ── Headlight beam cone ───────────────────────────────────────────────────────
function HeadlightBeam({ position, side }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 2.2 + side) * 0.012
    }
  })
  return (
    <mesh ref={ref} position={position} rotation={[0, side === 0 ? -0.08 : 0.08, 0]}>
      <coneGeometry args={[1.1, 5.5, 24, 1, true]} />
      <meshBasicMaterial color="#e8f4ff" transparent opacity={0.045} side={THREE.FrontSide} depthWrite={false} />
    </mesh>
  )
}

// ── Main car body ─────────────────────────────────────────────────────────────
function RaceCar({ onSettled }) {
  const groupRef  = useRef()
  const bodyRef   = useRef()
  const glowRef   = useRef()
  const glow2Ref  = useRef()
  const hlRef     = useRef()
  const settled   = useRef(false)
  const startTime = useRef(null)

  // Animation phases (seconds)
  const RACE_IN_DUR  = 1.6   // car blasts in from far right
  const BRAKE_DUR    = 0.55  // hard brake + slight overshoot
  const SETTLE_DUR   = 0.45  // settle to final position

  const WHEEL_POSITIONS = [
    [ 1.02, -0.20,  0.65],
    [ 1.02, -0.20, -0.65],
    [-1.02, -0.20,  0.65],
    [-1.02, -0.20, -0.65],
  ]

  // Materials
  const body      = { color: '#06060f', metalness: 0.99, roughness: 0.03, envMapIntensity: 2.5 }
  const bodyDeep  = { color: '#0a0a1e', metalness: 0.92, roughness: 0.08 }
  const glass     = { color: '#1a3a5c', emissive: '#06b6d4', emissiveIntensity: 0.2, transparent: true, opacity: 0.55, metalness: 0.05, roughness: 0.0 }
  const trim      = { color: '#7c3aed', emissive: '#7c3aed', emissiveIntensity: 1.2, metalness: 0.95, roughness: 0.05 }
  const vent      = { color: '#080818', metalness: 0.6, roughness: 0.5 }
  const redLight  = { color: '#ff2020', emissive: '#ff2020', emissiveIntensity: 4.5 }
  const whiteLight= { color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 6 }

  useFrame((state) => {
    if (!groupRef.current) return
    if (!startTime.current) startTime.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - startTime.current

    // ── Entrance animation ──
    if (!settled.current) {
      let x, z, rotY, tiltZ

      if (t < RACE_IN_DUR) {
        // Blast in from far right — perspective z trick makes it feel like racing toward camera
        const p = easeOutExpo(t / RACE_IN_DUR)
        x    = 18 - p * 18.8   // overshoots slightly
        z    = -12 + p * 12.5
        rotY = -0.6 + p * 0.55  // car turns to face forward
        tiltZ = -0.04            // slight lean into acceleration

      } else if (t < RACE_IN_DUR + BRAKE_DUR) {
        // Hard brake — overshoot then pull back
        const p = easeOutQuart((t - RACE_IN_DUR) / BRAKE_DUR)
        x    = -0.8 + p * 0.5   // overshoot left then back
        z    = 0.5 - p * 0.3
        rotY = -0.05 + p * 0.08
        tiltZ = -0.04 + p * 0.06 // nose dips on brake

      } else if (t < RACE_IN_DUR + BRAKE_DUR + SETTLE_DUR) {
        // Settle to final resting pose
        const p = easeInOutSine((t - RACE_IN_DUR - BRAKE_DUR) / SETTLE_DUR)
        x    = -0.3 + p * 0.1
        z    = 0.2 - p * 0.1
        rotY = 0.03 - p * 0.38  // rotate to nice 3/4 angle
        tiltZ = 0.02 - p * 0.02

      } else {
        settled.current = true
        if (onSettled) onSettled()
      }

      if (groupRef.current && !settled.current) {
        groupRef.current.position.x = x ?? groupRef.current.position.x
        groupRef.current.position.z = z ?? groupRef.current.position.z
        groupRef.current.rotation.y = rotY ?? groupRef.current.rotation.y
        if (bodyRef.current) bodyRef.current.rotation.z = tiltZ ?? 0
      }
    }

    // ── Idle loop (after settled) ──
    if (settled.current && groupRef.current) {
      const idle = state.clock.elapsedTime
      groupRef.current.position.y = -0.05 + Math.sin(idle * 0.7) * 0.018
      groupRef.current.rotation.y = -0.35 + Math.sin(idle * 0.22) * 0.06
    }

    // Pulsing neon underglow
    if (glowRef.current)  glowRef.current.intensity  = 3.2 + Math.sin(state.clock.elapsedTime * 1.9) * 1.1
    if (glow2Ref.current) glow2Ref.current.intensity = 2.0 + Math.sin(state.clock.elapsedTime * 1.9 + Math.PI) * 0.8
    if (hlRef.current)    hlRef.current.intensity    = 5.0 + Math.sin(state.clock.elapsedTime * 3.8) * 0.4
  })

  const WHEEL_POSITIONS_ARR = [
    [ 1.02, -0.20,  0.65],
    [ 1.02, -0.20, -0.65],
    [-1.02, -0.20,  0.65],
    [-1.02, -0.20, -0.65],
  ]

  return (
    <group ref={groupRef} position={[18, -0.05, -12]} scale={0.58}>
      <group ref={bodyRef}>

        {/* ── Chassis ── */}
        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[3.0, 0.10, 1.38]} />
          <meshStandardMaterial {...body} />
        </mesh>

        {/* ── Lower body ── */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[3.1, 0.24, 1.46]} />
          <meshStandardMaterial {...body} />
        </mesh>

        {/* ── Side skirts ── */}
        {[0.74, -0.74].map((z, i) => (
          <mesh key={i} position={[0, 0.01, z]}>
            <boxGeometry args={[2.8, 0.055, 0.04]} />
            <meshStandardMaterial {...trim} />
          </mesh>
        ))}

        {/* ── Hood (sloped) ── */}
        <mesh position={[0.92, 0.24, 0]} rotation={[0, 0, -0.20]}>
          <boxGeometry args={[1.18, 0.07, 1.36]} />
          <meshStandardMaterial {...body} />
        </mesh>

        {/* ── Rear deck ── */}
        <mesh position={[-0.90, 0.24, 0]} rotation={[0, 0, 0.26]}>
          <boxGeometry args={[1.08, 0.07, 1.36]} />
          <meshStandardMaterial {...body} />
        </mesh>

        {/* ── Cabin roof ── */}
        <mesh position={[0.06, 0.50, 0]} scale={[1, 1, 0.82]}>
          <boxGeometry args={[1.42, 0.30, 1.22]} />
          <meshStandardMaterial {...body} />
        </mesh>
        <mesh position={[0.06, 0.62, 0]} scale={[1, 0.48, 0.76]}>
          <sphereGeometry args={[0.72, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial {...body} />
        </mesh>

        {/* ── Windshield ── */}
        <mesh position={[0.65, 0.44, 0]} rotation={[0, 0, 0.50]}>
          <boxGeometry args={[0.04, 0.48, 1.10]} />
          <meshStandardMaterial {...glass} />
        </mesh>
        {/* Rear window */}
        <mesh position={[-0.60, 0.44, 0]} rotation={[0, 0, -0.56]}>
          <boxGeometry args={[0.04, 0.40, 1.06]} />
          <meshStandardMaterial {...glass} />
        </mesh>
        {/* Side windows */}
        {[0.62, -0.62].map((z, i) => (
          <mesh key={i} position={[0.06, 0.46, z * 0.68]}>
            <boxGeometry args={[1.18, 0.27, 0.03]} />
            <meshStandardMaterial {...glass} />
          </mesh>
        ))}

        {/* ── Front fascia ── */}
        <mesh position={[1.54, 0.10, 0]}>
          <boxGeometry args={[0.06, 0.30, 1.36]} />
          <meshStandardMaterial {...bodyDeep} />
        </mesh>
        {/* Front splitter */}
        <mesh position={[1.54, -0.06, 0]}>
          <boxGeometry args={[0.14, 0.04, 1.16]} />
          <meshStandardMaterial {...trim} />
        </mesh>
        {/* Grille */}
        <mesh position={[1.56, 0.10, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.72]} />
          <meshStandardMaterial {...vent} />
        </mesh>

        {/* ── Headlights (DRL strip) ── */}
        {[0.50, -0.50].map((z, i) => (
          <group key={i} position={[1.54, 0.20, z]}>
            <mesh>
              <boxGeometry args={[0.06, 0.10, 0.30]} />
              <meshStandardMaterial color="#080818" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.02, 0.04, 0]}>
              <boxGeometry args={[0.03, 0.022, 0.26]} />
              <meshStandardMaterial {...whiteLight} />
            </mesh>
            <mesh position={[0.02, -0.02, 0]}>
              <boxGeometry args={[0.03, 0.052, 0.20]} />
              <meshStandardMaterial color="#fffde7" emissive="#fffde7" emissiveIntensity={5} />
            </mesh>
          </group>
        ))}
        <pointLight ref={hlRef} position={[1.7, 0.22, 0]} color="#ddeeff" intensity={5.0} distance={4.0} />

        {/* Headlight beam cones */}
        <HeadlightBeam position={[3.2, 0.18, 0.42]} side={0} />
        <HeadlightBeam position={[3.2, 0.18, -0.42]} side={1} />

        {/* ── Rear fascia ── */}
        <mesh position={[-1.54, 0.10, 0]}>
          <boxGeometry args={[0.06, 0.30, 1.36]} />
          <meshStandardMaterial {...bodyDeep} />
        </mesh>
        {/* Diffuser */}
        <mesh position={[-1.54, -0.06, 0]}>
          <boxGeometry args={[0.14, 0.06, 1.06]} />
          <meshStandardMaterial {...vent} />
        </mesh>
        {/* Spoiler lip */}
        <mesh position={[-0.76, 0.34, 0]}>
          <boxGeometry args={[0.08, 0.065, 1.30]} />
          <meshStandardMaterial {...trim} />
        </mesh>

        {/* ── Taillights — full-width LED bar ── */}
        <mesh position={[-1.56, 0.18, 0]}>
          <boxGeometry args={[0.04, 0.038, 1.18]} />
          <meshStandardMaterial {...redLight} />
        </mesh>
        {[0.54, -0.54].map((z, i) => (
          <mesh key={i} position={[-1.56, 0.10, z]}>
            <boxGeometry args={[0.04, 0.10, 0.20]} />
            <meshStandardMaterial {...redLight} />
          </mesh>
        ))}
        <pointLight position={[-1.7, 0.16, 0]} color="#ff1a1a" intensity={2.0} distance={2.5} />

        {/* ── Exhaust tips ── */}
        {[0.40, -0.40].map((z, i) => (
          <mesh key={i} position={[-1.54, -0.12, z]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.058, 0.068, 0.10, 14]} />
            <meshStandardMaterial color="#1e1e30" metalness={0.96} roughness={0.08} />
          </mesh>
        ))}

        {/* ── Wheels ── */}
        {WHEEL_POSITIONS_ARR.map((pos, i) => (
          <Wheel key={i} position={pos} />
        ))}

        {/* ── Brake callipers ── */}
        {WHEEL_POSITIONS_ARR.map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z > 0 ? z - 0.09 : z + 0.09]}>
            <boxGeometry args={[0.20, 0.10, 0.06]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.0} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* ── Neon underglow ── */}
        <pointLight ref={glowRef}  position={[ 0,   -0.26, 0]}   color="#7c3aed" intensity={3.2} distance={2.6} />
        <pointLight ref={glow2Ref} position={[ 1.0, -0.26, 0]}   color="#06b6d4" intensity={2.0} distance={2.0} />
        <pointLight                position={[-1.0, -0.26, 0]}   color="#06b6d4" intensity={2.0} distance={2.0} />
        <pointLight position={[0, -0.30,  0.6]} color="#7c3aed" intensity={1.4} distance={1.8} />
        <pointLight position={[0, -0.30, -0.6]} color="#7c3aed" intensity={1.4} distance={1.8} />

      </group>
    </group>
  )
}

// ── Motion blur speed lines (CSS overlay, synced with entrance) ───────────────
function SpeedLines({ visible }) {
  if (!visible) return null
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.018) 6px, rgba(255,255,255,0.018) 7px)',
        animation: 'fadeSpeedLines 1.8s ease-out forwards',
        zIndex: 2,
      }}
    />
  )
}

// ── Reflective ground plane ───────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.39, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={15}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050510"
        metalness={0.8}
        mirror={0}
      />
    </mesh>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ onSettled }) {
  return (
    <>
      <ambientLight intensity={0.08} />
      {/* Key light — cool blue from front-top */}
      <directionalLight position={[4, 8, 6]} intensity={2.8} castShadow color="#c8d8ff"
        shadow-mapSize={[1024, 1024]} shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}
      />
      {/* Fill light — warm purple from left */}
      <directionalLight position={[-5, 3, -3]} intensity={0.9} color="#a855f7" />
      {/* Rim light — cyan from behind */}
      <pointLight position={[-4, 2, -3]} color="#06b6d4" intensity={2.5} distance={10} />
      {/* Top spot */}
      <spotLight position={[1, 9, 4]} angle={0.30} penumbra={0.85} intensity={5} castShadow color="#d4c0ff" />

      <RaceCar onSettled={onSettled} />
      <Ground />

      <ContactShadows
        position={[0, -0.38, 0]}
        opacity={0.85}
        scale={8}
        blur={3.0}
        far={1.5}
        color="#2d0060"
      />
      <Environment preset="night" />
    </>
  )
}

// ── Camera cinematic pull-back ────────────────────────────────────────────────
function CameraRig({ settled }) {
  const startPos = useRef(null)
  useFrame((state) => {
    if (!startPos.current) startPos.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - startPos.current

    if (!settled) {
      // During race-in: camera slightly ahead, wide angle feel
      state.camera.position.x = 0.8 - t * 0.05
      state.camera.position.y = 0.6
      state.camera.position.z = 7.5 - t * 0.1
    } else {
      // After settle: slow cinematic pull-back + slight orbit
      const idle = state.clock.elapsedTime
      state.camera.position.x = 0.5 + Math.sin(idle * 0.12) * 0.3
      state.camera.position.y = 0.55 + Math.sin(idle * 0.08) * 0.05
      state.camera.position.z = 7.2 + Math.sin(idle * 0.15) * 0.2
    }
    state.camera.lookAt(0, 0.1, 0)
  })
  return null
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function HeroCar() {
  const [settled, setSettled] = useState(false)
  const [showSpeedLines, setShowSpeedLines] = useState(true)

  const handleSettled = () => {
    setSettled(true)
    setTimeout(() => setShowSpeedLines(false), 400)
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <style>{`
        @keyframes fadeSpeedLines {
          0%   { opacity: 1; }
          60%  { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
      <SpeedLines visible={showSpeedLines} />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0.8, 0.6, 7.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <CameraRig settled={settled} />
          <Scene onSettled={handleSettled} />
        </Suspense>
      </Canvas>
    </div>
  )
}
