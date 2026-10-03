import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, UserPlus, Trash2, KeyRound, Pencil, Users } from 'lucide-react'
import { useAdmin } from '../store.jsx'
import { Modal, Field, inputCls } from '../ui.jsx'

const ROLES = [
  { value: 'super', label: 'Super', hint: 'Can edit the site and manage every other account.' },
  { value: 'editor', label: 'Editor', hint: 'Can add, edit and delete content, but cannot manage accounts.' },
  { value: 'viewer', label: 'Viewer', hint: 'Read-only. Can see the console but change nothing.' },
]

const ROLE_STYLES = {
  super: 'bg-navy text-white',
  editor: 'bg-surface text-navy border border-border',
  viewer: 'bg-gold/15 text-gold-ink border border-gold/40',
}

const EMPTY = { username: '', displayName: '', password: '', role: 'editor' }

export default function Accounts() {
  const { accounts, session, manageAccount, isSuper } = useAdmin()
  const [issuing, setIssuing] = useState(null)
  const [resetting, setResetting] = useState(null)
  const [renaming, setRenaming] = useState(null)
  const [removing, setRemoving] = useState(null)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState('')

  // The nav hides this entry for non-Super accounts; this covers a typed URL.
  // It has to come after every hook, so all the state above is declared first.
  if (!isSuper) return <Navigate to="/admin" replace />

  // Every mutation goes through here so a rejected change shows a message
  // instead of silently doing nothing.
  const run = async (fn, after) => {
    setBusy(true)
    setProblem('')
    try {
      await fn()
      after()
    } catch (e) {
      setProblem(e.message || 'That change could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  const issue = () => run(
    () => manageAccount('add', issuing.username, {
      password: issuing.password, displayName: issuing.displayName, role: issuing.role,
    }),
    () => setIssuing(null),
  )

  return (
    <div className="rounded-3xl border border-border bg-white p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy">Admin Accounts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Issue new logins or change what existing ones can do. Super accounts can edit the site and manage every other account.
          </p>
        </div>
        <button
          onClick={() => { setProblem(''); setIssuing({ ...EMPTY }) }}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors"
          data-write
        >
          <UserPlus className="h-4 w-4" /> Issue Account
        </button>
      </div>

      {problem && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{problem}</p>
      )}

      <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a) => {
          const isMe = a.username === session?.username
          return (
            <div key={a.username} className="rounded-3xl border border-border bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-bold text-navy">{a.display_name}</h3>
                  <p className="truncate text-sm text-muted-foreground">@{a.username}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${ROLE_STYLES[a.role]}`}>
                  {a.role}
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {ROLES.find((r) => r.value === a.role)?.hint}
              </p>

              <div className="mt-5 space-y-3">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-navy/70">Role</span>
                  <select
                    className={`${inputCls} mt-1.5`}
                    value={a.role}
                    disabled={isMe || busy}
                    onChange={(e) => run(
                      () => manageAccount('set_role', a.username, { role: e.target.value }),
                      () => {},
                    )}
                  >
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </label>
                {isMe && (
                  <p className="text-xs text-muted-foreground">You cannot change your own role.</p>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setProblem(''); setResetting({ username: a.username, display_name: a.display_name, password: '' }) }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors"
                    data-write
                  >
                    <KeyRound className="h-3.5 w-3.5" /> Password
                  </button>
                  <button
                    onClick={() => { setProblem(''); setRenaming({ username: a.username, displayName: a.display_name }) }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-border transition-colors"
                    data-write
                  >
                    <Pencil className="h-3.5 w-3.5" /> Rename
                  </button>
                  {!isMe && (
                    <button
                      onClick={() => { setProblem(''); setRemoving(a) }}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors"
                      data-write
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {accounts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center">
          <Users className="mx-auto h-10 w-10 text-gold" />
          <h3 className="mt-4 font-display text-xl font-bold text-navy">No accounts to show</h3>
          <p className="mt-2 text-sm text-muted-foreground">Accounts are listed here for Super accounts only.</p>
        </div>
      )}

      {issuing && (
        <Modal title="Issue a new account" onClose={() => setIssuing(null)}>
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Username" required>
                <input autoFocus className={inputCls} value={issuing.username} onChange={(e) => setIssuing({ ...issuing, username: e.target.value })} placeholder="e.g. Coreteam" />
              </Field>
              <Field label="Display name">
                <input className={inputCls} value={issuing.displayName} onChange={(e) => setIssuing({ ...issuing, displayName: e.target.value })} placeholder="Shown in the console" />
              </Field>
            </div>
            <Field label="Password" required>
              <input type="text" className={inputCls} value={issuing.password} onChange={(e) => setIssuing({ ...issuing, password: e.target.value })} placeholder="At least 6 characters" />
            </Field>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-navy/70">Role</span>
              <div className="mt-2 space-y-2">
                {ROLES.map((r) => (
                  <label key={r.value} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-3.5 transition-colors hover:border-gold">
                    <input
                      type="radio"
                      name="new-role"
                      className="mt-1 accent-navy"
                      checked={issuing.role === r.value}
                      onChange={() => setIssuing({ ...issuing, role: r.value })}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-navy">{r.label}</span>
                      <span className="block text-xs text-muted-foreground">{r.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIssuing(null)} className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-navy hover:bg-surface transition-colors">Cancel</button>
              <button
                onClick={issue}
                disabled={busy || !issuing.username.trim() || issuing.password.length < 6}
                className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40"
                data-write
              >
                Issue Account
              </button>
            </div>
          </div>
        </Modal>
      )}

      {resetting && (
        <Modal title={`Reset password for @${resetting.username}`} onClose={() => setResetting(null)}>
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Set a new password for {resetting.display_name}. Any active session for this account is signed out.
            </p>
            <Field label="New password" required>
              <input autoFocus type="text" className={inputCls} value={resetting.password} onChange={(e) => setResetting({ ...resetting, password: e.target.value })} placeholder="At least 6 characters" />
            </Field>
            <div className="flex gap-3">
              <button onClick={() => setResetting(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
              <button
                onClick={() => run(() => manageAccount('set_password', resetting.username, { password: resetting.password }), () => setResetting(null))}
                disabled={busy || resetting.password.length < 6}
                className="flex-1 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40"
                data-write
              >
                Reset Password
              </button>
            </div>
          </div>
        </Modal>
      )}

      {renaming && (
        <Modal title={`Rename @${renaming.username}`} onClose={() => setRenaming(null)}>
          <div className="space-y-5">
            <Field label="Display name" required>
              <input autoFocus className={inputCls} value={renaming.displayName} onChange={(e) => setRenaming({ ...renaming, displayName: e.target.value })} />
            </Field>
            <div className="flex gap-3">
              <button onClick={() => setRenaming(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
              <button
                onClick={() => run(() => manageAccount('set_display_name', renaming.username, { displayName: renaming.displayName }), () => setRenaming(null))}
                disabled={busy || !renaming.displayName.trim()}
                className="flex-1 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-40"
                data-write
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {removing && (
        <Modal title="Remove this account?" onClose={() => setRemoving(null)}>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-navy">{removing.display_name}</span> ({removing.role}) will lose access
              immediately and any active session is signed out. This cannot be undone.
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setRemoving(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy" data-write>Cancel</button>
            <button
              onClick={() => run(() => manageAccount('remove', removing.username), () => setRemoving(null))}
              disabled={busy}
              className="flex-1 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-40"
              data-write
            >
              Remove Account
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}