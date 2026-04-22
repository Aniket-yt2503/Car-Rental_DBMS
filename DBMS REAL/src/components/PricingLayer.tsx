'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Tier {
  label: string;
  days: number;
  multiplier: number;
}

const TIERS: Tier[] = [
  { label: '1 DAY',  days: 1,  multiplier: 1.0 },
  { label: '3 DAYS', days: 3,  multiplier: 0.92 },
  { label: '1 WEEK', days: 7,  multiplier: 0.82 },
  { label: '2 WEEKS',days: 14, multiplier: 0.72 },
];

const EXTRAS = [
  { label: 'INSURANCE',   cost: 12 },
  { label: 'GPS MODULE',  cost: 8  },
  { label: 'DRIVER ASSIST',cost: 18 },
];

interface Props {
  basePrice: number;
  color: string;
  glow: string;
  className?: string;
}

function useCounter(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from  = val;
    const tick  = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      setVal(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

export default function PricingLayer({ basePrice, color, glow, className = '' }: Props) {
  const [selectedTier,   setSelectedTier]   = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });

  const tier       = TIERS[selectedTier];
  const extrasTotal = selectedExtras.reduce((sum, i) => sum + EXTRAS[i].cost, 0);
  const rawTotal    = basePrice * tier.days * tier.multiplier + extrasTotal * tier.days;
  const finalPrice  = useCounter(Math.round(rawTotal), 700);

  const toggleExtra = (i: number) => {
    setSelectedExtras(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  return (
    <div ref={ref} className={className} style={{ width: '100%' }}>
      {/* ── Duration Tiers ─────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="text-label" style={{ marginBottom: '1rem', color }}>RENTAL DURATION</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {TIERS.map((t, i) => (
            <motion.button
              key={i}
              onClick={() => setSelectedTier(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              data-hover
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '6px',
                border: `1px solid ${i === selectedTier ? color : 'rgba(255,255,255,0.1)'}`,
                background: i === selectedTier ? `${color}15` : 'transparent',
                color: i === selectedTier ? color : 'rgba(255,255,255,0.4)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                cursor: 'none',
                transition: 'all 0.25s',
                boxShadow: i === selectedTier ? `0 0 20px ${glow}` : 'none',
              }}
            >
              {t.label}
              {t.multiplier < 1 && (
                <span style={{ marginLeft: '0.4rem', opacity: 0.6, fontSize: '0.55rem' }}>
                  -{Math.round((1 - t.multiplier) * 100)}%
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Expanding Price Rings ────────────────────── */}
      <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '2rem' }}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={inView ? {
              width:  `${(i + 1) * 22}%`,
              height: `${(i + 1) * 22}%`,
              opacity: 0.06 - i * 0.012,
            } : { width: 0, height: 0, opacity: 0 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              border: `1px solid ${color}`,
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Center price display */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 2,
        }}>
          <div className="text-label" style={{ marginBottom: '0.3rem' }}>TOTAL ESTIMATE</div>
          <motion.div
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color,
              textShadow: `0 0 30px ${glow}`,
              letterSpacing: '0.05em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${finalPrice}
          </motion.div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            opacity: 0.3,
            letterSpacing: '0.15em',
          }}>
            {tier.days} DAY{tier.days > 1 ? 'S' : ''} · {Math.round(basePrice * tier.multiplier)}/DAY BASE
          </div>
        </div>
      </div>

      {/* ── Extras ───────────────────────────────────── */}
      <div>
        <div className="text-label" style={{ marginBottom: '0.75rem', color }}>ADD-ONS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {EXTRAS.map((ex, i) => {
            const active = selectedExtras.includes(i);
            return (
              <motion.div
                key={i}
                onClick={() => toggleExtra(i)}
                whileHover={{ x: 4 }}
                data-hover
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.06)'}`,
                  background: active ? `${color}08` : 'transparent',
                  cursor: 'none',
                  transition: 'all 0.25s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 14, height: 14,
                    borderRadius: '3px',
                    border: `1px solid ${active ? color : 'rgba(255,255,255,0.2)'}`,
                    background: active ? color : 'transparent',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: active ? color : 'rgba(255,255,255,0.5)',
                  }}>
                    {ex.label}
                  </span>
                </div>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.65rem',
                  color: active ? color : 'rgba(255,255,255,0.3)',
                }}>
                  +${ex.cost}/day
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Price Breakdown */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.4, marginBottom: '0.4rem' }}>
          <span>BASE × {tier.days} days</span>
          <span>${Math.round(basePrice * tier.multiplier * tier.days)}</span>
        </div>
        {selectedExtras.map(i => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.4, marginBottom: '0.4rem' }}>
            <span>{EXTRAS[i].label} × {tier.days} days</span>
            <span>${EXTRAS[i].cost * tier.days}</span>
          </div>
        ))}
        <div style={{ height: 1, background: `${color}20`, margin: '0.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', color }}>
          <span>TOTAL</span>
          <span>${finalPrice}</span>
        </div>
      </div>
    </div>
  );
}
