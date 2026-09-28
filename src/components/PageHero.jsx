export default function PageHero({ eyebrow, title, sub }) {
  return (
    <section className="bg-navy-deep pt-36 pb-14 md:pt-44 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">{eyebrow}</div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white">{title}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg text-white/60 leading-relaxed">{sub}</p>}
      </div>
    </section>
  )
}
