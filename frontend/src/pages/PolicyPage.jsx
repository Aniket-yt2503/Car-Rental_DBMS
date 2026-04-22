import { useEffect, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from '../hooks/useLenis.js'
import Footer from '../components/Footer/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

const PolicyBackground = lazy(() => import('../components/Policy/PolicyBackground.jsx'))

const POLICIES = [
  {
    id: 'vehicle-info',
    icon: '🚗',
    title: 'Vehicle Information',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'rgba(168,85,247,0.3)',
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
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'rgba(59,130,246,0.3)',
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
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.3)',
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
    gradient: 'from-green-500 to-emerald-600',
    glow: 'rgba(16,185,129,0.3)',
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
    gradient: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.3)',
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
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.3)',
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
    gradient: 'from-violet-500 to-purple-700',
    glow: 'rgba(139,92,246,0.3)',
    points: [
      "All employees with a valid driver's license may rent company vehicles.",
      'Rentals under 2 weeks: employees pay 50% of the regular price.',
      'Rentals of 2 weeks or more: employees pay 90% of the regular price.',
      'Employee discounts cannot be combined with promotional pricing.',
    ],
  },
  {
    id: 'customers',
    icon: '👤',
    title: 'Customer Information',
    gradient: 'from-teal-500 to-green-600',
    glow: 'rgba(20,184,166,0.3)',
    points: [
      'We collect customer name, address, all phone numbers, and driver\'s license number.',
      'Each driver\'s license is assumed to be unique per person.',
      'Customer information is stored securely and used only for rental purposes.',
      'A valid driver\'s license is required to rent any vehicle.',
    ],
  },
  {
    id: 'employees-info',
    icon: '🏢',
    title: 'Employee Information',
    gradient: 'from-indigo-500 to-blue-700',
    glow: 'rgba(99,102,241,0.3)',
    points: [
      'We keep the same information for employees as for customers (name, address, phones, license).',
      'Employee categories: Drivers, Cleaners, Clerks, and Managers.',
      'Every employee works at one location only.',
      'Headquarters in Hamilton: all managers, including the President and two Vice-Presidents (Operations & Marketing).',
    ],
  },
]

function PolicyCard({ policy, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${policy.glow} 0%, transparent 70%)` }}
      />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${policy.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
        {policy.icon}
      </div>

      <h3 className="text-white font-bold text-lg mb-4">{policy.title}</h3>

      <ul className="space-y-2.5">
        {policy.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-white/60 leading-relaxed">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${policy.gradient} shrink-0`} />
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function PolicyPage() {
  useLenis()

  return (
    <div className="bg-gray-950 min-h-screen relative overflow-hidden">
      {/* 3D floating shapes background */}
      <Suspense fallback={null}>
        <PolicyBackground />
      </Suspense>
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-20 blur-[120px]" style={{ width: '50vw', height: '50vw', top: '-10%', left: '20%', background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-5"
          >
            <div className="w-6 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest">Phantom Ride</span>
            <div className="w-6 h-px bg-gradient-to-l from-purple-500 to-blue-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-black text-white mb-5"
          >
            Rental{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Policies
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to know about how we operate — transparent, fair, and straightforward.
            We believe in clear communication so you can rent with complete confidence.
          </motion.p>
        </div>
      </div>

      {/* Policy grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {POLICIES.map((policy, i) => (
            <PolicyCard key={policy.id} policy={policy} index={i} />
          ))}
        </div>

        {/* Summary banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 rounded-3xl border border-purple-500/20 bg-purple-500/5 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.08) 0%, transparent 70%)' }} />
          <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Questions?</h2>
          <p className="text-white/55 text-base max-w-xl mx-auto relative z-10">
            Our team is available at all 8 locations across Canada. Visit us in person or reach out through our contact page.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
