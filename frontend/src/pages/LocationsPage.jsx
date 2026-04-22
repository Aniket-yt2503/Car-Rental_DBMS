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
import SleekBadge from '../components/ui/SleekBadge.jsx'
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
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Drop-Off Charges</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Route & class specific logistics audit</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CAR_CLASSES.map(cls => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
              selectedClass === cls
                ? 'bg-white border-white text-black shadow-xl'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-6 text-slate-600 text-[10px] font-black uppercase tracking-widest">Origin ↓ / Target →</th>
              {locations.map(loc => (
                <th key={loc.id} className="p-6 text-white text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap">{loc.city}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locations.map((fromLoc, ri) => (
              <tr key={fromLoc.id} className={`border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors`}>
                <td className="p-6 text-white/60 text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{fromLoc.city}</td>
                {locations.map(toLoc => {
                  const charge = getCharge(fromLoc.id, toLoc.id)
                  return (
                    <td key={toLoc.id} className="p-6 text-center">
                      {charge === null
                        ? <span className="text-white/10 text-xs">—</span>
                        : <span className="text-amber-500 font-black text-xs tracking-widest">${charge.toFixed(2)}</span>
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
    <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
      {/* HQ card — FIRST */}
      <div className="loc-card">
        <GlassCard className="p-8 h-full flex flex-col gap-6" style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-black text-lg uppercase tracking-tighter">{HEADQUARTERS.name}</h3>
              <p className="text-slate-600 text-[10px] font-black tracking-widest mt-1 uppercase">{HEADQUARTERS.id}</p>
            </div>
            <span className="text-2xl">🏢</span>
          </div>
          <div className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wider">
            <p>{HEADQUARTERS.streetAddress}</p>
            <p>{HEADQUARTERS.city}, {HEADQUARTERS.province}</p>
            <p className="font-black text-[10px] text-slate-700 mt-2">{HEADQUARTERS.postalCode}</p>
          </div>
          <div className="mt-auto pt-6 border-t border-white/5">
            <SleekBadge label="HQ Command" color="white" />
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-3">PRESIDENTIAL SUITE + OPS</p>
          </div>
        </GlassCard>
      </div>

      {/* Branch cards */}
      {locations.map(loc => (
        <div key={loc.id} className="loc-card">
          <GlassCard className="p-8 h-full flex flex-col gap-6 hover:border-white/20 transition-all duration-500">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tighter">{loc.name}</h3>
                <p className="text-slate-600 text-[10px] font-black tracking-widest mt-1 uppercase">{loc.id}</p>
              </div>
              <span className="text-2xl">📍</span>
            </div>
            <div className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wider">
              <p>{loc.streetAddress}</p>
              <p>{loc.city}, {loc.province}</p>
              <p className="font-black text-[10px] text-slate-700 mt-2">{loc.postalCode}</p>
            </div>
            {loc.phone && <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{loc.phone}</p>}
            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-slate-700 text-[10px] font-black uppercase tracking-widest">{empCount(loc.id)} STAFF</span>
              <span className="text-[10px] text-slate-800 font-black tracking-widest">{loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}</span>
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
    <div className="min-h-screen bg-[#050505]">
      {/* Page hero */}
      <div className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="relative z-10 text-center">
           <div className="inline-block px-4 py-1.5 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-white/50 mb-8">
              Global Network Manifest
            </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            Tactical <span className="text-slate-800">Coordinates</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-slate-500 text-xl font-medium max-w-2xl mx-auto"
          >
            Strategic hubs in 20+ metropolitan sectors. Operational anywhere.
          </motion.p>
        </div>
      </div>

      <Locations />

      <div className="max-w-7xl mx-auto px-6 pb-12 mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Fleet Hubs</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Inventory distribution by sector</p>
           </div>
           <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Select hub on map or manifest below</p>
        </div>
        <LocationCards locations={locations} />
      </div>

      {locations.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-32">
          <DropOffMatrix locations={locations} />
        </div>
      )}

      <Footer />
    </div>
  )
}
