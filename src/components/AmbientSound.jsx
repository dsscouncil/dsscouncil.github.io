import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const STORAGE_KEY = 'dss-ambient-sound'

/**
 * Floating background-music control. Browsers only allow audio to start
 * after the visitor's first interaction, so playback kicks in on the first
 * click/keypress unless the visitor muted it previously (remembered in
 * localStorage). The 48s loop is seamless and stays quiet by design.
 */
export default function AmbientSound() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'off'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const el = new Audio('./audio/ambient-loop-v3.m4a')
    el.loop = true
    el.volume = 0.35
    el.preload = 'auto'
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
    if (muted) {
      el.pause()
      return
    }
    // Called outside a gesture on load: rejected until first interaction,
    // where the window listeners below retry it.
    el.play().catch(() => {})
  }, [muted])

  useEffect(() => {
    if (muted) return undefined
    const kick = () => {
      const el = audioRef.current
      if (el) el.play().catch(() => {})
    }
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
