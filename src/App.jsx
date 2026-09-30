import { useEffect, Component } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AdminProvider, useAdmin } from './admin/store.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import AmbientSound from './components/AmbientSound.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Council from './pages/Council.jsx'
import Initiatives from './pages/Initiatives.jsx'
import Events from './pages/Events.jsx'
import StudentVoice from './pages/StudentVoice.jsx'
import Clubs from './pages/Clubs.jsx'
import News from './pages/News.jsx'
import Documents from './pages/Documents.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminOverview from './admin/pages/Overview.jsx'
import AdminVoice from './admin/pages/Voice.jsx'
import AdminContactMessages from './admin/pages/ContactMessages.jsx'
import AdminMembers from './admin/pages/Members.jsx'
import AdminInitiatives from './admin/pages/Initiatives.jsx'
import AdminEvents from './admin/pages/Events.jsx'
import AdminClubs from './admin/pages/Clubs.jsx'
import AdminNews from './admin/pages/News.jsx'
import AdminDocuments from './admin/pages/Documents.jsx'
import AdminCircleQuotes from './admin/pages/CircleQuotes.jsx'
import AdminMessages from './admin/pages/LeadershipMessages.jsx'
import AdminSettings from './admin/pages/Settings.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Keeps one broken page from blanking the whole app. */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-5">
          <div className="max-w-md rounded-3xl bg-white border border-border p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-navy">Something went wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">This page hit an unexpected error. The rest of the site is still available.</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => this.setState({ error: null })}
                className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => {
                  this.setState({ error: null })
                  window.location.hash = '#/'
                }}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-navy hover:border-gold transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading the Council platform…</p>
      </div>
    </div>
  )
}

function DbError({ message, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-5">
      <div className="max-w-md rounded-3xl bg-white border border-border p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-navy">Can't reach the Council database</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <button onClick={onRetry} className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">
          Try again
        </button>
      </div>
    </div>
  )
}

function AdminGate() {
  const { session, loading } = useAdmin()
  if (loading) return <Loading />
  if (!session) return <AdminLogin />
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="voice" element={<AdminVoice />} />
        <Route path="contact-messages" element={<AdminContactMessages />} />
        <Route path="members" element={<AdminMembers />} />
        <Route path="initiatives" element={<AdminInitiatives />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="clubs" element={<AdminClubs />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="circle-quotes" element={<AdminCircleQuotes />} />
        <Route path="leadership-messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}

function Site() {
  const { data, error, loading, refresh } = useAdmin()
  if (loading) return <Loading />
  if (error || !data) return <DbError message={error || 'Unknown error'} onRetry={refresh} />
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <AmbientSound />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/council" element={<Council />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/events" element={<Events />} />
          <Route path="/student-voice" element={<StudentVoice />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/news" element={<News />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
        <Route path="/admin/*" element={<AdminGate />} />
        <Route path="*" element={<Site />} />
        </Routes>
      </ErrorBoundary>
    </AdminProvider>
  )
}
