'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState('11111111-1111-1111-1111-111111111111'); // Toronto Mock ID
  const [dropoff, setDropoff] = useState('22222222-2222-2222-2222-222222222222'); // Hamilton Mock ID
  
  // Mock calculation result states
  const [basePrice] = useState(450.0);
  const [dropoffCharge] = useState(150.0);
  const [discountAmount] = useState(0.0);
  const totalPrice = basePrice + dropoffCharge - discountAmount;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative min-h-[80vh] flex flex-col justify-center">
       
       <div className="flex gap-4 mb-12 justify-center">
         {[1, 2, 3].map(s => (
           <div key={s} className={`w-12 h-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-white/10'}`} />
         ))}
       </div>

       <AnimatePresence mode="wait">
         {step === 1 && (
           <motion.div
             key="step1"
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
             className="glass p-8 rounded-3xl"
           >
             <h2 className="text-3xl font-semibold mb-6">Itinerary Details</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Pickup Location</label>
                  <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full glass-input rounded-xl p-4 text-sm">
                    <option value="11111111-1111-1111-1111-111111111111">Toronto (100 Main St)</option>
                    <option value="22222222-2222-2222-2222-222222222222">Hamilton (200 King St)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Dropoff Location</label>
                  <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full glass-input rounded-xl p-4 text-sm">
                    <option value="11111111-1111-1111-1111-111111111111">Toronto (100 Main St)</option>
                    <option value="22222222-2222-2222-2222-222222222222">Hamilton (200 King St)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Pickup Date</label>
                  <input type="date" className="w-full glass-input rounded-xl p-4 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Dropoff Date</label>
                  <input type="date" className="w-full glass-input rounded-xl p-4 text-sm" />
                </div>
             </div>
             
             <div className="mt-8 flex justify-end">
               <button onClick={() => setStep(2)} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                 Continue to Pricing
               </button>
             </div>
           </motion.div>
         )}

         {step === 2 && (
           <motion.div
             key="step2"
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
             className="glass p-8 rounded-3xl"
           >
             <h2 className="text-3xl font-semibold mb-6">Pricing Breakdown</h2>
             <div className="space-y-4 text-lg">
                <div className="flex justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Base Class Rate (Duration)</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {pickup !== dropoff && (
                   <div className="flex justify-between p-4 bg-accent/20 border border-accent/30 rounded-xl">
                    <span className="text-primary font-light">Cross-City Dropoff Charge</span>
                    <span className="text-primary">+${dropoffCharge.toFixed(2)}</span>
                   </div>
                )}
                {discountAmount > 0 && (
                   <div className="flex justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <span className="text-green-400">Applied Discount</span>
                    <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
                   </div>
                )}
                <div className="flex justify-between p-4 mt-8 border-t border-white/20">
                  <span className="text-xl font-bold">Total Due</span>
                  <span className="text-3xl font-bold neon-text-cyan">${totalPrice.toFixed(2)}</span>
                </div>
             </div>
             
             <div className="mt-8 flex justify-between">
               <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white transition-colors">Back</button>
               <button onClick={() => setStep(3)} className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:bg-primaryDark transition-colors neon-border-cyan">
                 Confirm Booking
               </button>
             </div>
           </motion.div>
         )}

         {step === 3 && (
           <motion.div
             key="step3"
             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
             className="glass p-12 rounded-3xl text-center border-primary/40 shadow-[0_0_50px_rgba(0,240,255,0.1)]"
           >
             <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
             <h2 className="text-4xl font-bold mb-4 neon-text-cyan">Booking Confirmed!</h2>
             <p className="text-gray-400 max-w-md mx-auto">
               Your vehicle has been successfully reserved. Our system automatically verified the drop-off matrix and applied the appropriate charges.
             </p>
             <div className="mt-8">
               <p className="text-sm text-gray-500">Reservation ID: #AURA-{Math.floor(Math.random()*10000)}</p>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
