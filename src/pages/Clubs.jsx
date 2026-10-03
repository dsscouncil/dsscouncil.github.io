import { useMemo, useState } from 'react'
import { CalendarDays, MapPin, User, Handshake, DollarSign, Palette, PenTool, Dumbbell, Cpu, Mic, Users } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import SeeAlso from '../components/SeeAlso.jsx'
import { useAdmin, YEAR_GROUPS } from '../admin/store.jsx'

const KNOWN_CATEGORIES = ['Academic', 'Sports', 'Creative', 'Technology', 'Community', 'Culture', 'Leadership']

const ICONS = { CurrencyDollar: DollarSign, Palette, PenTool, Dumbbell, Cpu, Mic, Users, Handshake }
const ClubIcon = ({ name }) => {
  const Icon = ICONS[name] || Handshake
  return <Icon className="h-6 w-6 text-gold" />
}
export default function Clubs() {
  const { data } = useAdmin()
  const [cat, setCat] = useState('All')

  const categories = useMemo(() => {
    const present = [...new Set(data.clubs.map((c) => c.category))]
    const known = KNOWN_CATEGORIES.filter((c) => present.includes(c))
    return ['All', ...known, ...present.filter((c) => !known.includes(c))]
  }, [data.clubs])

  const list = cat === 'All' ? data.clubs : data.clubs.filter((c) => c.category === cat)

  return (
    <>
      <PageHero
        eyebrow="Clubs & Activities"
        title="Find your passion beyond the classroom"
        sub="Explore the clubs and extracurricular activities available at Dubai Scholars."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  cat === c ? 'bg-navy text-white' : 'bg-white border border-border text-navy/70 hover:border-gold hover:text-navy'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((club, i) => (
              <Reveal key={club.id} delay={(i % 3) * 80}>
                <div className="group h-full rounded-2xl bg-card border border-border gold-block p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-12 w-12 rounded-xl bg-navy flex items-center justify-center">
                      <ClubIcon name={club.icon} />
                    </div>
                    <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{club.category}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy group-hover:text-gold transition-colors">{club.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{club.description}</p>
                  <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                    {club.schedule && club.schedule !== '-' && <div className="inline-flex items-center gap-3"><CalendarDays className="h-4 w-4 text-gold" /> {club.schedule}</div>}
                    {club.location && club.location !== '-' && <div className={`inline-flex items-center gap-3 ${club.schedule && club.schedule !== '-' ? 'ml-4' : ''}`}><MapPin className="h-4 w-4 text-gold" /> {club.location}</div>}
                    {club.leads && club.leads !== '-' && <div className="inline-flex items-center gap-3"><User className="h-4 w-4 text-gold" /> {club.leads}</div>}
                    {club.join && club.join !== '-' && <p className="pt-1 font-semibold text-navy/70">How to join: {club.join}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No clubs in this category yet.</p>}
        </div>
      </section>
      <SeeAlso path="/clubs" />
    </>
  )
}
