import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin } from '../admin/store.jsx'

const RING_STYLES = {
  'Departmental Leadership': { fill: 'hsl(210 22% 88%)', stroke: 'hsl(213 20% 78%)', textFill: 'hsl(213 65% 22%)' },
  'Sports Council': { fill: 'hsl(210 30% 92%)', stroke: 'hsl(213 25% 80%)', textFill: 'hsl(213 65% 20%)' },
  'Well-being Leadership': { fill: 'hsl(213 45% 32%)', stroke: 'hsl(213 45% 26%)', textFill: 'hsl(40 65% 85%)' },
  'House Leadership': { fill: 'hsl(213 65% 14%)', stroke: 'hsl(213 65% 9%)', textFill: 'hsl(40 60% 82%)' },
}
const DEFAULT_STYLE = RING_STYLES['House Leadership']

import houseAlpha from '../assets/houses/alpha.png'
import housePi from '../assets/houses/pi.png'
import houseOmega from '../assets/houses/omega.png'
import houseBeta from '../assets/houses/beta.png'

// `colour` is the vivid house shade used for decorative fills. `ink` is a
// darkened variant of the same hue used wherever the shade appears as TEXT on
// the white card, so every house label clears the 4.5:1 WCAG AA minimum.
const HOUSES = [
  {
    name: 'Respect', house: 'Alpha', img: houseAlpha,
    colour: 'hsl(217 91% 60%)', ink: 'hsl(217 91% 52%)', soft: 'hsl(217 91% 95%)',
    desc: 'Treating every member of our community with dignity — on the field, in class and beyond.',
  },
  {
    name: 'Compassion', house: 'Pi', img: housePi,
    colour: 'hsl(0 72% 51%)', ink: 'hsl(0 72% 51%)', soft: 'hsl(0 86% 96%)',
    desc: 'Leading with kindness and standing beside those who need support the most.',
  },
  {
    name: 'Empathy', house: 'Omega', img: houseOmega,
    colour: 'hsl(45 93% 40%)', ink: 'hsl(45 73% 32%)', soft: 'hsl(48 96% 93%)',
    desc: 'Listening first, understanding always — seeing the world through each other\'s eyes.',
  },
  {
    name: 'Integrity', house: 'Beta', img: houseBeta,
    colour: 'hsl(142 71% 38%)', ink: 'hsl(142 55% 33%)', soft: 'hsl(142 69% 94%)',
    desc: 'Doing the right thing, especially when no one is watching.',
  },
]

// Ring geometry, outermost first. Each key owns one ring regardless of store order.
const RING_GEOMETRY = [
  { key: 'Departmental Leadership', path: 'M 5 250 A 245 245 0 1 0 495 250 A 245 245 0 1 0 5 250 Z M 45 250 A 205 205 0 1 0 455 250 A 205 205 0 1 0 45 250 Z', arc: 'arc-sports' },
  { key: 'Sports Council', path: 'M 45 250 A 205 205 0 1 0 455 250 A 205 205 0 1 0 45 250 Z M 92 250 A 158 158 0 1 0 408 250 A 158 158 0 1 0 92 250 Z', arc: 'arc-coordinators' },
  { key: 'Well-being Leadership', path: 'M 92 250 A 158 158 0 1 0 408 250 A 158 158 0 1 0 92 250 Z M 142 250 A 108 108 0 1 0 358 250 A 108 108 0 1 0 142 250 Z', arc: 'arc-deputies' },
  { key: 'House Leadership', path: 'M 142 250 A 108 108 0 1 0 358 250 A 108 108 0 1 0 142 250 Z M 192 250 A 58 58 0 1 0 308 250 A 58 58 0 1 0 192 250 Z', arc: 'arc-heads' },
]

function CirclesDiagram({ circles }) {
  const [active, setActive] = useState(null)
  const outer = circles.filter((c) => c.key !== 'Core Team')
  const core = circles.find((c) => c.key === 'Core Team') || { label: 'Core Team', quote: '' }
  const activeCircle = circles.find((c) => c.key === active)

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <svg viewBox="0 0 500 500" className="w-full h-auto" role="img" aria-label="Council circles of responsibility">
        <defs>
          <path id="arc-sports" d="M 25 250 A 225 225 0 0 1 475 250" fill="none" />
          <path id="arc-coordinators" d="M 68.5 250 A 181.5 181.5 0 0 1 431.5 250" fill="none" />
          <path id="arc-deputies" d="M 117 250 A 133 133 0 0 1 383 250" fill="none" />
          <path id="arc-heads" d="M 167 250 A 83 83 0 0 1 333 250" fill="none" />
        </defs>
        {RING_GEOMETRY.map(({ key, path, arc }) => {
          const circle = outer.find((c) => c.key === key)
          if (!circle) return null
          const style = RING_STYLES[key] || DEFAULT_STYLE
          return (
            <g key={key} onClick={() => setActive(key)} onMouseEnter={() => setActive(key)} onMouseLeave={() => setActive(null)}>
              <path
                d={path}
                fillRule="evenodd"
                fill={active === key ? 'hsl(39 53% 57% / 0.18)' : style.fill}
                stroke={active === key ? 'hsl(39 53% 57%)' : style.stroke}
                strokeWidth={active === key ? '3' : '1.5'}
                className="circle-ring"
              />
              <text fill={active === key ? 'hsl(39 53% 45%)' : style.textFill} dominantBaseline="middle" className="select-none" style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', pointerEvents: 'none', transition: 'fill 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">{circle.label}</textPath>
              </text>
            </g>
          )
        })}
        <g onClick={() => setActive(core.key)} onMouseEnter={() => setActive(core.key)} onMouseLeave={() => setActive(null)}>
          <path
            d="M 192 250 A 58 58 0 1 0 308 250 A 58 58 0 1 0 192 250 Z"
            fill={active === core.key ? 'hsl(39 53% 67%)' : 'hsl(39 53% 57%)'}
            stroke={active === core.key ? 'hsl(213 65% 9%)' : 'hsl(39 53% 47%)'}
            strokeWidth={active === core.key ? '3' : '1.5'}
            className="circle-ring"
          />
          <text x="250" y="250" textAnchor="middle" dominantBaseline="middle" fill="hsl(213 65% 9%)" className="select-none" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', pointerEvents: 'none' }}>
            {core.label}
          </text>
        </g>
      </svg>
      <div className="rounded-3xl border border-border bg-white p-8 gold-outline">
        {activeCircle ? (
          <div key={activeCircle.key} className="circle-quote">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">{activeCircle.label}</div>
            <p className="font-display text-xl md:text-2xl font-semibold text-navy leading-snug">
              &ldquo;{activeCircle.quote}&rdquo;
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Hover or tap a circle to read the philosophy behind each circle of the Council.</p>
        )}
      </div>
    </div>
  )
}

export default function About() {
  const { data } = useAdmin()
  const sc = data.siteContent
  const diagramCircles = data.circleQuotes

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Representing students. Building leaders. Creating change."
        sub={sc.aboutText}
      />

      {/* What we do */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">What We Do</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">The Council focuses on</h2>
            <p className="mt-3 text-muted-foreground">Eight pillars that guide our work across the school year.</p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sc.pillars.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80}>
                <div className="h-full rounded-2xl bg-card border border-border gold-block p-6">
                  <div className="font-display text-lg font-bold text-navy">{p.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Voices of leadership */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">Voices of Leadership</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Messages to the Council</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">Words of guidance from those who support and oversee our student leaders.</p>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {data.leadershipMessages.map((m, i) => (
              <Reveal key={m.id} delay={i * 100}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  {m.photo && (
                    <img src={m.photo} alt={m.name} referrerPolicy="no-referrer" className="h-16 w-16 rounded-full object-cover ring-2 ring-gold shadow-[0_0_12px_2px_hsl(39_53%_57%/0.4)]" />
                  )}
                  <Quote className="h-6 w-6 text-gold mt-4" />
                  <p className="mt-4 text-sm leading-relaxed text-navy/80">{m.quote}</p>
                  <div className="mt-5">
                    <div className="font-display font-bold text-navy">{m.name}</div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gold-ink mt-1">{m.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The four houses */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">House System</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">The four houses</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Every student belongs to a house — four communities that compete, create and serve together, each guided by its own value.
            </p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOUSES.map((h, i) => (
              <Reveal key={h.house} delay={(i % 4) * 80}>
                <div className="h-full rounded-2xl bg-card border border-border gold-block overflow-hidden">
                  <div className="h-2" style={{ background: h.colour }} />
                  <div className="p-6 text-center">
                    <div
                      className="mx-auto h-16 w-16 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ background: h.soft }}
                    >
                      <img src={h.img} alt={`${h.house} house symbol`} className="h-11 w-11 object-contain" />
                    </div>
                    <div className="mt-4 font-display text-xl font-bold text-navy">{h.name}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: h.ink }}>
                      {h.house} House
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* House of accountability */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="mx-auto max-w-4xl px-5 lg:px-8 text-center">
          <Reveal>
            <Quote className="h-10 w-10 text-gold mx-auto" />
            <p className="mt-6 font-display text-xl md:text-2xl font-medium text-navy leading-relaxed">{sc.philosophy}</p>
            <div className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">House of Accountability</div>
          </Reveal>
        </div>
      </section>

      {/* Structure circles */}
      <section className="py-20 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink mb-3">Structure</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Circles of responsibility</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              The Council works in connected circles — each supporting the next, none above another. Every role matters equally to how the Council serves.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <CirclesDiagram circles={diagramCircles} />
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-12 text-center">
              <Link to="/council" className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy hover:bg-gold-soft transition-colors group">
                Meet the Council
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
