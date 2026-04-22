"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LOCATIONS } from "@/data/mockData";
import { Calendar, MapPin, Car, ArrowRight, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export default function BookingWidget() {
  const router = useRouter();
  const { bookingParams, setBookingParams } = useStore();
  const [step, setStep] = useState(1);
  const classes = ["subcompact", "compact", "sedan", "luxury"] as const;

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleBook = () => {
    router.push("/book");
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto mt-8">
      {/* Upgrade Hint */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center gap-2 justify-center text-xs font-mono text-cyan-400 bg-cyan-400/10 px-4 py-2 rounded-full border border-cyan-400/30"
      >
        <ShieldAlert size={14} />
        HIGHER CLASS MAY BE ASSIGNED AT SAME PRICE
      </motion.div>

      {/* Widget Container */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 backdrop-blur-3xl bg-black/40 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col gap-6"
            >
              <h3 className="text-xl font-bold font-mono tracking-widest text-white/80 border-b border-white/10 pb-2">LOCATIONS</h3>
              <div className="flex flex-col gap-4">
                <div className="relative uppercase">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-cyan-400/50 appearance-none font-mono text-sm cursor-pointer"
                    value={bookingParams.pickupLocation}
                    onChange={(e) => setBookingParams({ pickupLocation: e.target.value })}
                  >
                    <option value="" disabled className="bg-black text-gray-400">Select Pickup Location</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id} className="bg-black text-white">{loc.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative uppercase">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-cyan-400/50 appearance-none font-mono text-sm cursor-pointer"
                    value={bookingParams.returnLocation}
                    onChange={(e) => setBookingParams({ returnLocation: e.target.value })}
                  >
                    <option value="" disabled className="bg-black text-gray-400">Select Return (Optional)</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id} className="bg-black text-white">{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!bookingParams.pickupLocation}
                className="mt-4 w-full bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400 text-cyan-400 p-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xl font-bold font-mono tracking-widest text-white/80">DATES</h3>
                <button onClick={handlePrev} className="text-sm font-mono text-gray-500 hover:text-white">← BACK</button>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-cyan-400/50 font-mono text-sm uppercase color-scheme-dark"
                    value={bookingParams.pickupDate || ""}
                    onChange={(e) => setBookingParams({ pickupDate: e.target.value })}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div className="flex-1 relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-cyan-400/50 font-mono text-sm uppercase"
                    value={bookingParams.returnDate || ""}
                    onChange={(e) => setBookingParams({ returnDate: e.target.value })}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!bookingParams.pickupDate || !bookingParams.returnDate}
                className="mt-4 w-full bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400 text-cyan-400 p-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xl font-bold font-mono tracking-widest text-white/80">CLASS</h3>
                <button onClick={handlePrev} className="text-sm font-mono text-gray-500 hover:text-white">← BACK</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {classes.map((c) => (
                  <div
                    key={c}
                    onClick={() => setBookingParams({ carClass: c })}
                    className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      bookingParams.carClass === c
                        ? "border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(0,240,255,0.2)] text-white"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <Car size={24} />
                    <span className="font-mono text-sm uppercase tracking-wider">{c}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleBook}
                disabled={!bookingParams.carClass}
                className="mt-4 w-full bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400 text-cyan-400 p-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                INITIALIZE RENTAL <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
