import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Marker } from 'react-simple-maps'
import GlowDot from '../ui/GlowDot'

export default function LocationMarker({ location, isSelected = false, onClick }) {
  const [hovered, setHovered] = useState(false)
  const dotSize = isSelected ? 10 : 6
  const dotColor = isSelected ? '#c084fc' : '#a855f7'

  return (
    <Marker coordinates={[location.lng, location.lat]}>
      <AnimatePresence>
        {hovered && (
          <motion.foreignObject
            x={-90} y={-110} width={180} height={100}
            style={{ overflow: 'visible', pointerEvents: 'none' }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: 'rgba(15,10,30,0.92)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '8px', padding: '8px 10px', color: '#e2e8f0', fontSize: '11px', lineHeight: '1.5', backdropFilter: 'blur(8px)', whiteSpace: 'nowrap', boxShadow: '0 0 16px rgba(168,85,247,0.25)' }}>
              <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: 2 }}>{location.name}</div>
              <div>{location.streetAddress}</div>
              <div>{location.city}, {location.province} {location.postalCode}</div>
            </div>
          </motion.foreignObject>
        )}
      </AnimatePresence>

      <g
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClick?.(location)}
        style={{ cursor: 'pointer' }}
        transform={`translate(-${dotSize}, -${dotSize})`}
      >
        <foreignObject width={dotSize * 4} height={dotSize * 4} style={{ overflow: 'visible' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowDot color={dotColor} size={dotSize} />
          </div>
        </foreignObject>
      </g>
    </Marker>
  )
}
