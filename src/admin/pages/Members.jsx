import { useMemo, useState } from 'react'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { useAdmin, MEMBER_CATEGORIES, YEAR_GROUPS } from '../store.jsx'
import { Modal, PageHead, Field, inputCls } from '../ui.jsx'

const EMPTY = { name: '', role: '', cat: 'Core Team', year: 'Year 10', house: '', tier: '', order: '', description: '', img: '' }

export default function Members() {
  const { data, add, update, remove } = useAdmin()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // null | {…, isNew}
  const [confirmId, setConfirmId] = useState(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? data.members.filter((m) => `${m.name} ${m.role} ${m.cat}`.toLowerCase().includes(q))
      : data.members
    return filtered
  }, [data.members, query])

  const openNew = () => setEditing({ ...EMPTY, isNew: true })
  const openEdit = (m) => setEditing({ ...m, isNew: false })

  const save = () => {
    const { isNew, id, ...fields } = editing
    const payload = {
      ...fields,
      tier: fields.tier === '' ? null : Number(fields.tier),
      order: fields.order === '' ? null : Number(fields.order),
    }
    if (isNew) add('members', payload)
    else update('members', id, payload)
    setEditing(null)
  }

  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value })
  const onPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setEditing((ed) => ({ ...ed, img: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <PageHead title="Council Members" sub={`Add, edit and remove council profiles · ${data.settings.year}`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="w-56 rounded-full border border-border bg-white py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60" />
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors" data-write>
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </PageHead>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <div key={m.id} className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-start gap-4">
              <span className="h-14 w-14 shrink-0 rounded-full ring-2 ring-gold shadow-[0_0_12px_2px_hsl(39_53%_57%/0.4)] overflow-hidden">
                {m.img ? <img src={m.img} alt={m.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-surface font-display font-bold text-navy">{m.name?.[0]}</span>}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold text-navy leading-snug">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role} · {m.cat}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => openEdit(m)} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors" data-write>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => setConfirmId(m.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors" data-write>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">No members match your search.</div>}

      {editing && (
        <Modal title={editing.isNew ? 'Add Council Member' : 'Edit Council Member'} onClose={() => setEditing(null)} wide>
          <div className="space-y-5">
            <Field label="Full Name" required><input required className={inputCls} value={editing.name} onChange={set('name')} /></Field>
            <Field label="Position" required><input required className={inputCls} value={editing.role} onChange={set('role')} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category" required>
                <select className={inputCls} value={editing.cat} onChange={set('cat')}>
                  {MEMBER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Year Group">
                <select className={inputCls} value={editing.year} onChange={set('year')}>
                  {YEAR_GROUPS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </Field>
            </div>
            {(editing.cat === 'House Leadership' || editing.house) && (
              <Field label="House"><input className={inputCls} value={editing.house || ''} onChange={set('house')} placeholder="House of Respect (Alpha)" /></Field>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Hierarchy Tier (lower = higher rank)"><input type="number" className={inputCls} value={editing.tier ?? ''} onChange={set('tier')} /></Field>
              <Field label="Display Order"><input type="number" className={inputCls} value={editing.order ?? ''} onChange={set('order')} /></Field>
            </div>
            <Field label="Short Description"><textarea rows={3} className={inputCls} value={editing.description || ''} onChange={set('description')} /></Field>
            <Field label="Photo">
              <div className="flex items-center gap-4">
                <span className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-gold shrink-0">
                  {editing.img ? <img src={editing.img} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-surface text-muted-foreground">?</span>}
                </span>
                <div className="flex-1 space-y-2">
                  <input type="file" accept="image/*" onChange={onPhoto} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" />
                  <input className={inputCls} value={editing.img?.startsWith('data:') ? '' : editing.img || ''} onChange={(e) => setEditing({ ...editing, img: e.target.value })} placeholder="…or paste an image URL" />
                </div>
              </div>
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button onClick={save} disabled={!editing.name || !editing.role} className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40" data-write>
                {editing.isNew ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Remove member?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">The profile will be removed from the Our Council page immediately.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
            <button onClick={() => { remove('members', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600" data-write>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
