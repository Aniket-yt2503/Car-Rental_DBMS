'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
import ParticleField from './ParticleField';

const CLASSES = [
  {
    id: 'subcompact',
    name: 'SUBCOMPACT',
    tagline: 'URBAN LIGHTNING',
    color: '#FF2D55',
    glow: 'rgba(255,45,85,0.25)',
    shape: 'cloud' as const,
    cars: [
      { make: 'Toyota', model: 'Yaris', year: 2024, color: 'Plasma Red', odometer: '12,400 km', fuel: 72 },
      { make: 'Honda',  model: 'Fit',   year: 2023, color: 'Storm Black', odometer: '8,100 km',  fuel: 91 },
      { make: 'Hyundai',model: 'i20',  year: 2024, color: 'Arctic White',odometer: '5,200 km',  fuel: 88 },
    ],
    pricePerDay: 28,
    description: 'Sharp. Erratic. Immediate. Built for the grid.',
  },
  {
    id: 'compact',
    name: 'COMPACT',
    tagline: 'STRUCTURED VELOCITY',
    color: '#00D4FF',
    glow: 'rgba(0,212,255,0.25)',
    shape: 'ring' as const,
    cars: [
      { make: 'Honda',   model: 'Civic',    year: 2024, color: 'Aegean Blue',  odometer: '18,500 km', fuel: 65 },
      { make: 'Mazda',   model: 'Mazda3',   year: 2024, color: 'Zircon Sand',  odometer: '21,000 km', fuel: 55 },
      { make: 'Toyota',  model: 'Corolla',  year: 2023, color: 'Meteor Gray',  odometer: '31,200 km', fuel: 80 },
    ],
    pricePerDay: 42,
    description: 'Precision grid. Controlled chaos. Engineered flow.',
  },
  {
    id: 'sedan',
    name: 'SEDAN',
    tagline: 'LIQUID MOTION',
    color: '#C0C8D8',
    glow: 'rgba(192,200,216,0.25)',
    shape: 'sphere' as const,
    cars: [
      { make: 'BMW',     model: '3 Series',  year: 2024, color: 'Alpine White', odometer: '9,800 km',  fuel: 78 },
      { make: 'Audi',    model: 'A4',        year: 2024, color: 'Daytona Gray', odometer: '14,200 km', fuel: 62 },
      { make: 'Mercedes',model: 'C-Class',   year: 2023, color: 'Obsidian Black',odometer:'22,100 km', fuel: 70 },
    ],
    pricePerDay: 75,
    description: 'Fluid. Organic. Silver wave through space.',
  },
  {
    id: 'luxury',
    name: 'LUXURY',
    tagline: 'GOLDEN SINGULARITY',
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.25)',
    shape: 'helix' as const,
    cars: [
      { make: 'Porsche',  model: 'Panamera', year: 2024, color: 'Gold Metallic',  odometer: '4,100 km',  fuel: 95 },
      { make: 'Bentley',  model: 'Flying Spur',year:2023,color:'Midnight Emerald',odometer: '2,800 km',  fuel: 88 },
      { make: 'Maserati', model: 'Ghibli',   year: 2024, color: 'Bianco Icaro',   odometer: '6,500 km',  fuel: 97 },
    ],
    pricePerDay: 180,
    description: 'Orbiting particles of gold. Beyond transport.',
    hasPromo: true,
  },
];

export default function FleetExplorer() {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [hovered, setHovered]           = useState(-1);
  const [carIndex,  setCarIndex]        = useState(0);
  const [dragStart, setDragStart]       = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = CLASSES[activeIndex];
  const car    = active.cars[carIndex];

  /* ── Navigate ─────────────────────────────────── */
  const goTo = (idx: number) => {
    setActiveIndex((idx + CLASSES.length) % CLASSES.length);
    setCarIndex(0);
  };

  /* ── Drag / Swipe ─────────────────────────────── */
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(x);
  };
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStart === null) return;
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const delta = x - dragStart;
    if (Math.abs(delta) > 60) goTo(activeIndex + (delta < 0 ? 1 : -1));
    setDragStart(null);
  };

  const fuelBar = (pct: number, color: string) => (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '100%', background: color, boxShadow: `0 0 8px ${color}` }}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
      onTouchStart={onDragStart}
      onTouchEnd={onDragEnd}
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* ── CLASS TABS ──────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.25rem',
        zIndex: 10,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '100px',
        padding: '0.3rem',
      }}>
        {CLASSES.map((cls, i) => (
          <motion.button
            key={cls.id}
            onClick={() => goTo(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '0.4rem 1.1rem',
              borderRadius: '100px',
              border: 'none',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              fontWeight: 700,
              cursor: 'none',
              transition: 'all 0.3s',
              background: i === activeIndex ? cls.color : 'transparent',
              color: i === activeIndex ? '#000' : 'rgba(255,255,255,0.4)',
              boxShadow: i === activeIndex ? `0 0 20px ${cls.glow}` : 'none',
            }}
          >
            {cls.name}
          </motion.button>
        ))}
      </div>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* LEFT: Particle Identity */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem 4rem 4rem',
          borderRight: `1px solid ${active.color}15`,
        }}>
          {/* Promotion badge */}
          {active.hasPromo && (
            <motion.div
              className="promo-active"
              style={{
                position: 'absolute', top: '7rem', right: '2rem',
                background: `${active.color}20`,
                border: `1px solid ${active.color}`,
                borderRadius: '4px',
                padding: '0.2rem 0.6rem',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                color: active.color,
                textTransform: 'uppercase',
              }}
            >
              ⚡ PROMO ACTIVE — 20% OFF
            </motion.div>
          )}

          {/* Particle Visualization */}
          <div style={{ width: '340px', height: '340px', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -40,
              background: `radial-gradient(circle, ${active.glow} 0%, transparent 70%)`,
              borderRadius: '50%',
            }} />
            <ParticleField
              color={active.color}
              shape={active.shape}
              count={2500}
              size={0.02}
              speed={0.4}
            />
          </div>

          {/* Class Name */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div className="text-label" style={{ marginBottom: '0.5rem', color: active.color }}>
              CLASS IDENTITY
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                color: active.color,
                textShadow: `0 0 40px ${active.glow}`,
                lineHeight: 1,
              }}
            >
              <GlitchText text={active.name} />
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              opacity: 0.4,
              marginTop: '0.5rem',
            }}>
              {active.tagline}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div className="text-label">FROM / DAY</div>
            <motion.div
              key={`price-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '3.5rem',
                fontFamily: "'Bebas Neue', sans-serif",
                color: active.color,
                lineHeight: 1,
                letterSpacing: '0.05em',
              }}
            >
              ${active.hasPromo ? Math.round(active.pricePerDay * 0.8) : active.pricePerDay}
            </motion.div>
            {active.hasPromo && (
              <div style={{ textDecoration: 'line-through', opacity: 0.4, fontSize: '0.9rem' }}>
                ${active.pricePerDay}
              </div>
            )}
          </div>

          {/* Description */}
          <p style={{
            marginTop: '1.5rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.85rem',
            opacity: 0.4,
            textAlign: 'center',
            maxWidth: '280px',
            lineHeight: 1.6,
          }}>
            {active.description}
          </p>
        </div>

        {/* RIGHT: Car Selection */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '8rem 4rem 4rem',
          gap: '1.5rem',
        }}>
          <div className="text-label" style={{ color: active.color }}>SELECT VEHICLE</div>

          {active.cars.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 8, scale: 1.01 }}
              onClick={() => setCarIndex(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(-1)}
              data-hover
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${i === carIndex ? active.color : 'rgba(255,255,255,0.06)'}`,
                background: i === carIndex
                  ? `${active.color}0a`
                  : 'rgba(255,255,255,0.02)',
                cursor: 'none',
                transition: 'all 0.3s',
                boxShadow: i === carIndex ? `0 0 30px ${active.glow}` : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: i === carIndex ? active.color : '#fff',
                  }}>
                    {c.year} {c.make} {c.model}
                  </div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.6rem',
                    opacity: 0.4,
                    letterSpacing: '0.15em',
                    marginTop: '0.25rem',
                  }}>
                    {c.color}
                  </div>
                </div>
                {i === carIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: active.color,
                      boxShadow: `0 0 12px ${active.color}`,
                    }}
                  />
                )}
              </div>

              {/* Stats */}
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div className="text-label">ODOMETER</div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.75rem',
                    marginTop: '0.25rem',
                    opacity: 0.7,
                  }}>{c.odometer}</div>
                </div>
                <div>
                  <div className="text-label" style={{ marginBottom: '0.5rem' }}>
                    FUEL {c.fuel}%
                  </div>
                  {fuelBar(c.fuel, active.color)}
                </div>
              </div>
            </motion.div>
          ))}

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: `0 0 40px ${active.glow}` }}
            whileTap={{ scale: 0.97 }}
            data-hover
            style={{
              marginTop: '1rem',
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: `1px solid ${active.color}`,
              background: 'transparent',
              color: active.color,
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: 'none',
              transition: 'all 0.3s',
            }}
          >
            RESERVE {car.make} {car.model}
          </motion.button>

          {/* Upgrade suggestion */}
          {activeIndex < CLASSES.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => goTo(activeIndex + 1)}
              data-hover
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: `${CLASSES[activeIndex + 1].color}08`,
                border: `1px solid ${CLASSES[activeIndex + 1].color}30`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'none',
              }}
            >
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', opacity: 0.5, letterSpacing: '0.15em' }}>
                UPGRADE TO
              </span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: CLASSES[activeIndex + 1].color, letterSpacing: '0.1em' }}>
                {CLASSES[activeIndex + 1].name} →
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── NAVIGATION ARROWS ───────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '1rem',
        zIndex: 10,
      }}>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => goTo(activeIndex - 1)}
          data-hover
          style={{
            width: 48, height: 48,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </motion.button>

        {/* Indicators */}
        {CLASSES.map((cls, i) => (
          <motion.div
            key={i}
            onClick={() => goTo(i)}
            data-hover
            animate={{
              width: i === activeIndex ? 32 : 8,
              background: i === activeIndex ? cls.color : 'rgba(255,255,255,0.2)',
            }}
            style={{
              height: 8, borderRadius: 4,
              cursor: 'none',
              alignSelf: 'center',
            }}
          />
        ))}

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => goTo(activeIndex + 1)}
          data-hover
          style={{
            width: 48, height: 48,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          →
        </motion.button>
      </div>
    </div>
  );
}
