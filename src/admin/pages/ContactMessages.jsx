import { useState } from 'react'
import { Trash2, Mail, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, Field, inputCls } from '../ui.jsx'

export default function ContactMessages() {
  const { data, update, remove } = useAdmin()
  const [filter, setFilter] = useState('All')
  const [managing, setManaging] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const all = data.contactMessages
  const list = filter === 'All' ? all : all.filter((m) => (filter === 'Open' ? !m.handled : m.handled))

  const rowCls = (m) =>
    `rounded-3xl border bg-white p-6 transition-colors ${m.handled ? 'border-border opacity-70' : 'border-gold/60 gold-outline'}`

  return (
    <div>
      <PageHead title="Contact Messages" sub={`Messages sent via the Contact page · ${data.settings.year}`} />

      <div className="mb-8 flex flex-wrap gap-2">
        {[
          ['All', `All (${all.length})`],
          ['Open', `Open (${all.filter((m) => !m.handled).length})`],
          ['Handled', `Handled (${all.filter((m) => m.handled).length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              filter === key ? 'bg-navy text-white' : 'bg-white border border-border text-navy/70 hover:border-gold hover:text-navy'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">
          No messages in this view yet.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {list.map((m) => (
          <div key={m.id} className={rowCls(m)}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gold">
                {m.handled ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-gold" />}
                {m.handled ? 'Handled' : 'New message'}
              </div>
              <span className="text-xs text-muted-foreground">{m.date}</span>
            </div>
            <h3 className="mt-2 font-display text-xl font-bold text-navy">{m.subject || 'No subject'}</h3>
            <p className="mt-1.5 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">{m.message}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="font-semibold text-navy">{m.name}</span>
              {m.year && <span>· {m.year}</span>}
            </div>
            <a
              href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your message to the Student Council'))}`}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold transition-colors"
            >
              <Mail className="h-3.5 w-3.5" /> {m.email}
            </a>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => update('contactMessages', m.id, { handled: !m.handled })}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-colors ${
                  m.handled
                    ? 'bg-surface text-navy/70 border border-border hover:text-navy'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {m.handled ? 'Mark Open' : 'Mark Handled'}
              </button>
              <button onClick={() => setManaging(m)} className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-navy hover:border-gold transition-colors">
                Manage
              </button>
              <button onClick={() => setConfirmId(m.id)} aria-label="Delete message" className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {managing && (
        <Modal title="Manage Message" onClose={() => setManaging(null)}>
          <div className="space-y-4">
            <div className="rounded-2xl bg-surface border border-border p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-navy">{managing.name}</span>
                <span className="text-xs text-muted-foreground">{managing.year || '—'}</span>
              </div>
              <a href={`mailto:${managing.email}`} className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold">
                <Mail className="h-3.5 w-3.5" /> {managing.email} <ExternalLink className="h-3 w-3" />
              </a>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{managing.message}</p>
            </div>
            <Field label="Subject">
              <input className={inputCls} value={managing.subject || ''} onChange={(e) => setManaging({ ...managing, subject: e.target.value })} />
            </Field>
            <Field label="Council Notes (private)">
              <textarea rows={3} className={inputCls} value={managing.notes || ''} onChange={(e) => setManaging({ ...managing, notes: e.target.value })} placeholder="Internal notes about this message…" />
            </Field>
            <button
              onClick={() => { update('contactMessages', managing.id, managing); setManaging(null) }}
              className="w-full rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete message?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will permanently remove the message from the dashboard.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy">Cancel</button>
            <button onClick={() => { remove('contactMessages', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
