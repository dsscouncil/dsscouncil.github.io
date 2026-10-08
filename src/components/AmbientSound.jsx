import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const STORAGE_KEY = 'dss-ambient-sound'

/**
 * Floating background-music control. Music is ON by default and playback is
 * attempted the moment the page loads, with no input from the visitor.
 * Pressing the button mutes it for good (the choice is remembered in
 * localStorage) and nothing is ever played while muted.
 *
 * Audible autoplay is not guaranteed: browsers only allow it once they trust
 * the site (Chrome's media-engagement rule, Safari on iOS needs a real
 * gesture). A refused play() is therefore normal, not an error - playback then
 * starts on the visitor's first click or keypress, which the listeners below
 * pick up.
 */
export default function AmbientSound() {
  const audioRef = useRef(null)
  // Audio is muted by default. It only plays after the visitor explicitly
  // presses the button; there is no audible autoplay on a fresh visit.
  // A past choice to leave the music on is remembered, so returning visitors
  // keep the sound level they picked last time.
  const [muted, setMuted] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      // Only a stored 'on' value re-enables sound. Anything else — no stored
      // value, or an explicit 'off' — starts muted.
      return stored !== 'on'
    } catch {
      return true
    }
  })

  useEffect(() => {
    // Absolute, not relative: the site now serves real URLs like /council, and
    // a './audio/...' path would resolve to /council/audio/... and 404.
    const el = new Audio('/audio/ambient-loop-v3.m4a')
    el.loop = true
    el.volume = 0.35
    // 'none' keeps the 1.2 MB track off the critical path: play() pulls it in
    // the moment playback is allowed. With 'auto' Chrome downloaded the whole
    // file on every page load, even on loads where playback was refused.
    el.preload = 'none'
    audioRef.current = el
    return () => {
      el.pause()
      el.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    try {
      localStorage.setItem(STORAGE_KEY, muted ? 'off' : 'on')
    } catch {
      /* private mode — preference just won't persist */
    }
    if (muted) el.pause()
  }, [muted])

  useEffect(() => {
    if (muted) return undefined
    const el = audioRef.current
    if (!el) return undefined

    // Audio starts only after the visitor has explicitly unmuted.
    // If the browser's autoplay policy still refuses the audible play(),
    // the gesture listeners below take over on the next click or keypress.
    const kick = () => {
      if (!muted) el.play().catch(() => {})
    }
    kick()
    window.addEventListener('pointerdown', kick)
    window.addEventListener('keydown', kick)
    return () => {
      window.removeEventListener('pointerdown', kick)
      window.removeEventListener('keydown', kick)
    }
  }, [muted])

  return (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      aria-pressed={!muted}
      aria-label={muted ? 'Turn background music on' : 'Turn background music off'}
      title={muted ? 'Play background music' : 'Mute background music'}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-navy-deep text-gold ring-1 ring-gold/40 shadow-lg shadow-navy/20 transition-all hover:bg-navy hover:ring-gold/70 hover:scale-105"
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  )
}
