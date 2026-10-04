import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  supabase, fetchSiteData, fetchSubmissions, fetchContactMessages,  submitVoice, uploadVoiceFile, submitContactMessage,
  adminLogin, adminValidate, adminLogout, adminWrite, adminManageAccount, adminListAccounts,
  adminResetContent, toDbRow, fromDbRow, COLLECTIONS,
  SESSION_KEY,
} from './supabase.js'

export const VOICE_STATUSES = ['Received', 'Under Review', 'In Progress', 'Completed', 'Unable to Proceed']
export const MEMBER_CATEGORIES = ['Core Team', 'House Leadership', 'Well-being Leadership', 'Departmental Leadership', 'Sports Council']
export const YEAR_GROUPS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11']
export const VOICE_CATEGORIES = ['Academic', 'Facilities', 'Events', 'Clubs', 'Wellbeing', 'Sustainability', 'Student Life', 'Report', 'Other']
export const VOICE_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

const AdminContext = createContext(null)

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AdminProvider({ children }) {
  const [data, setData] = useState(null) // null = loading
  const [error, setError] = useState(null)
  const [session, setSession] = useState(loadSession)

  const refresh = async () => {
    try {
      const [site, subs, contacts] = await Promise.all([fetchSiteData(), fetchSubmissions(session?.token), fetchContactMessages(session?.token)])
      setData({ ...site, submissions: subs, contactMessages: contacts })
      setError(null)
    } catch (e) {
      setError(e.message || 'Failed to load data')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  // Validate persisted session on load, and keep the stored role in sync with
  // the database so a role change takes effect without signing in again.
  useEffect(() => {
    if (!session) return
    adminValidate(session.token).then((info) => {
      if (!info) {
        setSession(null)
        localStorage.removeItem(SESSION_KEY)
        return
      }
      if (info.role !== session.role) {
        const next = { ...session, role: info.role }
        setSession(next)
        localStorage.setItem(SESSION_KEY, JSON.stringify(next))
      }
    })
  }, [])

  const canEdit = session?.role !== 'viewer'
  // Only Super accounts may issue or change other admin accounts.
  const isSuper = session?.role === 'super'
  const [accounts, setAccounts] = useState([])

  const loadAccounts = useCallback(async () => {
    if (session?.role !== 'super') {
      setAccounts([])
      return
    }
    try {
      setAccounts(await adminListAccounts(session.token))
    } catch (e) {
      setError(e.message || 'Failed to load accounts')
    }
  }, [session])

  useEffect(() => { loadAccounts() }, [loadAccounts])

  const actions = useMemo(() => {
    const persist = async (collection, op, id, item) => {
      if (!session?.token) throw new Error('Not signed in')
      // The database rejects writes for viewer accounts regardless; failing
      // here just avoids a pointless round trip and gives a clearer message.
      if (session.role === 'viewer') throw new Error('Your account has read-only access')
      const dbRow = op === 'delete' ? null : toDbRow(collection, item)
      const result = await adminWrite(session.token, COLLECTIONS[collection].table, op, id, dbRow)
      return result
    }

    return {
      refresh,
      reload: refresh,

      // ── public ──
      addSubmission: async (s) => submitVoice(s),
      addContactMessage: async (m) => submitContactMessage(m),
      uploadFile: (file) => uploadVoiceFile(file),

      // ── auth ──
      login: async (username, password) => {
        const result = await adminLogin(username, password)
        setSession(result)
        localStorage.setItem(SESSION_KEY, JSON.stringify(result))
        // Session just became valid — pull the private data now.
        try {
          const [subs, contacts] = await Promise.all([fetchSubmissions(result.token), fetchContactMessages(result.token)])
          setData((d) => (d ? { ...d, submissions: subs, contactMessages: contacts } : d))
        } catch { /* non-fatal; refresh will retry */ }
        return true
      },
      logout: async () => {
        if (session?.token) await adminLogout(session.token)
        localStorage.removeItem(SESSION_KEY)
        setSession(null)
      },

      // ── collection CRUD ──
      add: async (collection, item) => {
        const row = await persist(collection, 'insert', null, item)
        setData((d) => ({ ...d, [collection]: [...d[collection], fromDbRow(collection, row)] }))
      },
      update: async (collection, id, patch) => {
        const current = data[collection].find((x) => x.id === id) || {}
        const merged = { ...current, ...patch, id }
        const row = await persist(collection, 'update', id, merged)
        setData((d) => ({ ...d, [collection]: d[collection].map((x) => (x.id === id ? fromDbRow(collection, row) : x)) }))
      },
      remove: async (collection, id) => {
        await persist(collection, 'delete', id)
        setData((d) => ({ ...d, [collection]: d[collection].filter((x) => x.id !== id) }))
      },

      // ── settings (singleton) ──
      setSettings: async (patch) => {
        if (session.role === 'viewer') throw new Error('Your account has read-only access')
        const merged = { ...data.settings, ...patch }
        await adminWrite(session.token, 'site_settings', 'update', null, merged)
        setData((d) => ({ ...d, settings: { ...d.settings, ...merged } }))
      },

      // ── accounts (server-side, gated by session) ──
      manageAccount: async (action, username, opts) => {
        if (session?.role !== 'super') throw new Error('Only Super accounts can manage admin accounts')
        const result = await adminManageAccount(session.token, action, username, opts)
        await loadAccounts()
        return result
      },

      // ── import / rollover: bulk replace content ──
      resetContent: async (payload) => {
        if (session.role === 'viewer') throw new Error('Your account has read-only access')
        await adminResetContent(session.token, payload)
        await refresh()
      },

      exportJson: () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `dscouncil-data-${data.settings.year}.json`
        a.click()
        URL.revokeObjectURL(url)
      },
      importJson: async (json) => {
        const parsed = JSON.parse(json)
        if (!parsed.members) throw new Error('Unrecognised data file')
        const payload = {
          settings: parsed.settings,
          stats: parsed.stats,
          pillars: parsed.pillars,
          circle_quotes: parsed.circleQuotes,
          members: parsed.members,
          initiatives: parsed.initiatives,
          events: parsed.events,
          clubs: parsed.clubs,
          news: parsed.news,
          documents: parsed.documents,
          leadership_messages: parsed.leadershipMessages,
          ideas_board: parsed.ideasBoard,
        }
        await resetContent(payload)
      },
    }
  }, [data, session, loadAccounts])

  // App-model convenience aliases used by existing pages
  const value = useMemo(() => {
    if (!data) return { data: null, error, session, loading: true, canEdit, isSuper, accounts, ...actions }
    const siteContent = {
      stats: data.stats,
      pillars: data.pillars,
      ideasBoard: data.ideasBoard,
      philosophy: data.settings.philosophy,
      heroEyebrow: data.settings.heroEyebrow,
      heroTitleTop: data.settings.heroTitleTop,
      heroTitleMid: data.settings.heroTitleMid,
      heroTitleGold: data.settings.heroTitleGold,
      heroSub: data.settings.heroSub,
      heroDesc: data.settings.heroDesc,
      aboutTitle: data.settings.aboutTitle,
      aboutText: data.settings.aboutText,
      homeQuote: data.settings.homeQuote,
    }
    return { data: { ...data, siteContent }, error, session, loading: false, canEdit, isSuper, accounts, ...actions }
  }, [data, error, session, actions, canEdit, isSuper, accounts])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}
