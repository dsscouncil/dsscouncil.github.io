import { useState } from 'react'
import { MessageCircle, ShieldCheck, Paperclip, X, Loader2, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin, YEAR_GROUPS, VOICE_CATEGORIES, VOICE_PRIORITIES } from '../admin/store.jsx'
import { MAX_UPLOAD_MB } from '../admin/supabase.js'

const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition'

export default function StudentVoice() {
  const { data, addSubmission, uploadFile } = useAdmin()
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ gr: '', name: '', year: '', category: '', priority: 'Medium', title: '', description: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const pickFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!f) return
    if (f.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`File is too large — please keep it under ${MAX_UPLOAD_MB}MB.`)
      return
    }
    setError('')
    setFile(f)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const payload = { ...form }
      if (file) {
        const up = await uploadFile(file)
        payload.fileName = up.name
        payload.fileUrl = up.url
      }
      const submissionRef = await addSubmission(payload)
      setRef(submissionRef)
      setSent(true)
      setFile(null)
      setForm({ gr: '', name: '', year: '', category: '', priority: 'Medium', title: '', description: '' })
    } catch (err) {
      setError(err?.message || 'Something went wrong — please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Student Voice"
        title="Your Voice Matters."
        sub="The Student Council exists to listen. Share an idea, suggestion, concern, or proposal and help shape student life at Dubai Scholars."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-5 gap-10 items-start">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-3xl bg-card border border-border gold-outline p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-xl bg-navy flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-gold" />
                </span>
                <h2 className="font-display text-2xl font-bold text-navy">Share Your Voice</h2>
              </div>

              {sent ? (
                <div className="mt-8 rounded-2xl bg-surface border border-border p-8 text-center">
                  <ShieldCheck className="h-10 w-10 text-gold mx-auto" />
                  <h3 className="mt-4 font-display text-xl font-bold text-navy">Thank you — your submission was recorded.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your reference is <span className="font-bold text-navy">{ref}</span>. Every submission is reviewed by the Council. Your privacy is protected.
                  </p>
                  <button onClick={() => setSent(false)} className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">
                    Submit another
                  </button>
                </div>
              ) : (
                <form className="mt-8 space-y-5" onSubmit={submit}>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">GR Number *</label>
                      <input required value={form.gr} onChange={set('gr')} className={`mt-2 ${inputCls}`} placeholder="e.g. 12345" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Name *</label>
                      <input required value={form.name} onChange={set('name')} className={`mt-2 ${inputCls}`} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Year Group *</label>
                      <select required value={form.year} onChange={set('year')} className={`mt-2 ${inputCls}`}>
                        <option value="" disabled>Select year group</option>
                        {YEAR_GROUPS.map((y) => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Category *</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {VOICE_CATEGORIES.map((c) => (
                          <button type="button" key={c} onClick={() => setForm({ ...form, category: c })}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${form.category === c ? 'bg-navy text-white' : 'bg-surface text-navy/70 hover:text-navy'}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Priority *</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {VOICE_PRIORITIES.map((p) => (
                          <button type="button" key={p} onClick={() => setForm({ ...form, priority: p })}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${form.priority === p ? 'bg-gold text-navy' : 'bg-surface text-navy/70 hover:text-navy'}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Title *</label>
                    <input required value={form.title} onChange={set('title')} className={`mt-2 ${inputCls}`} placeholder="A short summary of your idea" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Description *</label>
                    <textarea required value={form.description} onChange={set('description')} rows={5} className={`mt-2 ${inputCls}`} placeholder="Tell us more — what's the idea, why does it matter, and how could it work?" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Evidence (optional)</label>
                    <input type="file" id="voice-evidence" className="hidden" onChange={pickFile} accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.csv" />
                    {!file ? (
                      <label
                        htmlFor="voice-evidence"
                        className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:border-gold hover:text-navy"
                      >
                        <Paperclip className="h-4 w-4 text-gold shrink-0" />
                        <span>Attach a photo or document as evidence — PDF, images or Office files, up to {MAX_UPLOAD_MB}MB</span>
                      </label>
                    ) : (
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Paperclip className="h-4 w-4 text-gold shrink-0" />
                          <span className="truncate text-sm font-medium text-navy">{file.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                        </div>
                        <button type="button" onClick={() => setFile(null)} aria-label="Remove file" className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-navy/5 hover:text-navy transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={busy} className="w-full rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy hover:bg-gold-soft transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {busy ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      'Share Your Voice'
                    )}
                  </button>
                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                    Submissions are private. Only Council admins can view them.
                  </p>
                </form>
              )}
            </div>
          </Reveal>

          {/* Ideas board */}
          <Reveal delay={120} className="lg:col-span-2">
            <div className="rounded-3xl bg-card border border-border p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-navy">Ideas Board</h2>
              <p className="mt-2 text-sm text-muted-foreground">A transparent look at approved ideas and their progress.</p>
              <div className="mt-6 space-y-4">
                {data.siteContent.ideasBoard.map((idea) => (
                  <div key={idea.id} className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gold-ink">{idea.category}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${idea.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{idea.status}</span>
                    </div>
                    <h3 className="mt-2 font-display font-bold text-navy">{idea.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{idea.description}</p>
                  </div>
                ))}
                {data.siteContent.ideasBoard.length === 0 && (
                  <p className="text-sm text-muted-foreground">No approved ideas to show yet.</p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
