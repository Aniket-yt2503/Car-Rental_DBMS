import { useState, lazy, Suspense, memo } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import NeonBadge from '../ui/NeonBadge.jsx'
import useTilt from '../../hooks/useTilt.js'

const Car3DViewer = lazy(() => import('./Car3DViewer.jsx'))

const CLASS_COLOR_MAP = {
  Subcompact: 'cyan',
  Compact: 'blue',
  Sedan: 'purple',
  Luxury: 'purple',
}

function ViewerLoader() {
  return (
    <div className="fixed inset-0 z-[200] bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading 3D viewer…</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono, highlight }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/6 last:border-0">
      <span className="text-white/45 text-sm">{label}</span>
      <span className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${highlight ? 'text-purple-300' : 'text-white/85'}`}>
        {value}
      </span>
    </div>
  )
}

export default memo(function CarCard({ car }) {
  const { ref, style } = useTilt({ maxTilt: 10, scale: 1.03 })
  const badgeColor = CLASS_COLOR_MAP[car.carClass] ?? 'purple'
  const [show3D, setShow3D] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div ref={ref} style={style} className="h-full">
        <GlassCard className="h-full flex flex-col overflow-hidden">
          {/* Image — taller */}
          <div className="overflow-hidden rounded-t-2xl h-52 bg-white/5 relative">
            <motion.img
              src={car.imageUrl}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* 3D button — OUTSIDE the image, below it */}
          <div className="px-5 pt-3 pb-0">
            <motion.button
              onClick={() => setShow3D(true)}
              whileHover={{ scale: 1.03, boxShadow: '0 0 22px rgba(168,85,247,0.7)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/80 to-violet-600/80 border border-purple-400/40 text-white text-sm font-bold cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            >
              <span className="text-base">⬡</span> View in 3D
            </motion.button>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-5 gap-3">
            {/* Class + color badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <NeonBadge label={car.carClass} color={badgeColor} />
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-white/8 text-white/70 border border-white/10 font-medium">
                {car.color}
              </span>
            </div>

            {/* Make / Model / Year — bigger */}
            <div>
              <h3 className="text-white font-black text-xl leading-tight">
                {car.make} {car.model}
              </h3>
              <p className="text-white/50 text-base mt-0.5 font-medium">{car.year}</p>
            </div>

            {/* Core info — always visible, bigger rows */}
            <div className="bg-white/4 rounded-xl px-4 py-1 border border-white/6">
              <InfoRow label="Vehicle ID" value={car.id} mono highlight />
              <InfoRow label="License Plate" value={car.licensePlate} mono />
              <InfoRow label="Odometer" value={`${(car.odometerStart ?? 0).toLocaleString()} km`} />
            </div>

            {/* Expandable extra info */}
            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="bg-white/4 rounded-xl px-4 py-1 border border-white/6">
                <InfoRow label="Seats" value={`${car.seats ?? 5} passengers`} />
                <InfoRow label="Transmission" value={car.transmission ?? 'Automatic'} />
                <InfoRow label="Fuel Type" value={car.fuelType ?? 'Gasoline'} />
                {car.features?.slice(0, 3).map(f => (
                  <InfoRow key={f} label="✓" value={f} />
                ))}
              </div>
            </motion.div>

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-purple-400/80 text-sm hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-none text-left font-medium"
            >
              {expanded ? '▲ Show less' : '▼ More details'}
            </button>
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
