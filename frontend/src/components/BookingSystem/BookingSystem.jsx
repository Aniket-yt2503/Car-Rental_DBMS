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
import SleekButton from '../ui/SleekButton.jsx'
import CarSelector from './CarSelector.jsx'
import { playUpgradeSound } from '../../utils/sound.js'

const CLASS_ORDER = ['Subcompact', 'Compact', 'Sedan', 'Luxury']
const FUEL_LEVELS = ['Empty', 'Quarter', 'Half', 'Three_Quarter', 'Full']
const UNIT_LABELS = { month: 'Month', '2weeks': '2 Wks', week: 'Week', day: 'Day' }

function fmt(n) { return n.toFixed(2) }
function locName(id) { return locations.find(l => l.id === id)?.name ?? id }

function playMonzaSound() {
  try {
    const audio = new Audio('/monza.mp3')
    audio.volume = 0.75
    audio.play().catch(() => {})
  } catch (e) { /* silent */ }
}

function ConfirmedOverlay({ onClose, car }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center backdrop-blur-3xl overflow-hidden"
      style={{ background: 'rgba(5,5,5,0.98)' }}
    >
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: `1px solid rgba(255,255,255,${0.1 - i * 0.02})` }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: `${i * 400}px`, height: `${i * 400}px`, opacity: 0 }}
          transition={{ duration: 1.5, delay: i * 0.15, ease: 'easeOut' }}
        />
      ))}

      <div className="text-center px-8 relative z-10 max-w-md">
        {car?.imageUrl ? (
          <motion.img
            src={car.imageUrl}
            alt={car.model}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 h-40 object-cover rounded-3xl mx-auto mb-8 border border-white/10"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
          />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-8xl mb-8 select-none"
          >🏁</motion.div>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-16 h-px bg-white/20 mx-auto mb-6"
        />

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-4xl font-black text-white mb-3 uppercase tracking-tighter"
        >
          DEPLOYMENT SUCCESSFUL
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-10"
        >
          Asset Reserved: {car?.year} {car?.make} {car?.model}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <SleekButton onClick={onClose} variant="platinum" className="px-12 py-4">Terminal Exit</SleekButton>
        </motion.div>
      </div>
    </motion.div>
  )
}

import BookingWidget from '../BookingWidget/BookingWidget.jsx'

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <span className={`text-[11px] font-black tracking-widest uppercase ${accent ? 'text-amber-500' : 'text-white/80'}`}>{value}</span>
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
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [driversLicense, setDriversLicense] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [driverError, setDriverError] = useState(null)

  const [confirmed, setConfirmed] = useState(false)

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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl"
        style={{ background: 'rgba(5,5,5,0.98)' }}
      >
        <div className="relative w-full max-w-3xl">
          <div className="flex justify-between items-center mb-6 px-4">
            <h1 className="text-xl font-black text-white uppercase tracking-[0.2em]">INITIALIZE TRIP</h1>
            <button
              onClick={() => dispatch({ type: 'CLOSE_BOOKING' })}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-white/20 hover:text-white transition-all bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer"
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

    if (firstName || lastName || driversLicense) {
      if (!firstName || !lastName || !driversLicense || !street || !city || !province || !postalCode) {
        setDriverError('All fields required for authorization.');
        return;
      }
      if (firstName.length < 2 || lastName.length < 2) {
        setDriverError('Identity names invalid.');
        return;
      }
      if (!/^[A-Za-z0-9-]+$/.test(driversLicense) || driversLicense.length < 5) {
        setDriverError('License authentication failed.');
        return;
      }
      if (postalCode.length < 5) {
        setDriverError('Postal coordinate invalid.');
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
      returnDate:        formData.returnDate || null,
      returnLocationId:  formData.returnLocation || formData.pickupLocation,
      endOdometer:       endOdometer ? Number(endOdometer) : null,
      fuelLevel:         fuelLevel,
      finalPrice:        finalPrice,
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
      setError(result.error)
      return
    }
    playMonzaSound()
    setConfirmed(true)
  }

  const card = (children, className = '') => (
    <div
      className={`rounded-3xl p-8 bg-white/5 border border-white/10 ${className}`}
    >
      {children}
    </div>
  )

  const label = (text) => (
    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-slate-500">{text}</p>
  )

  const inputClass = "w-full rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-white placeholder-white/10 bg-white/5 border border-white/10 focus:border-white/40 focus:outline-none transition-all"

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl"
        style={{ background: 'rgba(5,5,5,0.98)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl overflow-y-auto scrollbar-none"
          style={{ maxHeight: '92vh' }}
        >
          <div className="flex items-center justify-between mb-8 px-4">
            <h1 className="text-2xl font-black text-white uppercase tracking-[0.25em]">Summary Manifest</h1>
            <button
              onClick={() => dispatch({ type: 'CLOSE_BOOKING' })}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-white/20 hover:text-white transition-all bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer"
            >✕</button>
          </div>

          {!loading && chosenCar && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                {card(
                  <>
                    {label('Operational Asset')}
                    <div className="flex gap-6 items-center">
                      <img src={chosenCar.imageUrl} alt={chosenCar.model} className="w-32 h-20 object-cover rounded-2xl shrink-0 border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-lg uppercase tracking-tighter">{chosenCar.make} {chosenCar.model}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{chosenCar.year} · {chosenCar.licensePlate}</p>
                        <div className="flex items-center gap-3 mt-3">
                           <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 text-white/50">{assignedClass}</span>
                           {isUpgraded && <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest">✦ ELITE UPGRADE</span>}
                        </div>
                      </div>
                      <button onClick={() => setStep('select')} className="text-slate-700 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">Reassign</button>
                    </div>
                  </>
                )}

                {card(
                  <>
                    {label('Logistical Parameters')}
                    <div className="space-y-1">
                      <Row label="Point Alpha" value={locName(formData.pickupLocation)} />
                      <Row label="Point Omega" value={locName(formData.returnLocation)} />
                      <Row label="Log Start" value={formData.pickupDate} />
                      <Row label="Log End" value={formData.returnDate} />
                      <Row label="Total Cycle" value={`${totalDays} DAYS`} />
                    </div>
                  </>
                )}

                {card(
                  <>
                    <div className="flex items-center justify-between mb-2">
                      {label('Personnel Data')}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input 
                        type="text" placeholder="FIRST NAME" value={firstName} 
                        onChange={e => setFirstName(e.target.value.replace(/[^A-Za-z]/g, ''))} 
                        className={inputClass} 
                      />
                      <input 
                        type="text" placeholder="LAST NAME" value={lastName} 
                        onChange={e => setLastName(e.target.value.replace(/[^A-Za-z]/g, ''))} 
                        className={inputClass} 
                      />
                    </div>
                    <div className="mb-4">
                      <input 
                        type="text" placeholder="DRIVER LICENSE ID" value={driversLicense} 
                        onChange={e => setDriversLicense(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} 
                        className={inputClass} 
                      />
                    </div>
                    <div className="mb-4">
                      <input type="text" placeholder="STREET ADDRESS" value={street} onChange={e => setStreet(e.target.value)} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <select 
                        value={city} 
                        onChange={e => {
                          const found = locations.find(l => l.city === e.target.value);
                          setCity(e.target.value);
                          if (found) setProvince(found.province);
                        }} 
                        className={inputClass}
                      >
                        <option value="" disabled>SELECT CITY</option>
                        {[...new Set(locations.map(l => l.city))].sort().map(c => (
                          <option key={c} value={c} className="bg-slate-900">{c.toUpperCase()}</option>
                        ))}
                        <option value="Other" className="bg-slate-900">OTHER</option>
                      </select>
                      <input type="text" placeholder="PROV" value={province} onChange={e => setProvince(e.target.value.toUpperCase())} className={inputClass} />
                      <input 
                        type="text" placeholder="POSTAL" value={postalCode} 
                        onChange={e => setPostalCode(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ''))} 
                        className={inputClass} 
                      />
                    </div>
                    {driverError && <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-amber-500">{driverError}</p>}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {card(
                  <>
                    {label('Asset Condition')}
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-4">Logistical Fuel State</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {FUEL_LEVELS.map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFuelLevel(level)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                            fuelLevel === level 
                            ? 'bg-white/10 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                            : 'bg-white/5 border-white/10 text-slate-600 hover:text-white'
                          }`}
                        >
                          {level.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2">Initial ODO</p>
                        <input
                          type="number" value={startOdometer}
                          onChange={e => setStartOdometer(e.target.value)}
                          placeholder="KM"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2">Final ODO</p>
                        <input
                          type="number" value={endOdometer}
                          onChange={e => setEndOdometer(e.target.value)}
                          placeholder="KM"
                          className={inputClass + (odometerError ? " border-amber-500/50" : "")}
                        />
                      </div>
                    </div>
                    {odometerError && <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-amber-500">{odometerError}</p>}
                  </>
                )}

                {card(
                  <>
                    <div className="flex items-center justify-between mb-4">
                      {label('Financial Audit')}
                      <div className="flex gap-2">
                        {promotionApplies && <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">PROMO</span>}
                        {mode === 'employee' && <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 text-white px-2 py-0.5 rounded border border-white/20">STAFF</span>}
                      </div>
                    </div>

                    {pricingEntry ? (
                      <div className="space-y-3">
                        {billingLines.map(line => (
                          <div key={line.unit} className="flex justify-between items-center py-1">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{UNIT_LABELS[line.unit]} CYCLE ×{line.quantity}</span>
                            <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">${fmt(line.subtotal)}</span>
                          </div>
                        ))}
                        {dropOffCharge > 0 && (
                          <div className="flex justify-between items-center py-1">
                            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">LOGISTICAL CHARGE</span>
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest">${fmt(dropOffCharge)}</span>
                          </div>
                        )}
                        <div className="pt-6 mt-4 border-t border-white/10 flex justify-between items-end">
                          <span className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">Total Value</span>
                          <span className="text-4xl font-black text-white tracking-tighter">${fmt(finalPrice)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 text-[10px] font-black uppercase animate-pulse">Calculating audit...</p>
                    )}
                  </>
                )}

                <div className="mt-2">
                   <SleekButton 
                    onClick={handleConfirm}
                    disabled={!!odometerError || loading}
                    variant="amber"
                    className="w-full py-5 text-base font-black uppercase tracking-[0.3em]"
                   >
                     {loading ? 'Processing...' : 'Authorize Deployment'}
                   </SleekButton>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {confirmed && (
          <ConfirmedOverlay
            car={chosenCar}
            onClose={() => {
              setConfirmed(false)
              dispatch({ type: 'CLOSE_BOOKING' })
              window.location.href = '/'
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
