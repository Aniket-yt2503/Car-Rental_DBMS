import { motion } from 'framer-motion'

const variants = {
  primary: {
    base: 'text-white border-transparent relative overflow-hidden',
    style: { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' },
    hover: { scale: 1.05, boxShadow: '0 0 25px rgba(124,58,237,0.7), 0 0 50px rgba(6,182,212,0.3)' },
  },
  secondary: {
    base: 'bg-transparent text-purple-300 relative overflow-hidden',
    style: { border: '1px solid rgba(124,58,237,0.5)' },
    hover: { scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2)' },
  },
}

export default function NeonButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
}) {
  const scheme = variants[variant] ?? variants.primary

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors
        ${scheme.base}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
      style={scheme.style}
      whileHover={disabled ? {} : scheme.hover}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {/* Shimmer sweep on hover */}
      {!disabled && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
