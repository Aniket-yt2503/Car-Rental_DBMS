"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { User, MapPin, Calendar, CreditCard, Plus, Trash, Car, Zap } from "lucide-react";
import { PRICING, LOCATIONS } from "@/data/mockData";

export default function BookPage() {
  const { bookingParams, isEmployeeMode } = useStore();
  const [phones, setPhones] = useState([""]);
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [assignedClass, setAssignedClass] = useState(bookingParams.carClass || "subcompact");
  
  // Stats
  const [fuel, setFuel] = useState(100);
  const [startOdo, setStartOdo] = useState("12500");
  const [endOdo, setEndOdo] = useState("");

  // Logic to simulate an upgrade
  useEffect(() => {
    if (bookingParams.carClass === "compact") {
      setTimeout(() => {
        setIsUpgraded(true);
        setAssignedClass("sedan");
      }, 1500);
    }
  }, [bookingParams.carClass]);

  const pickupLoc = LOCATIONS.find((l) => l.id === bookingParams.pickupLocation);
  const returnLoc = LOCATIONS.find((l) => l.id === bookingParams.returnLocation) || pickupLoc;

  const days = (bookingParams.pickupDate && bookingParams.returnDate)
    ? Math.max(1, differenceInDays(new Date(bookingParams.returnDate), new Date(bookingParams.pickupDate)))
    : 1;

  const baseRate = PRICING[bookingParams.carClass || "subcompact"]?.base || 28;
  const isDropOffDiff = pickupLoc?.id !== returnLoc?.id;
  const dropOffCharge = isDropOffDiff ? 50 : 0;
  
  // Time split
  const months = Math.floor(days / 30);
  const remainingAfterMonths = days % 30;
  const weeks = Math.floor(remainingAfterMonths / 7);
  const remainingDays = remainingAfterMonths % 7;

  // Pricing Logic
  let discountMultiplier = 1;
  if (isEmployeeMode) {
    discountMultiplier = days >= 14 ? 0.1 : 0.5; // 90% off or 50% off
  }

  const subtotal = (days * baseRate) + dropOffCharge;
  const total = subtotal * discountMultiplier;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8">
      {/* ── LEFT: FORM & DETAILS ──────────────────────── */}
      <div className="flex-1 flex flex-col gap-8">
        
        {/* Customer Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold font-mono tracking-widest text-cyan-400 mb-6 flex items-center gap-3">
            <User /> CUSTOMER IDENTITY
          </h2>
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="FULL NAME" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white uppercase font-mono outline-none focus:border-cyan-400/50" />
            <input type="text" placeholder="ADDRESS" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white uppercase font-mono outline-none focus:border-cyan-400/50" />
            <input type="text" placeholder="DRIVER LICENSE NO." className="bg-white/5 border border-white/10 rounded-xl p-4 text-white uppercase font-mono outline-none focus:border-cyan-400/50" />
            
            <div className="flex flex-col gap-2 mt-2">
              <span className="font-mono text-sm text-gray-400">CONTACT NUMBERS</span>
              {phones.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="tel"
                    placeholder={`PHONE ${i + 1}`}
                    value={p}
                    onChange={(e) => { const newP = [...phones]; newP[i] = e.target.value; setPhones(newP); }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white uppercase font-mono outline-none focus:border-cyan-400/50"
                  />
                  {i > 0 && (
                    <button onClick={() => setPhones(phones.filter((_, idx) => idx !== i))} className="p-4 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">
                      <Trash size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => setPhones([...phones, ""])} className="mt-2 flex items-center justify-center gap-2 p-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors font-mono text-sm">
                <Plus size={16} /> ADD PHONE
              </button>
            </div>
          </div>
        </motion.div>

        {/* Vehicle Status (Odo / Fuel) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold font-mono tracking-widest text-cyan-400 mb-6 flex items-center gap-3">
            <Zap /> VEHICLE TELEMETRY
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <span className="font-mono text-sm text-gray-400 mb-2 block">FUEL LEVEL: {fuel}%</span>
              <div className="flex gap-1 h-12 w-full">
                {[25, 50, 75, 100].map((level) => (
                  <div
                    key={level}
                    onClick={() => setFuel(level)}
                    className={`flex-1 rounded-sm cursor-pointer transition-colors ${fuel >= level ? 'bg-cyan-400 shadow-[0_0_10px_#00f0ff]' : 'bg-white/10 hover:bg-white/20'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between font-mono text-[10px] text-gray-500 mt-2">
                <span>E</span><span>1/4</span><span>1/2</span><span>3/4</span><span>F</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <span className="font-mono text-sm text-gray-400 mb-2 block">START ODOMETER</span>
                <input type="number" value={startOdo} onChange={(e) => setStartOdo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono outline-none" />
              </div>
              <div>
                <span className="font-mono text-sm text-gray-400 mb-2 block">END ODOMETER</span>
                <input type="number" value={endOdo} onChange={(e) => setEndOdo(e.target.value)} className="w-full bg-white/5 border-[1px] border-white/10 rounded-xl p-3 text-white font-mono outline-none" placeholder="AT RETURN" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── RIGHT: SUMMARY & PRICING ──────────────────── */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-[400px] flex flex-col gap-6">
        
        {/* Class assignment block */}
        <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 shadow-[0_0_20px_#00f0ff]" />
          <h3 className="font-mono text-gray-400 text-sm mb-4">VEHICLE ASSIGNMENT</h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs opacity-50">REQUESTED</span>
            <span className="font-mono text-sm uppercase text-gray-300">{bookingParams.carClass || "N/A"}</span>
          </div>

          <AnimatePresence mode="wait">
            {isUpgraded ? (
              <motion.div
                key="upgraded"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                className="mt-4 p-4 rounded-xl border border-[#00f0ff] bg-[#00f0ff]/10"
              >
                <div className="font-mono text-[10px] text-cyan-400 tracking-widest mb-1 animate-pulse">SYSTEM OVERRIDE: UPGRADE APPLIED</div>
                <div className="font-display text-4xl text-white uppercase flex items-center gap-2">
                  <Car /> {assignedClass}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="standard"
                className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5"
              >
                <div className="font-display text-4xl text-white uppercase flex items-center gap-2">
                  <Car /> {assignedClass}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Breakdown */}
        <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
          <h3 className="font-mono text-gray-400 text-sm mb-2">DYNAMIC PRICING MODEL</h3>
          
          <div className="flex justify-between font-mono text-sm">
            <span className="text-gray-400">BASE ({bookingParams.carClass})</span>
            <span className="text-white">${baseRate} / DAY</span>
          </div>
          
          <div className="flex justify-between font-mono text-sm border-t border-white/10 pt-2">
            <span className="text-gray-400">DURATION</span>
            <span className="text-white text-right">
              {days} DAYS <br />
              <span className="text-[10px] text-gray-500">{months > 0 && `${months} MONTH(S) `}{weeks > 0 && `${weeks} WEEK(S) `}{remainingDays > 0 && `${remainingDays} DAY(S)`}</span>
            </span>
          </div>

          {isDropOffDiff && (
            <div className="flex justify-between font-mono text-sm text-orange-400">
              <span>DROP-OFF CHARGE</span>
              <span>+$50</span>
            </div>
          )}

          {isEmployeeMode && (
            <div className="flex justify-between font-mono text-sm text-green-400 bg-green-400/10 p-2 rounded-lg border border-green-400/20">
              <span>EMPLOYEE DISCOUNT</span>
              <span>{days >= 14 ? '90%' : '50%'} OFF</span>
            </div>
          )}

          <div className="border-t border-white/20 pt-4 mt-2 flex justify-between items-end">
            <div className="font-mono text-sm text-gray-400">TOTAL EST.</div>
            <div className="font-display text-5xl text-cyan-400 text-right drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              ${total.toFixed(2)}
            </div>
          </div>
          
          <button className="mt-4 w-full bg-cyan-400 text-black py-4 rounded-xl font-bold font-mono tracking-widest flex justify-center items-center gap-2 hover:bg-cyan-300 transition-colors shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            <CreditCard size={18} /> INITIATE CONTRACT
          </button>
        </div>
      </motion.div>
    </div>
  );
}
