import { useState } from 'react'
import { Pencil, Trash2, Plus, FileText } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, Field, inputCls } from '../ui.jsx'

const CATS = ['Council Charter', 'Meeting Information', 'Student Resources', 'Forms', 'Guidelines', 'Campaign Materials']
const EMPTY = { title: '', description: '', category: 'Council Charter', url: '' }

export default function Documents() {
  const { data, add, update, remove } = useAdmin()
  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value })

  return (
    <div>
      <PageHead title="Council Documents" sub={`Public documents shown on the Documents page · ${data.settings.year}`}>
        <button onClick={() => setEditing({ ...EMPTY, isNew: true })} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors" data-write>
          <Plus className="h-4 w-4" /> Add Document
        </button>
      </PageHead>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.documents.map((d) => (
          <div key={d.id} className="rounded-3xl border border-border bg-white p-6">
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{d.category}</span>
            <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-bold text-navy">
              <FileText className="h-4 w-4 text-gold" /> {d.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{d.description}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setEditing({ ...d, isNew: false })} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors" data-write>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => setConfirmId(d.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors" data-write>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {data.documents.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-gold" />
          <h3 className="mt-4 font-display text-xl font-bold text-navy">No documents yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Documents you add here appear instantly on the public Documents page.</p>
        </div>
      )}

      {editing && (
        <Modal title={editing.isNew ? 'Add Document' : 'Edit Document'} onClose={() => setEditing(null)}>
          <div className="space-y-5">
            <Field label="Title" required><input required className={inputCls} value={editing.title} onChange={set('title')} /></Field>
            <Field label="Description"><textarea rows={3} className={inputCls} value={editing.description} onChange={set('description')} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category"><select className={inputCls} value={editing.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Link (URL)"><input className={inputCls} value={editing.url || ''} onChange={set('url')} placeholder="https://…" /></Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button onClick={() => { const { isNew, id, ...fields } = editing; isNew ? add('documents', fields) : update('documents', id, fields); setEditing(null) }} disabled={!editing.title} className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40" data-write>Save</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete document?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will remove the document from the site immediately.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
            <button onClick={() => { remove('documents', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600" data-write>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
