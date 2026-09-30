const LINES = [
  ['P', 'roactive'],
  ['U', 'nion for'],
  ['L', 'eadership &'],
  ['S', 'tudent'],
  ['E', 'mpowerment'],
]

/**
 * The DS PULSE brand lockup: five stacked lines whose acronym capitals
 * render in the signature gold. Fixed text by design — it is a logotype,
 * not editable copy.
 */
export default function PulseMark({ className = '' }) {
  return (
    <span className={className}>
      <span className="sr-only">Proactive Union for Leadership and Student Empowerment</span>
      <span aria-hidden="true">
        {LINES.map(([cap, rest]) => (
          <span key={cap} className="block">
            <span className="text-gold">{cap}</span>
            {rest}
          </span>
        ))}
      </span>
    </span>
  )
}
