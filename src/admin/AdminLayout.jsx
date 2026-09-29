import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutGrid, MessageSquareHeart, Users, Megaphone, CalendarDays, UsersRound,
  MoreHorizontal, ChevronDown, ChevronUp, Newspaper, FileText, Target, Quote, Settings,
  LogOut, ExternalLink, Mail,
} from 'lucide-react'
import { useAdmin } from './store.jsx'
import { LOGO } from '../data/content.js'

export default function AdminLayout() {
  const { data, session, logout } = useAdmin()
  const [moreOpen, setMoreOpen] = useState(true)
  const navigate = useNavigate()

  const main = [
    { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/admin/voice', label: 'Student Voice', icon: MessageSquareHeart, count: data.submissions.length },
    { to: '/admin/members', label: 'Council Members', icon: Users, count: data.members.length },
    { to: '/admin/initiatives', label: 'Initiatives', icon: Megaphone, count: data.initiatives.length },
    { to: '/admin/events', label: 'Events', icon: CalendarDays, count: data.events.length },
    { to: '/admin/clubs', label: 'Clubs', icon: UsersRound, count: data.clubs.length },
  ]
  const more = [
    { to: '/admin/contact-messages', label: 'Contact Messages', icon: Mail, count: data.contactMessages.length },
    { to: '/admin/news', label: 'News', icon: Newspaper, count: data.news.length },
    { to: '/admin/documents', label: 'Documents', icon: FileText, count: data.documents.length },
    { to: '/admin/circle-quotes', label: 'Circle Quotes', icon: Target, count: data.circleQuotes.length },
    { to: '/admin/leadership-messages', label: 'Leadership Messages', icon: Quote, count: data.leadershipMessages.length },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const itemCls = (active) =>
    `flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
      active ? 'bg-gold text-navy' : 'text-white/75 hover:bg-white/10 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" title="Back to main website" className="inline-block h-10 w-10 rounded-lg bg-navy-deep shadow-[0_0_8px_hsl(39_53%_57%_0.35)]">
              <img src={LOGO} alt="Council logo — back to main website" className="h-full w-full object-contain p-1" />
            </Link>
            <Link to="/admin" className="leading-tight">
              <span className="block font-display text-lg font-bold text-navy">Governor&rsquo;s Console</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Council Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {session ? (session.name || session.username) : 'Admin'}
            </span>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-8 px-5 py-8 lg:px-8">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-fit w-72 shrink-0 rounded-3xl bg-navy-deep p-5 lg:block">
          <div className="px-3 pb-4 pt-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">Governor&rsquo;s Console</div>
            <div className="mt-0.5 font-display text-lg font-bold text-gold">Admin Dashboard</div>
          </div>
          <nav className="space-y-1">
            {main.map(({ to, label, icon: Icon, count, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => itemCls(isActive)}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon className="h-[18px] w-[18px]" />
                      {label}
                    </span>
                    {count !== undefined && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive ? 'bg-navy/20 text-navy' : 'bg-white/10 text-white/70'}`}>{count}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <button onClick={() => setMoreOpen(!moreOpen)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white transition-colors">
              <span className="flex items-center gap-3"><MoreHorizontal className="h-[18px] w-[18px]" /> More</span>
              {moreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {moreOpen && more.map(({ to, label, icon: Icon, count }) => (
              <NavLink key={to} to={to} className={({ isActive }) => itemCls(isActive)}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon className="h-[18px] w-[18px]" />
                      {label}
                    </span>
                    {count !== undefined && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive ? 'bg-navy/20 text-navy' : 'bg-white/10 text-white/70'}`}>{count}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 border-t border-white/10 pt-4 space-y-1">
            <Link to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white transition-colors">
              <ExternalLink className="h-[18px] w-[18px]" /> View Site
            </Link>
            <button onClick={() => { logout(); navigate('/') }} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white transition-colors">
              <LogOut className="h-[18px] w-[18px]" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 pb-16">
          {/* Mobile console nav (sidebar is hidden below lg) */}
          <div className="lg:hidden -mt-2 mb-6 -mx-1 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]{display:none}">
            {[...main, ...more].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'bg-navy text-white' : 'bg-white border border-border text-navy/70'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
