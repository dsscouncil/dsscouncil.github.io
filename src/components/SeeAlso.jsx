import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { relatedFor } from '../site.js'

/**
 * Contextual links from the bottom of a page.
 *
 * Seven of the ten sections shipped with no links in their body at all - every
 * link they offered was nav or footer boilerplate, which is the weakest thing
 * Google has to build sitelinks from. This gives each section three genuine,
 * on-topic links, drawn from the `related` list in site.js so the same wording
 * drives the nav, the prerendered crawl nav and the structured data.
 *
 * The anchor text is the target route's `label`, which is deliberately the
 * same wording as that page's <title>, so the sitelink Google shows is the one
 * written for the search.
 */
export default function SeeAlso({ path }) {
  const related = relatedFor(path)
  if (!related.length) return null

  return (
    <section className="pb-10 md:pb-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="border-t border-border pt-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-6">Keep exploring</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {related.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="group flex h-full flex-col rounded-2xl bg-card border border-border p-6 transition-colors hover:border-gold focus-visible:border-gold"
              >
                <h2 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors">{r.label}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.blurb}</p>
                {/* mt-auto so the call to action sits on one baseline whatever the
                    blurb length, instead of stepping down with the text. */}
                <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-ink">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
