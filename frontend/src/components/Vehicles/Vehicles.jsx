import { useEffect, useRef, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getCars } from '../../api/cars.js'
import { getLocations } from '../../api/locations.js'
import CarCard from './CarCard.jsx'

gsap.registerPlugin(ScrollTrigger)

const CAR_CLASSES = ['All', 'Subcompact', 'Compact', 'Sedan', 'Luxury']

function FilterButton({ label, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
        active
          ? 'bg-purple-600/80 border-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.5)]'
          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </motion.button>
  )
}

// Horizontal scroll marquee
const ClassMarquee = memo(function ClassMarquee() {
  const items = ['SUBCOMPACT', 'COMPACT', 'SEDAN', 'LUXURY', 'SUBCOMPACT', 'COMPACT', 'SEDAN', 'LUXURY']
  return (
    <div className="overflow-hidden py-3 mb-8 border-y border-white/5">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {items.map((item, i) => (
          <span key={i} className="text-white/8 text-4xl font-black tracking-widest select-none">{item}</span>
        ))}
      </motion.div>
    </div>
  )
})

// Section header — simple, no scroll-driven parallax
function SectionHeader({ filtered }) {
  return (
    <div className="text-center mb-6">
      <p className="text-white/50 text-base">
        <span className="text-white font-semibold">{filtered}</span> vehicles available — hover to tilt, click 3D to explore.
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

  // GSAP stagger entrance — only on first load
  const hasAnimated = useRef(false)
  useEffect(() => {
    if (!gridRef.current || loading || hasAnimated.current) return
    const cards = gridRef.current.querySelectorAll('.car-card-item')
    if (!cards.length) return
    hasAnimated.current = true
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.55, stagger: 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
      }
    )
  }, [loading])

  // Horizontal scroll line animation
  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.vehicles-line',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const locationOptions = ['All', ...locations.map(l => l.name)]

  const filtered = cars.filter(car => {
    const classMatch = activeClassFilter === 'All' || car.carClass === activeClassFilter
    const loc = locations.find(l => l.id === car.locationId)
    const locationMatch = activeLocationFilter === 'All' || (loc && loc.name === activeLocationFilter)
    return classMatch && locationMatch
  })

  return (
    <section ref={sectionRef} id="vehicles" className="pt-4 pb-20 px-6 relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* Background grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)',
      }} />

      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-wrap gap-2 justify-center">
            {CAR_CLASSES.map(cls => (
              <FilterButton key={cls} label={cls} active={activeClassFilter === cls} onClick={() => setActiveClassFilter(cls)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {locationOptions.map(loc => (
              <FilterButton key={loc} label={loc} active={activeLocationFilter === loc} onClick={() => setActiveLocationFilter(loc)} />
            ))}
          </div>
        </div>

        {loading && <p className="text-center text-white/40 py-20">Loading vehicles…</p>}
        {error && <p className="text-center text-red-400 py-20">Failed to load vehicles: {error}</p>}

        {!loading && !error && (
          <div ref={gridRef}>
            <SectionHeader filtered={filtered.length} />
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(car => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.22 }}
                    className="car-card-item"
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <p className="text-center text-white/40 py-20">No vehicles match the selected filters.</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
