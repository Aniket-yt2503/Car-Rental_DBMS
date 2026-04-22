import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import NeonBadge from '../ui/NeonBadge.jsx'

const classColors = { Subcompact: 'cyan', Compact: 'blue', Sedan: 'purple', Luxury: 'purple' }

// Typical drop-off charges per class (min across routes)
const DROP_OFF_RANGE = {
  Subcompact: '$29 – $55',
  Compact:    '$39 – $65',
  Sedan:      '$49 – $85',
  Luxury:     '$79 – $130',
}

function PriceRow({ label, value, highlight }) {
  return (
    <div className={`flex justify-between items-center py-2.5 border-b border-white/5 last:border-0 ${highlight ? 'text-white' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-white/70' : 'text-white/45'}`}>{label}</span>
      <span className={`font-semibold text-sm ${highlight ? 'text-white' : 'text-white/80'}`}>${value.toFixed(2)}</span>
    </div>
  )
}

export default function PricingCard({ pricing }) {
  const color = classColors[pricing.carClass] ?? 'purple'

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 0 32px rgba(168,85,247,0.35), 0 0 64px rgba(168,85,247,0.12)' }}
      transition={{ duration: 0.22 }}
      className="h-full"
    >
      <GlassCard className="p-6 h-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <NeonBadge label={pricing.carClass} color={color} />
        </div>

        {/* Hero price */}
        <div>
          <p
            className="text-4xl font-extrabold leading-none"
            style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            ${pricing.perDay.toFixed(2)}
          </p>
          <p className="text-white/35 text-xs mt-1">per day</p>
        </div>

        {/* Rate breakdown */}
        <div className="flex-1">
          <PriceRow label="Per week (7 days)" value={pricing.perWeek} />
          <PriceRow label="Per 2 weeks (14 days)" value={pricing.per2Weeks} />
          <PriceRow label="Per month (30 days)" value={pricing.perMonth} highlight />
        </div>

        {/* Drop-off charge note */}
        <div className="pt-3 border-t border-white/8">
          <p className="text-white/35 text-xs flex items-center gap-1.5">
            <span className="text-amber-400/70">📍</span>
            Drop-off charge: <span className="text-amber-400/80 font-medium">{DROP_OFF_RANGE[pricing.carClass]}</span>
          </p>
          <p className="text-white/20 text-[10px] mt-1">Varies by route. Same-location return = no charge.</p>
        </div>
      </GlassCard>
    </motion.div>
  )
}
