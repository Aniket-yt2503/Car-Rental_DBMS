'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = [
  { id: 'NYC',  name: 'New York',     x: 72, y: 35 },
  { id: 'MIA',  name: 'Miami',        x: 65, y: 70 },
  { id: 'LAX',  name: 'Los Angeles',  x: 15, y: 45 },
  { id: 'CHI',  name: 'Chicago',      x: 58, y: 28 },
  { id: 'SEA',  name: 'Seattle',      x: 12, y: 18 },
  { id: 'DEN',  name: 'Denver',       x: 38, y: 38 },
  { id: 'ATL',  name: 'Atlanta',      x: 62, y: 58 },
  { id: 'LAS',  name: 'Las Vegas',    x: 22, y: 48 },
  { id: 'HOU',  name: 'Houston',      x: 48, y: 68 },
  { id: 'PHX',  name: 'Phoenix',      x: 26, y: 55 },
];

const ROUTES = [
  { from: 'NYC', to: 'MIA', price: 280 },
  { from: 'LAX', to: 'NYC', price: 520 },
  { from: 'CHI', to: 'ATL', price: 190 },
  { from: 'SEA', to: 'LAX', price: 210 },
  { from: 'DEN', to: 'CHI', price: 175 },
  { from: 'LAS', to: 'PHX', price: 95 },
  { from: 'HOU', to: 'MIA', price: 230 },
  { from: 'ATL', to: 'NYC', price: 310 },
];

export default function LocationGraph() {
  const [pickup,  setPickup]  = useState<string | null>(null);
  const [dropoff, setDropoff] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activePrice, setActivePrice] = useState<number | null>(null);
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const getRoute = () =>
    ROUTES.find(
      r => (r.from === pickup && r.to === dropoff) || (r.from === dropoff && r.to === pickup)
    );

  useEffect(() => {
    const route = getRoute();
    if (route) {
      setActivePrice(route.price);
      let start = 0;
      const target = route.price;
      const duration = 1200;
      const startTime = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setAnimatedPrice(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } else {
      setActivePrice(null);
      setAnimatedPrice(0);
    }
  }, [pickup, dropoff]);

  const handleNodeClick = (id: string) => {
    if (!pickup)         { setPickup(id); return; }
    if (id === pickup)   { setPickup(null); setDropoff(null); return; }
    if (!dropoff)        { setDropoff(id); return; }
    setPickup(id); setDropoff(null);
  };

  const getNode = (id: string) => LOCATIONS.find(l => l.id === id)!;

  return (
    <div style={{ width: '100%', padding: '2rem', position: 'relative' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="text-label" style={{ color: 'rgba(0,240,255,0.6)', marginBottom: '0.5rem' }}>
          NETWORK / NODES
        </div>
        <h3 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.05em' }}>
          LOCATION MESH
        </h3>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', opacity: 0.3, marginTop: '0.5rem', letterSpacing: '0.2em' }}>
          SELECT PICKUP → SELECT DROP-OFF
        </p>
      </div>

      {/* Graph */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '45%' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 50"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#00f0ff" opacity="0.6" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5}
              stroke="rgba(255,255,255,0.025)" strokeWidth="0.1" />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="50"
              stroke="rgba(255,255,255,0.025)" strokeWidth="0.1" />
          ))}

          {/* Default gentle route lines */}
          {ROUTES.map((r, i) => {
            const from = getNode(r.from);
            const to   = getNode(r.to);
            const isActive = (r.from === pickup && r.to === dropoff) ||
                             (r.from === dropoff && r.to === pickup);
            return (
              <line key={i}
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
                stroke={isActive ? '#00f0ff' : 'rgba(0,240,255,0.07)'}
                strokeWidth={isActive ? 0.4 : 0.15}
                strokeDasharray={isActive ? '0' : '0.5 0.5'}
                markerEnd={isActive ? 'url(#arrow)' : undefined}
                style={{ transition: 'all 0.4s', filter: isActive ? 'url(#glow)' : 'none' }}
              />
            );
          })}

          {/* Active route animated dash */}
          {pickup && dropoff && (() => {
            const from = getNode(pickup);
            const to   = getNode(dropoff);
            return (
              <line
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="rgba(0,240,255,0.3)"
                strokeWidth="0.6"
                strokeDasharray="2 1"
                style={{
                  animation: 'lineDraw 2s ease forwards',
                  strokeDashoffset: 0,
                }}
              />
            );
          })()}

          {/* Nodes */}
          {LOCATIONS.map(loc => {
            const isPickup  = loc.id === pickup;
            const isDropoff = loc.id === dropoff;
            const isHovered = loc.id === hoveredNode;
            const color = isPickup ? '#00f0ff' : isDropoff ? '#ffd700' : 'rgba(255,255,255,0.5)';

            return (
              <g key={loc.id}
                onClick={() => handleNodeClick(loc.id)}
                onMouseEnter={() => setHoveredNode(loc.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'none' }}
              >
                {/* Pulse ring */}
                <circle
                  cx={loc.x} cy={loc.y} r="2.5"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.2"
                  opacity={0.3}
                  className="node-pulse"
                />
                {/* Core */}
                <circle
                  cx={loc.x} cy={loc.y}
                  r={isPickup || isDropoff ? 1.2 : isHovered ? 1.0 : 0.7}
                  fill={color}
                  filter="url(#glow)"
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Label */}
                <text
                  x={loc.x} y={loc.y - 2.2}
                  fill={color}
                  fontSize="1.5"
                  fontFamily="'Space Mono', monospace"
                  textAnchor="middle"
                  opacity={isPickup || isDropoff || isHovered ? 1 : 0.35}
                  style={{ transition: 'opacity 0.2s', letterSpacing: '0.1em' }}
                >
                  {loc.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Price Display */}
      <AnimatePresence>
        {pickup && dropoff && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: '2rem',
              textAlign: 'center',
              padding: '1.5rem',
              border: '1px solid rgba(0,240,255,0.15)',
              borderRadius: '12px',
              background: 'rgba(0,240,255,0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="text-label" style={{ marginBottom: '0.5rem' }}>
              {pickup} → {dropoff} DROP-OFF PREMIUM
            </div>
            <div className="font-display neon-cyan" style={{ fontSize: '3rem', letterSpacing: '0.05em' }}>
              +${activePrice !== null ? animatedPrice : '—'}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', opacity: 0.35, marginTop: '0.5rem' }}>
              DISTANCE-BASED CALCULATION · APPLIED AT CHECKOUT
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              data-hover
              onClick={() => { setPickup(null); setDropoff(null); }}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1.5rem',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                cursor: 'none',
              }}
            >
              RESET ROUTE
            </motion.button>
          </motion.div>
        )}

        {pickup && !dropoff && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              opacity: 0.4,
            }}
          >
            PICKUP: <span style={{ color: '#00f0ff' }}>{pickup}</span> → SELECT DROP-OFF NODE
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
