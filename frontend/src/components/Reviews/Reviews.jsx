import { useEffect, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import reviews from '../../data/reviews.js'
import SectionWrapper from '../ui/SectionWrapper.jsx'

const StarRating = memo(function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-500' : 'text-slate-800'}`} fill="currentColor" viewBox="0 0 20 20">
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
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="phantom-card rounded-3xl p-8 flex flex-col gap-5 relative overflow-hidden cursor-default bg-white/5 border border-white/10"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="text-4xl text-white/5 font-serif leading-none select-none -mb-4 font-black">"</div>

      <StarRating rating={review.rating} />

      <p className="text-slate-400 text-sm leading-relaxed flex-1 italic font-medium">
        {review.body}
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-5 border-t border-white/5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-black shrink-0 tracking-tighter"
          style={{ background: 'linear-gradient(135deg,#ffffff,#94a3b8)' }}
        >
          {review.avatar}
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight uppercase tracking-widest">{review.authorName}</p>
          <p className="text-slate-600 text-[11px] font-bold mt-0.5">{review.location} · {formattedDate}</p>
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

  useEffect(() => {
    const id = setInterval(() => setPage(p => (p + 1) % totalPages), 10000)
    return () => clearInterval(id)
  }, [totalPages])

  return (
    <SectionWrapper id="reviews">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          VOICES OF THE <span className="phantom-text">DRIVE</span>
        </h2>
        <p className="text-lg max-w-xl mx-auto text-slate-500 font-medium">
          Elite perspectives from our global community of enthusiasts.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
        {visible.map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
            className="h-1 rounded-full transition-all duration-500 cursor-pointer"
            style={{
              width: i === page ? '40px' : '8px',
              background: i === page ? '#ffffff' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
