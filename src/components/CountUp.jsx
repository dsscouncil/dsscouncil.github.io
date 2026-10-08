import { useEffect, useRef, useState } from 'react'

/**
 * Counts a number up from zero once its real value is known - the animated
 * figures the original hero had. Only the digits move: a suffix such as the
 * "%" in "100%" is kept exactly as it was written, and a value with no number
 * in it is rendered untouched.
 *
 * The count waits for the figure to actually scroll into view: an
 * IntersectionObserver holds the number at zero until it is well inside the
 * viewport, so visitors who land on the page do not miss the animation and
 * those who scroll down later catch it in full.
 *
 * Nothing that cannot be counted is animated, so the starting figure is worked
 * out while rendering: a value with no digits, a target of zero (there is
 * nothing to count up to) and a visitor whose system asks for reduced motion
 * all begin - and therefore finish - on the real figure.
 */
export default function CountUp({ value, duration = 3000 }) {
  const match = String(value ?? '').match(/^(\d+)(.*)$/)
  const hasNumber = Boolean(match)
  const target = hasNumber ? Number(match[1]) : 0
  const suffix = hasNumber ? match[2] : ''
  const reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const counts = hasNumber && target > 0 && !reducedMotion
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [shown, setShown] = useState(() => (counts ? 0 : target))

  // Hold at zero until the figure itself scrolls into the viewport.
  useEffect(() => {
    if (!counts || inView) return undefined
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return undefined
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      // Half the figure visible before the count begins.
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [counts, inView])

  useEffect(() => {
    if (!counts || !inView) return undefined
    let frame = 0
    const startedAt = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - startedAt) / duration)
      // easeInOutCubic: eases in, counts steadily through the middle, then
      // settles gently on the figure.
      const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
      setShown(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [counts, inView, target, duration])

  if (!hasNumber) return <>{value}</>
  return <span ref={ref}>{shown}{suffix}</span>
}
