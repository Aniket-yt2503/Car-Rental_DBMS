import { useRef, useCallback, useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { useAppContext } from '../../context/AppContext.jsx'

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
        style={{ opacity: 0.6 }} // Dim slightly so text remains readable
      />
      {/* Dark gradient behind text to prevent overlap readability issues */}
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2" style={{
        background: 'linear-gradient(90deg, rgba(5,4,4,0.9) 0%, rgba(5,4,4,0.6) 50%, transparent 100%)',
      }} />
    </div>
  )
}

// ── Stats sidebar ─────────────────────────────────────────────────────────────
function HeroStats() {
  const stats = [
    { value: '200+', label: 'Luxury Fleet',   accent: 'rgba(200,160,80,0.9)' },
    { value: '50+',  label: 'Global Cities',  accent: 'rgba(180,180,200,0.8)' },
    { value: '4.9★', label: 'Client Rating',  accent: 'rgba(220,220,220,0.9)' },
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
          {/* Accent bar */}
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

// ── Bottom status bar ─────────────────────────────────────────────────────────
function StatusBar({ videoEnded }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4"
    >
      <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          className={!videoEnded ? 'animate-pulse' : ''}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: videoEnded ? 'rgba(200,160,80,0.9)' : '#22c55e',
            boxShadow: videoEnded ? '0 0 8px rgba(200,160,80,0.8)' : '0 0 8px rgba(34,197,94,0.8)',
            flexShrink: 0,
          }}
        />
        <span className="text-white/40 text-[10px] uppercase tracking-[0.18em]">
          {videoEnded ? 'Phantom Ride' : 'Live Preview'}
        </span>
        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.12)' }} />
        <span className="text-white/25 text-[10px] font-mono tracking-wider">
          {videoEnded ? 'Premium Fleet' : '∞ km/h'}
        </span>
      </div>
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
      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {text}
      </span>
      <span className="animate-pulse text-purple-400">|</span>
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

  // Subtle cursor-following glow — warm gold
  const glowBg = useTransform(
    [springX, springY],
    ([x, y]) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return 'none'
      return `radial-gradient(500px circle at ${x * rect.width}px ${y * rect.height}px, rgba(180,130,60,0.08), transparent 65%)`
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
        background: '#050404',
        overflow: 'hidden',   // hard clip — nothing escapes
      }}
    >
      {/* ── 1. Video — full screen ── */}
      <CinematicVideo onEnded={(state) => setVideoEnded(state !== undefined ? state : true)} />

      {/* ── 5. Cursor glow ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: glowBg, zIndex: 4 }}
      />

      {/* ── 6. Fine dot grid — luxury texture ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)',
        }} />
      </div>

      {/* ── Stats ── */}
      <HeroStats />

      {/* ── Status bar ── */}
      <StatusBar videoEnded={videoEnded} />

      {/* ── Main content ── */}
      <div
        className="relative flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-20 pt-28 pb-20"
        style={{ zIndex: 10, maxWidth: '680px' }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-7"
        >
          {/* Gold accent line */}
          <div style={{
            width: 28, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(200,160,80,0.9))',
          }} />
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(200,160,80,0.85)',
          }}>
            Phantom Ride — Premium Car Rental
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-black leading-[1.0] tracking-tight mb-7"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
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
                background: 'linear-gradient(135deg, #f5f0e8 0%, #c8a050 40%, #e8c878 70%, #f5f0e8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 28px rgba(200,160,80,0.6))',
              } : {
                color: '#f5f0e8',
                textShadow: '0 2px 30px rgba(0,0,0,0.95)',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            width: 80,
            background: 'linear-gradient(90deg, rgba(200,160,80,0.8), transparent)',
            transformOrigin: 'left',
            marginBottom: '1.5rem',
          }}
        />

        {/* Subtitle with Typewriter */}
        <motion.p
          className="text-xl md:text-2xl font-bold leading-relaxed mb-10"
          style={{
            color: 'rgba(240,235,225,0.8)',
            textShadow: '0 1px 12px rgba(0,0,0,0.8)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Typewriter />
        </motion.p>

        {/* Book Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openBooking}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 overflow-hidden rounded-full font-bold tracking-widest uppercase text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-shadow hover:shadow-[0_0_60px_rgba(124,58,237,0.6)]"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
            <span className="relative z-10 text-base">Book Now</span>
            <svg className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <style>{`
              @keyframes shine {
                100% { transform: translateX(150%); }
              }
            `}</style>
          </motion.button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1.0 }}
          className="flex items-center gap-3 mt-10"
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 1, height: 28, background: 'linear-gradient(180deg, transparent, rgba(200,160,80,0.6))' }} />
            <div
              className="animate-bounce"
              style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'rgba(200,160,80,0.7)',
              }}
            />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  )
}
