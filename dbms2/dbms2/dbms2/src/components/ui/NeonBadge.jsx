const colorMap = {
  purple: {
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    glow: '0 0 12px rgba(168, 85, 247, 0.6), 0 0 24px rgba(168, 85, 247, 0.3)',
    text: '#e9d5ff',
  },
  blue: {
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    glow: '0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(59, 130, 246, 0.3)',
    text: '#dbeafe',
  },
  cyan: {
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    glow: '0 0 12px rgba(6, 182, 212, 0.6), 0 0 24px rgba(6, 182, 212, 0.3)',
    text: '#cffafe',
  },
}

export default function NeonBadge({ label, color = 'purple' }) {
  const scheme = colorMap[color] ?? colorMap.purple

  return (
    <span
      style={{
        background: scheme.gradient,
        boxShadow: scheme.glow,
        color: scheme.text,
        padding: '2px 1px',
        borderRadius: '9999px',
        display: 'inline-block',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: 'rgba(10, 10, 20, 0.75)',
          borderRadius: '9999px',
          padding: '2px 12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: scheme.text,
        }}
      >
        {label}
      </span>
    </span>
  )
}
