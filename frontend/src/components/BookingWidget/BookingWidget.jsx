import { useState } from 'react'
import GlassCard from '../ui/GlassCard.jsx'
import NeonButton from '../ui/NeonButton.jsx'
import { validateBookingForm } from '../../utils/validation.js'
import { useAppContext } from '../../context/AppContext.jsx'
import locations from '../../data/locations.js'

const CAR_CLASSES = ['Subcompact', 'Compact', 'Sedan', 'Luxury']

const inputClass =
  'w-full border text-white rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder-white/25 ' +
  'bg-[rgba(124,58,237,0.06)] border-[rgba(124,58,237,0.2)] focus:border-[rgba(124,58,237,0.6)] focus:ring-1 focus:ring-[rgba(124,58,237,0.3)] focus:shadow-[0_0_15px_rgba(124,58,237,0.2)]'

const labelClass = 'block text-xs font-medium mb-1 tracking-wide' +
  ' text-[rgba(196,181,253,0.7)]'
const errorClass = 'mt-1 text-xs text-red-400'

export default function BookingWidget() {
  const { dispatch } = useAppContext()

  const [form, setForm] = useState({
    pickupLocation: '',
    returnLocation: '',
    pickupDate: '',
    returnDate: '',
    requestedClass: 'Sedan',
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'pickupLocation' && prev.returnLocation === prev.pickupLocation) {
        next.returnLocation = value
      }
      return next
    })
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const { valid, errors: validationErrors } = validateBookingForm(form)
    if (!valid) { setErrors(validationErrors); return }
    setErrors({})
    dispatch({ type: 'OPEN_BOOKING', payload: form })
  }

  const showDropOffHint =
    form.returnLocation && form.pickupLocation && form.returnLocation !== form.pickupLocation

  return (
    <GlassCard className="p-6 w-full max-w-3xl">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="pickupLocation">Pickup Location</label>
            <select id="pickupLocation" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} className={inputClass}>
              <option value="" disabled className="bg-gray-900">Select location</option>
              {locations.map(loc => <option key={loc.id} value={loc.id} className="bg-gray-900">{loc.name}</option>)}
            </select>
            {errors.pickupLocation && <p className={errorClass}>{errors.pickupLocation}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="returnLocation">Return Location</label>
            <select id="returnLocation" name="returnLocation" value={form.returnLocation} onChange={handleChange} className={inputClass}>
              <option value="" disabled className="bg-gray-900">Select location</option>
              {locations.map(loc => <option key={loc.id} value={loc.id} className="bg-gray-900">{loc.name}</option>)}
            </select>
            {errors.returnLocation && <p className={errorClass}>{errors.returnLocation}</p>}
            {showDropOffHint && <p className="mt-1 text-xs text-amber-400">Drop-off charge may apply</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="pickupDate">Pickup Date</label>
            <input id="pickupDate" type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} className={inputClass + ' [color-scheme:dark]'} />
            {errors.pickupDate && <p className={errorClass}>{errors.pickupDate}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="returnDate">Return Date</label>
            <input id="returnDate" type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className={inputClass + ' [color-scheme:dark]'} />
            {errors.returnDate && <p className={errorClass}>{errors.returnDate}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Car Class</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {CAR_CLASSES.map(cls => (
                <label key={cls} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all ${form.requestedClass === cls
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'}`}
                  style={form.requestedClass === cls
                    ? { border: '1px solid rgba(124,58,237,0.7)', background: 'rgba(124,58,237,0.2)', boxShadow: '0 0 12px rgba(124,58,237,0.3)' }
                    : { border: '1px solid rgba(124,58,237,0.15)', background: 'rgba(124,58,237,0.04)' }
                  }
                >
                  <input type="radio" name="requestedClass" value={cls} checked={form.requestedClass === cls} onChange={handleChange} className="sr-only" />
                  {cls}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-white/40 italic">Higher class may be assigned at same price.</p>
          <NeonButton type="submit" className="w-full sm:w-auto">Search Vehicles</NeonButton>
        </div>
      </form>
    </GlassCard>
  )
}
