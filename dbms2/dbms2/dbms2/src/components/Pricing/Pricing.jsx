import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPricing } from '../../api/pricing.js'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import PricingCard from './PricingCard.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Pricing() {
  const [pricingData, setPricingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const gridRef = useRef(null)

  useEffect(() => {
    getPricing().then(({ data, error }) => {
      if (error) setError(error); else setPricingData(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!gridRef.current || loading) return
    const cards = gridRef.current.querySelectorAll('.pricing-card-item')
    if (!cards.length) return
    gsap.fromTo(cards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true } })
  }, [loading])

  return (
    <SectionWrapper id="pricing">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Simple <span className="phantom-text">Pricing</span></h2>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(196,181,253,0.5)' }}>Transparent rates for every class — no hidden fees.</p>
      </div>
      {loading && <p className="text-center text-white/40 py-20">Loading pricing…</p>}
      {error && <p className="text-center text-red-400 py-20">Failed to load pricing: {error}</p>}
      {!loading && !error && (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingData.map(p => <div key={p.carClass} className="pricing-card-item"><PricingCard pricing={p} /></div>)}
        </div>
      )}
    </SectionWrapper>
  )
}
