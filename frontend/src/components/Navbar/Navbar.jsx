import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import useMagneticHover from '../../hooks/useMagneticHover.js'
import { useAppContext } from '../../context/AppContext.jsx'
import { playPageSwitchSound } from '../../utils/sound.js'

const NAV_ITEMS = [
  { label: 'Home',      route: '/',          anchor: null },
  { label: 'Vehicles',  route: '/vehicles',  anchor: null },
  { label: 'Locations', route: '/locations', anchor: null },
  { label: 'Pricing',   route: '/pricing',   anchor: null },
  { label: 'Policy',    route: '/policy',    anchor: null },
  { label: 'FAQs',      route: '/faqs',      anchor: null },
  { label: 'Support',   route: '/support',   anchor: null },
  { label: '⚙ Admin',  route: '/admin',     anchor: null },
]

function NavLink({ item, onNavigate }) {
  const { ref, style } = useMagneticHover({ strength: 0.3, radius: 70 })
  const location = useLocation()
  const isActive = location.pathname === item.route && !item.anchor

  const isSupport = item.label === 'Support'

  return (
    <button
      ref={ref}
      style={style}
      onClick={() => onNavigate(item)}
      className={`font-medium text-sm transition-all duration-200 cursor-pointer bg-transparent border-none outline-none whitespace-nowrap ${
        isSupport
          ? 'text-amber-500/80 hover:text-amber-400'
          : isActive
          ? 'text-white'
          : 'text-slate-500 hover:text-white'
      }`}
    >
      {isSupport ? '🤖 ' : ''}{item.label}
    </button>
  )
}

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { state } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isScrolled = scrollY > 80

  function handleNavigate(item) {
    setMobileMenuOpen(false)
    if (item.anchor) {
      if (window.location.pathname === item.route) {
        const el = document.getElementById(item.anchor)
        if (el) {
          if (state.lenis) state.lenis.scrollTo(el, { duration: 1.2 })
          else el.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        playPageSwitchSound()
        navigate(item.route)
        const tryScroll = (attempts = 0) => {
          const el = document.getElementById(item.anchor)
          if (el) {
            setTimeout(() => {
              if (state.lenis) state.lenis.scrollTo(el, { duration: 1.2 })
              else el.scrollIntoView({ behavior: 'smooth' })
            }, 80)
          } else if (attempts < 20) {
            setTimeout(() => tryScroll(attempts + 1), 150)
          }
        }
        setTimeout(() => tryScroll(), 300)
      }
    } else {
      if (window.location.pathname !== item.route) playPageSwitchSound()
      navigate(item.route)
      setTimeout(() => {
        if (state.lenis) state.lenis.scrollTo(0)
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }
  }

  function handleBookNow() {
    setMobileMenuOpen(false)
    if (window.location.pathname !== '/') playPageSwitchSound()
    navigate('/')
    setTimeout(() => {
      const el = document.getElementById('home')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  return (
    <>
      <motion.nav
        animate={isScrolled ? {
          top: 0,
          left: 0,
          x: 0,
          width: '100%',
          borderRadius: '0px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          backgroundColor: 'rgba(10,10,10,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        } : {
          top: '1.25rem',
          left: '50%',
          x: '-50%',
          width: 'min(1080px, calc(100vw - 2rem))',
          borderRadius: '9999px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '0.625rem',
          paddingBottom: '0.625rem',
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed z-50 flex items-center backdrop-blur-xl border justify-between md:justify-start"
        style={{ willChange: 'transform, width, border-radius' }}
      >
        <button
          onClick={() => handleNavigate({ route: '/', anchor: null })}
          className="cursor-pointer bg-transparent border-none outline-none shrink-0 md:mr-8"
        >
          <span className="font-black text-xl tracking-[0.15em] uppercase text-white">Midnight Ride</span>
        </button>

        {/* Desktop Nav links */}
        <div className="hidden md:flex items-center gap-3 md:gap-7 flex-1 justify-center">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.label} item={item} onNavigate={handleNavigate} />
          ))}
        </div>

        {/* Desktop Book Now */}
        <motion.button
          onClick={handleBookNow}
          whileHover={{ scale: 1.05, background: '#ffffff', color: '#000000' }}
          whileTap={{ scale: 0.96 }}
          className="hidden md:block shrink-0 ml-5 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-white cursor-pointer border border-white/20 outline-none transition-all duration-300"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          Book Now
        </motion.button>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden text-white/80 hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[rgba(5,5,5,0.98)] backdrop-blur-3xl pt-24 pb-10 px-6 flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col gap-8 items-center mt-10">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item)}
                  className="text-2xl font-bold text-white/60 hover:text-white transition-colors tracking-widest uppercase"
                >
                  {item.label}
                </button>
              ))}
              <motion.button
                onClick={handleBookNow}
                className="mt-8 px-10 py-4 rounded-full text-lg font-black uppercase tracking-widest text-black bg-white"
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
