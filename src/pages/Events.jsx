import { useMemo } from 'react'
import { useState } from 'react'
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
const escIcs = (s) =>
  String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

// Real .ics download — opens in iPhone/Google/Outlook calendars.
function downloadIcs(e) {
  const d = resolveDate(e)
  if (!d) return
  const start = `${d.year}${pad(d.month)}${pad(d.day)}`
  const endDt = new Date(d.year, d.month - 1, d.day + 1) // all-day: end = next day
  const end = `${endDt.getFullYear()}${pad(endDt.getMonth() + 1)}${pad(endDt.getDate())}`
  const desc = [e.description, e.org && `Organised by: ${e.org}`].filter(Boolean).join('\n')
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dubai Scholars Student Council//Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.id}@dsscouncil.github.io`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escIcs(e.title)}`,
    desc ? `DESCRIPTION:${escIcs(desc)}` : null,
    e.location ? `LOCATION:${escIcs(e.location)}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(e.title || 'event').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function AddToCalendarButton({ event, compact }) {
  const d = resolveDate(event)
  return (
    <button
      onClick={() => downloadIcs(event)}
      disabled={!d}
      title={d ? `Adds ${d.day} ${MONTHS[d.month - 1]} ${d.year} to your calendar` : 'Event date not set'}
      className={`inline-flex items-center gap-2 rounded-full border border-border font-semibold text-navy transition-colors hover:border-gold hover:text-gold disabled:opacity-40 ${
        compact ? 'px-4 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
      }`}
    >
      <CalendarPlus className="h-4 w-4" />
      Add to Calendar
    </button>
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

  const upcoming = withDates.filter((e) => e.date.year > new Date().getFullYear() || e.date.month >= new Date().getMonth() + 1)

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
                      <span className="text-xs font-semibold uppercase tracking-wide text-gold">{e.type}</span>
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
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-gold">{e.type}</span>
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
            <p className="text-center text-muted-foreground py-16">No past events to show yet — the term has just begun.</p>
          )}
        </div>
      </section>
    </>
  )
}
