import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getPromotions } from '../../api/promotions.js'
import SleekBadge from '../ui/SleekBadge.jsx'

export default function Promotions() {
  const [promotion, setPromotion] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getPromotions().then(({ data, error }) => {
      if (!error && data) setPromotion(data.find(p => p.active) ?? null)
      setLoading(false)
    })
  }, [])

  if (loading || !promotion) return null

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl overflow-hidden flex flex-col md:flex-row items-center gap-8 px-10 py-8 bg-white/5 border border-white/10"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 pointer-events-none shimmer opacity-30" />

        {/* Discount badge */}
        <div className="shrink-0 relative z-10 text-center md:text-left">
          <div className="text-7xl font-black text-white leading-none tracking-tighter">
            {promotion.discountPercent}%
          </div>
          <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Reduction Audit</div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-white/10 shrink-0" />

        {/* Info */}
        <div className="flex-1 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Active Manifest Deal</span>
            <SleekBadge label={promotion.carClass} color="amber" />
          </div>
          <p className="text-white font-black text-xl uppercase tracking-tighter">{promotion.label}</p>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,1)', color: '#000' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            navigate('/')
            setTimeout(() => {
              const el = document.getElementById('home')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 80)
          }}
          className="shrink-0 px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] text-white bg-white/10 border border-white/20 transition-all cursor-pointer"
        >
          Initialize Offer
        </motion.button>
      </motion.div>
    </div>
  )
}
