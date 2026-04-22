'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FleetExplorer   = dynamic(() => import('@/components/FleetExplorer'),   { ssr: false });
const WebGLBackground = dynamic(() => import('@/components/WebGLBackground'), { ssr: false });

export default function BrowsePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <WebGLBackground />

      {/* ── Floating top bar ──────────────────────── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(5,5,5,0.7)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            data-hover
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.6rem',
              letterSpacing: '0.25em',
              color: '#00f0ff',
              textShadow: '0 0 20px rgba(0,240,255,0.5)',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div style={{
              width: 10, height: 10,
              borderRadius: '50%',
              background: '#00f0ff',
              boxShadow: '0 0 16px #00f0ff',
              animation: 'nodePulse 2s ease-in-out infinite',
            }} />
            AURA
          </motion.div>
        </Link>

        {/* Centre label */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.35em',
          opacity: 0.3,
        }}>
          FLEET EXPLORER
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {[{ label: 'HOME', href: '/' }, { label: 'LOCATIONS', href: '/locations' }, { label: 'DASHBOARD', href: '/dashboard' }].map(l => (
            <Link key={l.label} href={l.href}>
              <motion.span
                whileHover={{ color: '#00f0ff', y: -2 }}
                data-hover
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.25em',
                  opacity: 0.4,
                  cursor: 'none',
                  display: 'block',
                  transition: 'opacity 0.2s',
                }}
              >
                {l.label}
              </motion.span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main explorer ──────────────────────────── */}
      <div style={{ paddingTop: '72px', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
        <FleetExplorer />
      </div>

      {/* ── Drag hint ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.55rem',
          letterSpacing: '0.3em',
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <motion.span animate={{ x: [-4, 4, -4] }} transition={{ duration: 1.5, repeat: Infinity }}>←</motion.span>
        DRAG OR CLICK CLASS TABS TO NAVIGATE
        <motion.span animate={{ x: [4, -4, 4] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
      </motion.div>
    </div>
  );
}
