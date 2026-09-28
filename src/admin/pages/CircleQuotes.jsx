import { useState } from 'react'
import { Save, Check } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { PageHead, Field, inputCls } from '../ui.jsx'

const RING_COLORS = {
  'Departmental Leadership': 'hsl(210 22% 88%)',
  'Sports Council': 'hsl(210 30% 92%)',
  'Well-being Leadership': 'hsl(213 45% 32%)',
  'House Leadership': 'hsl(213 65% 14%)',
  'Core Team': 'hsl(39 53% 57%)',
}

function QuoteCard({ cq }) {
  const { update } = useAdmin()
  const [label, setLabel] = useState(cq.label)
  const [quote, setQuote] = useState(cq.quote)
  const [saved, setSaved] = useState(false)

  const dirty = label !== cq.label || quote !== cq.quote
  const save = () => {
    update('circleQuotes', cq.id, { label, quote })
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-7">
      <div className="flex items-center gap-3">
        <span className="h-3.5 w-3.5 rounded-full" style={{ background: RING_COLORS[cq.key] || 'hsl(213 20% 70%)' }} />
        <h3 className="font-display text-2xl font-bold text-navy">{cq.key}</h3>
      </div>
      <div className="mt-5 space-y-4">
        <Field label="Circle Label">
          <input className={inputCls} value={label} onChange={(e) => { setLabel(e.target.value); setSaved(false) }} />
        </Field>
        <Field label="Hover Quote">
          <textarea rows={3} className={inputCls} value={quote} onChange={(e) => { setQuote(e.target.value); setSaved(false) }} />
        </Field>
        <button onClick={save} disabled={!dirty || !label.trim() || !quote.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40">
          {saved ? <Check className="h-4 w-4 text-gold" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function CircleQuotes() {
  const { data } = useAdmin()
  const order = ['Departmental Leadership', 'Sports Council', 'Well-being Leadership', 'House Leadership', 'Core Team']
  const sorted = [...data.circleQuotes].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))

  return (
    <div>
      <PageHead title="Council Circle Quotes" sub="Edit the label and hover quote for each circle on the About page. Changes appear instantly on the live site." />
      <div className="grid gap-6 xl:grid-cols-2">
        {sorted.map((cq) => <QuoteCard key={cq.id} cq={cq} />)}
      </div>
    </div>
  )
}
