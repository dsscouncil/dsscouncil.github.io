import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { LOGO, footerLinks } from '../data/content.js'
import { useAdmin } from '../admin/store.jsx'

export default function Footer() {
  const { data } = useAdmin()
  const email = data.settings.councilEmail
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="relative h-16 w-16 rounded-2xl bg-navy-deep shadow-[0_0_16px_hsl(39_53%_57%_0.35)]">
              <img
                src={LOGO}
                alt="Dubai Scholars Student Council"
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain p-2"
              />
            </div>
            <p className="mt-4 font-display text-lg font-semibold">&ldquo;By the Students. From the Students. For the Students.&rdquo;</p>
            <a
              href={`mailto:${email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors"
            >
              <Mail className="h-4 w-4 text-gold" />
              {email}
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {footerLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link to={l.href} className="text-sm text-white/70 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">Get Involved</h3>
            <ul className="space-y-2.5">
              <li><Link to="/student-voice" className="text-sm text-white/70 hover:text-gold transition-colors">Share Your Voice</Link></li>
              <li><Link to="/clubs" className="text-sm text-white/70 hover:text-gold transition-colors">Explore Clubs →</Link></li>
              <li><Link to="/events" className="text-sm text-white/70 hover:text-gold transition-colors">Upcoming Events →</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">© 2026 Dubai Scholars Secondary Student Council</p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-sm text-white/50 hover:text-gold transition-colors">Council Admin</Link>
            <p className="text-sm text-white/50">Official student leadership platform · Built by the Council</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
