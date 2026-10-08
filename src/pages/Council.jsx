import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import SeeAlso from '../components/SeeAlso.jsx'
import { useAdmin, MEMBER_CATEGORIES } from '../admin/store.jsx'

// People who work together belong next to each other on the grid, and the most
// senior of them first. Role titles are free text, so the team is derived from
// the title: "Head of IT" and "IT Coordinator" both reduce to "it". The
// coordinator match is deliberately loose because the live data contains a
// misspelling ("Coordiantor"); anything with no team is left exactly where it
// was.
function departmentKey(role) {
  const r = (role || '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim()
  const head = r.match(/^head of (.+)$/)
  if (head) return head[1]
  const mate = r.match(/^(.+?)\s+(?:co[a-z]*tor|ambassador)$/)
  return mate ? mate[1] : null
}

// Fallback team for roles that name no department: a deputy belongs beside the
// regular role it deputises for, so "Deputy Head Girl" pairs with "Head Girl".
function deputyFamily(role) {
  return (role || '')
    .toLowerCase()
    .replace(/[^a-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^deputy /, '')
}

// The Sports Council is really two teams, Sports and Fitness.
function councilKey(role) {
  const r = (role || '').toLowerCase()
  if (r.includes('fitness')) return 'fitness'
  if (r.includes('sport')) return 'sports'
  return null
}

// House Leadership teams are the houses themselves, the Sports Council splits by
// sport, and everywhere else the team comes from the role title.
function teamKey(cat, m) {
  if (cat === 'House Leadership') return (m.house || '').trim() || null
  if (cat === 'Sports Council') return councilKey(m.role)
  return departmentKey(m.role) || deputyFamily(m.role)
}

// Captain / President / Head outrank an Ambassador, which outranks a
// Coordinator; within any of those a regular role outranks its Deputy.
// An ambassador is a representative of the whole department while a
// coordinator only runs one strand of it, so within a team an ambassador is
// listed before the coordinators even when the coordinator's year comes first
// in the year-order the list is built from.
function seniority(role) {
  const r = (role || '').toLowerCase()
  const deputy = /^deputy/.test(r) ? 1 : 0
  const leader = /(captain|president|head)/.test(r) ? 0 : /ambassador/.test(r) ? 1 : 2
  return leader * 2 + deputy
}

// Keeps the original ordering untouched, except that the first tile of each team
// is immediately followed by that team's remaining members, most senior first.
// Teams stay in the order they already appeared in.
function groupTeams(cat, list) {
  const buckets = new Map()
  for (const m of list) {
    const key = teamKey(cat, m)
    if (!key) continue
    const b = buckets.get(key) || []
    b.push(m)
    buckets.set(key, b)
  }
  const placed = new Set()
  const out = []
  for (const m of list) {
    const key = teamKey(cat, m)
    if (!key) {
      out.push(m)
      continue
    }
    if (placed.has(key)) continue
    placed.add(key)
    out.push(...[...buckets.get(key)].sort((a, b) => seniority(a.role) - seniority(b.role)))
  }
  return out
}

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

    // Two orderings, chosen per category:
    //   • Well-being Leadership is ordered by YEAR, because a Year 11 is more
    //     senior than a Year 10 — it reads President (Y11), Head (Y10),
    //     Ambassador (Y10), Coordinator (Y9). A year is never broken up there,
    //     so nobody junior can be pulled above a senior year.
    //   • Every other category keeps the department grouping: a head sits
    //     directly beside their own coordinators, most senior role first. The
    //     team grouping only ever tidies the order inside one category.
    const YEAR_ORDER_CATEGORIES = new Set(['Well-being Leadership'])
    const yearRank = (y) => {
      const m = String(y || '').match(/year\s*(\d+)/i)
      return m ? Number(m[1]) : 0
    }
    const order = (m) => (m.order ?? Number.MAX_SAFE_INTEGER)
    const tierThenOrder = (a, b) =>
      (a.tier ?? b.tier ?? 0) - (b.tier ?? a.tier ?? 0) || order(a) - order(b)

    return Object.entries(byCat).map(([cat, list]) => {
      if (!YEAR_ORDER_CATEGORIES.has(cat)) {
        return [cat, groupTeams(cat, [...list].sort(
          (a, b) => yearRank(a.year) - yearRank(b.year) || tierThenOrder(a, b),
        ))]
      }
      const sorted = [...list].sort(
        (a, b) => yearRank(b.year) - yearRank(a.year) || tierThenOrder(a, b),
      )
      const years = []
      for (const m of sorted) {
        const rank = yearRank(m.year)
        if (years.length && years[years.length - 1].rank === rank) years[years.length - 1].members.push(m)
        else years.push({ rank, members: [m] })
      }
      return [cat, years.flatMap(({ members }) => groupTeams(cat, members))]
    })
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
      <SeeAlso path="/council" />
    </>
  )
}
