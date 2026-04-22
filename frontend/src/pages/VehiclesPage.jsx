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
    <div className="relative overflow-hidden flex items-center justify-center" style={{ paddingTop: '5.5rem', paddingBottom: '1rem', background: 'transparent' }}>
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full opacity-10" style={{ width: '50vw', height: '50vw', top: '-20%', left: '-10%', filter: 'blur(100px)', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', willChange: 'transform' }} />
        <div className="absolute rounded-full opacity-5" style={{ width: '40vw', height: '40vw', bottom: '-20%', right: '-5%', filter: 'blur(100px)', background: 'radial-gradient(circle, rgba(217,119,6,0.3) 0%, transparent 70%)', willChange: 'transform' }} />
      </div>
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center gap-3"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            THE <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">ELITE FLEET</span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.25em]">
            Precision Engineering <span className="text-white/20 px-2">|</span> Pure Luxury
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Divider({ label }) {
  return (
    <div className="relative py-12 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="relative px-8 py-2 rounded-full bg-black border border-white/10">
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
      </div>
    </div>
  )
}

export default function VehiclesPage() {
  useLenis()
  return (
    <div className="min-h-screen bg-[#050505]" style={{ background: 'transparent' }}>
      <VehiclesHero />
      <Vehicles />
      <Divider label="Strategic Offers" />
      <Promotions />
      <Footer />
    </div>
  )
}
