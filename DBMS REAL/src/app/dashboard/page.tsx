"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { ShieldCheck, Tag, Users, Car, Settings } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Cars");
  const { isEmployeeMode } = useStore();

  const tabs = [
    { id: "Cars", icon: <Car size={18} /> },
    { id: "Promotions", icon: <Tag size={18} /> },
    { id: "Rentals", icon: <ShieldCheck size={18} /> },
    { id: "Roles", icon: <Users size={18} /> },
  ];

  if (!isEmployeeMode) {
    return (
      <div className="min-h-screen pt-32 px-4 md:px-8 max-w-4xl mx-auto text-center flex flex-col justify-center items-center relative z-10">
        <ShieldCheck size={64} className="text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
        <h1 className="text-4xl font-display text-white tracking-widest mb-4">ACCESS DENIED</h1>
        <p className="font-mono text-gray-400">PLEASE ENABLE EMPLOYEE MODE TO ACCESS THIS TERMINAL.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display text-cyan-400 tracking-widest drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">AURA COMMAND CENTER</h1>
          <p className="font-mono text-sm text-gray-400 mt-2">SECURE ADMIN TERMINAL ACTIVATED</p>
        </div>
        <div className="glass px-6 py-3 rounded-full border border-cyan-400/30 flex items-center gap-3 bg-black/40 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]" />
          <span className="font-mono text-xs text-white">SYSTEM STATUS: OPTIMAL</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm uppercase transition-all whitespace-nowrap ${
              activeTab === t.id
                ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] font-bold border border-cyan-400"
                : "bg-black/40 backdrop-blur-md text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            {t.icon} {t.id}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="glass min-h-[60vh] rounded-3xl border border-white/10 p-6 md:p-8 bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Settings size={300} />
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === "Cars" && (
            <motion.div key="Cars" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <h2 className="text-xl font-mono text-white tracking-widest border-b border-white/10 pb-2">MANAGE FLEET RECORD (UI MOCK)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-4 border border-white/5 bg-white/5 rounded-xl flex flex-col gap-2 relative hover:border-cyan-400/50 transition-colors">
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    <span className="font-mono text-xs text-cyan-400">C-00{i}</span>
                    <span className="font-bold text-white uppercase text-lg">Toyota Yaris</span>
                    <div className="text-xs font-mono text-gray-500 mt-2 space-y-1"><span>CLASS: SUBCOMPACT</span> <br /> <span>PLATE: AUR-X0{i}</span></div>
                    <button className="mt-4 text-xs font-mono border border-white/20 rounded-lg py-2 px-3 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-colors flex justify-center uppercase tracking-wider">EDIT RECORD</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "Promotions" && (
            <motion.div key="Promotions" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <h2 className="text-xl font-mono text-white tracking-widest border-b border-white/10 pb-2">ACTIVE PROMOTIONS</h2>
              <div className="p-6 border border-cyan-400/30 bg-cyan-400/10 rounded-2xl flex flex-col gap-4 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyan-400/20 pb-4 gap-4">
                  <span className="font-bold text-cyan-400 tracking-widest font-mono text-lg">WEEKLY LUXURY SPECIAL</span>
                  <span className="px-4 py-1 bg-cyan-400 text-black text-xs font-bold rounded-full uppercase tracking-wider">ACTIVE</span>
                </div>
                <div className="font-mono text-sm text-gray-300 space-y-2">
                  <p>TARGET CLASS: <span className="text-white">LUXURY</span></p>
                  <p>DISCOUNT: <span className="text-white">20% OFF BASE RATE</span></p>
                  <p>VALIDITY: <span className="text-white">NOV 10 - NOV 17</span></p>
                </div>
                <button className="self-start mt-4 px-6 py-3 border border-red-500/50 text-red-400 text-xs font-bold font-mono tracking-widest uppercase rounded-lg hover:bg-red-500/20 hover:border-red-500 transition-colors">DISABLE PROMOTION</button>
              </div>
            </motion.div>
          )}

          {activeTab === "Rentals" && (
            <motion.div key="Rentals" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <h2 className="text-xl font-mono text-white tracking-widest border-b border-white/10 pb-2">RENTAL CONTRACTS</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-gray-400 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 uppercase tracking-widest">
                      <th className="pb-4 pt-2 text-white">ID</th>
                      <th className="pb-4 pt-2 text-white">CUSTOMER</th>
                      <th className="pb-4 pt-2 text-white">CAR ALLOCATED</th>
                      <th className="pb-4 pt-2 text-white">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "RT-8842", c: "JOHN D.", v: "C-031 (S-Class)", s: "ONGOING" },
                      { id: "RT-8843", c: "SARAH L.", v: "C-011 (Golf)", s: "COMPLETED" },
                      { id: "RT-8844", c: "MIKE R.", v: "C-021 (Camry)", s: "PENDING" },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 text-cyan-400 font-bold">{r.id}</td>
                        <td className="py-4 text-white">{r.c}</td>
                        <td className="py-4">{r.v}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 font-bold rounded-sm text-[10px] tracking-widest ${r.s === "ONGOING" ? "bg-green-500/20 text-green-400 border border-green-500/30" : r.s === "COMPLETED" ? "bg-gray-500/20 text-gray-400 border border-gray-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"}`}>{r.s}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "Roles" && (
            <motion.div key="Roles" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <h2 className="text-xl font-mono text-white tracking-widest border-b border-white/10 pb-2">PERSONNEL ROLES CONFIGURATION</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["MANAGER", "CLERK", "DRIVER", "CLEANER"].map((role) => (
                  <div key={role} className="p-6 border border-white/10 bg-white/5 rounded-2xl text-center hover:bg-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group">
                    <div className="w-16 h-16 mx-auto rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-4 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                      <Users className="text-cyan-400" size={28} />
                    </div>
                    <span className="font-bold text-white tracking-widest text-sm block mb-1">{role}</span>
                    <span className="font-mono text-[10px] text-gray-500 uppercase">View Permissions</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
