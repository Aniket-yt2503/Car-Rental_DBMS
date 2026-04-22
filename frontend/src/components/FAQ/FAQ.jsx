import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import FAQItem from './FAQItem.jsx'

gsap.registerPlugin(ScrollTrigger)

const FAQ_DATA = [
  { id: 'faq-1', question: 'What documents do I need to rent a car?', answer: "You will need a valid driver's licence, a major credit card in your name, and a government-issued photo ID. International renters should also bring their passport and, where applicable, an International Driving Permit." },
  { id: 'faq-2', question: 'Can I return the car to a different location?', answer: 'Yes — we support one-way rentals between any of our locations. A Drop-Off Charge of $49.99 applies when the return location differs from the pickup location. This fee is shown clearly during checkout.' },
  { id: 'faq-3', question: 'What is the minimum rental age?', answer: 'Renters must be at least 21 years of age. Drivers aged 21–24 may be subject to a young driver surcharge depending on the vehicle class selected.' },
  { id: 'faq-4', question: 'How does the car class upgrade work?', answer: 'If your requested class is unavailable at pickup, we may assign you a higher class at no extra charge. You will always pay the rate for the class you originally booked — never more.' },
  { id: 'faq-5', question: 'What fuel policy applies to my rental?', answer: 'We operate a full-to-full policy. The vehicle is provided with a full tank and should be returned full. The fuel level at pickup and return is recorded on your rental agreement.' },
  { id: 'faq-6', question: 'Are there mileage limits on rentals?', answer: 'All rentals include unlimited kilometres within Canada. Cross-border travel into the United States requires prior approval and may incur additional fees.' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    const items = listRef.current.querySelectorAll('.faq-item')
    if (!items.length) return
    gsap.fromTo(items, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: listRef.current, start: 'top 80%', once: true } })
  }, [])

  return (
    <SectionWrapper id="faqs">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Frequently Asked Questions</h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto">Everything you need to know before you hit the road.</p>
      </div>
      <div ref={listRef} className="max-w-4xl mx-auto flex flex-col gap-3">
        {FAQ_DATA.map((item, idx) => (
          <div key={item.id} className="faq-item">
            <FAQItem question={item.question} answer={item.answer} isOpen={openIndex === idx} onClick={() => setOpenIndex(prev => prev === idx ? null : idx)} />
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
