import { useState, lazy, Suspense, memo } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import useTilt from '../../hooks/useTilt.js'

const Car3DViewer = lazy(() => import('./Car3DViewer.jsx'))

const CLASS_COLOR_MAP = {
  Subcompact: 'slate',
  Compact: 'slate',
  Sedan: 'slate',
  Luxury: 'amber',
}

function ViewerLoader() {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-px bg-white/20 animate-pulse" />
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Initializing Hologram</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono, highlight }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{label}</span>
      <span className={`text-[11px] font-black tracking-widest uppercase ${mono ? 'font-mono' : ''} ${highlight ? 'text-white' : 'text-slate-400'}`}>
        {value}
      </span>
    </div>
  )
}

export default memo(function CarCard({ car }) {
  const { ref, style } = useTilt({ maxTilt: 10, scale: 1.03 })
  const [show3D, setShow3D] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const isLuxury = car.carClass === 'Luxury'

  return (
    <>
      <div ref={ref} style={style} className="h-full">
        <GlassCard className="h-full flex flex-col overflow-hidden bg-white/5 border border-white/10 group transition-all duration-500 hover:border-white/20">
          {/* Image */}
          <div className="overflow-hidden h-56 bg-black relative">
            <motion.img
              src={car.imageUrl}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Class Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded border ${
                isLuxury 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.2)]' 
                  : 'bg-white/10 border-white/20 text-white/70'
              }`}>
                {car.carClass}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 p-6 gap-5">
            {/* Title Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-black text-xl leading-none uppercase tracking-tighter">
                  {car.make} {car.model}
                </h3>
                <span className="text-slate-600 text-[10px] font-black tracking-widest">{car.year}</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-4 h-px bg-slate-800" />
                 <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{car.color} Exterior</span>
              </div>
            </div>

            {/* Core info */}
            <div className="bg-white/5 rounded-2xl px-5 py-2 border border-white/5">
              <InfoRow label="Asset ID" value={car.id} mono highlight />
              <InfoRow label="License" value={car.licensePlate} mono />
              <InfoRow label="Start Log" value={`${(car.odometerStart ?? 0).toLocaleString()} KM`} />
            </div>

            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="bg-white/5 rounded-2xl px-5 py-2 border border-white/5 mt-[-12px]">
                <InfoRow label="Capacity" value={`${car.seats ?? 5} UNITS`} />
                <InfoRow label="Drive" value={car.transmission ?? 'AUTO'} />
                <InfoRow label="Power" value={car.fuelType ?? 'GAS'} />
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto">
              <motion.button
                onClick={() => setShow3D(true)}
                whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.25em] cursor-pointer transition-all duration-300 hover:text-white"
              >
                <span className="text-sm">⬡</span> Initialize 3D View
              </motion.button>

              <button
                onClick={() => setExpanded(v => !v)}
                className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer bg-transparent border-none text-center"
              >
                {expanded ? 'Collapse Data' : 'Expand Data Stream'}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {show3D && (
        <Suspense fallback={<ViewerLoader />}>
          <Car3DViewer car={car} onClose={() => setShow3D(false)} />
        </Suspense>
      )}
    </>
  )
})
