import { Suspense, useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import { getPricing } from "../api/pricing.js"
import { useNavigate } from "react-router-dom"
import useLenis from "../hooks/useLenis.js"
import Footer from "../components/Footer/Footer.jsx"
import NeonButton from "../components/ui/NeonButton.jsx"
import NeonBadge from "../components/ui/NeonBadge.jsx"

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
          emissiveIntensity={0.4}
          distort={distort}
          speed={2}
          transparent
          opacity={0.18}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function ParticleField() {
  const pointsRef = useRef()
  const count = 320

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const palette = [
      new THREE.Color("#7c3aed"),
      new THREE.Color("#06b6d4"),
      new THREE.Color("#a855f7"),
      new THREE.Color("#c4b5fd"),
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
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

function RingPortal() {
  const ringRef = useRef()
  const ring2Ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef.current)  ringRef.current.rotation.z  = t * 0.18
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.12
  })
  return (
    <group position={[0, 0, -3]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[3.8, 0.025, 12, 120]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2.5} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.6, 0.015, 12, 120]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} transparent opacity={0.35} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.0, 0.01, 8, 100]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#c4b5fd" emissiveIntensity={1.5} transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

function PricingScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 2]} color="#7c3aed" intensity={3} distance={12} />
      <pointLight position={[5, 3, 0]} color="#06b6d4" intensity={2} distance={10} />
      <pointLight position={[-5, -3, 0]} color="#a855f7" intensity={1.5} distance={8} />

      <ParticleField />
      <RingPortal />

      <FloatingOrb position={[-5.5, 2.5, -2]}  color="#7c3aed" speed={0.8} distort={0.55} scale={1.4} />
      <FloatingOrb position={[ 5.5, -2.0, -1]} color="#06b6d4" speed={0.6} distort={0.45} scale={1.1} />
      <FloatingOrb position={[ 0.5,  3.5, -4]} color="#a855f7" speed={1.0} distort={0.65} scale={0.8} />
      <FloatingOrb position={[-3.0, -3.0, -3]} color="#c4b5fd" speed={0.7} distort={0.4}  scale={0.6} />

      <Environment preset="night" />
    </>
  )
}

// ── Pricing data ──────────────────────────────────────────────────────────────
const CLASS_META = {
  Subcompact: { icon: "🚗", tagline: "Smart & efficient",   accent: "#06b6d4", badge: "cyan",   popular: false },
  Compact:    { icon: "🚙", tagline: "Best value",          accent: "#3b82f6", badge: "blue",   popular: false },
  Sedan:      { icon: "🏎️", tagline: "Most popular",        accent: "#a855f7", badge: "purple", popular: true  },
  Luxury:     { icon: "👑", tagline: "Ultimate experience", accent: "#f59e0b", badge: "purple", popular: false },
}

const DROP_OFF_RANGE = {
  Subcompact: "$29 – $55",
  Compact:    "$39 – $65",
  Sedan:      "$49 – $85",
  Luxury:     "$79 – $130",
}

const DURATION_KEYS = [
  { key: "perDay",    label: "Per Day",      unit: "day"    },
  { key: "perWeek",   label: "Per Week",     unit: "7 days" },
  { key: "per2Weeks", label: "Per 2 Weeks",  unit: "14 days"},
  { key: "perMonth",  label: "Per Month",    unit: "30 days"},
]

function PricingCard({ pricing, index, activeDuration }) {
  const meta = CLASS_META[pricing.carClass] ?? CLASS_META.Sedan
  const navigate = useNavigate()
  const price = pricing[activeDuration.key]

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col rounded-3xl overflow-hidden group cursor-default"
      style={{
        background: meta.popular
          ? `linear-gradient(160deg, rgba(124,58,237,0.18), rgba(6,182,212,0.08))`
          : `linear-gradient(160deg, rgba(124,58,237,0.07), rgba(2,2,8,0.6))`,
        border: meta.popular
          ? `1px solid rgba(124,58,237,0.5)`
          : `1px solid rgba(124,58,237,0.15)`,
        boxShadow: meta.popular
          ? `0 0 40px rgba(124,58,237,0.25), 0 0 80px rgba(124,58,237,0.08)`
          : "none",
      }}
      whileHover={{
        y: -8,
        boxShadow: `0 0 50px ${meta.accent}40, 0 0 100px ${meta.accent}15`,
        borderColor: `${meta.accent}60`,
        transition: { duration: 0.25 },
      }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}cc, transparent)` }} />

      {/* Popular badge */}
      {meta.popular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <div className="px-4 py-1 rounded-b-xl text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, #7c3aed, #06b6d4)` }}>
            ✦ Most Popular
          </div>
        </div>
      )}

      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl mb-2">{meta.icon}</div>
            <h3 className="text-xl font-black text-white">{pricing.carClass}</h3>
            <p className="text-xs mt-0.5" style={{ color: `${meta.accent}cc` }}>{meta.tagline}</p>
          </div>
          <NeonBadge label={pricing.carClass} color={meta.badge} />
        </div>

        {/* Price hero */}
        <div className="py-4 border-y" style={{ borderColor: `${meta.accent}20` }}>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-black" style={{ background: `linear-gradient(135deg, #fff, ${meta.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ${price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(196,181,253,0.5)" }}>per {activeDuration.unit}</p>
        </div>

        {/* All rates */}
        <div className="flex flex-col gap-2 flex-1">
          {DURATION_KEYS.map(d => (
            <div key={d.key} className={`flex justify-between items-center px-3 py-2 rounded-xl transition-all ${d.key === activeDuration.key ? "text-white" : "text-white/40"}`}
              style={d.key === activeDuration.key ? { background: `${meta.accent}18`, border: `1px solid ${meta.accent}30` } : {}}
            >
              <span className="text-sm">{d.label}</span>
              <span className="font-bold text-sm">${pricing[d.key].toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Drop-off note */}
        <div className="rounded-xl px-3 py-2.5" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <p className="text-xs flex items-center gap-1.5" style={{ color: "rgba(251,191,36,0.7)" }}>
            <span>📍</span> Drop-off: <span className="font-semibold">{DROP_OFF_RANGE[pricing.carClass]}</span>
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>Same-location return = no charge</p>
        </div>

        {/* CTA */}
        <NeonButton onClick={() => navigate("/")} className="w-full justify-center text-center">
          Book {pricing.carClass} →
        </NeonButton>
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
      transition={{ duration: 0.6 }}
      className="mt-20 rounded-3xl overflow-hidden"
      style={{ border: "1px solid rgba(124,58,237,0.2)", background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(2,2,8,0.8))" }}
    >
      <div className="p-6 border-b" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
        <h3 className="text-xl font-bold text-white">Full Rate Comparison</h3>
        <p className="text-sm mt-1" style={{ color: "rgba(196,181,253,0.5)" }}>All classes side by side</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: "rgba(196,181,253,0.6)" }}>Duration</th>
              {pricingData.map(p => {
                const meta = CLASS_META[p.carClass]
                return (
                  <th key={p.carClass} className="px-6 py-4 font-semibold text-center" style={{ color: meta.accent }}>
                    {CLASS_META[p.carClass].icon} {p.carClass}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {DURATION_KEYS.map((d, i) => (
              <tr key={d.key} style={{ borderBottom: i < DURATION_KEYS.length - 1 ? "1px solid rgba(124,58,237,0.08)" : "none" }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4" style={{ color: "rgba(196,181,253,0.7)" }}>
                  <span className="font-medium">{d.label}</span>
                  <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.25)" }}>({d.unit})</span>
                </td>
                {pricingData.map(p => (
                  <td key={p.carClass} className="px-6 py-4 text-center font-bold text-white">
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

function PerksSection() {
  const perks = [
    { icon: "⛽", title: "Full Tank Guarantee",    desc: "Every vehicle delivered with a full tank. Return at any level." },
    { icon: "🔄", title: "Free Class Upgrades",    desc: "Get bumped to a higher class at no extra cost when available." },
    { icon: "📍", title: "Drop-Off Anywhere",      desc: "Return to any of our 20+ locations across Canada." },
    { icon: "🛡️", title: "Transparent Pricing",    desc: "No hidden fees. What you see is exactly what you pay." },
    { icon: "👔", title: "Employee Discounts",     desc: "Staff enjoy 50% off short rentals, 10% off monthly." },
    { icon: "🎁", title: "Weekly Promotions",      desc: "Active deals on select classes — check before you book." },
  ]
  return (
    <div className="mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h3 className="text-3xl font-bold text-white mb-2">What's <span className="phantom-text">Included</span></h3>
        <p className="text-sm" style={{ color: "rgba(196,181,253,0.5)" }}>Every rental comes with these guarantees</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {perks.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            whileHover={{ y: -4, borderColor: "rgba(124,58,237,0.4)" }}
            className="flex gap-4 p-5 rounded-2xl transition-all"
            style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.12)" }}
          >
            <span className="text-2xl shrink-0">{p.icon}</span>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">{p.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(196,181,253,0.5)" }}>{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
    <div className="min-h-screen relative" style={{ background: "transparent" }}>

      {/* Three.js background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <PricingScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold uppercase tracking-widest"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#a855f7" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{ boxShadow: "0 0 8px rgba(168,85,247,0.8)" }} />
              Transparent Pricing
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
              Simple,{" "}
              <span className="phantom-text">Honest</span>
              <br />Pricing
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(196,181,253,0.55)" }}>
              No surprises. No hidden fees. Just premium vehicles at rates that make sense.
            </p>
          </motion.div>

          {/* Duration toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-10"
          >
            <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
              {DURATION_KEYS.map(d => (
                <button
                  key={d.key}
                  onClick={() => setActiveDuration(d)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-none"
                  style={activeDuration.key === d.key
                    ? { background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "#fff", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }
                    : { background: "transparent", color: "rgba(196,181,253,0.6)" }
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDuration.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {pricingData.map((p, i) => (
                  <PricingCard key={p.carClass} pricing={p} index={i} activeDuration={activeDuration} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Comparison table */}
          {!loading && <ComparisonTable pricingData={pricingData} />}

          {/* Perks */}
          <PerksSection />

          {/* CTA banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 rounded-3xl p-10 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2), transparent 60%)" }} />
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-3">Ready to Hit the Road?</h3>
              <p className="mb-6" style={{ color: "rgba(196,181,253,0.6)" }}>Book your vehicle in under 2 minutes.</p>
              <NeonButton onClick={() => { window.scrollTo({ top: 0 }); window.location.href = "/" }} className="px-10 py-3 text-base">
                Book Now →
              </NeonButton>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
