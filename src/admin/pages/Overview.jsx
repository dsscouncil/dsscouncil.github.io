import { Link } from 'react-router-dom'
import {
  MessageSquareHeart, Users, Megaphone, CalendarDays, UsersRound, Newspaper, FileText, Lightbulb, ArrowRight, Mail,
} from 'lucide-react'
import { useAdmin } from '../store.jsx'

function StatCard({ to, icon: Icon, value, label }) {
  return (
    <Link to={to} className="group block rounded-3xl border border-border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg gold-outline">
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy">
          <Icon className="h-6 w-6 text-gold" />
        </span>
        <span className="font-display text-5xl font-bold text-navy tabular-nums">{value}</span>
      </div>
      <div className="mt-5 font-display text-2xl font-bold text-navy">{label}</div>
      <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground group-hover:text-gold transition-colors">
        Manage <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}

export default function Overview() {
  const { data } = useAdmin()
  const s = data.siteContent

  const cards = [
    { to: '/admin/voice', icon: MessageSquareHeart, value: data.submissions.length, label: 'Submissions' },
    { to: '/admin/contact-messages', icon: Mail, value: data.contactMessages.length, label: 'Contact Messages' },
    { to: '/admin/members', icon: Users, value: data.members.length, label: 'Council Members' },
    { to: '/admin/initiatives', icon: Megaphone, value: data.initiatives.length, label: 'Initiatives' },
    { to: '/admin/events', icon: CalendarDays, value: data.events.length, label: 'Events' },
    { to: '/admin/clubs', icon: UsersRound, value: data.clubs.length, label: 'Clubs' },
    { to: '/admin/news', icon: Newspaper, value: data.news.length, label: 'News Articles' },
    { to: '/admin/documents', icon: FileText, value: data.documents.length, label: 'Documents' },
  ]

  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-navy">Welcome to the Governor&rsquo;s Console</h1>
      <p className="mt-2 text-muted-foreground">Managing academic year {data.settings.year}. Use the sidebar to manage each area of the platform.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => <StatCard key={c.to} {...c} />)}
      </div>

      <div className="mt-10 rounded-3xl bg-navy-deep p-8 text-white">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-gold" />
          <h2 className="font-display text-2xl font-bold">Restricted access</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">
          This console is restricted — only Council admins with issued accounts can sign in. Everything here controls the live site, so keep credentials within the Council.
        </p>
      </div>
    </div>
  )
}
