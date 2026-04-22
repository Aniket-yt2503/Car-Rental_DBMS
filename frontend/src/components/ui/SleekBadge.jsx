const colorMap = {
  slate: {
    bg: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.15)',
    text: 'rgba(255, 255, 255, 0.7)',
  },
  amber: {
    bg: 'rgba(217, 119, 6, 0.1)',
    border: 'rgba(217, 119, 6, 0.3)',
    text: '#fbbf24',
  },
  emerald: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    text: '#34d399',
  },
  white: {
    bg: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.3)',
    text: '#ffffff',
  },
}

export default function SleekBadge({ label, color = 'slate' }) {
  const scheme = colorMap[color] ?? colorMap.slate

  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300"
      style={{
        background: scheme.bg,
        borderColor: scheme.border,
        color: scheme.text,
      }}
    >
      {label}
    </span>
  )
}
