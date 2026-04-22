import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getPromotions } from '../../api/promotions.js'
import NeonBadge from '../ui/NeonBadge.jsx'

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
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden flex items-center gap-6 px-8 py-5"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.15))',
          border: '1px solid rgba(168,85,247,0.3)',
          boxShadow: '0 0 30px rgba(168,85,247,0.12)',
        }}
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.1) 0%, transparent 60%)' }} />

        {/* Discount badge */}
        <div className="shrink-0 relative z-10">
          <div
            className="text-5xl font-black leading-none"
            style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {promotion.discountPercent}%
          </div>
          <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mt-0.5">OFF</div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-white/10 shrink-0" />

        {/* Info */}
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/40 text-xs uppercase tracking-widest">This Week's Deal</span>
            <NeonBadge label={promotion.carClass} color="purple" />
          </div>
          <p className="text-white font-semibold text-base">{promotion.label}</p>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            navigate('/')
            setTimeout(() => {
              const el = document.getElementById('home')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 80)
          }}
          className="shrink-0 px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer border-none relative z-10"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
        >
          Book Now
        </motion.button>
      </motion.div>
    </div>
  )
}
