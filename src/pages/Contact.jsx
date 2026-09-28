import { useState } from 'react'
import { Mail, MessageCircle, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { useAdmin, YEAR_GROUPS } from '../admin/store.jsx'

const yearOptions = [...YEAR_GROUPS, 'Staff / Parent', 'Prefer not to say']

const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition'

export default function Contact() {
  const { data, addContactMessage } = useAdmin()
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', year: '', email: '', gr: '', subject: '', message: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await addContactMessage(form)
      setSent(true)
      setForm({ name: '', year: '', email: '', gr: '', subject: '', message: '' })
    } catch (err) {
      setError(err?.message || 'Something went wrong — please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch with the Council"
        sub="Have a question, idea, or message for the Secondary Student Council? We'd love to hear from you."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
          {/* Info panel */}
          <Reveal>
            <div className="rounded-3xl bg-navy-deep text-white p-8 md:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2">{data.settings.schoolName}</div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Secondary Student Council</h2>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                The Council welcomes messages from students, parents and staff. For official school enquiries, please contact the school directly.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="h-11 w-11 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Official Council Email</div>
                    <a href={`mailto:${data.settings.councilEmail}`} className="mt-1 block text-sm font-semibold text-white hover:text-gold transition-colors">
                      {data.settings.councilEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="h-11 w-11 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Student Voice</div>
                    <Link to="/student-voice" className="mt-1 block text-sm font-semibold text-white hover:text-gold transition-colors">
                      Submit ideas via the Student Voice page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={120}>
            <div className="rounded-3xl bg-card border border-border gold-outline p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-navy">Send us a message</h2>

              {sent ? (
                <div className="mt-8 rounded-2xl bg-surface border border-border p-8 text-center">
                  <Send className="h-10 w-10 text-gold mx-auto" />
                  <h3 className="mt-4 font-display text-xl font-bold text-navy">Message sent!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">The Council has been notified by email and will get back to you as soon as possible.</p>
                  <button onClick={() => setSent(false)} className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">
                    Send another
                  </button>
                </div>
              ) : (
                <form className="mt-8 space-y-5" onSubmit={submit}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Name *</label>
                      <input required value={form.name} onChange={set('name')} className={`mt-2 ${inputCls}`} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Year Group</label>
                      <select value={form.year} onChange={set('year')} className={`mt-2 ${inputCls}`}>
                        <option value="">Select</option>
                        {yearOptions.map((y) => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Email *</label>
                    <input required type="email" value={form.email} onChange={set('email')} className={`mt-2 ${inputCls}`} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Student's GR</label>
                    <input value={form.gr} onChange={set('gr')} className={`mt-2 ${inputCls}`} placeholder="e.g. 12345 (optional)" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Subject</label>
                    <input value={form.subject} onChange={set('subject')} className={`mt-2 ${inputCls}`} placeholder="What's this about?" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={set('message')} className={`mt-2 ${inputCls}`} placeholder="Write your message…" />
                  </div>
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                  )}
                  <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy hover:bg-gold-soft transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {busy ? 'Sending…' : (<><Send className="h-4 w-4" /> Send Message</>)}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
