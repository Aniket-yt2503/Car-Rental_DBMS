import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from '../hooks/useLenis.js'
import Footer from '../components/Footer/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

const FAQ_CATEGORIES = [
  {
    category: 'Booking',
    icon: '📅',
    items: [
      { q: 'How do I book a vehicle?', a: 'Use the booking widget on our home page. Select your pickup location, return location, dates, and car class. Click "Search Vehicles" to browse available cars and confirm your booking.' },
      { q: 'Can I book for someone else?', a: 'Yes, but the primary driver must present their own valid driver\'s license at pickup. The booking can be made under any name, but the renter must be present.' },
      { q: 'How far in advance can I book?', a: 'You can book up to 12 months in advance. We recommend booking early for peak seasons and popular locations.' },
      { q: 'Can I modify my booking?', a: 'Yes, modifications can be made up to 24 hours before pickup. Contact your pickup location or use our support chat to make changes.' },
    ],
  },
  {
    category: 'Vehicles',
    icon: '🚗',
    items: [
      { q: 'What car classes are available?', a: 'We offer four classes: Subcompact (city-friendly, fuel-efficient), Compact (versatile everyday cars), Sedan (comfortable mid-size), and Luxury (premium vehicles with top features).' },
      { q: 'What is a complimentary upgrade?', a: 'If your requested class is unavailable at pickup, we assign you a higher class at no extra charge. You always pay the price of the class you originally booked.' },
      { q: 'Are the vehicles insured?', a: 'All Phantom Ride vehicles carry standard liability insurance. Additional coverage options are available at pickup. We recommend reviewing your personal auto insurance policy as well.' },
      { q: 'What documents do I need?', a: 'A valid driver\'s license, a major credit card in your name, and a government-issued photo ID. International renters should also bring their passport and an International Driving Permit if applicable.' },
    ],
  },
  {
    category: 'Pricing & Payments',
    icon: '💰',
    items: [
      { q: 'How is pricing calculated?', a: 'We use the largest applicable billing unit. For example, 8 days = 1 week + 1 day. Rates are per class: Subcompact is most affordable, Luxury is premium. Check our Pricing page for exact rates.' },
      { q: 'What is a drop-off charge?', a: 'A drop-off charge applies when you return the vehicle to a different location than where you picked it up. The fee varies by car class and route, and is shown clearly during booking.' },
      { q: 'Are there employee discounts?', a: 'Yes! Phantom Ride employees get 50% off rentals under 2 weeks, and 10% off for longer rentals. Employee discounts cannot be combined with promotional pricing.' },
      { q: 'How do promotions work?', a: 'Weekly promotions offer discounts (typically 60% off) on a single car class. Only one class can be on promotion at a time. Promotions apply to customer bookings only, not employee rentals.' },
    ],
  },
  {
    category: 'Pickup & Return',
    icon: '📍',
    items: [
      { q: 'What is the fuel policy?', a: 'All vehicles are provided with a full tank. Please return the vehicle with a full tank to avoid a refuelling charge. We record the fuel level (Empty, Quarter, Half, Three-Quarters, or Full) at both pickup and return.' },
      { q: 'Do you record vehicle defects?', a: 'We trust our customers — we do not record defects at pickup or return. However, if you notice any pre-existing damage, we recommend noting it with our staff at pickup.' },
      { q: 'How is the odometer tracked?', a: 'We record the odometer reading before rental and after return. This is used for fleet maintenance only. There are no mileage limits within Canada.' },
      { q: 'Can I return to a different location?', a: 'Absolutely! One-way rentals are fully supported. Pick up in Toronto, drop off in Vancouver — a drop-off charge will apply based on the route and car class.' },
    ],
  },
  {
    category: 'Locations & Hours',
    icon: '🌍',
    items: [
      { q: 'Where are your locations?', a: 'We have 20+ locations worldwide across Canada, USA, UK, France, Germany, UAE, Japan, Australia, Singapore, and India. Visit our Locations page for the full list with addresses and hours.' },
      { q: 'Where is your headquarters?', a: 'Our headquarters is in Hamilton, Ontario, Canada. All managers, including the President and two Vice-Presidents (Operations & Marketing), are based there.' },
      { q: 'What are your operating hours?', a: 'Most locations operate Mon–Sun 7:00 AM – 10:00 PM. Hours vary by location — check the Locations page for specific branch hours.' },
    ],
  },
]

function FAQItem({ item, isOpen, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
        isOpen
          ? 'border-purple-500/40 bg-purple-500/5'
          : 'border-white/8 bg-white/3 hover:border-white/15'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between px-5 py-4 gap-4">
        <span className={`font-medium text-sm leading-snug transition-colors ${isOpen ? 'text-white' : 'text-white/75'}`}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-base transition-colors ${isOpen ? 'bg-purple-500/30 text-purple-300' : 'bg-white/8 text-white/40'}`}
        >
          +
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-4 pt-1">
              <div className="h-px bg-white/8 mb-3" />
              <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQsPage() {
  useLenis()
  const [openMap, setOpenMap] = useState({})
  const [activeCategory, setActiveCategory] = useState('All')

  function toggle(key) {
    setOpenMap(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const categories = ['All', ...FAQ_CATEGORIES.map(c => c.category)]
  const filtered = activeCategory === 'All'
    ? FAQ_CATEGORIES
    : FAQ_CATEGORIES.filter(c => c.category === activeCategory)

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Hero */}
      <div className="relative pt-32 pb-14 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.1) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest">Help Center</span>
            <div className="w-6 h-px bg-gradient-to-l from-purple-500 to-blue-500" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-5xl md:text-6xl font-black text-white mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Questions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-white/50 text-lg">
            Everything you need to know before you hit the road.
          </motion.p>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-purple-600/80 border-purple-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ sections */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {filtered.map((section, si) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.05, duration: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-xl font-bold text-white">{section.category}</h2>
              <div className="flex-1 h-px bg-white/8" />
            </div>
            <div className="flex flex-col gap-2">
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`
                return (
                  <FAQItem
                    key={key}
                    item={item}
                    index={ii}
                    isOpen={!!openMap[key]}
                    onClick={() => toggle(key)}
                  />
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
