import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionWrapper from '../ui/SectionWrapper.jsx'

gsap.registerPlugin(ScrollTrigger)

const POLICIES = [
  {
    id: 'vehicle-info',
    icon: '🚗',
    title: 'Vehicle Information',
    color: 'from-purple-500 to-violet-600',
    points: [
      'Each vehicle has a unique identification number and a unique license plate.',
      'Cars are classified as Subcompact, Compact, Sedan, or Luxury — each class has its own pricing.',
      'Every car has a recorded make, model, year of manufacture, and color.',
      'All cars in the same class are priced identically regardless of make or model.',
    ],
  },
  {
    id: 'odometer',
    icon: '📊',
    title: 'Odometer & Condition',
    color: 'from-blue-500 to-cyan-600',
    points: [
      'We record the odometer reading before every rental and after every return.',
      'We trust our customers — no defect recording is done at pickup or return.',
      'Odometer readings are used solely for mileage tracking and fleet maintenance.',
      'Any discrepancy in odometer readings will be reviewed by our team.',
    ],
  },
  {
    id: 'fuel',
    icon: '⛽',
    title: 'Fuel Policy',
    color: 'from-amber-500 to-orange-600',
    points: [
      'All vehicles are rented with a full tank of fuel — no exceptions.',
      'Upon return, we record the fuel level: Empty, Quarter, Half, Three-Quarters, or Full.',
      'Customers are responsible for refuelling before return to avoid fuel surcharges.',
      'Fuel level is noted on your rental agreement at both pickup and return.',
    ],
  },
  {
    id: 'dropoff',
    icon: '📍',
    title: 'Drop-Off Policy',
    color: 'from-green-500 to-emerald-600',
    points: [
      'Vehicles rented at one location may be returned to any of our other locations.',
      'A drop-off charge applies when the return location differs from the pickup location.',
      'Drop-off fees vary by car class and the specific route taken.',
      'The applicable drop-off charge is shown clearly during the booking process.',
    ],
  },
  {
    id: 'rental-dates',
    icon: '📅',
    title: 'Rental Dates & Pricing',
    color: 'from-pink-500 to-rose-600',
    points: [
      'We track the rental start and return dates — time of day is not recorded.',
      'Pricing tiers: 1 day, 1 week (7 days), 2 weeks (14 days), and 1 month (30 days).',
      'Rentals are priced using the largest applicable billing unit. Example: 8 days = 1 week + 1 day.',
      'If a requested class is unavailable, a higher class may be assigned at the requested class price (upgrade).',
    ],
  },
  {
    id: 'promotions',
    icon: '🎯',
    title: 'Promotions',
    color: 'from-cyan-500 to-blue-600',
    points: [
      'Weekly promotional discounts are available on a single car class at a time.',
      'Promotions are typically 60% of the regular price but may vary.',
      'Only one car class can have an active promotion in any given week.',
      'Promotional pricing does not apply to employee rentals.',
    ],
  },
  {
    id: 'employee',
    icon: '👔',
    title: 'Employee Rental Policy',
    color: 'from-violet-500 to-purple-700',
    points: [
      'All employees with a valid driver\'s license may rent company vehicles.',
      'Rentals under 2 weeks: employees pay 50% of the regular price.',
      'Rentals of 2 weeks or more: employees pay 90% of the regular price.',
      'Employee discounts cannot be combined with promotional pricing.',
    ],
  },
  {
    id: 'customers',
    icon: '👤',
    title: 'Customer Information',
    color: 'from-teal-500 to-green-600',
    points: [
      'We collect customer name, address, all phone numbers, and driver\'s license number.',
      'Each driver\'s license is assumed to be unique per person.',
      'Customer information is stored securely and used only for rental purposes.',
      'A valid driver\'s license is required to rent any vehicle.',
    ],
  },
]

function PolicyCard({ policy, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="policy-card"
    >
      <div
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-colors duration-200"
        onClick={() => setOpen(v => !v)}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${policy.color} flex items-center justify-center text-lg shrink-0`}>
            {policy.icon}
          </div>
          <h3 className="text-white font-semibold text-base flex-1">{policy.title}</h3>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/40 text-xl shrink-0"
          >
            +
          </motion.span>
        </div>

        {/* Expandable content */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <ul className="px-5 pb-5 space-y-2.5 border-t border-white/8 pt-4">
                {policy.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/65 leading-relaxed">
                    <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${policy.color} shrink-0`} />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Policy() {
  return (
    <SectionWrapper id="policy">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Rental{' '}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Policies
          </span>
        </h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Everything you need to know about how we operate — transparent, fair, and straightforward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {POLICIES.map((policy, i) => (
          <PolicyCard key={policy.id} policy={policy} index={i} />
        ))}
      </div>
    </SectionWrapper>
  )
}
