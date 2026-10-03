import { useRef, useState } from 'react'
import { Download, Upload, RotateCcw, Check, BarChart3, Loader2 } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, PageHead, Field, inputCls } from '../ui.jsx'

function VoiceAnalytics() {
  const { data, canEdit } = useAdmin()
  const subs = data.submissions
  const tally = (key) => {
    const map = {}
    for (const s of subs) { const v = s[key] || '—'; map[v] = (map[v] || 0) + 1 }
    return Object.entries(map).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)
  }

  const bars = [
    ['By Category', 'category'],
    ['By Priority', 'priority'],
    ['By Status', 'status'],
    ['By Year Group', 'year'],
  ]

  return (
    <div className="rounded-3xl border border-border bg-white p-7">
      <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-navy">
        <BarChart3 className="h-5 w-5 text-gold" /> Voice Analytics
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Trends across {subs.length} submission{subs.length === 1 ? '' : 's'} · {data.settings.year}</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {bars.map(([title, key]) => {
          const entries = tally(key)
          const max = Math.max(1, ...entries.map((e) => e.count))
          return (
            <div key={key}>
              <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
              <div className="mt-3 space-y-3">
                {entries.map((e) => (
                  <div key={e.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-navy">{e.label}</span>
                      <span className="text-muted-foreground tabular-nums">{e.count} · {Math.round((e.count / subs.length) * 100)}%</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(e.count / max) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {entries.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DataManager() {
  const { data, setSettings, exportJson, importJson, canEdit } = useAdmin()
  const fileRef = useRef(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [importError, setImportError] = useState('')
  const [year, setYear] = useState(data.settings.year)
  const [savedYear, setSavedYear] = useState(false)

  const [importing, setImporting] = useState(false)

  const onImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        await importJson(String(reader.result))
        setImportError('')
      } catch (err) {
        setImportError(err.message || 'Could not import that file.')
      } finally {
        setImporting(false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-7">
      <h2 className="font-display text-2xl font-bold text-navy">Platform Settings &amp; Data</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Academic Year (shown across the site)">
          <div className="flex gap-2">
            <input className={inputCls} disabled={!canEdit} value={year} onChange={(e) => { setYear(e.target.value); setSavedYear(false) }} />
            <button disabled={!canEdit} onClick={() => { setSettings({ year: year.trim() || data.settings.year }); setSavedYear(true); setTimeout(() => setSavedYear(false), 1500) }}
              className="shrink-0 rounded-xl bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40">
              {savedYear ? <Check className="h-4 w-4" /> : 'Save'}
            </button>
          </div>
        </Field>
        <Field label="Council Email (shown in footer & contact)">
          <input className={inputCls} disabled={!canEdit} defaultValue={data.settings.councilEmail} onBlur={(e) => setSettings({ councilEmail: e.target.value.trim() })} />
        </Field>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button onClick={exportJson} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:border-gold transition-colors">
          <Download className="h-4 w-4" /> Export JSON
        </button>
        <button disabled={importing} onClick={() => fileRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:border-gold transition-colors disabled:opacity-50" data-write>
          {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {importing ? 'Restoring…' : 'Import JSON'}
        </button>
        <button onClick={() => setConfirmReset(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors" data-write>
          <RotateCcw className="h-4 w-4" /> Restore from Backup
        </button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
      </div>
      {importError && <p className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">{importError}</p>}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Export at the end of each term to archive the year&rsquo;s data, then restore it any time.
        At the start of a new Council year, export an archive, then edit content directly (or restore a prepared file) for the incoming council.
      </p>

      {confirmReset && (
        <Modal title="Import a full data file?" onClose={() => setConfirmReset(false)}>
          <p className="text-sm text-muted-foreground">Choose the JSON export you want to restore. This replaces all site content (members, initiatives, events, clubs, news, documents, quotes, stats, pillars, ideas and settings) with the file's contents. Submissions and admin accounts are not affected.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setConfirmReset(false)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy">Cancel</button>
            <button onClick={() => { setConfirmReset(false); fileRef.current?.click() }} className="flex-1 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep" data-write>Choose file…</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default function Settings() {
  return (
    <div className="space-y-8">
      <PageHead title="Settings" sub="Voice analytics, academic year and data management." />
      <VoiceAnalytics />
      <DataManager />
    </div>
  )
}
