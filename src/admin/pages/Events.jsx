import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, Field, inputCls } from '../ui.jsx'

const TYPES = ['Council Event', 'Awareness Day', 'Competition', 'Campaign', 'Workshop']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const EMPTY = { day: '1', month: 'OCT', type: 'Council Event', title: '', location: '', org: '', description: '' }

export default function Events() {
  const { data, add, update, remove } = useAdmin()
  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value })

  return (
    <div>
      <PageHead title="Events" sub={`Manage upcoming Council events and campaigns · ${data.settings.year}`}>
        <button onClick={() => setEditing({ ...EMPTY, isNew: true })} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors" data-write>
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </PageHead>

      <div className="space-y-5">
        {data.events.map((e) => (
          <div key={e.id} className="flex flex-col gap-4 rounded-3xl border border-border bg-white p-5 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-navy text-white">
              <span className="font-display text-2xl font-bold text-gold">{e.day}</span>
              <span className="text-[10px] font-bold tracking-widest">{e.month}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold uppercase tracking-wide text-gold">{e.type}</div>
              <h3 className="font-display text-lg font-bold text-navy">{e.title}</h3>
              <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                {e.location && <span>{e.location}</span>}
                {e.org && <span>{e.org}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...e, isNew: false })} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors" data-write>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => setConfirmId(e.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors" data-write>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {data.events.length === 0 && <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">No events yet.</div>}
      </div>

      {editing && (
        <Modal title={editing.isNew ? 'Add Event' : 'Edit Event'} onClose={() => setEditing(null)} wide>
          <div className="space-y-5">
            <Field label="Title" required><input required className={inputCls} value={editing.title} onChange={set('title')} /></Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Day"><input type="number" min="1" max="31" className={inputCls} value={editing.day} onChange={set('day')} /></Field>
              <Field label="Month"><select className={inputCls} value={editing.month} onChange={set('month')}>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select></Field>
              <Field label="Type"><select className={inputCls} value={editing.type} onChange={set('type')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Location"><input className={inputCls} value={editing.location || ''} onChange={set('location')} placeholder="School Auditorium" /></Field>
              <Field label="Organiser"><input className={inputCls} value={editing.org || ''} onChange={set('org')} placeholder="Secondary Student Council" /></Field>
            </div>
            <Field label="Description"><textarea rows={3} className={inputCls} value={editing.description || ''} onChange={set('description')} /></Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button onClick={() => { const { isNew, id, ...fields } = editing; isNew ? add('events', fields) : update('events', id, fields); setEditing(null) }} disabled={!editing.title} className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40" data-write>Save</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete event?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will remove the event from the site immediately.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
            <button onClick={() => { remove('events', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600" data-write>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
