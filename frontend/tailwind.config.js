/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        phantom: {
          void:    '#020208',
          deep:    '#06060f',
          dark:    '#0a0a1a',
          mid:     '#0f0f28',
          purple:  '#7c3aed',
          violet:  '#a855f7',
          lavender:'#c4b5fd',
          cyan:    '#06b6d4',
          teal:    '#22d3ee',
          glow:    '#e879f9',
        },
        neon: {
          purple: '#a855f7',
          blue:   '#3b82f6',
          cyan:   '#06b6d4',
          pink:   '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        phantom:      '0 0 30px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)',
        'phantom-sm': '0 0 15px rgba(124,58,237,0.4)',
        'phantom-lg': '0 0 60px rgba(124,58,237,0.4), 0 0 120px rgba(124,58,237,0.15)',
        neon:         '0 0 20px rgba(168,85,247,0.4)',
        'neon-cyan':  '0 0 20px rgba(6,182,212,0.4)',
      },
      animation: {
        'float':       'floatUp 8s linear infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'border-flow': 'borderFlow 4s ease infinite',
        'shimmer':     'shimmer 3s linear infinite',
        'pulse-ring':  'pulseRing 2.5s ease-out infinite',
      },
    },
  },
  plugins: [],
}
