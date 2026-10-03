import { useState } from 'react'
import { FileText, ExternalLink } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import SeeAlso from '../components/SeeAlso.jsx'
import { useAdmin } from '../admin/store.jsx'

export default function Documents() {
  const { data } = useAdmin()
  const [cat, setCat] = useState('All')

  const categories = ['All', ...new Set(data.documents.map((d) => d.category))]
  const list = cat === 'All' ? data.documents : data.documents.filter((d) => d.category === cat)

  return (
    <>
      <PageHero
        eyebrow="Council Documents"
        title="Resources & official documents"
        sub="Approved public documents from the Student Council — charters, meeting information, student resources, forms, guidelines and campaign materials."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {data.documents.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
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
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((d, i) => (
              <Reveal key={d.id} delay={(i % 3) * 80}>
                {(() => {
                  const Tag = d.url ? 'a' : 'div'
                  const linkProps = d.url ? { href: d.url, target: '_blank', rel: 'noreferrer' } : {}
                  return (
                    <Tag {...linkProps} className="group block h-full rounded-2xl bg-card border border-border gold-block p-6">
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{d.category}</span>
                      <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-bold text-navy group-hover:text-gold transition-colors">
                        <FileText className="h-4 w-4 text-gold" /> {d.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                      {d.url && <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-ink">Open document <ExternalLink className="h-3.5 w-3.5" /></span>}
                    </Tag>
                  )
                })()}
              </Reveal>
            ))}
          </div>

          {data.documents.length === 0 && (
            <Reveal>
              <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center">
                <FileText className="h-10 w-10 text-gold mx-auto" />
                <h3 className="mt-4 font-display text-xl font-bold text-navy">No documents available</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Public documents for {data.settings.year} will appear here once uploaded by the Council.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
      <SeeAlso path="/documents" />
    </>
  )
}
