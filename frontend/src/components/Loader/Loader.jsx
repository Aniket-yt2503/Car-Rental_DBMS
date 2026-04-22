import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playLoaderSound } from '../../utils/sound.js'

const BRAND = 'Phantom Ride'
const MIN_DURATION_MS = 2200
const READY_TIMEOUT_MS = 10000

// ─── Phonk-style loading sound ────────────────────────────────────────────────
function playPhonkSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // 808 bass kick
    const kick = ctx.createOscillator()
    const kickGain = ctx.createGain()
    kick.connect(kickGain); kickGain.connect(ctx.destination)
    kick.type = 'sine'
    kick.frequency.setValueAtTime(150, now)
    kick.frequency.exponentialRampToValueAtTime(40, now + 0.3)
    kickGain.gain.setValueAtTime(0.6, now)
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    kick.start(now); kick.stop(now + 0.5)

    // Phonk hi-hat pattern
    const hatTimes = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
    hatTimes.forEach(t => {
      const bufSize = ctx.sampleRate * 0.05
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15
      const src = ctx.createBufferSource()
      src.buffer = buf
      const hGain = ctx.createGain()
      const hFilter = ctx.createBiquadFilter()
      hFilter.type = 'highpass'
      hFilter.frequency.value = 8000
      src.connect(hFilter); hFilter.connect(hGain); hGain.connect(ctx.destination)
      hGain.gain.setValueAtTime(0.3, now + t)
      hGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.04)
      src.start(now + t); src.stop(now + t + 0.05)
    })

    // Synth stab
    const stab = ctx.createOscillator()
    const stabGain = ctx.createGain()
    const stabDist = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) { const x = (i * 2) / 256 - 1; curve[i] = (3 + 200) * x / (Math.PI + 200 * Math.abs(x)) }
    stabDist.curve = curve
    stab.connect(stabDist); stabDist.connect(stabGain); stabGain.connect(ctx.destination)
    stab.type = 'sawtooth'
    stab.frequency.setValueAtTime(220, now + 0.5)
    stab.frequency.setValueAtTime(277, now + 0.75)
    stab.frequency.setValueAtTime(330, now + 1.0)
    stabGain.gain.setValueAtTime(0, now + 0.5)
    stabGain.gain.linearRampToValueAtTime(0.12, now + 0.55)
    stabGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3)
    stab.start(now + 0.5); stab.stop(now + 1.4)
  } catch (e) { /* silent */ }
}

// ─── Animated car silhouette (CSS only, no R3F) ───────────────────────────────
function AnimatedCar({ progress }) {
  return (
    <div className="relative w-48 h-20 mb-8">
      {/* Car body */}
      <div
        className="absolute bottom-4 left-0 right-0 h-8 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', boxShadow: '0 0 20px rgba(168,85,247,0.4)' }}
      />
      {/* Roof */}
      <div
        className="absolute bottom-10 left-8 right-12 h-6 rounded-t-lg"
        style={{ background: 'linear-gradient(135deg, #2d1b69, #5b21b6)' }}
      />
      {/* Windshield */}
      <div
        className="absolute bottom-10 right-10 w-8 h-5 rounded-sm"
        style={{ background: 'rgba(147,197,253,0.3)', border: '1px solid rgba(147,197,253,0.2)' }}
      />
      {/* Headlight */}
      <div
        className="absolute bottom-6 right-1 w-3 h-2 rounded-sm"
        style={{ background: '#fffde7', boxShadow: '0 0 8px #fffde7, 0 0 20px rgba(255,253,231,0.5)' }}
      />
      {/* Tail light */}
      <div
        className="absolute bottom-6 left-1 w-3 h-2 rounded-sm"
        style={{ background: '#ef4444', boxShadow: '0 0 8px #ef4444' }}
      />
      {/* Wheels */}
      {[{ left: '12px' }, { right: '12px' }].map((pos, i) => (
        <div
          key={i}
          className="absolute bottom-1 w-7 h-7 rounded-full border-2 border-purple-400"
          style={{
            ...pos,
            background: '#111827',
            boxShadow: '0 0 8px rgba(168,85,247,0.5)',
            animation: `spin ${0.3 + progress * 0.002}s linear infinite`,
          }}
        >
          <div className="absolute inset-1 rounded-full border border-purple-500/50" />
        </div>
      ))}
      {/* Neon underglow */}
      <div
        className="absolute bottom-0 left-4 right-4 h-1 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.8), transparent)', filter: 'blur(3px)' }}
      />
      {/* Speed lines */}
      {progress > 20 && [0, 1, 2, 3].map(i => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `-${20 + i * 15}px`,
            bottom: `${8 + i * 4}px`,
            width: `${30 + i * 10}px`,
            height: '1px',
            background: `rgba(168,85,247,${0.6 - i * 0.12})`,
            animation: `slideLeft 0.4s ease-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

const loaderStyles = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes slideLeft { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
`

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)
  const exitTriggeredRef = useRef(false)

  useEffect(() => {
    // Play loader ambient sound immediately on mount
    const timer = setTimeout(() => {
      playLoaderSound()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    startTimeRef.current = performance.now()
    const tick = (now) => {
      const elapsed = now - startTimeRef.current
      const raw = elapsed / MIN_DURATION_MS
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 2.5)
      const next = Math.min(Math.round(eased * 100), 100)
      setProgress(next)
      if (next < 100) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (progress < 100 || exitTriggeredRef.current) return
    const triggerExit = () => {
      if (exitTriggeredRef.current) return
      exitTriggeredRef.current = true
      setVisible(false)
    }
    if (document.readyState === 'complete') { triggerExit(); return }
    const onReady = () => { if (document.readyState === 'complete') triggerExit() }
    document.addEventListener('readystatechange', onReady)
    const timeout = setTimeout(triggerExit, READY_TIMEOUT_MS)
    return () => { document.removeEventListener('readystatechange', onReady); clearTimeout(timeout) }
  }, [progress])

  return (
    <>
      <style>{loaderStyles}</style>
      <AnimatePresence onExitComplete={onComplete}>
        {visible && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#030712' }}
            exit={{ y: '-100%', opacity: 0, transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }}
          >
            {/* Scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,0.5) 2px, rgba(168,85,247,0.5) 3px)',
                backgroundSize: '100% 3px',
              }}
            />

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />

            {/* Animated car */}
            <AnimatedCar progress={progress} />

            {/* Brand */}
            <div className="flex gap-0.5 mb-8">
              {BRAND.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl font-black tracking-[0.3em] text-white select-none"
                  style={{ textShadow: '0 0 30px rgba(168,85,247,0.6)' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/30 text-xs uppercase tracking-[0.4em] mb-8"
            >
              Premium Car Rental
            </motion.p>

            {/* Progress bar */}
            <div className="w-56 flex flex-col items-center gap-2">
              <div className="w-full h-0.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)',
                    boxShadow: '0 0 10px rgba(168,85,247,0.9)',
                  }}
                  transition={{ duration: 0.05 }}
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-white/20 text-[10px] uppercase tracking-widest">Loading</span>
                <span className="text-purple-400 text-xs font-mono tabular-nums">{progress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
