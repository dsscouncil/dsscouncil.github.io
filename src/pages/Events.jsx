import { useMemo, useState } from 'react'
import { CalendarPlus, MapPin, Users } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin } from '../admin/store.jsx'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export default function Events() {
  const { data } = useAdmin()
  const [tab, setTab] = useState('upcoming')

  const upcoming = useMemo(
    () =>
      [...data.events].sort(
        (a, b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month) || Number(a.day) - Number(b.day),
      ),
    [data.events],
  )

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Council events & activities"
        sub="Stay up to date with upcoming Council events, campaigns, awareness days, charity drives, competitions and leadership activities."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex gap-2 mb-12">
            {[
              ['upcoming', 'Upcoming'],
              ['past', 'Past Events'],
              ['calendar', 'Calendar'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  tab === key ? 'bg-navy text-white' : 'bg-white border border-border text-navy/70 hover:border-gold hover:text-navy'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'upcoming' && (
            <div className="space-y-6">
              {upcoming.map((e, i) => (
                <Reveal key={e.id} delay={i * 80}>
                  <div className="rounded-2xl bg-card border border-border gold-block p-6 flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="shrink-0 w-20 h-20 rounded-2xl bg-navy text-white flex flex-col items-center justify-center">
                      <span className="font-display text-3xl font-bold text-gold">{e.day}</span>
                      <span className="text-xs font-semibold tracking-widest">{e.month}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gold">{e.type}</span>
                      <h3 className="font-display text-xl font-bold text-navy mt-1">{e.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                        {e.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gold" />{e.location}</span>}
                        {e.org && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-gold" />{e.org}</span>}
                      </div>
                      {e.description && <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>}
                    </div>
                    <button
                      onClick={() => alert(`"${e.title}" added to your calendar (demo).`)}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:border-gold hover:text-gold transition-colors"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Add to Calendar
                    </button>
                  </div>
                </Reveal>
              ))}
              {upcoming.length === 0 && (
                <p className="text-center text-muted-foreground py-16">No upcoming events right now — check back soon.</p>
              )}
            </div>
          )}

          {tab === 'past' && (
            <p className="text-center text-muted-foreground py-16">No past events to show yet — the term has just begun.</p>
          )}

          {tab === 'calendar' && (
            <p className="text-center text-muted-foreground py-16">A full term calendar is coming soon.</p>
          )}
        </div>
      </section>
    </>
  )
}
