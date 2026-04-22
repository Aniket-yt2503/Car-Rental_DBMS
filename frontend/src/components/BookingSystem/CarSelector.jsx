import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCars } from '../../api/cars.js'
import { useAppContext } from '../../context/AppContext.jsx'
import SleekBadge from '../ui/SleekBadge.jsx'
import SleekButton from '../ui/SleekButton.jsx'
import { lazy, Suspense } from 'react'

const Car3DViewer = lazy(() => import('../Vehicles/Car3DViewer.jsx'))

const CLASS_COLOR_MAP = { Subcompact: 'slate', Compact: 'slate', Sedan: 'slate', Luxury: 'amber' }
const CLASS_ORDER = ['Subcompact', 'Compact', 'Sedan', 'Luxury']

function CarOption({ car, selected, onSelect, onView3D }) {
  const isLuxury = car.carClass === 'Luxury'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      onClick={() => onSelect(car)}
      className={`relative rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden group bg-white/5 border ${
        selected
          ? 'border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-black">
        <img
          src={car.imageUrl}
          alt={`${car.year} ${car.make} ${car.model}`}
          className={`w-full h-full object-cover transition-all duration-700 ${selected ? 'opacity-100 scale-105' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'}`}
        />
        {/* 3D button */}
        <button
          onClick={e => { e.stopPropagation(); onView3D(car) }}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer backdrop-blur-md"
        >
          ⬡ VIEW 3D
        </button>
        {selected && (
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xl">
            <span className="text-black text-xs font-black">✓</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
           <SleekBadge label={car.carClass} color={isLuxury ? 'amber' : 'slate'} />
          <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{car.color}</span>
        </div>
        <p className="text-white font-black text-lg uppercase tracking-tighter">{car.make} {car.model}</p>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{car.year}</p>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
          <span className="text-slate-700 text-[9px] font-black uppercase tracking-widest">{car.id}</span>
          <span className="text-slate-700 text-[9px] font-black uppercase tracking-widest">{car.licensePlate}</span>
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

  useEffect(() => {
    const lenis = state.lenis
    if (lenis) lenis.stop()
    document.body.style.overflow = 'hidden'

    return () => {
      if (lenis) lenis.start()
      document.body.style.overflow = ''
    }
  }, [state.lenis])

  useEffect(() => {
    getCars().then(({ data }) => {
      if (data) setCars(data)
      setLoading(false)
    })
  }, [])

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
      <div className="fixed inset-0 z-[100] backdrop-blur-3xl flex flex-col" style={{ height: '100dvh', background: 'rgba(5,5,5,0.98)' }}>
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 scrollbar-none"
          style={{ overflowY: 'scroll', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
        <div className="max-w-7xl mx-auto px-6 py-12 pb-40">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">SELECT MISSION ASSET</h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                Deployment for {formData?.requestedClass} class · {filtered.length} assets ready
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-white transition-all cursor-pointer"
            >
              ← BACK
            </button>
          </div>

          {/* Trip summary pill */}
          {formData && (
            <div className="flex flex-wrap items-center gap-6 mb-12 p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                 <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Route</span>
                 <span className="text-white text-[11px] font-black uppercase tracking-widest">{formData.pickupLocation} → {formData.returnLocation}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                 <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Timeline</span>
                 <span className="text-white text-[11px] font-black uppercase tracking-widest">{formData.pickupDate} — {formData.returnDate}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                 <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Target</span>
                 <span className="text-amber-500 text-[11px] font-black uppercase tracking-widest">{formData.requestedClass} CLASS</span>
              </div>
            </div>
          )}

          {/* Class filter tabs */}
          <div className="flex gap-3 mb-10 flex-wrap">
            {allFilters.map(cls => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer border ${
                  classFilter === cls
                    ? 'bg-white border-white text-black shadow-xl'
                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="w-16 h-px bg-white/20 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Scanning Fleet</p>
            </div>
          )}

          {/* Car grid */}
          {!loading && (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
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
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="w-16 h-px bg-white/10" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">No matching assets found</p>
            </div>
          )}
        </div>
        </div>

        {/* Footer Confirm Bar */}
        <div className="shrink-0 px-6 py-6 border-t border-white/5 bg-black/50 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {selectedCar ? (
                  <div className="flex items-center gap-4">
                    <img src={selectedCar.imageUrl} className="w-20 h-12 object-cover rounded-xl border border-white/10" />
                    <div>
                      <p className="text-white font-black text-sm uppercase tracking-widest">{selectedCar.make} {selectedCar.model}</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{selectedCar.carClass} · {selectedCar.year}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-800 animate-pulse" />
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Standby for asset selection</p>
                  </div>
                )}
              </div>
              <div className="w-full sm:w-auto">
                <SleekButton
                  onClick={() => selectedCar && onConfirm(selectedCar)}
                  disabled={!selectedCar}
                  variant="amber"
                  className="w-full sm:w-64 py-4 text-[11px] font-black uppercase tracking-[0.3em]"
                >
                  INITIALIZE AUTHORIZATION
                </SleekButton>
              </div>
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
