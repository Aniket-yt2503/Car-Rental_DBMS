import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BRAND = 'Midnight Ride'
const MIN_DURATION_MS = 2500
const READY_TIMEOUT_MS = 10000

// ─── Minimalist tactical sound ────────────────────────────────────────────────
function playMidnightSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // Deep sub bass pulse
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(40, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.5)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)
    osc.start(now); osc.stop(now + 2)

    // Subtle high-tech click
    const click = ctx.createOscillator()
    const cGain = ctx.createGain()
    click.connect(cGain); cGain.connect(ctx.destination)
    click.type = 'square'
    click.frequency.setValueAtTime(1200, now + 0.5)
    cGain.gain.setValueAtTime(0, now + 0.5)
    cGain.gain.linearRampToValueAtTime(0.05, now + 0.51)
    cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    click.start(now + 0.5); click.stop(now + 0.7)
  } catch (e) { /* silent */ }
}

function AnimatedCar({ progress }) {
  return (
    <div className="relative w-64 h-24 mb-12">
      {/* Car body - Stealth profile */}
      <div
        className="absolute bottom-6 left-0 right-0 h-7 rounded-md"
        style={{ background: 'linear-gradient(90deg, #0f172a, #334155, #0f172a)', border: '1px solid rgba(255,255,255,0.05)' }}
      />
      {/* Cockpit */}
      <div
        className="absolute bottom-12 left-16 right-20 h-6 rounded-t-2xl"
        style={{ background: 'linear-gradient(180deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.08)' }}
      />
      {/* Headlight - Platinum beam */}
      <div
        className="absolute bottom-8 right-2 w-4 h-1.5 rounded-full"
        style={{ background: '#f8fafc', boxShadow: '0 0 15px #f8fafc, 0 0 30px rgba(248,250,252,0.4)' }}
      />
      {/* Wheels - Technical detail */}
      {[{ left: '20px' }, { right: '20px' }].map((pos, i) => (
        <div
          key={i}
          className="absolute bottom-2 w-8 h-8 rounded-full border border-slate-800"
          style={{
            ...pos,
            background: '#020617',
            animation: `spin ${0.4 - progress * 0.003}s linear infinite`,
          }}
        >
          <div className="absolute inset-1.5 rounded-full border-[0.5px] border-slate-700/50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-slate-800/30" />
        </div>
      ))}
      {/* Speed lines - Minimalist */}
      {progress > 15 && [0, 1].map(i => (
        <motion.div
          key={i}
          className="absolute h-[1px] bg-white/10"
          style={{
            left: `-${40 + i * 20}px`,
            bottom: `${10 + i * 8}px`,
            width: `${50 + i * 30}px`,
          }}
          animate={{ x: [0, -100], opacity: [0, 0.4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

const loaderStyles = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)
  const exitTriggeredRef = useRef(false)

  useEffect(() => {
    playMidnightSound()
  }, [])

  useEffect(() => {
    startTimeRef.current = performance.now()
    const tick = (now) => {
      const elapsed = now - startTimeRef.current
      const raw = elapsed / MIN_DURATION_MS
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3)
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
            style={{ background: '#050505' }}
            exit={{ opacity: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          >
            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] phantom-noise" />

            {/* Tactical Grid Background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.02]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            {/* Animated Car */}
            <AnimatedCar progress={progress} />

            {/* Brand - Modern Minimalist */}
            <div className="flex flex-col items-center gap-4 mb-16">
              <div className="flex gap-4">
                {BRAND.split(' ').map((word, wi) => (
                  <div key={wi} className="flex gap-1">
                    {word.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (wi * 8 + i) * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl font-black tracking-tighter text-white select-none uppercase"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                ))}
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-12 h-[1px] bg-white/20"
              />
            </div>

            {/* Progress - Tactical readout */}
            <div className="w-64 flex flex-col items-center gap-4">
              <div className="w-full flex items-center justify-between">
                <span className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">Initializing System</span>
                <span className="text-white text-[10px] font-black tracking-widest tabular-nums">{progress}%</span>
              </div>
              <div className="w-full h-px bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/40"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Footer hint */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 flex flex-col items-center gap-2"
            >
               <span className="text-slate-800 text-[8px] font-black uppercase tracking-[0.6em]">Midnight Ride Automotive Group</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
