import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, ExternalLink } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import PulseMark from '../components/PulseMark.jsx'
import { IMG, LOGO } from '../data/content.js'
import { useAdmin } from '../admin/store.jsx'

export default function Home() {
  const { data } = useAdmin()
  const sc = data.siteContent
  const activeInitiatives = data.initiatives.filter((i) => i.status !== 'Completed').length
  const featuredNews = data.news.find((n) => n.featured) || data.news[0]

  const statValue = (label) => {
    if (label.startsWith('100')) return '100%'
    if (label === 'Initiatives') return String(activeInitiatives || data.initiatives.length)
    if (label === 'Council Members') return String(data.members.length)
    return sc.stats.find((s) => s.label === label)?.value || '0'
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-deep pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-6">{sc.heroEyebrow}</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.06] text-white">
              <PulseMark />
            </h1>
            <p className="mt-6 text-xl font-medium text-white/80">{sc.heroSub}</p>
            <p className="mt-4 text-lg text-white/60 max-w-xl leading-relaxed">{sc.heroDesc}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link to="/council" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy hover:bg-gold-soft transition-colors">
                Meet the Council
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/student-voice" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:border-gold hover:text-gold transition-colors">
                <MessageCircle className="h-4 w-4" />
                Share Your Voice
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden gold-outline">
                <span className="inline-block relative w-full aspect-[3/2]">
                  <img
                    src={IMG.hero}
                    srcSet={IMG.heroSrcSet}
                    sizes="(min-width: 1024px) 584px, 100vw"
                    width={1500}
                    height={1000}
                    alt="Dubai Scholars student leaders"
                    fetchPriority="high"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full inset-0 absolute object-contain"
                  />
                </span>
              </div>
              <div className="absolute -bottom-6 -left-6 md:-left-10 glass-dark rounded-2xl p-5 shadow-lg w-56">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">Live Council</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-3xl font-bold text-gold">{activeInitiatives}</div>
                    <div className="text-xs text-white/70">Active Initiatives</div>
                  </div>
                  <div className="h-px w-8 bg-white/20" />
                  <div>
                    <div className="font-display text-3xl font-bold text-white">{data.members.length}</div>
                    <div className="text-xs text-white/70">Council Members</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-10 px-7 lg:px-10">
          {sc.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-5xl md:text-6xl font-bold text-gold tabular-nums">{statValue(s.label)}</div>
              <div className="mt-3 text-lg font-semibold text-white">{s.label}</div>
              <div className="text-sm text-white/60 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="rounded-3xl overflow-hidden gold-outline">
              <span className="relative w-full aspect-[7/5] block">
                <img
                  src={IMG.about}
                  srcSet={IMG.aboutSrcSet}
                  sizes="(min-width: 1024px) 580px, 100vw"
                  width={1260}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  alt="Students collaborating"
                  referrerPolicy="no-referrer"
                  className="w-full h-full inset-0 absolute object-contain"
                />
              </span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">About the Council</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy leading-tight">{sc.aboutTitle}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{sc.aboutText}</p>
            <div className="mt-6 rounded-2xl border-l-2 border-gold bg-surface p-5">
              <p className="text-sm italic text-navy/80">{sc.homeQuote}</p>
            </div>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold transition-colors group">
              Learn more about the Council
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured initiatives */}
      <section className="py-20 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">Featured Initiatives</div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Projects shaping our school</h2>
              </div>
              <Link to="/initiatives" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold transition-colors group">
                View all initiatives
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {data.initiatives.filter((i) => i.featured).slice(0, 3).map((ini, i) => (
              <Reveal key={ini.id} delay={i * 100}>
                <Link to="/initiatives" className="group block h-full rounded-2xl overflow-hidden bg-card border border-border gold-block">
                  <div className="relative h-44 overflow-hidden bg-surface">
                    <div className="w-full h-full bg-navy flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gold/40"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ini.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {ini.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gold-ink mb-2">{ini.category}</div>
                    <h3 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors">{ini.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{ini.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* News teaser */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">News &amp; Announcements</div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">From the Council desk</h2>
              </div>
              <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold transition-colors group">
                Read all news
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
          {featuredNews && (
            <Reveal delay={100}>
              <Link to="/news" className="group block rounded-2xl overflow-hidden bg-card border border-border gold-block max-w-2xl">
                <div className="p-6">
                  <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold">{featuredNews.category}</span>
                  <h3 className="mt-4 font-display text-xl font-bold text-navy group-hover:text-gold transition-colors">{featuredNews.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{featuredNews.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          )}
          <Reveal delay={150}>
            <div className="mt-10 rounded-3xl bg-navy-deep text-white p-8 md:p-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">Share Your Voice</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold">Your voice can shape student life at Dubai Scholars.</h3>
              <p className="mt-3 text-white/60 max-w-xl mx-auto">Share an idea, suggestion, concern, or proposal. Every submission is reviewed by the Council.</p>
              <Link to="/student-voice" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy hover:bg-gold-soft transition-colors">
                Share Your Voice
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* School website */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-navy-deep text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 gold-outline">
              <div className="shrink-0 h-24 w-24 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                <img src={LOGO} alt="Dubai Scholars Private School" className="h-16 w-16 object-contain" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">Our School</div>
                <h3 className="font-display text-2xl md:text-3xl font-bold">Proudly part of the Dubai Scholars family.</h3>
                <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
                  The Student Council is one of many ways students lead at Dubai Scholars. Explore admissions, academics and campus life on the official school website.
                </p>
              </div>
              <a
                href="https://dubaischolars.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy hover:bg-gold-soft transition-colors"
              >
                Visit dubaischolars.com
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
