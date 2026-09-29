import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { LOGO, navLinks } from '../data/content.js'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <nav className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-20 py-3 items-center justify-between">
          <Link to="/" className="flex items-center group" aria-label="Dubai Scholars Student Council">
            <div className="relative h-14 w-14 rounded-xl bg-navy-deep shadow-[0_0_12px_hsl(39_53%_57%_0.35)]">
              <img
                src={LOGO}
                alt="Dubai Scholars Student Council"
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain p-1.5"
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((l) => (
              <NavLink
                key={l.href}
                to={l.href}
                end={l.href === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-navy/70 hover:text-navy'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student-voice"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-all shadow-[0_0_14px_2px_hsl(39_53%_57%/0.4)] hover:shadow-[0_0_20px_4px_hsl(39_53%_57%/0.6)]"
            >
              Share Your Voice
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full text-navy hover:bg-surface transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="mx-auto max-w-7xl px-5 mt-2 pb-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.href}
                to={l.href}
                end={l.href === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-surface text-gold' : 'text-navy/80 hover:bg-surface'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
