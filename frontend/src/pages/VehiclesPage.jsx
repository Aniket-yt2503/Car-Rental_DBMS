import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from '../hooks/useLenis.js'
import Vehicles from '../components/Vehicles/Vehicles.jsx'
import Promotions from '../components/Promotions/Promotions.jsx'
import Footer from '../components/Footer/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

function VehiclesHero() {
  const bgRef = useRef(null)
  useEffect(() => {
    if (!bgRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: '25%', ease: 'none',
        scrollTrigger: { trigger: bgRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative overflow-hidden flex items-center justify-center" style={{ paddingTop: '5rem', paddingBottom: '1.5rem', background: 'transparent' }}>
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full opacity-20" style={{ width: '50vw', height: '50vw', top: '-20%', left: '-10%', filter: 'blur(60px)', background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)', willChange: 'transform' }} />
        <div className="absolute rounded-full opacity-15" style={{ width: '40vw', height: '40vw', bottom: '-20%', right: '-5%', filter: 'blur(60px)', background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)', willChange: 'transform' }} />
      </div>
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Our <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Fleet</span>
          </h1>
          <span className="text-white/20 hidden md:inline">·</span>
          <p className="text-white/50 text-sm md:text-base">
            Browse, explore in <span className="text-purple-400 font-medium">3D</span>, and book your perfect vehicle.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Divider({ label }) {
  return (
    <div className="relative py-6 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/5" />
      </div>
      <div className="relative px-5 py-1.5 rounded-full bg-gray-950 border border-white/10">
        <span className="text-white/40 text-xs uppercase tracking-widest">{label}</span>
      </div>
    </div>
  )
}

export default function VehiclesPage() {
  useLenis()
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <VehiclesHero />
      <Vehicles />
      <Divider label="This Week's Deal" />
      <Promotions />
      <Footer />
    </div>
  )
}
