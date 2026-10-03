import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin } from '../admin/store.jsx'

const STATUS_STYLES = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Planning: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function Initiatives() {
  const { data } = useAdmin()
  const [cat, setCat] = useState('All')

  const categories = useMemo(() => ['All', ...new Set(data.initiatives.map((i) => i.category))], [data.initiatives])
  const list = cat === 'All' ? data.initiatives : data.initiatives.filter((i) => i.category === cat)

  return (
    <>
      <PageHero
        eyebrow="Initiatives"
        title="Projects led by the Council"
        sub="Student-led initiatives across community, sustainability, wellbeing, charity and more. Filter by category to explore our work."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">Featured Projects</div>
          </Reveal>

          <div className="flex flex-wrap gap-2 mb-10">
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((ini, i) => (
              <Reveal key={ini.id} delay={(i % 3) * 80}>
                <div className="group h-full rounded-2xl overflow-hidden bg-card border border-border gold-block">
                  <div className="relative h-44 overflow-hidden bg-surface">
                    <div className="w-full h-full bg-navy flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gold/40"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      {ini.featured && <span className="rounded-full bg-gold text-navy px-3 py-1 text-xs font-bold uppercase tracking-wide">Featured</span>}
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[ini.status] || 'bg-surface text-navy border-border'}`}>
                        {ini.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gold-ink mb-2">{ini.category}</div>
                    <h3 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors">{ini.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{ini.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                      {ini.date && <span>{ini.date}</span>}
                      {ini.lead && <span>Lead: {ini.lead}</span>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {list.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No initiatives in this category yet — check back soon.</p>
          )}
        </div>
      </section>
    </>
  )
}
