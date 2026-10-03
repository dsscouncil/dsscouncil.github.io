import { useState } from 'react'
import { Pencil, Trash2, Plus, Quote } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, Field, inputCls } from '../ui.jsx'

const EMPTY = { name: '', role: '', quote: '', photo: '' }

export default function LeadershipMessages() {
  const { data, add, update, remove } = useAdmin()
  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value })

  const onPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setEditing((ed) => ({ ...ed, photo: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <PageHead title="Leadership Messages" sub="Edit the messages shown on the About page.">
        <button onClick={() => setEditing({ ...EMPTY, isNew: true })} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors" data-write>
          <Plus className="h-4 w-4" /> Add Message
        </button>
      </PageHead>

      <div className="space-y-5">
        {data.leadershipMessages.map((m) => (
          <div key={m.id} className="rounded-3xl border border-border bg-white p-6 md:flex md:items-start md:gap-6">
            <span className="mb-4 block h-20 w-20 shrink-0 rounded-full ring-2 ring-gold shadow-[0_0_12px_2px_hsl(39_53%_57%/0.4)] overflow-hidden md:mb-0">
              {m.photo
                ? <img src={m.photo} alt={m.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                : <span className="flex h-full w-full items-center justify-center bg-surface font-display text-2xl font-bold text-navy">{m.name?.[0]}</span>}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl font-bold text-navy">{m.name}</h3>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mt-0.5">{m.role}</div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{m.quote}</p>
            </div>
            <div className="mt-5 flex gap-2 md:mt-0">
              <button onClick={() => setEditing({ ...m, isNew: false })} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors" data-write>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => setConfirmId(m.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors" data-write>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {data.leadershipMessages.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">No messages yet.</div>
        )}
      </div>

      {editing && (
        <Modal title={editing.isNew ? 'Add Message' : 'Edit Message'} onClose={() => setEditing(null)} wide>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold">
                {editing.photo
                  ? <img src={editing.photo} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  : <span className="flex h-full w-full items-center justify-center bg-surface font-display text-xl font-bold text-navy">{editing.name?.[0] || '?'}</span>}
              </span>
              <input type="file" accept="image/*" onChange={onPhoto} className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" required><input required className={inputCls} value={editing.name} onChange={set('name')} placeholder="Ms. Sapna Chagrani" /></Field>
              <Field label="Role / Title" required><input required className={inputCls} value={editing.role} onChange={set('role')} placeholder="Head of School" /></Field>
            </div>
            <Field label="Message" required><textarea required rows={5} className={inputCls} value={editing.quote} onChange={set('quote')} /></Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button onClick={() => { const { isNew, id, ...fields } = editing; isNew ? add('leadershipMessages', fields) : update('leadershipMessages', id, fields); setEditing(null) }} disabled={!editing.name || !editing.quote} className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40" data-write>Save</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete message?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will remove the message from the About page immediately.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
            <button onClick={() => { remove('leadershipMessages', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600" data-write>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
