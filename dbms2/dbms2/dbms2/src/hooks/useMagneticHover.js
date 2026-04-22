import { useRef, useState, useCallback } from 'react';

/**
 * Applies a magnetic pull effect to an element when the pointer
 * moves within a given radius of its center.
 * Requirements: 2.6
 *
 * @param {object} params
 * @param {number} [params.strength=0.3] - How strongly the element follows the cursor (0–1)
 * @param {number} [params.radius=100]   - Pixel radius within which the effect activates
 * @returns {{ ref: React.RefObject, style: React.CSSProperties }}
 */
export function useMagneticHover({ strength = 0.3, radius = 100 } = {}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        setPosition({ x: dx * strength, y: dy * strength });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  // Attach listeners via the ref callback pattern so consumers just spread ref
  const setRef = useCallback(
    (node) => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      ref.current = node;
      if (node) {
        node.addEventListener('mousemove', handleMouseMove);
        node.addEventListener('mouseleave', handleMouseLeave);
      }
    },
    [handleMouseMove, handleMouseLeave]
  );

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: 'transform 0.3s ease-out',
    willChange: 'transform',
  };

  return { ref: setRef, style };
}

export default useMagneticHover;
