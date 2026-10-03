import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin, MEMBER_CATEGORIES } from '../admin/store.jsx'

function MemberCard({ m }) {
  return (
    <div className="group h-full rounded-2xl bg-card border border-border gold-block">
      <div className="flex flex-col items-center px-5 pt-7 pb-5 text-center">
        <span className="relative inline-flex h-36 w-36 shrink-0 items-center justify-center rounded-full">
          {/* glowing ring */}
          <span className="absolute inset-0 rounded-full ring-2 ring-gold shadow-[0_0_22px_5px_hsl(39_53%_57%/0.45)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_8px_hsl(39_53%_57%/0.6)]" />
          {m.img ? (
            <img
              src={m.img}
              alt={m.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="relative h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <span className="relative h-32 w-32 rounded-full bg-navy flex items-center justify-center">
              <span className="font-display text-5xl font-bold text-gold">{m.name?.[0]}</span>
            </span>
          )}
        </span>
        <span className="mt-4 rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy/70">
          {m.cat}
        </span>
        <h3 className="mt-2.5 font-display text-lg font-bold text-navy">{m.name}</h3>
        <p className="mt-1 text-sm font-medium text-gold-ink">{m.role}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{m.year}</p>
        {m.house && <p className="mt-1.5 text-xs font-semibold text-navy/70">{m.house}</p>}
        {m.note && <p className="mt-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-ink">{m.note}</p>}
        {m.description && <p className="mt-2 text-xs text-muted-foreground">{m.description}</p>}
      </div>
    </div>
  )
}

export default function Council() {
  const { data } = useAdmin()
  const [filter, setFilter] = useState('All')

  const categories = useMemo(() => {
    const present = [...new Set(data.members.map((m) => m.cat))]
    const known = MEMBER_CATEGORIES.filter((c) => present.includes(c))
    return ['All', ...known, ...present.filter((c) => !known.includes(c))]
  }, [data.members])

  const grouped = useMemo(() => {
    const filtered = filter === 'All' ? data.members : data.members.filter((m) => m.cat === filter)
    const byCat = {}
    for (const m of filtered) (byCat[m.cat] ||= []).push(m)
    const order = (m) => (m.order ?? Number.MAX_SAFE_INTEGER)
    return Object.entries(byCat).map(([cat, list]) => [
      cat,
      [...list].sort((a, b) => (a.tier ?? b.tier ?? 0) - (b.tier ?? a.tier ?? 0) || order(a) - order(b)),
    ])
  }, [data.members, filter])

  return (
    <>
      <PageHero
        eyebrow="Our Council"
        title="Meet the student leaders"
        sub="The Council is made up of elected and appointed student leaders across Years 9–11. Profiles are managed by the Council administration."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  filter === c ? 'bg-navy text-white' : 'bg-white border border-border text-navy/70 hover:border-gold hover:text-navy'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {grouped.map(([cat, list]) => (
            <div key={cat} className="mb-16">
              <Reveal>
                <h3 className="font-display text-2xl font-bold text-navy flex items-center gap-3">
                  <span className="h-px w-10 bg-gold" /> {cat}
                </h3>
              </Reveal>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((m, i) => (
                  <Reveal key={m.id} delay={(i % 3) * 80}>
                    <MemberCard m={m} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
          {data.members.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">Council profiles for this year will appear here soon.</p>
          )}
        </div>
      </section>
    </>
  )
}
