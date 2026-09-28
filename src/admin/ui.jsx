import { useEffect } from 'react'
import { X } from 'lucide-react'

export const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-navy placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition'

export function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-navy/70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export function Modal({ title, onClose, children, wide }) {
  // Lock page scroll while the modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 md:p-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-navy-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} rounded-3xl bg-white shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-border px-7 py-5">
          <h2 className="font-display text-2xl font-bold text-navy">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="h-9 w-9 rounded-full hover:bg-surface flex items-center justify-center text-navy/60">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  )
}

export function PageHead({ title, sub, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">{title}</h1>
        {sub && <p className="mt-1.5 text-muted-foreground">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  )
}

const STATUS_STYLES = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Received: 'bg-surface text-navy border-border',
  'Unable to Proceed': 'bg-red-50 text-red-600 border-red-200',
}

export function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-surface text-navy border-border'}`}>
      {status}
    </span>
  )
}

export function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-navy text-white' : 'bg-white border border-border text-navy/70 hover:border-gold hover:text-navy'
      }`}
    >
      {children}
    </button>
  )
}
