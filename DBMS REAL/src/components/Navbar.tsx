'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Bell, User, Settings, ChevronDown, LogOut, Wallet } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const flipVariants = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 10 } },
    exit: { rotateX: 90, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100, rotateX: 90 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
        className="fixed w-full z-50 glass h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 border-b border-primary/20 bg-gradient-to-r from-black/80 via-black/40 to-black/80 backdrop-blur-3xl"
      >
        <motion.div 
          whileHover={{ scale: 1.1, rotateY: 180 }} 
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-primary to-accent animate-pulse shadow-[0_0_20px_#00f0ff]" />
          <Link href="/">
            <span className="text-2xl md:text-3xl font-extrabold tracking-widest neon-text-cyan cursor-pointer hidden sm:block">AURA</span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center text-sm font-bold tracking-widest text-gray-300">
          {['EXPLORE', 'LOCATIONS', 'DASHBOARD'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}>
              <motion.span 
                whileHover={{ scale: 1.2, color: "#00f0ff", y: -5 }} 
                className="cursor-pointer block transition-colors"
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Desktop Buttons & Icons */}
        <div className="hidden md:flex items-center gap-6">


          <div className="relative group perspective-[1000px]">
            <motion.div 
              onHoverStart={() => setShowProfileInfo(true)}
              onHoverEnd={() => setShowProfileInfo(false)}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10"
            >
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">JOHN D.</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </motion.div>
            
            <AnimatePresence>
              {showProfileInfo && (
                <motion.div
                  variants={flipVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="absolute top-full right-0 mt-4 w-60 glass rounded-2xl border border-primary/30 p-4 flex flex-col gap-2 origin-top"
                >
                   <Link href="/dashboard" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors"><Wallet className="w-5 h-5 text-green-400"/> <span>Wallet: $1,250</span></Link>
                   <div className="h-px w-full bg-white/10 my-1" />
                   <div className="flex items-center gap-3 p-3 hover:bg-red-500/20 rounded-xl transition-colors text-red-400 cursor-pointer"><LogOut className="w-5 h-5"/> <span>Sign Out</span></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/explore">
            <motion.button 
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 30px 10px rgba(0,240,255,0.4)" }}
              whileTap={{ scale: 0.9 }}
              className="px-8 py-3 rounded-full bg-primary/20 border-2 border-primary text-primary neon-border-cyan font-bold tracking-widest shadow-lg"
            >
              BOOK
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <motion.button 
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.8 }}
          className="md:hidden text-primary" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="fixed top-20 left-0 w-full h-[calc(100vh-5rem)] backdrop-blur-3xl bg-black/90 flex flex-col items-center justify-center gap-8 z-40 md:hidden origin-top perspective-[1000px]"
          >
            {['EXPLORE', 'LOCATIONS', 'DASHBOARD'].map((item, i) => (
               <motion.div 
                 key={item}
                 initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, type: "spring" }}
               >
                 <Link 
                   href={`/${item.toLowerCase()}`} 
                   onClick={() => setIsOpen(false)} 
                   className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                 >
                   {item}
                 </Link>
               </motion.div>
            ))}
            
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex gap-6 mt-8">
               <div className="p-4 rounded-full glass border border-primary/50 text-white"><User size={24}/></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="w-full px-12 mt-4"
            >
              <Link href="/explore" onClick={() => setIsOpen(false)}>
                <button className="w-full py-4 rounded-xl bg-primary shadow-[0_0_30px_#00f0ff] text-black font-black text-xl tracking-widest uppercase origin-center transform transition-all hover:scale-105 active:scale-95">
                  Book A Ride Now
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
