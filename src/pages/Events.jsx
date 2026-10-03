import { useMemo, useState } from 'react'
import { CalendarPlus, CalendarDays, MapPin, Users, Clock } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin } from '../admin/store.jsx'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// Events store day + 3-letter month only; resolve to the next future occurrence.
function resolveDate(e) {
  const m = MONTHS.indexOf((e.month || '').toUpperCase())
  const day = parseInt(e.day, 10)
  if (m < 0 || !day) return null
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let year = now.getFullYear()
  if (new Date(year, m, day) < today) year += 1
  return { year, month: m + 1, day }
}

const pad = (n) => String(n).padStart(2, '0')

// Opens the event prefilled in Google Calendar (all-day, Dubai timezone).
function googleCalendarUrl(e) {
  const d = resolveDate(e)
  if (!d) return null
  const endDt = new Date(d.year, d.month - 1, d.day + 1) // all-day: end = next day
  const dates = `${d.year}${pad(d.month)}${pad(d.day)}/${endDt.getFullYear()}${pad(endDt.getMonth() + 1)}${pad(endDt.getDate())}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title || 'Council Event',
    dates,
    details: [e.description, e.org && `Organised by: ${e.org}`].filter(Boolean).join('\n'),
  })
  if (e.location) params.set('location', e.location)
  params.set('ctz', 'Asia/Dubai')
  return `https://calendar.google.com/calendar/render?${params}`
}

function AddToCalendarButton({ event, compact }) {
  const url = googleCalendarUrl(event)
  const cls = `inline-flex items-center gap-2 rounded-full border border-border font-semibold text-navy transition-colors hover:border-gold hover:text-gold ${
    compact ? 'px-4 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
  }`
  if (!url) {
    return (
      <button disabled title="Event date not set" className={`${cls} disabled:opacity-40`}>
        <CalendarPlus className="h-4 w-4" />
        Add to Calendar
      </button>
    )
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className={cls} title="Opens in Google Calendar">
      <CalendarPlus className="h-4 w-4" />
      Add to Calendar
    </a>
  )
}

export default function Events() {
  const { data } = useAdmin()
  const [tab, setTab] = useState('upcoming')

  const withDates = useMemo(
    () =>
      data.events
        .map((e) => ({ ...e, date: resolveDate(e) }))
        .filter((e) => e.date)
        .sort((a, b) =>
          a.date.year - b.date.year || a.date.month - b.date.month || a.date.day - b.date.day,
        ),
    [data.events],
  )

  const today0 = new Date(); today0.setHours(0, 0, 0, 0)
  const upcoming = withDates.filter((e) => new Date(e.date.year, e.date.month - 1, e.date.day) >= today0)

  const monthGroups = useMemo(() => {
    const groups = []
    for (const e of withDates) {
      const label = new Date(e.date.year, e.date.month - 1, 1).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      })
      let g = groups[groups.length - 1]
      if (!g || g.label !== label) {
        g = { label, events: [] }
        groups.push(g)
      }
      g.events.push(e)
    }
    return groups
  }, [withDates])

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
              ['calendar', 'Calendar'],
              ['past', 'Past Events'],
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
                      <span className="text-xs font-semibold uppercase tracking-wide text-gold-ink">{e.type}</span>
                      <h3 className="font-display text-xl font-bold text-navy mt-1">{e.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                        {e.date && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-gold" />
                            {new Date(e.date.year, e.date.month - 1, e.date.day).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        {e.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gold" />{e.location}</span>}
                        {e.org && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-gold" />{e.org}</span>}
                      </div>
                      {e.description && <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>}
                    </div>
                    <AddToCalendarButton event={e} />
                  </div>
                </Reveal>
              ))}
              {upcoming.length === 0 && (
                <p className="text-center text-muted-foreground py-16">No upcoming events right now — check back soon.</p>
              )}
            </div>
          )}

          {tab === 'calendar' && (
            <div className="space-y-10">
              {monthGroups.map((g, gi) => (
                <Reveal key={g.label} delay={gi * 60}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <CalendarDays className="h-5 w-5 text-gold" />
                      <h3 className="font-display text-2xl font-bold text-navy">{g.label}</h3>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {g.events.length} {g.events.length === 1 ? 'event' : 'events'}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
                      {g.events.map((e) => (
                        <div key={e.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="shrink-0 w-14 text-center rounded-xl bg-navy text-white py-2">
                            <div className="font-display text-xl font-bold text-gold leading-none">{e.day}</div>
                            <div className="text-[10px] font-semibold tracking-widest mt-0.5">{e.month}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-gold-ink">{e.type}</span>
                            <h4 className="font-display font-bold text-navy leading-snug">{e.title}</h4>
                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                              {e.date && (
                                <span>
                                  {new Date(e.date.year, e.date.month - 1, e.date.day).toLocaleDateString('en-GB', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              )}
                              {e.location && <span>· {e.location}</span>}
                              {e.org && <span>· {e.org}</span>}
                            </div>
                          </div>
                          <AddToCalendarButton event={e} compact />
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
              {monthGroups.length === 0 && (
                <p className="text-center text-muted-foreground py-16">No events on the calendar yet.</p>
              )}
            </div>
          )}

          {tab === 'past' && (
            <div className="space-y-6">
              {withDates.filter((e) => {
                const today = new Date(); today.setHours(0, 0, 0, 0)
                return new Date(e.date.year, e.date.month - 1, e.date.day) < today
              }).map((e, i) => (
                <Reveal key={e.id} delay={i * 80}>
                  <div className="rounded-2xl bg-card border border-border p-6 flex flex-col md:flex-row gap-6 md:items-center opacity-80">
                    <div className="shrink-0 w-20 h-20 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center">
                      <span className="font-display text-3xl font-bold text-navy/70">{e.day}</span>
                      <span className="text-xs font-semibold tracking-widest text-navy/60">{e.month}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{e.type}</span>
                      <h3 className="font-display text-xl font-bold text-navy mt-1">{e.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                        <span>{new Date(e.date.year, e.date.month - 1, e.date.day).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        {e.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-muted-foreground/60" />{e.location}</span>}
                        {e.org && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-muted-foreground/60" />{e.org}</span>}
                      </div>
                      {e.description && <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
              {withDates.filter((e) => {
                const today = new Date(); today.setHours(0, 0, 0, 0)
                return new Date(e.date.year, e.date.month - 1, e.date.day) < today
              }).length === 0 && (
                <p className="text-center text-muted-foreground py-16">No past events yet — the term has just begun.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
