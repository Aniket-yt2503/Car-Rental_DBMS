import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from '../hooks/useLenis.js'
import Locations from '../components/Locations/Locations.jsx'
import { getLocations } from '../api/locations.js'
import employees from '../data/employees.js'
import { HEADQUARTERS } from '../data/employees.js'
import dropOffCharges from '../data/dropOffCharges.js'
import GlassCard from '../components/ui/GlassCard.jsx'
import NeonBadge from '../components/ui/NeonBadge.jsx'
import Footer from '../components/Footer/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

const CAR_CLASSES = ['Subcompact', 'Compact', 'Sedan', 'Luxury']

function DropOffMatrix({ locations }) {
  const [selectedClass, setSelectedClass] = useState('Sedan')

  const getCharge = (fromId, toId) => {
    if (fromId === toId) return null
    const entry = dropOffCharges.find(
      d => d.fromId === fromId && d.toId === toId && d.carClass === selectedClass
    )
    return entry ? entry.charge : 49.99
  }

  return (
    <div className="mt-14">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Drop-Off Charges</h2>
        <p className="text-white/50 text-sm">One-way rental fees by route and car class</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {CAR_CLASSES.map(cls => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
              selectedClass === cls
                ? 'bg-purple-600/80 border-purple-500 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/40 text-xs uppercase tracking-wider font-medium">From ↓ / To →</th>
              {locations.map(loc => (
                <th key={loc.id} className="p-4 text-white/60 text-xs font-medium text-center whitespace-nowrap">{loc.city}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locations.map((fromLoc, ri) => (
              <tr key={fromLoc.id} className={`border-b border-white/5 ${ri % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                <td className="p-4 text-white/60 text-xs font-semibold whitespace-nowrap">{fromLoc.city}</td>
                {locations.map(toLoc => {
                  const charge = getCharge(fromLoc.id, toLoc.id)
                  return (
                    <td key={toLoc.id} className="p-4 text-center">
                      {charge === null
                        ? <span className="text-white/15 text-xs">—</span>
                        : <span className="text-amber-400 font-semibold text-xs">${charge.toFixed(2)}</span>
                      }
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LocationCards({ locations }) {
  const cardsRef = useRef(null)

  useEffect(() => {
    if (!cardsRef.current) return
    const cards = cardsRef.current.querySelectorAll('.loc-card')
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', once: true },
    })
  }, [locations])

  const empCount = (locId) => employees.filter(e => e.locationId === locId).length

  return (
    <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
      {/* HQ card — FIRST */}
      <div className="loc-card">
        <GlassCard className="p-5 h-full flex flex-col gap-3" style={{ borderColor: 'rgba(168,85,247,0.35)', background: 'rgba(168,85,247,0.05)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm">{HEADQUARTERS.name}</h3>
              <p className="text-white/35 text-xs mt-0.5 font-mono">{HEADQUARTERS.id}</p>
            </div>
            <span className="text-xl">🏢</span>
          </div>
          <div className="text-white/60 text-sm leading-relaxed">
            <p>{HEADQUARTERS.streetAddress}</p>
            <p>{HEADQUARTERS.city}, {HEADQUARTERS.province}</p>
            <p className="font-mono text-xs text-white/35 mt-1">{HEADQUARTERS.postalCode}</p>
          </div>
          <div className="mt-auto pt-3 border-t border-white/8">
            <NeonBadge label="Headquarters" color="purple" />
            <p className="text-white/35 text-xs mt-2">President + 2 Vice-Presidents</p>
          </div>
        </GlassCard>
      </div>

      {/* Branch cards */}
      {locations.map(loc => (
        <div key={loc.id} className="loc-card">
          <GlassCard className="p-5 h-full flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm">{loc.name}</h3>
                <p className="text-white/35 text-xs mt-0.5 font-mono">{loc.id}</p>
              </div>
              <span className="text-xl">📍</span>
            </div>
            <div className="text-white/60 text-sm leading-relaxed">
              <p>{loc.streetAddress}</p>
              <p>{loc.city}, {loc.province}</p>
              <p className="font-mono text-xs text-white/35 mt-1">{loc.postalCode}</p>
            </div>
            {loc.phone && <p className="text-white/40 text-xs">{loc.phone}</p>}
            {loc.hours && <p className="text-white/30 text-xs">{loc.hours}</p>}
            <div className="mt-auto pt-3 border-t border-white/8 flex items-center justify-between">
              <span className="text-white/35 text-xs">{empCount(loc.id)} staff</span>
              <span className="text-xs text-purple-400/60 font-mono">{loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}</span>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  )
}

export default function LocationsPage() {
  useLenis()
  const [locations, setLocations] = useState([])

  useEffect(() => {
    getLocations().then(({ data }) => { if (data) setLocations(data) })
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Page hero */}
      <div className="relative pt-28 pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-15" style={{ width: '45vw', height: '45vw', top: '-10%', right: '-5%', filter: 'blur(60px)', background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)', willChange: 'transform' }} />
          <div className="absolute rounded-full opacity-12" style={{ width: '35vw', height: '35vw', bottom: '-10%', left: '10%', filter: 'blur(55px)', background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)', willChange: 'transform' }} />
        </div>
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-black text-white mb-3"
          >
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Locations
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/50 text-lg"
          >
            20+ cities worldwide — pick up and drop off anywhere.
          </motion.p>
        </div>
      </div>

      {/* Compact interactive map */}
      <Locations />

      {/* Branch cards + HQ */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <h2 className="text-2xl font-bold text-white mb-2 mt-8">All Branches</h2>
        <p className="text-white/40 text-sm mb-0">Click a city on the map or a card below to zoom in.</p>
        <LocationCards locations={locations} />
      </div>

      {/* Drop-off charge matrix */}
      {locations.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <DropOffMatrix locations={locations} />
        </div>
      )}

      <Footer />
    </div>
  )
}
