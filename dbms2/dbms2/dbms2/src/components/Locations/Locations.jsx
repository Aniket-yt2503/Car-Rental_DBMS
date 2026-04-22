import { useEffect, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLocations } from '../../api/locations'
import LocationMarker from './LocationMarker'
import { HEADQUARTERS } from '../../data/employees'

gsap.registerPlugin(ScrollTrigger)

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const DEFAULT_CENTER = [10, 25]
const DEFAULT_ZOOM = 1

export default function Locations() {
  const [locations, setLocations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [position, setPosition] = useState({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
  const markersRef = useRef([])
  const mapRef = useRef(null)

  useEffect(() => {
    getLocations().then(({ data }) => { if (data) setLocations(data) })
  }, [])

  useEffect(() => {
    if (!locations.length || !mapRef.current) return
    const ctx = gsap.context(() => {
      const els = markersRef.current.filter(Boolean)
      if (!els.length) return
      gsap.set(els, { opacity: 0, scale: 0 })
      ScrollTrigger.create({
        trigger: mapRef.current,
        start: 'top 80%',
        onEnter: () => gsap.to(els, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' }),
        once: true,
      })
    })
    return () => ctx.revert()
  }, [locations])

  function handleMarkerClick(location) {
    if (selectedId === location.id) {
      setSelectedId(null)
      setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
    } else {
      setSelectedId(location.id)
      setPosition({ coordinates: [location.lng, location.lat], zoom: 5 })
    }
  }

  // Group by country/region for pills
  const countries = [...new Set(locations.map(l => l.country))]

  return (
    <div ref={mapRef} className="px-6 pb-4">
      <div className="max-w-6xl mx-auto">
        {/* World map */}
        <div
          className="rounded-2xl overflow-hidden border border-white/10"
          style={{ background: '#080818', boxShadow: '0 0 30px rgba(168,85,247,0.06)', height: '360px' }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: DEFAULT_CENTER, scale: 140 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup
              center={position.coordinates}
              zoom={position.zoom}
              onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates, zoom })}
              minZoom={0.8}
              maxZoom={8}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#0f0f28"
                      stroke="#ffffff06"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#16163a' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              {locations.map((loc, i) => (
                <g key={loc.id} ref={(el) => { markersRef.current[i] = el }}>
                  <LocationMarker
                    location={loc}
                    isSelected={selectedId === loc.id}
                    onClick={handleMarkerClick}
                  />
                </g>
              ))}
              {/* HQ marker — Hamilton */}
              <Marker coordinates={[HEADQUARTERS.lng, HEADQUARTERS.lat]}>
                <g style={{ cursor: 'pointer' }}>
                  <circle r={7} fill="#f59e0b" opacity={0.9} style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }} />
                  <text textAnchor="middle" y={-12} style={{ fontSize: '8px', fill: '#fde68a', fontWeight: 700 }}>HQ</text>
                </g>
              </Marker>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Country filter pills */}
        {locations.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button
              onClick={() => { setSelectedId(null); setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }) }}
              className="px-3 py-1 rounded-full text-xs border transition-all duration-200 cursor-pointer bg-white/5 border-white/10 text-white/55 hover:border-purple-500/40 hover:text-white/80"
            >
              🌍 World View
            </button>
            {countries.map(country => (
              <button
                key={country}
                onClick={() => {
                  const locs = locations.filter(l => l.country === country)
                  if (locs.length) {
                    const avgLng = locs.reduce((s, l) => s + l.lng, 0) / locs.length
                    const avgLat = locs.reduce((s, l) => s + l.lat, 0) / locs.length
                    setPosition({ coordinates: [avgLng, avgLat], zoom: 3 })
                  }
                }}
                className="px-3 py-1 rounded-full text-xs border transition-all duration-200 cursor-pointer bg-white/5 border-white/10 text-white/55 hover:border-purple-500/40 hover:text-white/80"
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
