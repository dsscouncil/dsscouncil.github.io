import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, ArrowLeft, User, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useAdmin } from './store.jsx'
import { LOGO } from '../data/content.js'
import PulseMark from '../components/PulseMark.jsx'

const FieldLabel = ({ children }) => (
  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-navy/60">{children}</label>
)

const inputCls =
  'w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition'

export default function AdminLogin() {
  const { login } = useAdmin()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
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
    <div className="flex min-h-screen bg-navy-deep">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(165deg, hsl(213 65% 12%) 0%, hsl(213 70% 6%) 55%, hsl(213 75% 4%) 100%)' }}
        />
        <div
          className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(39 53% 57% / 0.14) 0%, transparent 62%)' }}
        />
        <div
          className="absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(217 91% 60% / 0.10) 0%, transparent 60%)' }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-14">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/5 ring-1 ring-gold/40 shadow-[0_0_24px_hsl(39_53%_57%_0.25)] p-1">
              <img src={LOGO} alt="Council logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-white">Dubai Scholars</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Secondary Student Council</div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-5xl font-bold leading-[1.08] text-white">
              <PulseMark />
            </h2>
            <p className="mt-6 text-lg font-medium text-white/70">&ldquo;We Don&rsquo;t Just Represent. We Deliver.&rdquo;</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <ShieldCheck className="h-4 w-4 text-gold/70" />
            Governor&rsquo;s Console · 2026–27 Council
          </div>
        </div>
      </div>

      {/* Sign-in panel */}
      <div className="relative flex flex-1 items-center justify-center px-5 py-16">
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: 'linear-gradient(165deg, hsl(213 65% 12%) 0%, hsl(213 70% 6%) 55%, hsl(213 75% 4%) 100%)' }}
        />
        <div className="relative w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="h-16 w-16 rounded-2xl bg-white/5 ring-1 ring-gold/40 shadow-[0_0_24px_hsl(39_53%_57%_0.25)] p-1.5">
              <img src={LOGO} alt="Council logo" className="h-full w-full object-contain" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white">
              <PulseMark />
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/40 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-deep shadow-[0_0_18px_hsl(39_53%_57%_0.3)]">
                <ShieldCheck className="h-5 w-5 text-gold" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-navy">Governor&rsquo;s Console</h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Council Admin Sign In</p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <FieldLabel>Username</FieldLabel>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${inputCls} pl-11`}
                    placeholder="Your username"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputCls} pl-11 pr-12`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-navy/40 hover:text-navy transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-navy-deep px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy/25 transition-all hover:bg-navy hover:shadow-xl disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying credentials…
                  </>
                ) : (
                  <>
                    Sign In to Console
                    <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Access is restricted to Council admins with issued accounts.
                <br />
                All sign-in activity is logged.
              </p>
            </form>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mx-auto mt-6 flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to ds-pulse.com
          </button>
        </div>
      </div>
    </div>
  )
}
