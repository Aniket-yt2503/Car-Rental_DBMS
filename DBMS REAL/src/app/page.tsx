'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import GlitchText from '@/components/GlitchText';
import LocationGraph from '@/components/LocationGraph';
import PricingLayer from '@/components/PricingLayer';
import BookingWidget from '@/components/BookingWidget';
import Link from 'next/link';

// Dynamic imports — prevent SSR issues with Three.js
const ParticleField   = dynamic(() => import('@/components/ParticleField'),   { ssr: false });
const WebGLBackground = dynamic(() => import('@/components/WebGLBackground'), { ssr: false });

/* ── Small reusable label ──────────────────────── */
function Label({ children, color = 'rgba(0,240,255,0.6)' }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem',
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
      color,
      marginBottom: '0.6rem',
    }}>
      {children}
    </div>
  );
}

/* ── Section reveal wrapper ────────────────────── */
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Class mini-card ───────────────────────────── */
const CLASSES = [
  { id: 'subcompact', name: 'SUBCOMPACT', color: '#FF2D55', glow: 'rgba(255,45,85,0.3)',   shape: 'cloud'  as const, price: 28  },
  { id: 'compact',    name: 'COMPACT',    color: '#00D4FF', glow: 'rgba(0,212,255,0.3)',   shape: 'ring'   as const, price: 42  },
  { id: 'sedan',      name: 'SEDAN',      color: '#C0C8D8', glow: 'rgba(192,200,216,0.3)', shape: 'sphere' as const, price: 75  },
  { id: 'luxury',     name: 'LUXURY',     color: '#FFD700', glow: 'rgba(255,215,0,0.3)',   shape: 'helix'  as const, price: 180, promo: true },
];

function ClassCard({ cls, index }: { cls: typeof CLASSES[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      data-hover
      style={{
        position: 'relative',
        borderRadius: '16px',
        border: `1px solid ${cls.color}20`,
        background: 'rgba(5,5,5,0.6)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        cursor: 'none',
        transition: 'box-shadow 0.4s',
        boxShadow: `0 0 40px ${cls.glow}`,
      }}
    >
      {/* Promo badge */}
      {cls.promo && (
        <div className="promo-active" style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          background: `${cls.color}20`,
          border: `1px solid ${cls.color}`,
          borderRadius: '4px',
          padding: '0.15rem 0.5rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.5rem',
          letterSpacing: '0.2em',
          color: cls.color,
          zIndex: 2,
        }}>
          ⚡ PROMO
        </div>
      )}

      {/* Particle canvas */}
      <div style={{ height: '180px', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${cls.glow} 0%, transparent 70%)`,
        }} />
        <ParticleField color={cls.color} shape={cls.shape} count={1200} size={0.025} speed={0.3} />
      </div>

      {/* Info */}
      <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.6rem',
          color: cls.color,
          letterSpacing: '0.08em',
          lineHeight: 1,
          textShadow: `0 0 20px ${cls.glow}`,
        }}>
          <GlitchText text={cls.name} speed={40} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.75rem' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', opacity: 0.35, letterSpacing: '0.2em' }}>FROM / DAY</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: cls.color }}>
              ${cls.promo ? Math.round(cls.price * 0.8) : cls.price}
            </div>
          </div>
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.94 }}
              data-hover
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '100px',
                border: `1px solid ${cls.color}50`,
                background: `${cls.color}10`,
                color: cls.color,
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                cursor: 'none',
              }}
            >
              EXPLORE →
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Marquee ticker ────────────────────────────── */
function Ticker() {
  const items = ['AURA RENTALS', 'MOBILITY REDEFINED', 'DRIVE BEYOND LIMITS', 'SUBCOMPACT', 'COMPACT', 'SEDAN', 'LUXURY', 'AWARD-TIER EXPERIENCE', '24/7 CONCIERGE', 'INSTANT UPGRADE'];
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem 0', position: 'relative', zIndex: 2 }}>
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.3em', opacity: 0.25 }}>
            {item} <span style={{ color: '#00f0ff', opacity: 0.5 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Hero section ────────────────────────────── */
function HeroSection() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
      <Reveal>
        <h1 className="font-display" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)', lineHeight: 0.85, textAlign: 'center', letterSpacing: '-0.02em', margin: '2rem 0' }}>
          DRIVE<br />
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>THE</span><br />
          FUTURE
        </h1>
      </Reveal>
      <Reveal delay={0.2} style={{ marginTop: '2rem', width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'center' }}>
        <BookingWidget />
      </Reveal>

      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,240,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
              data-hover
              style={{
                padding: '0.9rem 2.5rem',
                borderRadius: '4px',
                border: '1px solid #00f0ff',
                background: 'rgba(0,240,255,0.08)',
                color: '#00f0ff',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                cursor: 'none',
              }}
            >
              ENTER FLEET
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            data-hover
            onClick={() => document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '0.9rem 2.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              cursor: 'none',
            }}
          >
            EXPLORE ↓
          </motion.button>
        </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.25,
        }}
      >
        <div style={{ width: 1, height: '3rem', background: 'linear-gradient(to bottom, transparent, #00f0ff)' }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.3em' }}>SCROLL</div>
      </motion.div>
    </section>
  );
}

/* ── Stats bar ─────────────────────────────────── */
function StatsBar() {
  const stats = [
    { label: 'VEHICLES', value: '2,400+' },
    { label: 'CITIES',   value: '48'     },
    { label: 'CLASSES',  value: '4'      },
    { label: 'UPTIME',   value: '99.97%' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative', zIndex: 2,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '2rem 1.5rem',
          textAlign: 'center',
          borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>
            {s.value}
          </div>
          <div className="text-label" style={{ marginTop: '0.4rem' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────── */
export default function Home() {
  const [selectedClass, setSelectedClass] = useSelectedClass();
  const cls = CLASSES[selectedClass];

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <WebGLBackground />

      {/* ── HERO ──────────────────────────────────── */}
      <HeroSection />

      {/* ── TICKER ────────────────────────────────── */}
      <Ticker />

      {/* ── STATS ─────────────────────────────────── */}
      <Reveal>
        <StatsBar />
      </Reveal>

      {/* ── FLEET CLASSES ─────────────────────────── */}
      <section id="fleet-section" style={{ padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 5rem)', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <Label>VEHICLE CLASSES</Label>
          <h2 className="font-display" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.88, letterSpacing: '-0.01em', marginBottom: '3rem' }}>
            CHOOSE<br />
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>YOUR</span><br />
            IDENTITY
          </h2>
        </Reveal>

        {/* Class selector tabs */}
        <Reveal delay={0.1}>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {CLASSES.map((c, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedClass(i)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                data-hover
                style={{
                  padding: '0.4rem 1.2rem',
                  borderRadius: '100px',
                  border: `1px solid ${i === selectedClass ? c.color : 'rgba(255,255,255,0.08)'}`,
                  background: i === selectedClass ? `${c.color}15` : 'transparent',
                  color: i === selectedClass ? c.color : 'rgba(255,255,255,0.3)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  cursor: 'none',
                  transition: 'all 0.3s',
                }}
              >
                {c.name}
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {CLASSES.map((c, i) => (
            <ClassCard key={c.id} cls={c} index={i} />
          ))}
        </div>
      </section>

      {/* ── FEATURED CLASS SPOTLIGHT ──────────────── */}
      <section style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
        position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(2rem, 5vw, 6rem)',
        alignItems: 'center',
      }}>
        <div>
          <Reveal>
            <Label color={cls.color}>SELECTED CLASS</Label>
            <div className="font-display" style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', color: cls.color, lineHeight: 0.88, textShadow: `0 0 60px ${cls.glow}` }}>
              <GlitchText text={cls.name} speed={35} />
            </div>
            <p style={{ marginTop: '1.5rem', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', opacity: 0.4, lineHeight: 1.8, maxWidth: '380px' }}>
              {cls.id === 'subcompact' && 'Sharp angular bursts. Perfect for the urban grid. Erratic, immediate, electric.'}
              {cls.id === 'compact'    && 'Structured velocity. A pulsing ring of electric blue. Engineered precision.'}
              {cls.id === 'sedan'      && 'Liquid silver motion. Organic wave displacement through space and time.'}
              {cls.id === 'luxury'     && 'Golden singularity. Orbiting particles of pure prestige. Beyond transportation.'}
            </p>
          </Reveal>

          <Reveal delay={0.2} style={{ marginTop: '2.5rem' }}>
            <PricingLayer basePrice={cls.price} color={cls.color} glow={cls.glow} />
          </Reveal>
        </div>

        <Reveal delay={0.1} style={{ position: 'relative', height: 'clamp(300px, 50vw, 500px)' }}>
          <div style={{ position: 'absolute', inset: '-15%', background: `radial-gradient(circle, ${cls.glow} 0%, transparent 60%)`, borderRadius: '50%', opacity: 0.8 }} />
          <ParticleField color={cls.color} shape={cls.shape} count={3500} size={0.02} speed={0.35} />
        </Reveal>
      </section>

      {/* ── LOCATIONS ─────────────────────────────── */}
      <section style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
        position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <Reveal>
          <LocationGraph />
        </Reveal>
      </section>

      {/* ── MANIFESTO / CTA ───────────────────────── */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <Reveal>
          <Label>MANIFESTO</Label>
          <h2 className="font-display" style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.02em' }}>
            <span style={{ display: 'block', color: '#fff' }}>THIS IS</span>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.12)' }}>NOT A</span>
            <span style={{ display: 'block', color: '#00f0ff', textShadow: '0 0 80px rgba(0,240,255,0.3)' }}>CAR RENTAL</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p style={{
            marginTop: '2.5rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            opacity: 0.35,
            maxWidth: '560px',
            lineHeight: 1.9,
            letterSpacing: '0.03em',
          }}>
            It is a statement. An experience built from particles, shaders, and physics. A digital installation that happens to move you from A to B.
          </p>
        </Reveal>

        <Reveal delay={0.3} style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 60px rgba(0,240,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              data-hover
              style={{
                padding: '1rem 3rem',
                borderRadius: '4px',
                border: 'none',
                background: '#00f0ff',
                color: '#000',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '0.2em',
                cursor: 'none',
              }}
            >
              ENTER THE FLEET
            </motion.button>
          </Link>
        </Reveal>

        {/* Footer strip */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          display: 'flex',
          gap: '2rem',
          opacity: 0.2,
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.55rem',
          letterSpacing: '0.3em',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {['PRIVACY', 'TERMS', 'CONTACT', 'AURA © 2026'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── useState hook for class selection ─────────── */
function useSelectedClass(): [number, (i: number) => void] {
  return useState<number>(0);
}
