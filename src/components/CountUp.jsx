import { useEffect, useState } from 'react'

/**
 * Counts a number up from zero once its real value is known - the animated
 * figures the original hero had. Only the digits move: a suffix such as the
 * "%" in "100%" is kept exactly as it was written, and a value with no number
 * in it is rendered untouched.
 *
 * Nothing that cannot be counted is animated, so the starting figure is worked
 * out while rendering: a value with no digits, a target of zero (there is
 * nothing to count up to) and a visitor whose system asks for reduced motion
 * all begin - and therefore finish - on the real figure.
 */
export default function CountUp({ value, duration = 1200 }) {
  const match = String(value ?? '').match(/^(\d+)(.*)$/)
  const hasNumber = Boolean(match)
  const target = hasNumber ? Number(match[1]) : 0
  const suffix = hasNumber ? match[2] : ''
  const reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const counts = hasNumber && target > 0 && !reducedMotion
  const [shown, setShown] = useState(() => (counts ? 0 : target))

  useEffect(() => {
    if (!counts) return undefined
    let frame = 0
    const startedAt = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - startedAt) / duration)
      // easeOutCubic: quick off the line, then settling gently on the figure.
      setShown(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [counts, target, duration])

  if (!hasNumber) return <>{value}</>
  return <>{shown}{suffix}</>
}
