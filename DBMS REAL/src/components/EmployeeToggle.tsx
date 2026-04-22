"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function EmployeeToggle() {
  const { isEmployeeMode, setEmployeeMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 left-0 w-64 glass bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col gap-4"
          >
            <h3 className="font-mono text-sm text-white tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
              <ShieldAlert size={16} className="text-cyan-400" /> SYSTEM ACCESS
            </h3>
            
            <button
              onClick={() => {
                setEmployeeMode(!isEmployeeMode);
                setIsOpen(false);
              }}
              className={`w-full py-3 rounded-xl font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                isEmployeeMode
                  ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20"
                  : "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              }`}
            >
              {isEmployeeMode ? (
                <> <LogOut size={14} /> REVERT TO USER </>
              ) : (
                <> <CheckCircle2 size={14} /> INITIATE EMPLOYEE MODE </>
              )}
            </button>
            <div className="font-mono text-[10px] text-gray-500 text-center leading-relaxed">
              Enabling employee mode unlocks HQ dashboard access, removes standard promotions, and activates structural discounts.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors shadow-2xl ${
          isEmployeeMode
            ? "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            : "bg-black/60 border-white/20 text-gray-400 hover:border-cyan-400/50 hover:text-cyan-400 glass"
        }`}
      >
        <ShieldAlert size={20} />
      </motion.button>
    </div>
  );
}
