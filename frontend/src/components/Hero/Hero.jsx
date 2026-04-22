import { useRef, useCallback, useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { useAppContext } from '../../context/AppContext.jsx'
import SleekButton from '../ui/SleekButton.jsx'

const VIDEO_SRC = '/Luxury_Supercar_Drift_Cinematic_Loop.mp4'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const wordVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(12px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
}

const HEADLINE_WORDS = ['Drive', 'the', 'Future,', 'Today.']

// ── Fullscreen cinematic video ────────────────────────────────────────────────
function CinematicVideo({ onEnded }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.volume = 0
    v.play().catch(() => {})
  }, [onEnded])

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="w-full h-full object-cover"
        style={{ opacity: 0.6 }}
      />
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2" style={{
        background: 'linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.7) 50%, transparent 100%)',
      }} />
    </div>
  )
}

// ── Stats sidebar ─────────────────────────────────────────────────────────────
function HeroStats() {
  const stats = [
    { value: '200+', label: 'Luxury Fleet',   accent: 'rgba(255,255,255,0.3)' },
    { value: '50+',  label: 'Global Cities',  accent: 'rgba(217,119,6,0.5)' },
    { value: '4.9★', label: 'Client Rating',  accent: 'rgba(255,255,255,0.2)' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-8 bottom-32 z-20 hidden xl:flex flex-col gap-3"
    >
      {stats.map(({ value, label, accent }) => (
        <div key={label} className="flex items-center gap-3 group">
          <div style={{
            width: 2, height: 36, borderRadius: 2,
            background: `linear-gradient(180deg, ${accent}, transparent)`,
            boxShadow: `0 0 10px ${accent}`,
            flexShrink: 0,
          }} />
          <div>
            <p className="text-white font-bold text-sm tracking-wide leading-none">{value}</p>
            <p className="text-white/35 text-[11px] mt-0.5 tracking-wider uppercase">{label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}


// ── Cool Typing Animation ──────────────────────────────────────────────────────
function Typewriter() {
  const words = ["Unleash the Power.", "Experience True Luxury.", "Command the Road.", "Drive the Future."]
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIdx % words.length]
    let timer

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(prev => currentWord.substring(0, prev.length - 1))
        if (text.length <= 1) {
          setIsDeleting(false)
          setWordIdx(prev => prev + 1)
        }
      }, 40)
    } else {
      timer = setTimeout(() => {
        setText(prev => currentWord.substring(0, prev.length + 1))
        if (text.length === currentWord.length) {
          timer = setTimeout(() => setIsDeleting(true), 2500)
        }
      }, 100)
    }

    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIdx, words])

  return (
    <span className="inline-block min-w-[280px]">
      <span className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
        {text}
      </span>
      <span className="animate-pulse text-slate-400">|</span>
    </span>
  )
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef  = useRef(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const { dispatch } = useAppContext()

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 1.2 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 1.2 })

  const glowBg = useTransform(
    [springX, springY],
    ([x, y]) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return 'none'
      return `radial-gradient(500px circle at ${x * rect.width}px ${y * rect.height}px, rgba(255,255,255,0.03), transparent 65%)`
    }
  )

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [mouseX, mouseY])

  const openBooking = () => {
    dispatch({ type: 'OPEN_BOOKING', payload: {} })
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex flex-col"
      style={{
        minHeight: '100svh',
        background: '#050505',
        overflow: 'hidden',
      }}
    >
      <CinematicVideo onEnded={(state) => setVideoEnded(state !== undefined ? state : true)} />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: glowBg, zIndex: 4 }}
      />

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)',
        }} />
      </div>

      <HeroStats />


      <div
        className="relative flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-20 pt-28 pb-20"
        style={{ zIndex: 10, maxWidth: '720px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-7"
        >
          <div style={{
            width: 28, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))',
          }} />
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}>
            Midnight Ride — Luxury Automotive
          </span>
        </motion.div>

        <motion.h1
          className="font-black leading-[1.0] tracking-tight mb-7"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-[0.2em] last:mr-0"
              style={i === 2 ? {
                background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 40%, #cbd5e1 70%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))',
              } : {
                color: '#ffffff',
                textShadow: '0 2px 30px rgba(0,0,0,0.8)',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            width: 100,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)',
            transformOrigin: 'left',
            marginBottom: '1.5rem',
          }}
        />

        <motion.p
          className="text-xl md:text-2xl font-bold leading-relaxed mb-10"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Typewriter />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <SleekButton 
            onClick={openBooking} 
            variant="amber" 
            className="px-12 py-5 text-base uppercase tracking-widest"
          >
            Experience Now
          </SleekButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1.0 }}
          className="flex items-center gap-3 mt-10"
        >
          <div className="flex flex-col items-center gap-1">
            <div style={{ width: 1, height: 28, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2))' }} />
            <div className="animate-bounce w-1 h-1 rounded-full bg-white/30" />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  )
}
