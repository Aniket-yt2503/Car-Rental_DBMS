import { motion } from 'framer-motion'

const variants = {
  primary: {
    base: 'text-white border-transparent relative overflow-hidden',
    style: { background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.1)' },
    hover: { scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.2)' },
  },
  secondary: {
    base: 'bg-transparent text-slate-300 relative overflow-hidden',
    style: { border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' },
    hover: { scale: 1.02, background: 'rgba(255,255,255,0.05)', color: '#ffffff' },
  },
  amber: {
    base: 'text-white border-transparent relative overflow-hidden',
    style: { background: 'linear-gradient(135deg, #d97706, #92400e)', border: '1px solid rgba(255,255,255,0.1)' },
    hover: { scale: 1.02, boxShadow: '0 4px 20px rgba(217,119,6,0.3)', border: '1px solid rgba(255,255,255,0.3)' },
  },
}

export default function SleekButton({
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
      className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all
        ${scheme.base}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
      style={scheme.style}
      whileHover={disabled ? {} : scheme.hover}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Subtle shimmer sweep on hover */}
      {!disabled && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
