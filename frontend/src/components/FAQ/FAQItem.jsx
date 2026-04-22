import { motion, AnimatePresence } from 'framer-motion'

export default function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden backdrop-blur-md cursor-pointer transition-all duration-200 ${
        isOpen
          ? 'border-purple-500/40 bg-purple-500/8 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
      }`}
      onClick={onClick}
    >
      {/* Question row — taller padding */}
      <div className="flex items-center justify-between px-7 py-5 select-none gap-4">
        <span className={`font-semibold text-base leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/80'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-lg font-light transition-colors duration-200 ${
            isOpen ? 'bg-purple-500/30 text-purple-300' : 'bg-white/8 text-white/50'
          }`}
        >
          +
        </motion.div>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-7 pb-6 pt-1">
              <div className="h-px bg-white/8 mb-4" />
              <p className="text-white/65 text-sm leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
