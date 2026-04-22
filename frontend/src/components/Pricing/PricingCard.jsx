import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import SleekBadge from '../ui/SleekBadge.jsx'

const classColors = { Subcompact: 'slate', Compact: 'slate', Sedan: 'slate', Luxury: 'amber' }

const DROP_OFF_RANGE = {
  Subcompact: '$29 – $55',
  Compact:    '$39 – $65',
  Sedan:      '$49 – $85',
  Luxury:     '$79 – $130',
}

function PriceRow({ label, value, highlight }) {
  return (
    <div className={`flex justify-between items-center py-3 border-b border-white/5 last:border-0 ${highlight ? 'text-white' : ''}`}>
      <span className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-white/70' : 'text-slate-600'}`}>{label}</span>
      <span className={`text-[11px] font-black tracking-widest ${highlight ? 'text-white' : 'text-white/60'}`}>${value.toFixed(2)}</span>
    </div>
  )
}

export default function PricingCard({ pricing }) {
  const color = classColors[pricing.carClass] ?? 'slate'

  return (
    <motion.div
      whileHover={{ y: -8, borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-full group"
    >
      <GlassCard className="p-8 h-full flex flex-col gap-8 transition-all duration-500 border-white/10 group-hover:border-white/20">
        <div className="flex items-center justify-between">
          <SleekBadge label={pricing.carClass} color={color} />
        </div>

        <div>
          <p className="text-5xl font-black text-white tracking-tighter">
            ${pricing.perDay.toFixed(2)}
          </p>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Daily Manifest Rate</p>
        </div>

        <div className="flex-1">
          <PriceRow label="Weekly Cycle" value={pricing.perWeek} />
          <PriceRow label="Bi-Weekly Cycle" value={pricing.per2Weeks} />
          <PriceRow label="Monthly Manifest" value={pricing.perMonth} highlight />
        </div>

        <div className="pt-6 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Logistical Range</p>
          <p className="text-white font-black text-xs uppercase tracking-widest">
            {DROP_OFF_RANGE[pricing.carClass]}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  )
}
