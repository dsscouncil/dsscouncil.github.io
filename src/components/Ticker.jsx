const MESSAGE =
  'You supply the vision; we supply the structure. More power to your ideas, backed by unyielding execution.'

/**
 * LED-screen style running text strip shown under the header.
 * The message repeats seamlessly (track rendered twice, translated -50%).
 * Pauses on hover and respects prefers-reduced-motion via CSS.
 */
export default function Ticker() {
  return (
    <div className="ticker-strip relative overflow-hidden bg-navy text-gold" aria-label="Council announcement">
      <div className="ticker-track flex w-max items-center whitespace-nowrap">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex items-center">
                <span className="px-8 text-xs font-semibold uppercase tracking-[0.22em]">{MESSAGE}</span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
