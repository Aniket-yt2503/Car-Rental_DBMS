import { motion } from 'framer-motion'
import useLenis from '../hooks/useLenis.js'
import Hero from '../components/Hero/Hero.jsx'
import Reviews from '../components/Reviews/Reviews.jsx'
import Footer from '../components/Footer/Footer.jsx'

function About() {
  return (
    <section id="about" className="py-20 px-6 relative">
      <div className="phantom-divider mb-16 max-w-6xl mx-auto" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About{' '}
            <span className="phantom-text">Phantom Ride</span>
          </h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(196,181,253,0.55)' }}>
            Phantom Ride is a premium car rental service operating worldwide. We combine cutting-edge
            vehicles with a seamless digital booking experience — because getting there should be as
            enjoyable as arriving.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { stat: '10+',  label: 'Years of Service',  icon: '🏆', color: 'from-purple-500 to-violet-600',  glow: 'rgba(124,58,237,0.3)' },
            { stat: '20+',  label: 'Global Cities',     icon: '🌍', color: 'from-cyan-500 to-blue-600',      glow: 'rgba(6,182,212,0.3)' },
            { stat: '15+',  label: 'Vehicles in Fleet', icon: '🚗', color: 'from-emerald-500 to-teal-600',   glow: 'rgba(16,185,129,0.3)' },
            { stat: '500+', label: 'Happy Customers',   icon: '⭐', color: 'from-amber-500 to-orange-600',   glow: 'rgba(245,158,11,0.3)' },
          ].map(({ stat, label, icon, color, glow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="phantom-card relative flex flex-col items-center gap-3 rounded-2xl py-8 px-4 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(6,182,212,0.03))',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              <div className={`absolute inset-0 opacity-[0.07] bg-gradient-to-br ${color}`} />
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${glow.replace('0.3', '0.6')}, transparent)` }} />
              <span className="text-3xl relative z-10">{icon}</span>
              <span className={`text-4xl font-black relative z-10 bg-gradient-to-br ${color} bg-clip-text text-transparent`}>{stat}</span>
              <span className="text-white/50 text-sm text-center leading-tight relative z-10">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '🏢', color: 'text-purple-400', title: 'Headquarters',
              content: (
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.55)' }}>
                  1 Innovation Drive<br />Hamilton, ON L8P 4M2<br />
                  <span className="text-white/30 text-xs mt-1 block">President + 2 Vice-Presidents on-site</span>
                </p>
              ),
            },
            {
              icon: '📋', color: 'text-cyan-400', title: 'Rental Tiers',
              content: (
                <ul className="text-sm space-y-1.5" style={{ color: 'rgba(196,181,253,0.55)' }}>
                  {['1 day rate', '1 week (7 days)', '2 weeks (14 days)', '1 month (30 days)'].map(t => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.8)' }} />
                      {t}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              icon: '✓', color: 'text-emerald-400', title: 'Our Promise',
              content: (
                <ul className="text-sm space-y-1.5" style={{ color: 'rgba(196,181,253,0.55)' }}>
                  {['Full tank at pickup', 'Free class upgrades', 'Drop-off anywhere', 'Transparent pricing'].map(t => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
                      {t}
                    </li>
                  ))}
                </ul>
              ),
            },
          ].map(({ icon, color, title, content }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="phantom-card rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(6,182,212,0.03))',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                <span className={`${color} text-lg`}>{icon}</span> {title}
              </h3>
              {content}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  useLenis()
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <Hero />
      <div className="cv-auto"><Reviews /></div>
      <div className="cv-auto"><About /></div>
      <Footer />
    </div>
  )
}
