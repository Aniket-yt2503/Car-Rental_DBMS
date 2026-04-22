import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCars } from '../../api/cars.js'
import { useAppContext } from '../../context/AppContext.jsx'
import NeonBadge from '../ui/NeonBadge.jsx'
import NeonButton from '../ui/NeonButton.jsx'
import { lazy, Suspense } from 'react'

const Car3DViewer = lazy(() => import('../Vehicles/Car3DViewer.jsx'))

const CLASS_COLOR_MAP = { Subcompact: 'cyan', Compact: 'blue', Sedan: 'purple', Luxury: 'purple' }
const CLASS_ORDER = ['Subcompact', 'Compact', 'Sedan', 'Luxury']

function CarOption({ car, selected, onSelect, onView3D }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      onClick={() => onSelect(car)}
      className={`relative rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group ${
        selected
          ? 'shadow-[0_0_25px_rgba(124,58,237,0.4),0_0_50px_rgba(124,58,237,0.15)]'
          : 'hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]'
      }`}
      style={selected
        ? { border: '1px solid rgba(124,58,237,0.6)', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.05))' }
        : { border: '1px solid rgba(124,58,237,0.12)', background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(2,2,8,0.8))' }
      }
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-black/30">
        <img
          src={car.imageUrl}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* 3D button */}
        <button
          onClick={e => { e.stopPropagation(); onView3D(car) }}
          className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 border border-white/20 text-white/70 text-xs font-medium hover:bg-purple-600/60 hover:text-white hover:border-purple-400/50 transition-all cursor-pointer backdrop-blur-sm"
        >
          ⬡ 3D
        </button>
        {selected && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <NeonBadge label={car.carClass} color={CLASS_COLOR_MAP[car.carClass] ?? 'purple'} />
          <span className="text-white/50 text-xs">{car.color}</span>
        </div>
        <p className="text-white font-semibold text-sm">{car.make} {car.model}</p>
        <p className="text-white/40 text-xs mt-0.5">{car.year}</p>

        {/* Features */}
        {car.features && (
          <div className="flex flex-wrap gap-1 mt-2">
            {car.features.slice(0, 2).map(f => (
              <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/50 border border-white/8">{f}</span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/8">
          <span className="text-white/30 text-[10px] font-mono">{car.id}</span>
          <span className="text-white/30 text-[10px] font-mono">{car.licensePlate}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function CarSelector({ onConfirm, onBack }) {
  const { state } = useAppContext()
  const formData = state.bookingFormData
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCar, setSelectedCar] = useState(null)
  const [viewing3D, setViewing3D] = useState(null)
  const [classFilter, setClassFilter] = useState(formData?.requestedClass ?? 'All')

  const scrollRef = useRef(null)

  // Stop Lenis and intercept wheel events so the overlay scrolls natively
  useEffect(() => {
    const lenis = state.lenis
    if (lenis) lenis.stop()
    document.body.style.overflow = 'hidden'

    // Intercept wheel events on the overlay div before Lenis sees them
    const el = scrollRef.current
    const onWheel = (e) => {
      e.stopPropagation()
      if (el) el.scrollTop += e.deltaY
    }
    if (el) el.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      if (lenis) lenis.start()
      document.body.style.overflow = ''
      if (el) el.removeEventListener('wheel', onWheel)
    }
  }, [state.lenis])

  useEffect(() => {
    getCars().then(({ data }) => {
      if (data) setCars(data)
      setLoading(false)
    })
  }, [])

  // Filter: show requested class + higher (upgrade eligible)
  const eligibleClasses = formData?.requestedClass
    ? CLASS_ORDER.slice(CLASS_ORDER.indexOf(formData.requestedClass))
    : CLASS_ORDER

  const filtered = cars.filter(car => {
    if (classFilter !== 'All' && car.carClass !== classFilter) return false
    return eligibleClasses.includes(car.carClass)
  })

  const allFilters = ['All', ...eligibleClasses]

  return (
    <>
      <div className="fixed inset-0 z-[100] backdrop-blur-sm flex flex-col" style={{ height: '100dvh', background: 'rgba(2,2,8,0.98)' }}>
        {/* Scrollable content area */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0"
          style={{ overflowY: 'scroll', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Choose Your Vehicle</h1>
              <p className="text-white/40 text-sm mt-1">
                Showing {formData?.requestedClass} and above · {filtered.length} available
              </p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none"
            >
              ← Back
            </button>
          </div>

          {/* Trip summary pill */}
          {formData && (
            <div className="flex flex-wrap gap-3 mb-6 p-3 rounded-xl text-xs" style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)', color: 'rgba(196,181,253,0.7)' }}>
              <span>📍 {formData.pickupLocation}</span>
              <span className="text-white/20">→</span>
              <span>📍 {formData.returnLocation}</span>
              <span className="text-white/20">·</span>
              <span>📅 {formData.pickupDate} → {formData.returnDate}</span>
              <span className="text-white/20">·</span>
              <span className="text-purple-400">Requested: {formData.requestedClass}</span>
            </div>
          )}

          {/* Class filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {allFilters.map(cls => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  classFilter === cls
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
                style={classFilter === cls
                  ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.3))', border: '1px solid rgba(124,58,237,0.6)', boxShadow: '0 0 12px rgba(124,58,237,0.3)' }
                  : { background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }
                }
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Upgrade notice */}
          {formData?.requestedClass && (
            <div className="mb-5 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2">
              <span>ℹ</span>
              Higher class vehicles may be assigned at your requested class price — complimentary upgrade.
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20 text-white/40">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
              Loading vehicles…
            </div>
          )}

          {/* Car grid */}
          {!loading && (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                {filtered.map(car => (
                  <CarOption
                    key={car.id}
                    car={car}
                    selected={selectedCar?.id === car.id}
                    onSelect={setSelectedCar}
                    onView3D={setViewing3D}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-white/40 py-16">No vehicles available for this filter.</p>
          )}

          {/* Confirm bar spacer */}
          <div className="h-4" />
        </div>
        </div>

        <div className="shrink-0 px-4 py-3" style={{ borderTop: '1px solid rgba(124,58,237,0.2)', background: 'rgba(2,2,8,0.95)', backdropFilter: 'blur(20px)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between rounded-2xl px-5 py-3" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))', border: '1px solid rgba(124,58,237,0.25)' }}>
              <div>
                {selectedCar ? (
                  <div>
                    <p className="text-white font-semibold text-sm">{selectedCar.year} {selectedCar.make} {selectedCar.model}</p>
                    <p className="text-white/40 text-xs">{selectedCar.carClass} · {selectedCar.color}</p>
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">Select a vehicle to continue</p>
                )}
              </div>
              <NeonButton
                onClick={() => selectedCar && onConfirm(selectedCar)}
                disabled={!selectedCar}
                className="px-6"
              >
                Continue →
              </NeonButton>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      <AnimatePresence>
        {viewing3D && (
          <Suspense fallback={null}>
            <Car3DViewer car={viewing3D} onClose={() => setViewing3D(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}
