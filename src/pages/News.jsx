import { useMemo, useState } from 'react'
import { CalendarDays, User, Search, X } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin } from '../admin/store.jsx'

export default function News() {
  const { data } = useAdmin()
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  const categories = useMemo(() => ['All', ...new Set(data.news.map((a) => a.category))], [data.news])

  const list = useMemo(() => {
    let l = data.news
    if (cat !== 'All') l = l.filter((a) => a.category === cat)
    if (query.trim()) {
      const q = query.toLowerCase()
      l = l.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q))
    }
    return l
  }, [data.news, cat, query])

  const open = data.news.find((a) => a.id === openId)

  return (
    <>
      <PageHero
        eyebrow="News & Announcements"
        title="From the Council desk"
        sub="Announcements, project updates, event recaps, achievements, campaigns and student opportunities — all in one place."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-8">
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

          <div className="relative max-w-md mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full border border-border bg-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 80}>
                <button onClick={() => setOpenId(a.id)} className="group h-full w-full text-left rounded-2xl overflow-hidden bg-card border border-border gold-block">
                  <div className="p-6">
                    <div className="flex items-center gap-2">
                      {a.featured && <span className="rounded-full bg-gold text-navy px-3 py-1 text-xs font-bold uppercase tracking-wide">Featured</span>}
                      <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold">{a.category}</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-navy group-hover:text-gold transition-colors">{a.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                    <div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-gold" />{a.date}</span>
                      <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-gold" />{a.author}</span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
          {list.length === 0 && <p className="text-center text-muted-foreground py-16">No articles match your search.</p>}
        </div>
      </section>

      {/* Article modal */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-navy-deep/70 backdrop-blur-sm" onClick={() => setOpenId(null)} />
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button onClick={() => setOpenId(null)} aria-label="Close article" className="absolute top-4 right-4 h-10 w-10 rounded-full bg-surface flex items-center justify-center text-navy hover:bg-border transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="p-7 md:p-10">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold">{open.category}</span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-navy">{open.title}</h2>
              <div className="mt-3 flex items-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-gold" />{open.date}</span>
                <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4 text-gold" />{open.author}</span>
              </div>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-navy/85">
                {(open.body || []).map((p, i) => (
                  <p key={i} className={i === open.body.length - 1 ? 'font-semibold text-gold' : ''}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
