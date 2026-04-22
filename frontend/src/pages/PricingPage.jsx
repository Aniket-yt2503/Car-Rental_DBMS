import { Suspense, useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import { getPricing } from "../api/pricing.js"
import { useNavigate } from "react-router-dom"
import useLenis from "../hooks/useLenis.js"
import Footer from "../components/Footer/Footer.jsx"
import SleekButton from "../components/ui/SleekButton.jsx"

// ── Three.js background scene ─────────────────────────────────────────────────
function FloatingOrb({ position, color, speed, distort, scale }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
  })
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[scale, 48, 48]} position={position}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          distort={distort}
          speed={1.5}
          transparent
          opacity={0.12}
          roughness={0}
          metalness={1}
        />
      </Sphere>
    </Float>
  )
}

function ParticleField() {
  const pointsRef = useRef()
  const count = 400

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 25
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [])

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#94a3b8"),
      new THREE.Color("#d97706"),
      new THREE.Color("#475569"),
    ]
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      arr[i * 3]     = c.r
      arr[i * 3 + 1] = c.g
      arr[i * 3 + 2] = c.b
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function RingPortal() {
  const ringRef = useRef()
  const ring2Ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef.current)  ringRef.current.rotation.z  = t * 0.1
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.08
  })
  return (
    <group position={[0, 0, -4]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[4.2, 0.015, 12, 150]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} transparent opacity={0.15} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[5.0, 0.01, 12, 150]} />
        <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.8} transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

function PricingScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} color="#ffffff" intensity={2} distance={20} />
      <pointLight position={[8, 5, 0]} color="#d97706" intensity={1.5} distance={15} />
      <pointLight position={[-8, -5, 0]} color="#ffffff" intensity={1} distance={15} />

      <ParticleField />
      <RingPortal />

      <FloatingOrb position={[-6, 3, -2]}   color="#ffffff" speed={0.5} distort={0.4} scale={1.5} />
      <FloatingOrb position={[ 6, -3, -1]}  color="#d97706" speed={0.4} distort={0.3} scale={1.2} />
      <FloatingOrb position={[ 0, 5, -5]}    color="#ffffff" speed={0.6} distort={0.5} scale={0.9} />

      <Environment preset="night" />
    </>
  )
}

// ── Pricing data ──────────────────────────────────────────────────────────────
const CLASS_META = {
  Subcompact: { icon: "🔘", tagline: "Agile Precision",    accent: "#94a3b8", popular: false },
  Compact:    { icon: "🔹", tagline: "Essential Value",    accent: "#64748b", popular: false },
  Sedan:      { icon: "💠", tagline: "Preferred Standard", accent: "#cbd5e1", popular: true  },
  Luxury:     { icon: "🔱", tagline: "Apex Selection",     accent: "#d97706", popular: false },
}

const DROP_OFF_RANGE = {
  Subcompact: "$29 – $55",
  Compact:    "$39 – $65",
  Sedan:      "$49 – $85",
  Luxury:     "$79 – $130",
}

const DURATION_KEYS = [
  { key: "perDay",    label: "DAILY",      unit: "DAY"    },
  { key: "perWeek",   label: "WEEKLY",     unit: "7 DAYS" },
  { key: "per2Weeks", label: "BI-WEEKLY",  unit: "14 DAYS"},
  { key: "perMonth",  label: "MONTHLY",    unit: "30 DAYS"},
]

function PricingCard({ pricing, index, activeDuration }) {
  const meta = CLASS_META[pricing.carClass] ?? CLASS_META.Sedan
  const navigate = useNavigate()
  const price = pricing[activeDuration.key]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col rounded-3xl overflow-hidden group cursor-default bg-white/5 border border-white/10"
      whileHover={{
        y: -10,
        borderColor: "rgba(255,255,255,0.3)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      }}
    >
      {meta.popular && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white z-20" />
      )}

      <div className="p-8 flex flex-col gap-6 flex-1">
        <div>
          <div className="flex items-center justify-between mb-4">
             <span className="text-2xl">{meta.icon}</span>
             {meta.popular && (
               <span className="text-[9px] font-black uppercase tracking-[0.25em] bg-white text-black px-2 py-1 rounded">Preferred</span>
             )}
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{pricing.carClass}</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">{meta.tagline}</p>
        </div>

        <div className="py-6 border-y border-white/5">
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-white tracking-tighter">
              ${price.toFixed(2)}
            </span>
            <span className="text-[10px] font-black text-slate-600 mb-2 uppercase tracking-widest">/ {activeDuration.unit}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {DURATION_KEYS.map(d => (
            <div key={d.key} className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all border ${d.key === activeDuration.key ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-transparent text-slate-500"}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">{d.label}</span>
              <span className="text-[11px] font-black uppercase tracking-widest">${pricing[d.key].toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Logistical Range</p>
          <p className="text-white font-black text-xs uppercase tracking-widest">{DROP_OFF_RANGE[pricing.carClass]}</p>
        </div>

        <SleekButton onClick={() => navigate("/")} variant={meta.popular ? "platinum" : "outline"} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em]">
          Initiate Booking
        </SleekButton>
      </div>
    </motion.div>
  )
}

function ComparisonTable({ pricingData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-32 rounded-3xl overflow-hidden bg-white/5 border border-white/10"
    >
      <div className="p-8 border-b border-white/5 bg-black/20">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Full Manifest Comparison</h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Side-by-side metric audit</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Category</th>
              {pricingData.map(p => (
                <th key={p.carClass} className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white text-center">
                  {p.carClass}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DURATION_KEYS.map((d, i) => (
              <tr key={d.key} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{d.label}</span>
                </td>
                {pricingData.map(p => (
                  <td key={p.carClass} className="px-8 py-6 text-center text-slate-400 font-bold text-sm">
                    ${p[d.key].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default function PricingPage() {
  useLenis()
  const [pricingData, setPricingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDuration, setActiveDuration] = useState(DURATION_KEYS[0])

  useEffect(() => {
    getPricing().then(({ data }) => {
      if (data) setPricingData(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 55 }}>
          <Suspense fallback={null}>
            <PricingScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-1.5 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-white/50 mb-8">
              Financial Transparency
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase">
              Value <span className="text-slate-700">Audit</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-slate-500 font-medium">
              Elite performance at calculated rates. No compromises, no hidden variables.
            </p>
          </motion.div>

          <div className="flex justify-center mb-16">
            <div className="flex p-2 rounded-2xl bg-white/5 border border-white/10 gap-2">
              {DURATION_KEYS.map(d => (
                <button
                  key={d.key}
                  onClick={() => setActiveDuration(d)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] transition-all cursor-pointer border-none ${activeDuration.key === d.key ? 'bg-white text-black shadow-xl' : 'bg-transparent text-slate-500 hover:text-white'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="w-16 h-px bg-white/20 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Retrieving Audit Data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingData.map((p, i) => (
                <PricingCard key={p.carClass} pricing={p} index={i} activeDuration={activeDuration} />
              ))}
            </div>
          )}

          {!loading && <ComparisonTable pricingData={pricingData} />}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 rounded-3xl p-16 text-center bg-white/5 border border-white/10 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Ready for Departure?</h3>
              <p className="text-slate-500 font-medium text-lg mb-12">Initialize your experience in under 120 seconds.</p>
              <SleekButton onClick={() => { window.scrollTo({ top: 0 }); window.location.href = "/" }} variant="amber" className="px-16 py-5 text-base uppercase tracking-widest">
                Start Mission
              </SleekButton>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
