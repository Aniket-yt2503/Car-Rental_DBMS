'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const FINAL = 'AURA';

function scramble(target: string, progress: number): string {
  return target
    .split('')
    .map((char, i) => {
      if (i < Math.floor(progress * target.length)) return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join('');
}

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState('????');
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const duration = 2200;

    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      setText(scramble(FINAL, p));

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setText(FINAL);
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 800);
        }, 400);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="loading-screen"
        >
          {/* Particle lines */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.1 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: 0,
                  width: 1,
                  height: `${20 + Math.random() * 30}%`,
                  background: 'linear-gradient(to bottom, transparent, #00f0ff, transparent)',
                }}
                animate={{ y: ['0%', '100vh'] }}
                transition={{
                  duration: 1.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

          {/* Main text */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(6rem, 20vw, 18rem)',
                lineHeight: 1,
                letterSpacing: '0.1em',
                color: '#fff',
                textShadow: '0 0 40px rgba(0,240,255,0.6), 0 0 120px rgba(0,240,255,0.2)',
                fontVariantNumeric: 'tabular-nums',
                minWidth: '4ch',
              }}
            >
              {text}
            </div>

            {/* Progress bar */}
            <div style={{
              marginTop: '2rem',
              height: 1,
              width: '20rem',
              background: 'rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00f0ff, #8b00ff)',
                  boxShadow: '0 0 10px #00f0ff',
                  width: `${progress * 100}%`,
                }}
              />
            </div>

            <p style={{
              marginTop: '1.5rem',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              opacity: 0.3,
              color: '#fff',
            }}>
              INITIALIZING MOBILITY EXPERIENCE
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
