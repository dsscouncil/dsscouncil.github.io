import { useState } from 'react'
import { Pencil, Trash2, Plus, Search, Star } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, StatusPill, Field, inputCls } from '../ui.jsx'

const STATUSES = ['Planning', 'In Progress', 'Completed']
const CATS = ['Student Voice', 'Community', 'Sustainability', 'Academic', 'Wellbeing', 'Events', 'Charity']
const EMPTY = { title: '', description: '', category: 'Events', status: 'Planning', date: '', lead: '', featured: true }

export default function Initiatives() {
  const { data, add, update, remove } = useAdmin()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const q = query.trim().toLowerCase()
  const list = q ? data.initiatives.filter((i) => `${i.title} ${i.category}`.toLowerCase().includes(q)) : data.initiatives

  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value })

  return (
    <div>
      <PageHead title="Initiatives" sub={`Manage Council projects and campaigns · ${data.settings.year}`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="w-56 rounded-full border border-border bg-white py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60" />
        </div>
        <button onClick={() => setEditing({ ...EMPTY, isNew: true })} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors" data-write>
          <Plus className="h-4 w-4" /> Add Initiative
        </button>
      </PageHead>

      <div className="grid gap-6 lg:grid-cols-2">
        {list.map((i) => (
          <div key={i.id} className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-wide text-gold">{i.category}</div>
              <div className="flex items-center gap-2">
                {i.featured && <Star className="h-4 w-4 fill-gold text-gold" />}
                <StatusPill status={i.status} />
              </div>
            </div>
            <h3 className="mt-2 font-display text-xl font-bold text-navy">{i.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{i.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
              {i.date && <span>{i.date}</span>}
              {i.lead && <span>Lead: {i.lead}</span>}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setEditing({ ...i, isNew: false })} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors" data-write>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => update('initiatives', i.id, { featured: !i.featured })} className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-navy/70 hover:border-gold hover:text-navy transition-colors" data-write>
                {i.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button onClick={() => setConfirmId(i.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors" data-write>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">No initiatives yet.</div>}

      {editing && (
        <Modal title={editing.isNew ? 'Add Initiative' : 'Edit Initiative'} onClose={() => setEditing(null)} wide>
          <div className="space-y-5">
            <Field label="Title" required><input required className={inputCls} value={editing.title} onChange={set('title')} /></Field>
            <Field label="Description"><textarea rows={3} className={inputCls} value={editing.description} onChange={set('description')} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category">
                <select className={inputCls} value={editing.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
              </Field>
              <Field label="Status">
                <select className={inputCls} value={editing.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Target Date"><input className={inputCls} value={editing.date || ''} onChange={set('date')} placeholder="15 January 2027" /></Field>
              <Field label="Lead"><input className={inputCls} value={editing.lead || ''} onChange={set('lead')} placeholder="Council member name" /></Field>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-navy">
              <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 accent-[hsl(39_53%_57%)]" />
              Show in the Featured section on the site
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button onClick={() => { const { isNew, id, ...fields } = editing; isNew ? add('initiatives', fields) : update('initiatives', id, fields); setEditing(null) }} disabled={!editing.title} className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40" data-write>Save</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete initiative?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will remove the initiative from the site immediately.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
            <button onClick={() => { remove('initiatives', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600" data-write>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
