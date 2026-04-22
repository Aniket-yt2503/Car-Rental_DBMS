const pulseKeyframes = `
@keyframes glowDotPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.8); opacity: 0; }
}
`

let styleInjected = false

function injectStyle() {
  if (styleInjected || typeof document === 'undefined') return
  const tag = document.createElement('style')
  tag.textContent = pulseKeyframes
  document.head.appendChild(tag)
  styleInjected = true
}

export default function GlowDot({ color = '#a855f7', size = 12 }) {
  injectStyle()

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size * 2,
        height: size * 2,
      }}
    >
      {/* Outer pulsing ring */}
      <span
        style={{
          position: 'absolute',
          width: size * 2,
          height: size * 2,
          borderRadius: '50%',
          background: color,
          opacity: 0.6,
          animation: 'glowDotPulse 1.8s ease-in-out infinite',
        }}
      />
      {/* Inner solid dot */}
      <span
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}`,
        }}
      />
    </span>
  )
}
