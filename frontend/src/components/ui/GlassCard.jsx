import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      className={`backdrop-blur-xl rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(6,182,212,0.03))',
        border: '1px solid rgba(124,58,237,0.18)',
      }}
      whileHover={{
        boxShadow: '0 0 30px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)',
        borderColor: 'rgba(124,58,237,0.4)',
      }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}
