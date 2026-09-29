import { useState } from 'react'
import { Pencil, Trash2, Plus, Handshake, DollarSign, Palette, PenTool, Dumbbell, Cpu, Mic, Users } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, Field, inputCls } from '../ui.jsx'

const CATS = ['Academic', 'Sports', 'Creative', 'Technology', 'Community', 'Culture', 'Leadership']
const EMPTY = { name: '', description: '', category: 'Academic', schedule: '-', location: '-', leads: '-', join: '-', icon: 'Handshake' }

const ICONS = { CurrencyDollar: DollarSign, Palette, PenTool, Dumbbell, Cpu, Mic, Users, Handshake }
const ClubIcon = ({ name }) => {
  const Icon = ICONS[name] || Handshake
  return <Icon className="h-4 w-4 text-gold" />
}

export default function Clubs() {
  const { data, add, update, remove } = useAdmin()
  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value })

  return (
    <div>
      <PageHead title="Clubs & Activities" sub={`Manage the club directory shown on the site · ${data.settings.year}`}>
        <button onClick={() => setEditing({ ...EMPTY, isNew: true })} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">
          <Plus className="h-4 w-4" /> Add Club
        </button>
      </PageHead>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.clubs.map((c) => (
          <div key={c.id} className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center text-gold text-sm font-semibold">
                <ClubIcon name={c.icon} />
              </span>
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{c.category}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-navy">{c.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setEditing({ ...c, isNew: false })} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => setConfirmId(c.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {data.clubs.length === 0 && <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">No clubs yet.</div>}

      {editing && (
        <Modal title={editing.isNew ? 'Add Club' : 'Edit Club'} onClose={() => setEditing(null)} wide>
          <div className="space-y-5">
            <Field label="Club Name" required><input required className={inputCls} value={editing.name} onChange={set('name')} /></Field>
            <Field label="Description"><textarea rows={3} className={inputCls} value={editing.description} onChange={set('description')} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category"><select className={inputCls} value={editing.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="How to Join"><input className={inputCls} value={editing.join || ''} onChange={set('join')} placeholder="e.g. Sign up with the PE department" /></Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Schedule"><input className={inputCls} value={editing.schedule || ''} onChange={set('schedule')} placeholder="Tuesdays, Thursdays" /></Field>
              <Field label="Location"><input className={inputCls} value={editing.location || ''} onChange={set('location')} /></Field>
              <Field label="Led By"><input className={inputCls} value={editing.leads || ''} onChange={set('leads')} placeholder="Amit, Arjun" /></Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button onClick={() => { const { isNew, id, ...fields } = editing; isNew ? add('clubs', fields) : update('clubs', id, fields); setEditing(null) }} disabled={!editing.name} className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete club?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will remove the club from the site immediately.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy">Cancel</button>
            <button onClick={() => { remove('clubs', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
