import { useEffect, useRef, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getCars } from '../../api/cars.js'
import { getLocations } from '../../api/locations.js'
import CarCard from './CarCard.jsx'

gsap.registerPlugin(ScrollTrigger)

const CAR_CLASSES = ['All', 'Subcompact', 'Compact', 'Sedan', 'Luxury']

// Section header
function SectionHeader({ filtered }) {
  return (
    <div className="text-center mb-10">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
        <span className="text-white">{filtered}</span> Units Ready For Deployment
      </p>
    </div>
  )
}

export default function Vehicles() {
  const [cars, setCars] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeClassFilter, setActiveClassFilter] = useState('All')
  const [activeLocationFilter, setActiveLocationFilter] = useState('All')
  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    Promise.all([getCars(), getLocations()]).then(([carsResult, locsResult]) => {
      if (carsResult.error || locsResult.error) setError(carsResult.error || locsResult.error)
      else { setCars(carsResult.data); setLocations(locsResult.data) }
      setLoading(false)
    })
  }, [])

  const hasAnimated = useRef(false)
  useEffect(() => {
    if (!gridRef.current || loading || hasAnimated.current) return
    const cards = gridRef.current.querySelectorAll('.car-card-item')
    if (!cards.length) return
    hasAnimated.current = true
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.6, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
      }
    )
  }, [loading])

  const locationOptions = ['All', ...locations.map(l => l.name)]

  const filtered = cars.filter(car => {
    const classMatch = activeClassFilter === 'All' || car.carClass === activeClassFilter
    const loc = locations.find(l => l.id === car.locationId)
    const locationMatch = activeLocationFilter === 'All' || (loc && loc.name === activeLocationFilter)
    return classMatch && locationMatch
  })

  const selectClass = "w-full sm:w-56 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border outline-none bg-white/5 border-white/10 text-white/70 focus:border-white/40 focus:text-white cursor-pointer appearance-none transition-all duration-300"

  return (
    <section ref={sectionRef} id="vehicles" className="pt-4 pb-20 px-6 relative overflow-hidden" style={{ background: 'transparent' }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
          <div className="relative group">
            <select
              value={activeClassFilter}
              onChange={(e) => setActiveClassFilter(e.target.value)}
              className={selectClass}
            >
              <option value="All" className="bg-neutral-900">All Categories</option>
              {CAR_CLASSES.filter(c => c !== 'All').map(cls => (
                <option key={cls} value={cls} className="bg-neutral-900">{cls}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/30 group-hover:text-white/60 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative group">
            <select
              value={activeLocationFilter}
              onChange={(e) => setActiveLocationFilter(e.target.value)}
              className={selectClass}
            >
              <option value="All" className="bg-neutral-900">All Locations</option>
              {locationOptions.filter(l => l !== 'All').map(loc => (
                <option key={loc} value={loc} className="bg-neutral-900">{loc}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/30 group-hover:text-white/60 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-px bg-white/20 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Initializing Fleet</p>
          </div>
        )}
        
        {error && <p className="text-center text-red-400 font-bold py-32 uppercase tracking-widest text-xs">Access Denied: {error}</p>}

        {!loading && !error && (
          <div ref={gridRef}>
            <SectionHeader filtered={filtered.length} />
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map(car => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="car-card-item"
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-px bg-white/10" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">No matching assets found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
