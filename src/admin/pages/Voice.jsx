import { useState } from 'react'
import { Trash2, Eye, EyeOff, Paperclip, ExternalLink } from 'lucide-react'
import { useAdmin, VOICE_STATUSES } from '../store.jsx'
import { Modal, PageHead, StatusPill, Chip, Field, inputCls } from '../ui.jsx'

export default function Voice() {
  const { data, update, remove, canEdit } = useAdmin()
  const [filter, setFilter] = useState('All')
  const [managing, setManaging] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const list = filter === 'All' ? data.submissions : data.submissions.filter((s) => s.status === filter)

  return (
    <div>
      <PageHead title="Student Voice Submissions" sub={`Private — only visible to Council admins · ${data.settings.year}`} />

      <div className="mb-8 flex flex-wrap gap-2">
        {['All', ...VOICE_STATUSES].map((s) => <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>{s}</Chip>)}
      </div>

      {list.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">No submissions in this view.</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {list.map((s) => (
          <div key={s.id} className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-wide text-gold">{s.category} · {s.priority}</div>
              <StatusPill status={s.status} />
            </div>
            <h3 className="mt-2 font-display text-xl font-bold text-navy">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>GR: {s.gr || '—'}</span>
              {s.name && <span>· {s.name}</span>}
              {s.year && <span>· {s.year}</span>}
              <span>· {s.ref}</span>
              <span>· {s.date}</span>
            </div>
            {s.file && (
              <a
                href={s.file.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-navy transition-colors hover:border-gold"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Paperclip className="h-4 w-4 shrink-0 text-gold" />
                  <span className="truncate">{s.file.name}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </a>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <select disabled={!canEdit} value={s.status} onChange={(e) => update('submissions', s.id, { status: e.target.value })}
                className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50">
                {VOICE_STATUSES.map((v) => <option key={v}>{v}</option>)}
              </select>
              <button onClick={() => setManaging(s)} className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-navy hover:border-gold transition-colors">Manage</button>
              <button onClick={() => update('submissions', s.id, { published: !s.published })}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-colors ${s.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-surface text-navy/70 border border-border hover:text-navy'}`}
                data-write>
                {s.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {s.published ? 'Published' : 'Publish'}
              </button>
              <button onClick={() => setConfirmId(s.id)} aria-label="Delete submission" className="ml-auto h-9 w-9 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors" data-write>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {managing && (
        <Modal title="Manage Submission" onClose={() => setManaging(null)}>
          <div className="space-y-4">
            <Field label="Title"><input disabled={!canEdit} className={inputCls} value={managing.title} onChange={(e) => setManaging({ ...managing, title: e.target.value })} /></Field>
            <Field label="Description"><textarea disabled={!canEdit} rows={4} className={inputCls} value={managing.description} onChange={(e) => setManaging({ ...managing, description: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <select disabled={!canEdit} className={inputCls} value={managing.status} onChange={(e) => setManaging({ ...managing, status: e.target.value })}>
                  {VOICE_STATUSES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Category"><input disabled={!canEdit} className={inputCls} value={managing.category} onChange={(e) => setManaging({ ...managing, category: e.target.value })} /></Field>
            </div>
            <Field label="Council Notes (private)">
              <textarea disabled={!canEdit} rows={3} className={inputCls} value={managing.notes || ''} onChange={(e) => setManaging({ ...managing, notes: e.target.value })} placeholder="Internal notes about this submission…" />
            </Field>
            {managing.file && (
              <a
                href={managing.file.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-navy transition-colors hover:border-gold"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Paperclip className="h-4 w-4 shrink-0 text-gold" />
                  <span className="truncate">{managing.file.name}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </a>
            )}
            <button
              onClick={() => { update('submissions', managing.id, managing); setManaging(null) }}
              className="w-full rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors"
              data-write
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete submission?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will permanently remove the submission from the dashboard.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
            <button onClick={() => { remove('submissions', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600" data-write>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
