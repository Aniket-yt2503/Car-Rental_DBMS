import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Creates a GSAP ScrollTrigger instance tied to a ref element.
 * Automatically kills the trigger on unmount.
 * Requirements: 13.2, 13.3
 *
 * @param {object} params
 * @param {React.RefObject} params.ref        - Ref attached to the trigger/target element
 * @param {gsap.core.Tween|gsap.core.Timeline} params.animation - GSAP animation to control
 * @param {Element|string} [params.trigger]   - Trigger element (defaults to ref.current)
 * @param {string} [params.start='top 80%']   - ScrollTrigger start position
 * @param {string} [params.end='bottom 20%']  - ScrollTrigger end position
 * @param {boolean|number} [params.scrub]     - Scrub value (true, false, or number)
 * @param {boolean} [params.markers]          - Show debug markers
 * @returns {React.MutableRefObject<ScrollTrigger|null>} - Ref holding the ST instance
 */
export function useScrollTrigger({
  ref,
  animation,
  trigger,
  start = 'top 80%',
  end = 'bottom 20%',
  scrub,
  markers = false,
} = {}) {
  const stRef = useRef(null);

  useEffect(() => {
    // SSR safety
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const triggerEl = trigger ?? ref?.current;
    if (!triggerEl) return;

    stRef.current = ScrollTrigger.create({
      trigger: triggerEl,
      animation,
      start,
      end,
      scrub,
      markers,
    });

    return () => {
      stRef.current?.kill();
      stRef.current = null;
    };
  }, [ref, animation, trigger, start, end, scrub, markers]);

  return stRef.current;
}

export default useScrollTrigger;
