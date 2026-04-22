import { lazy, Suspense, useMemo, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAppContext } from './context/AppContext.jsx'
import Loader from './components/Loader/index.js'
import Navbar from './components/Navbar/Navbar.jsx'
import BookingSystem from './components/BookingSystem/BookingSystem.jsx'
import { playDriftIntroSound } from './utils/sound.js'

// ── Lazy-load all pages — zero JS until route is visited ─────────────────────
const HomePage        = lazy(() => import('./pages/HomePage.jsx'))
const VehiclesPage    = lazy(() => import('./pages/VehiclesPage.jsx'))
const LocationsPage   = lazy(() => import('./pages/LocationsPage.jsx'))
const PolicyPage      = lazy(() => import('./pages/PolicyPage.jsx'))
const CustomerCarePage= lazy(() => import('./pages/CustomerCarePage.jsx'))
const FAQsPage        = lazy(() => import('./pages/FAQsPage.jsx'))
const PricingPage     = lazy(() => import('./pages/PricingPage.jsx'))

// Minimal fallback — no layout shift
function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(124,58,237,0.6)', borderTopColor: 'transparent' }} />
    </div>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18, ease: 'easeIn' } },
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageWrapper><Suspense fallback={<PageFallback />}><HomePage /></Suspense></PageWrapper>} />
        <Route path="/vehicles" element={<PageWrapper><Suspense fallback={<PageFallback />}><VehiclesPage /></Suspense></PageWrapper>} />
        <Route path="/locations"element={<PageWrapper><Suspense fallback={<PageFallback />}><LocationsPage /></Suspense></PageWrapper>} />
        <Route path="/policy"   element={<PageWrapper><Suspense fallback={<PageFallback />}><PolicyPage /></Suspense></PageWrapper>} />
        <Route path="/support"  element={<PageWrapper><Suspense fallback={<PageFallback />}><CustomerCarePage /></Suspense></PageWrapper>} />
        <Route path="/faqs"     element={<PageWrapper><Suspense fallback={<PageFallback />}><FAQsPage /></Suspense></PageWrapper>} />
        <Route path="/pricing"  element={<PageWrapper><Suspense fallback={<PageFallback />}><PricingPage /></Suspense></PageWrapper>} />
        <Route path="*"         element={<PageWrapper><Suspense fallback={<PageFallback />}><HomePage /></Suspense></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

// ── Particles — memoized, stable random values, reduced count ────────────────
const PhantomParticles = memo(function PhantomParticles() {
  // useMemo so values never regenerate on re-render
  const particles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: (i % 3) + 1.5,
    left: (i * 10.3) % 100,
    delay: (i * 1.7) % 12,
    duration: 12 + (i * 2.1) % 10,
    color: i % 3 === 0 ? 'rgba(168,85,247,0.5)' : i % 3 === 1 ? 'rgba(6,182,212,0.4)' : 'rgba(196,181,253,0.35)',
  })), [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

function PageShell() {
  return (
    <div className="phantom-bg min-h-screen relative">
      <PhantomParticles />
      <Navbar />
      <AnimatedRoutes />
    </div>
  )
}

export default function App() {
  const { state, dispatch } = useAppContext()

  return (
    <>
      <AnimatePresence>
        {!state.loaderDone && (
          <Loader onComplete={() => {
            dispatch({ type: 'LOADER_DONE' })
            playDriftIntroSound()
          }} />
        )}
      </AnimatePresence>

      {state.loaderDone && <PageShell />}

      <AnimatePresence>
        {state.bookingSystemOpen && <BookingSystem />}
      </AnimatePresence>
    </>
  )
}
