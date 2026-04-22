import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '../context/AppContext.jsx';

/**
 * Initializes Lenis smooth scroll, wires it to GSAP's RAF loop,
 * and stores the instance in AppContext via SET_LENIS.
 * Requirements: 13.1, 13.2
 */
export function useLenis() {
  const { dispatch } = useAppContext();
  const lenisRef = useRef(null);

  useEffect(() => {
    // SSR safety
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis;

    // Wire Lenis into GSAP's ticker so ScrollTrigger stays in sync
    const onTick = (time) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    dispatch({ type: 'SET_LENIS', payload: lenis });

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      dispatch({ type: 'SET_LENIS', payload: null });
    };
  }, [dispatch]);

  return lenisRef.current;
}

export default useLenis;
