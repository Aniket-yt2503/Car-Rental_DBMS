'use client';
import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

interface Props {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  trigger?: boolean;  // when true, starts animation
  speed?: number;     // ms per iteration
  iterations?: number;
}

export default function GlitchText({
  text,
  className = '',
  style = {},
  trigger = true,
  speed = 50,
  iterations = 12,
}: Props) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!trigger) return;
    let count = 0;
    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (count / iterations > i / text.length) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      count++;
      if (count > iterations + text.length) {
        setDisplay(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, trigger, speed, iterations]);

  // Re-trigger on hover
  const handleHover = () => {
    let count = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (count / iterations > i / text.length) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      count++;
      if (count > iterations + text.length) {
        setDisplay(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);
  };

  return (
    <span
      className={`glitch-text ${className}`}
      data-text={display}
      style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', ...style }}
      onMouseEnter={handleHover}
    >
      {display}
    </span>
  );
}
