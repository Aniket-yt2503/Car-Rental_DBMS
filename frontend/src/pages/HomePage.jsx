import { motion } from 'framer-motion'
import useLenis from '../hooks/useLenis.js'
import Hero from '../components/Hero/Hero.jsx'
import Reviews from '../components/Reviews/Reviews.jsx'
import Footer from '../components/Footer/Footer.jsx'

function About() {
  return (
    <section id="about" className="py-32 px-6 relative">
      <div className="phantom-divider mb-24 max-w-6xl mx-auto" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            THE <span className="phantom-text">MIDNIGHT</span> LEGACY
          </h2>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto text-slate-500 font-medium">
            Midnight Ride is more than a rental service—it's a commitment to automotive excellence. 
            We curate the world's most exceptional vehicles to ensure your journey is as powerful as your destination.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { stat: '10+',  label: 'Years of Excellence',  icon: '🎖️', color: 'from-slate-200 to-slate-500',  glow: 'rgba(255,255,255,0.1)' },
            { stat: '20+',  label: 'Global Strategic Hubs', icon: '🌐', color: 'from-slate-300 to-slate-600',  glow: 'rgba(255,255,255,0.1)' },
            { stat: '15+',  label: 'Elite Performance Fleet', icon: '🏎️', color: 'from-amber-400 to-amber-600',  glow: 'rgba(217,119,6,0.1)' },
            { stat: '500+', label: 'Elite Members',   icon: '🤝', color: 'from-slate-100 to-slate-400',  glow: 'rgba(255,255,255,0.1)' },
          ].map(({ stat, label, icon, color, glow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="phantom-card relative flex flex-col items-center gap-4 rounded-3xl py-12 px-6 overflow-hidden bg-white/5 border border-white/10"
            >
              <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${color}`} />
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }} />
              <span className="text-4xl relative z-10">{icon}</span>
              <span className={`text-5xl font-black relative z-10 bg-gradient-to-br ${color} bg-clip-text text-transparent tracking-tighter`}>{stat}</span>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] text-center relative z-10">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '📍', color: 'text-white', title: 'Operational Base',
              content: (
                <p className="text-sm leading-relaxed text-slate-500">
                  1 Innovation Drive<br />Hamilton, ON L8P 4M2<br />
                  <span className="text-slate-700 text-[10px] mt-2 block font-bold uppercase tracking-widest">Global Operations Command</span>
                </p>
              ),
            },
            {
              icon: '💎', color: 'text-amber-500', title: 'Service Tiers',
              content: (
                <ul className="text-sm space-y-2 text-slate-500">
                  {['24h Rapid Response', 'Weekly Elite', 'Bi-Weekly Executive', 'Monthly Strategic'].map(t => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-slate-700 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              icon: '🛡️', color: 'text-emerald-500', title: 'The Commitment',
              content: (
                <ul className="text-sm space-y-2 text-slate-500">
                  {['Precision Maintenance', 'Tier-1 Upgrades', 'Global Mobility', 'Absolute Discretion'].map(t => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-slate-700 shrink-0" />
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
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="phantom-card rounded-3xl p-8 bg-white/5 border border-white/10"
            >
              <h3 className="text-white font-bold mb-5 flex items-center gap-3 text-sm uppercase tracking-[0.15em]">
                <span className={`${color} text-xl`}>{icon}</span> {title}
              </h3>
              <div className="font-medium">{content}</div>
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
    <div className="min-h-screen bg-[#050505]">
      <Hero />
      <div className="cv-auto"><Reviews /></div>
      <div className="cv-auto"><About /></div>
      <Footer />
    </div>
  )
}
