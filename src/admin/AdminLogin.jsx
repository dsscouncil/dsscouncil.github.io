import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, ArrowLeft, User } from 'lucide-react'
import { useAdmin } from './store.jsx'
import { LOGO } from '../data/content.js'
import { inputCls, Field } from './ui.jsx'

export default function AdminLogin() {
  const { login } = useAdmin()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Sign in failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-deep px-5 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <span className="h-16 w-16 overflow-hidden rounded-full bg-white ring-1 ring-border">
            <img src={LOGO} alt="Council logo" className="h-full w-full object-contain" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-navy">Governor&rsquo;s Console</h1>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Council Admin</p>
          <p className="mt-3 text-sm text-muted-foreground">Council admin sign in.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Username" required>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input required value={username} onChange={(e) => setUsername(e.target.value)} className={`${inputCls} pl-11`} placeholder="e.g. Burhanuddin" autoComplete="username" />
            </div>
          </Field>
          <Field label="Password" required>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" autoComplete="current-password" />
          </Field>
          {error && <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-50">
            <LogIn className="h-4 w-4" />
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
          <p className="text-center text-xs text-muted-foreground">Only Council admins with issued accounts can access this dashboard.</p>
        </form>

        <button onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy/60 hover:text-navy transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </button>
      </div>
    </div>
  )
}
