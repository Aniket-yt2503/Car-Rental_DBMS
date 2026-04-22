import { useRef, useCallback } from 'react'

/**
 * 3D tilt effect — uses RAF + direct DOM style mutation.
 * Zero React re-renders on mousemove.
 */
export function useTilt({ maxTilt = 12, perspective = 1000, scale = 1.03 } = {}) {
  const ref = useRef(null)
  const rafRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const rX = -y * maxTilt * 2
      const rY = x * maxTilt * 2
      ref.current.style.transform = `perspective(${perspective}px) rotateX(${rX}deg) rotateY(${rY}deg) scale(${scale})`
      ref.current.style.transition = 'none'
    })
  }, [maxTilt, perspective, scale])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (!ref.current) return
    ref.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
    ref.current.style.transition = 'transform 350ms cubic-bezier(0.22,1,0.36,1)'
  }, [perspective])

  const setRef = useCallback((node) => {
    if (ref.current) {
      ref.current.removeEventListener('mousemove', handleMouseMove)
      ref.current.removeEventListener('mouseleave', handleMouseLeave)
    }
    ref.current = node
    if (node) {
      node.addEventListener('mousemove', handleMouseMove, { passive: true })
      node.addEventListener('mouseleave', handleMouseLeave, { passive: true })
      node.style.willChange = 'transform'
    }
  }, [handleMouseMove, handleMouseLeave])

  return { ref: setRef, style: {} }
}

export default useTilt
