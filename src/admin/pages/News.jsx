import { useState } from 'react'
import { Pencil, Trash2, Plus, Star } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, StatusPill, Field, inputCls } from '../ui.jsx'

const CATS = ['Announcement', 'Project Update', 'Event Recap', 'Achievement', 'Campaign', 'Student Opportunity']
const EMPTY = { title: '', excerpt: '', bodyText: '', category: 'Announcement', date: '', author: '', featured: false }

export default function News() {
  const { data, add, update, remove } = useAdmin()
  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.value })

  const save = () => {
    const { isNew, id, bodyText, ...fields } = editing
    const payload = { ...fields, body: bodyText.split('\n').filter((p) => p.trim()) }
    if (isNew) add('news', payload)
    else update('news', id, payload)
    setEditing(null)
  }

  return (
    <div>
      <PageHead title="News Articles" sub={`Announcements and updates shown on the News page · ${data.settings.year}`}>
        <button onClick={() => setEditing({ ...EMPTY, isNew: true })} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">
          <Plus className="h-4 w-4" /> Add Article
        </button>
      </PageHead>

      <div className="space-y-5">
        {data.news.map((n) => (
          <div key={n.id} className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">{n.category}</span>
                {n.featured && <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy">Featured</span>}
              </div>
              <StatusPill status="Completed" />
            </div>
            <h3 className="mt-3 font-display text-xl font-bold text-navy">{n.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span>{n.date}</span>
              <span>By {n.author}</span>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setEditing({ ...n, isNew: false, bodyText: (n.body || []).join('\n') })} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => update('news', n.id, { featured: !n.featured })} className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-navy/70 hover:border-gold hover:text-navy transition-colors">
                {n.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button onClick={() => setConfirmId(n.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {data.news.length === 0 && <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-muted-foreground">No articles yet.</div>}
      </div>

      {editing && (
        <Modal title={editing.isNew ? 'Add Article' : 'Edit Article'} onClose={() => setEditing(null)} wide>
          <div className="space-y-5">
            <Field label="Title" required><input required className={inputCls} value={editing.title} onChange={set('title')} /></Field>
            <Field label="Excerpt (preview text)"><textarea rows={2} className={inputCls} value={editing.excerpt} onChange={set('excerpt')} /></Field>
            <Field label="Body (one paragraph per line)"><textarea rows={7} className={inputCls} value={editing.bodyText} onChange={set('bodyText')} /></Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Category"><select className={inputCls} value={editing.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Date"><input className={inputCls} value={editing.date} onChange={set('date')} placeholder="1 September 2026" /></Field>
              <Field label="Author"><input className={inputCls} value={editing.author} onChange={set('author')} /></Field>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-navy">
              <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 accent-[hsl(39_53%_57%)]" />
              Mark as featured
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button onClick={save} disabled={!editing.title} className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete article?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-muted-foreground">This will remove the article from the site immediately.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy">Cancel</button>
            <button onClick={() => { remove('news', confirmId); setConfirmId(null) }} className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
