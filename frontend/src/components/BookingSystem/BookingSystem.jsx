import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { differenceInDays, parseISO } from 'date-fns'
import { getPricing } from '../../api/pricing.js'
import { getPromotions } from '../../api/promotions.js'
import { createRental } from '../../api/rentals.js'
import { getBillingLines, calculatePrice } from '../../utils/pricing.js'
import { validateOdometer } from '../../utils/validation.js'
import { lookupDropOffCharge } from '../../data/dropOffCharges.js'
import locations from '../../data/locations.js'
import { useAppContext } from '../../context/AppContext.jsx'
import NeonBadge from '../ui/NeonBadge.jsx'
import NeonButton from '../ui/NeonButton.jsx'
import CarSelector from './CarSelector.jsx'
import { playUpgradeSound } from '../../utils/sound.js'

const CLASS_ORDER = ['Subcompact', 'Compact', 'Sedan', 'Luxury']
const FUEL_LEVELS = ['Empty', 'Quarter', 'Half', 'Three_Quarter', 'Full']
const UNIT_LABELS = { month: 'Month', '2weeks': '2 Wks', week: 'Week', day: 'Day' }

function fmt(n) { return n.toFixed(2) }
function locName(id) { return locations.find(l => l.id === id)?.name ?? id }

// ─── Play Monza MP3 on confirm ────────────────────────────────────────────────
function playMonzaSound() {
  try {
    const audio = new Audio('/monza.mp3')
    audio.volume = 0.75
    audio.play().catch(() => {})
  } catch (e) { /* silent */ }
}

// ─── Booking confirmed overlay ────────────────────────────────────────────────
function ConfirmedOverlay({ onClose, car }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center backdrop-blur-md overflow-hidden"
      style={{ background: 'rgba(2,2,8,0.96)' }}
    >
      {/* Burst rings */}
      {[1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: `1px solid rgba(124,58,237,${0.5 - i * 0.1})` }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: `${i * 280}px`, height: `${i * 280}px`, opacity: 0 }}
          transition={{ duration: 1.4, delay: i * 0.12, ease: 'easeOut' }}
        />
      ))}
      {/* Confetti */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={`c-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            background: ['#a855f7','#06b6d4','#f59e0b','#10b981','#ef4444','#c4b5fd'][i % 6],
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 700,
            y: (Math.random() - 0.5) * 500,
            opacity: 0,
            scale: [0, 1.8, 0],
            rotate: Math.random() * 540,
          }}
          transition={{ duration: 1.8, delay: 0.1 + Math.random() * 0.4, ease: 'easeOut' }}
        />
      ))}

      <div className="text-center px-8 relative z-10 max-w-md">
        {/* Car image or emoji */}
        {car?.imageUrl ? (
          <motion.img
            src={car.imageUrl}
            alt={car.model}
            initial={{ x: -300, opacity: 0, rotate: -8 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-48 h-32 object-cover rounded-2xl mx-auto mb-4"
            style={{ boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}
          />
        ) : (
          <motion.div
            initial={{ x: -200, opacity: 0, rotate: -15 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-8xl mb-4 select-none"
          >🚗</motion.div>
        )}

        {/* Divider lines */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex justify-center gap-3 mb-5"
        >
          {[0, 1].map(i => (
            <div key={i} className="w-20 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
          ))}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-black text-white mb-2"
          style={{ textShadow: '0 0 40px rgba(124,58,237,0.7)' }}
        >
          Booking Confirmed!
        </motion.h2>

        {car && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-white/50 text-sm mb-1"
          >
            {car.year} {car.make} {car.model} · {car.color}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-white/60 text-base mb-2"
        >
          Your vehicle is ready. Enjoy the ride. 🏁
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm mb-8 italic"
          style={{ color: 'rgba(168,85,247,0.7)' }}
        >
          "Life is a journey — make it a great one."
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <NeonButton onClick={onClose} className="px-10">Back to Home</NeonButton>
        </motion.div>
      </div>
    </motion.div>
  )
}

import BookingWidget from '../BookingWidget/index.js'

// ─── Label/value row ──────────────────────────────────────────────────────────
function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs" style={{ color: 'rgba(196,181,253,0.5)' }}>{label}</span>
      <span className={`text-xs font-semibold ${accent ? 'text-amber-400' : 'text-white/80'}`}>{value}</span>
    </div>
  )
}

export default function BookingSystem() {
  const { state, dispatch } = useAppContext()
  const formData = state.bookingFormData || {}
  const mode = state.mode

  const [step, setStep] = useState(!formData.pickupDate ? 'form' : 'select')
  const [chosenCar, setChosenCar] = useState(null)
  const [pricing, setPricing] = useState([])
  const [promotions, setPromotions] = useState([])
  const [assignedClass, setAssignedClass] = useState(null)
  const [isUpgraded, setIsUpgraded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fuelLevel, setFuelLevel] = useState('Full')
  const [startOdometer, setStartOdometer] = useState('')
  const [endOdometer, setEndOdometer] = useState('')
  const [odometerError, setOdometerError] = useState(null)
  
  // Driver Details
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [driversLicense, setDriversLicense] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [driverError, setDriverError] = useState(null)

  const [confirmed, setConfirmed] = useState(false)

  // Pause Lenis + lock body scroll while summary is open
  useEffect(() => {
    if (step !== 'details') return
    const lenis = state.lenis
    if (lenis) lenis.stop()
    document.body.style.overflow = 'hidden'
    return () => {
      if (lenis) lenis.start()
      document.body.style.overflow = ''
    }
  }, [step, state.lenis])

  // Move to 'select' step automatically once form is completed
  useEffect(() => {
    if (step === 'form' && formData.pickupDate) {
      setStep('select')
    }
  }, [formData, step])

  function handleCarSelected(car) {
    setChosenCar(car)
    setStep('details')
    setLoading(true)
    Promise.all([getPricing(), getPromotions()]).then(([pr, promo]) => {
      if (pr.error || promo.error) { setError(pr.error || promo.error); setLoading(false); return }
      setPricing(pr.data)
      setPromotions(promo.data)
      const requested = formData?.requestedClass ?? car.carClass
      const wasUpgraded = car.carClass !== requested && CLASS_ORDER.indexOf(car.carClass) > CLASS_ORDER.indexOf(requested)
      setAssignedClass(car.carClass)
      setIsUpgraded(wasUpgraded)
      if (wasUpgraded) setTimeout(() => playUpgradeSound(), 600)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (startOdometer !== '' && endOdometer !== '') {
      setOdometerError(validateOdometer(Number(startOdometer), Number(endOdometer)).error)
    } else setOdometerError(null)
  }, [startOdometer, endOdometer])

  if (step === 'form') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
        style={{ background: 'rgba(2,2,8,0.97)' }}
      >
        <div className="relative w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4 px-2">
            <h1 className="text-xl font-black text-white tracking-wide" style={{ textShadow: '0 0 20px rgba(124,58,237,0.5)' }}>Trip Details</h1>
            <button
              onClick={() => dispatch({ type: 'CLOSE_BOOKING' })}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white transition-colors cursor-pointer text-sm"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}
            >✕</button>
          </div>
          <BookingWidget />
        </div>
      </motion.div>
    )
  }

  if (step === 'select') {
    return (
      <CarSelector
        onConfirm={handleCarSelected}
        onBack={() => dispatch({ type: 'CLOSE_BOOKING' })}
      />
    )
  }

  const totalDays = differenceInDays(parseISO(formData.returnDate), parseISO(formData.pickupDate))
  const pricingEntry = pricing.find(p => p.carClass === assignedClass)
  const activePromotion = promotions.find(p => p.active) ?? null
  const billingLines = pricingEntry ? getBillingLines(totalDays, pricingEntry) : []
  const dropOffCharge = lookupDropOffCharge(formData.pickupLocation, formData.returnLocation, assignedClass ?? formData.requestedClass)
  const baseTotal = billingLines.reduce((s, l) => s + l.subtotal, 0)
  const discountedBase = pricingEntry ? calculatePrice(totalDays, pricingEntry, activePromotion, mode) : 0
  const finalPrice = discountedBase + (dropOffCharge ?? 0)
  const promotionApplies = mode === 'customer' && activePromotion && activePromotion.carClass === assignedClass

  async function handleConfirm() {
    if (odometerError || loading) return

    // Validate driver details if they are entering them
    if (firstName || lastName || driversLicense) {
      if (!firstName || !lastName || !driversLicense || !street || !city || !province || !postalCode) {
        setDriverError('Please fill out all driver details to proceed.');
        return;
      }
    }
    setDriverError(null);

    setLoading(true)
    const result = await createRental({
      carId:             chosenCar.id || chosenCar.car_id,
      pickupLocationId:  formData.pickupLocation,
      requestedClass:    formData.requestedClass ?? chosenCar.carClass,
      pickupDate:        formData.pickupDate,
      startOdometer:     Number(startOdometer) || 0,
      promoId:           activePromotion ? activePromotion.id : null,
      
      // New fields for completed bookings (if employee fills them out)
      returnDate:        formData.returnDate || null,
      returnLocationId:  formData.returnLocation || formData.pickupLocation,
      endOdometer:       endOdometer ? Number(endOdometer) : null,
      fuelLevel:         fuelLevel,
      finalPrice:        finalPrice,

      // Driver details
      firstName,
      lastName,
      street,
      city,
      province,
      postalCode,
      driversLicense
    })
    setLoading(false)
    if (result.error) {
      console.error('[Booking]', result.error)
      setError(result.error)
      return
    }
    playMonzaSound()
    setConfirmed(true)
  }

  const card = (children, className = '') => (
    <div
      className={`rounded-2xl p-4 ${className}`}
      style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.03))', border: '1px solid rgba(124,58,237,0.18)' }}
    >
      {children}
    </div>
  )

  const label = (text) => (
    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ background: 'linear-gradient(135deg,#a855f7,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{text}</p>
  )

  return (
    <>
      {/* ── Full-screen overlay ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(2,2,8,0.97)', backdropFilter: 'blur(12px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl overflow-y-auto scrollbar-none"
          style={{ maxHeight: '92vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black phantom-text tracking-wide">Booking Summary</h1>
            <button
              onClick={() => dispatch({ type: 'CLOSE_BOOKING' })}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white transition-colors cursor-pointer text-sm"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}
            >✕</button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-16 text-white/40">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
              Loading pricing…
            </div>
          )}

          {error && (
            <div className="rounded-xl p-4 text-red-300 text-sm mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              {error}
            </div>
          )}

          {/* ── Two-column layout ── */}
          {!loading && chosenCar && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-3">

                {/* Vehicle card */}
                {card(
                  <>
                    {label('Vehicle')}
                    <div className="flex gap-3 items-center">
                      <img src={chosenCar.imageUrl} alt={chosenCar.model} className="w-20 h-14 object-cover rounded-xl shrink-0" style={{ boxShadow: '0 0 16px rgba(124,58,237,0.3)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{chosenCar.year} {chosenCar.make} {chosenCar.model}</p>
                        <p className="text-white/40 text-xs mt-0.5">{chosenCar.color} · {chosenCar.licensePlate}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <NeonBadge label={assignedClass} color={isUpgraded ? 'cyan' : 'purple'} />
                          {isUpgraded && <span className="text-[10px] text-cyan-400 font-semibold">✦ Upgraded!</span>}
                        </div>
                      </div>
                      <button onClick={() => setStep('select')} className="text-white/25 hover:text-purple-400 text-xs cursor-pointer bg-transparent border-none shrink-0 transition-colors">Change</button>
                    </div>
                  </>
                )}

                {/* Trip details */}
                {card(
                  <>
                    {label('Trip Details')}
                    <div className="grid grid-cols-2 gap-x-4">
                      <Row label="Pickup" value={locName(formData.pickupLocation)} />
                      <Row label="Return" value={locName(formData.returnLocation)} />
                      <Row label="From" value={formData.pickupDate} />
                      <Row label="To" value={formData.returnDate} />
                      <Row label="Duration" value={`${totalDays} day${totalDays !== 1 ? 's' : ''}`} />
                      <Row label="Mode" value={mode} />
                    </div>
                  </>
                )}

                {/* Driver Details */}
                {card(
                  <>
                    <div className="flex items-center justify-between mb-2">
                      {label('Driver Details')}
                      <span className="text-[9px] text-white/30 uppercase tracking-widest">Required</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }} />
                      <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }} />
                    </div>
                    <div className="mb-2">
                      <input type="text" placeholder="Driver's License (e.g. DL-X123)" value={driversLicense} onChange={e => setDriversLicense(e.target.value)} className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }} />
                    </div>
                    <div className="mb-2">
                      <input type="text" placeholder="Street Address" value={street} onChange={e => setStreet(e.target.value)} className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }} />
                      <input type="text" placeholder="Prov" value={province} onChange={e => setProvince(e.target.value)} className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }} />
                      <input type="text" placeholder="Postal" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }} />
                    </div>
                    {driverError && <p className="mt-2 text-[10px] text-red-400">{driverError}</p>}
                  </>
                )}

                {/* Vehicle condition */}
                {card(
                  <>
                    {label('Vehicle Condition')}
                    {/* Fuel level */}
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Fuel at Return</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {FUEL_LEVELS.map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFuelLevel(level)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer"
                          style={fuelLevel === level
                            ? { border: '1px solid rgba(124,58,237,0.7)', background: 'rgba(124,58,237,0.2)', color: '#c4b5fd' }
                            : { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }
                          }
                        >
                          {level.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    {/* Odometers */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Start Odo (km)</p>
                        <input
                          type="number" min="0" value={startOdometer}
                          onChange={e => setStartOdometer(e.target.value)}
                          placeholder="e.g. 12000"
                          className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
                          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">End Odo (km)</p>
                        <input
                          type="number" min="0" value={endOdometer}
                          onChange={e => setEndOdometer(e.target.value)}
                          placeholder="e.g. 12500"
                          className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
                          style={{ background: 'rgba(124,58,237,0.06)', border: `1px solid ${odometerError ? 'rgba(239,68,68,0.5)' : 'rgba(124,58,237,0.2)'}` }}
                        />
                        {odometerError && <p className="mt-1 text-[10px] text-red-400">{odometerError}</p>}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex flex-col gap-3">

                {/* Price breakdown */}
                {card(
                  <>
                    <div className="flex items-center justify-between mb-2">
                      {label('Price Breakdown')}
                      <div className="flex gap-1.5 -mt-2">
                        {promotionApplies && <NeonBadge label={`${activePromotion.discountPercent}% off`} color="cyan" />}
                        {mode === 'employee' && <NeonBadge label="Employee" color="purple" />}
                      </div>
                    </div>

                    {pricingEntry ? (
                      <>
                        {/* Line items */}
                        <div className="space-y-0.5 mb-2">
                          {billingLines.map(line => (
                            <div key={line.unit} className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
                              <span className="text-xs text-white/50">{UNIT_LABELS[line.unit]} ×{line.quantity}</span>
                              <span className="text-xs text-white/70">${fmt(line.subtotal)}</span>
                            </div>
                          ))}
                          {dropOffCharge !== null && (
                            <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
                              <span className="text-xs text-amber-400">Drop-Off Charge</span>
                              <span className="text-xs text-amber-400">${fmt(dropOffCharge)}</span>
                            </div>
                          )}
                          {promotionApplies && (
                            <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
                              <span className="text-xs text-cyan-400">Promo -{activePromotion.discountPercent}%</span>
                              <span className="text-xs text-cyan-400">-${fmt(baseTotal * activePromotion.discountPercent / 100)}</span>
                            </div>
                          )}
                          {mode === 'employee' && (
                            <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
                              <span className="text-xs text-purple-400">Employee {totalDays < 14 ? '50%' : '10%'} off</span>
                              <span className="text-xs text-purple-400">-${fmt(baseTotal - calculatePrice(totalDays, pricingEntry, null, 'employee'))}</span>
                            </div>
                          )}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-2 mt-1" style={{ borderTop: '1px solid rgba(124,58,237,0.25)' }}>
                          <span className="text-sm font-bold text-white/60">Total</span>
                          <span className="text-2xl font-black" style={{ background: 'linear-gradient(135deg,#a855f7,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            ${fmt(finalPrice)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 py-4 text-white/30 text-xs">
                        <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin" />
                        Calculating price…
                      </div>
                    )}
                  </>
                )}

                {/* Confirm CTA */}
                <div
                  className="rounded-2xl p-5 flex flex-col items-center gap-3 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))', border: '1px solid rgba(124,58,237,0.35)' }}
                >
                  {/* Top glow line */}
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), rgba(6,182,212,0.6), transparent)' }} />

                  <p className="text-white/50 text-xs text-center">
                    By confirming you agree to our rental policy. Full tank guaranteed at pickup.
                  </p>

                  <motion.button
                    onClick={handleConfirm}
                    disabled={!!odometerError || loading}
                    whileHover={!odometerError && !loading ? { scale: 1.04, boxShadow: '0 0 30px rgba(124,58,237,0.7), 0 0 60px rgba(6,182,212,0.3)' } : {}}
                    whileTap={!odometerError && !loading ? { scale: 0.97 } : {}}
                    className="w-full py-3.5 rounded-xl font-black text-base text-white cursor-pointer border-none relative overflow-hidden"
                    style={{
                      background: odometerError || loading
                        ? 'rgba(124,58,237,0.2)'
                        : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                      opacity: odometerError || loading ? 0.5 : 1,
                    }}
                  >
                    {/* Shimmer */}
                    {!odometerError && !loading && (
                      <motion.span
                        className="absolute inset-0 pointer-events-none"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                      />
                    )}
                    <span className="relative z-10">
                      {loading ? '⏳ Loading…' : '🏁 Confirm Booking'}
                    </span>
                  </motion.button>

                  {odometerError && (
                    <p className="text-red-400 text-xs text-center">{odometerError}</p>
                  )}
                </div>

                {/* Drop-off note */}
                {dropOffCharge !== null && (
                  <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(251,191,36,0.7)' }}>
                    📍 Drop-off charge applies — different pickup & return locations.
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ── Confirmed overlay ── */}
      <AnimatePresence>
        {confirmed && (
          <ConfirmedOverlay
            car={chosenCar}
            onClose={() => {
              setConfirmed(false)
              dispatch({ type: 'CLOSE_BOOKING' })
              window.location.href = '/' // Quick way to navigate and reset state
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
