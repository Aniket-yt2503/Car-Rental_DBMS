import { useEffect, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import reviews from '../../data/reviews.js'
import SectionWrapper from '../ui/SectionWrapper.jsx'

const StarRating = memo(function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-purple-400' : 'text-white/15'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
})

const ReviewCard = memo(function ReviewCard({ review, index }) {
  const formattedDate = new Date(review.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short' })
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="phantom-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden cursor-default"
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(6,182,212,0.03))',
        border: '1px solid rgba(124,58,237,0.15)',
      }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(6,182,212,0.4), transparent)' }} />
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(124,58,237,0.15), transparent 70%)' }} />

      {/* Quote */}
      <div className="text-3xl text-purple-500/20 font-serif leading-none select-none -mb-2">"</div>

      <StarRating rating={review.rating} />

      <p className="text-white/75 text-sm leading-relaxed flex-1 italic">
        {review.body}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/8">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
        >
          {review.avatar}
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{review.authorName}</p>
          <p className="text-white/35 text-xs">{review.location} · {formattedDate}</p>
        </div>
      </div>
    </motion.div>
  )
})

export default function Reviews() {
  const [page, setPage] = useState(0)
  const PER_PAGE = 3
  const totalPages = Math.ceil(reviews.length / PER_PAGE)
  const visible = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  // Auto-advance pages
  useEffect(() => {
    const id = setInterval(() => setPage(p => (p + 1) % totalPages), 8000)
    return () => clearInterval(id)
  }, [totalPages])

  return (
    <SectionWrapper id="reviews">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          What Our <span className="phantom-text">Customers Say</span>
        </h2>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(196,181,253,0.5)' }}>
          Real experiences from real renters across Canada.
        </p>
      </div>

      {/* 3-column grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
        {visible.map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </motion.div>
      </AnimatePresence>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === page ? '24px' : '6px',
              background: i === page ? '#a855f7' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
