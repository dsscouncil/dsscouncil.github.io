import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://tguvcfpqjiedvpfkrinr.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_uWcWWj5HW7MreMxx_5jYLQ_IWjOyePm'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
})

export const SESSION_KEY = 'dssc-admin-session-v4'

const uid = () => crypto.randomUUID()

// ── Row ↔ app-model mappers ──
const mapMember = (r) => ({
  id: r.id, name: r.name, role: r.role, cat: r.category, year: r.year_group,
  house: r.house || '', note: r.note || '', description: r.description || '',
  img: r.image_url || '', tier: r.tier, order: r.sort ?? 0,
})
const toMember = (m) => ({
  id: m.id || uid(), name: m.name, role: m.role, category: m.cat, year_group: m.year,
  house: m.house || '', note: m.note || '', description: m.description || '',
  image_url: m.img || '', tier: m.tier === '' || m.tier == null ? null : Number(m.tier),
  sort: m.order ?? 0,
})

const mapInitiative = (r) => ({ id: r.id, title: r.title, description: r.description, category: r.category, status: r.status, date: r.date_label || '', lead: r.lead || '', featured: r.featured, order: r.sort ?? 0 })
const toInitiative = (i) => ({ id: i.id || uid(), title: i.title, description: i.description, category: i.category, status: i.status, date_label: i.date || '', lead: i.lead || '', featured: i.featured !== false, sort: i.order ?? 0 })

const mapEvent = (r) => ({ id: r.id, title: r.title, day: r.day, month: r.month, type: r.type, location: r.location || '', org: r.org || '', description: r.description || '', order: r.sort ?? 0 })
const toEvent = (e) => ({ id: e.id || uid(), title: e.title, day: e.day, month: e.month, type: e.type, location: e.location || '', org: e.org || '', description: e.description || '', sort: e.order ?? 0 })

const mapClub = (r) => ({ id: r.id, name: r.name, description: r.description, category: r.category, schedule: r.schedule, location: r.location, leads: r.leads, join: r.join_info, icon: r.icon || 'Handshake', order: r.sort ?? 0 })
const toClub = (c) => ({ id: c.id || uid(), name: c.name, description: c.description, category: c.category, schedule: c.schedule, location: c.location, leads: c.leads, join_info: c.join, icon: c.icon || 'Handshake', sort: c.order ?? 0 })

const mapNews = (r) => ({ id: r.id, title: r.title, excerpt: r.excerpt, body: (r.body || '').split('\n'), category: r.category, date: r.date_label || '', author: r.author || '', featured: r.featured, status: r.status || 'Draft', order: r.sort ?? 0 })
const toNews = (n) => ({ id: n.id || uid(), title: n.title, excerpt: n.excerpt, body: Array.isArray(n.body) ? n.body.join('\n') : (n.body || ''), category: n.category, date_label: n.date || '', author: n.author || '', featured: !!n.featured, status: n.status || 'Draft', sort: n.order ?? 0 })

const mapDocument = (r) => ({ id: r.id, title: r.title, description: r.description, category: r.category, url: r.url || '', order: r.sort ?? 0 })
const toDocument = (d) => ({ id: d.id || uid(), title: d.title, description: d.description, category: d.category, url: d.url || '', sort: d.order ?? 0 })

const mapMessage = (r) => ({ id: r.id, name: r.name, role: r.role_title, quote: r.quote, photo: r.image_url || '', order: r.sort ?? 0 })
const toMessage = (m) => ({ id: m.id || uid(), name: m.name, role_title: m.role, quote: m.quote, image_url: m.photo || '', sort: m.order ?? 0 })

const mapQuote = (r) => ({ id: r.id, key: r.circle_key, label: r.label, quote: r.quote })
const toQuote = (c) => ({ id: c.id || uid(), circle_key: c.key, label: c.label, quote: c.quote })

const mapStat = (r) => ({ id: r.id, label: r.label, sub: r.sub, value: r.value, order: r.sort ?? 0 })
const toStat = (s) => ({ id: s.id || uid(), label: s.label, sub: s.sub, value: s.value, sort: s.order ?? 0 })

const mapPillar = (r) => ({ id: r.id, title: r.title, desc: r.description, order: r.sort ?? 0 })
const toPillar = (p) => ({ id: p.id || uid(), title: p.title, description: p.desc, sort: p.order ?? 0 })

const mapContact = (r) => ({
  id: r.id, name: r.name, year: r.year_group || '', email: r.email || '', gr: r.gr || '',
  subject: r.subject || '', message: r.message, handled: r.handled, notes: r.notes || '',
  date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  createdAt: r.created_at,
})
const toContact = (c) => ({
  id: c.id || uid(), name: c.name, year_group: c.year || '', email: c.email, gr: c.gr || '',
  subject: c.subject || '', message: c.message, handled: !!c.handled, notes: c.notes || '',
})

const mapIdea = (r) => ({ id: r.id, category: r.category, title: r.title, status: r.status, description: r.description, order: r.sort ?? 0 })
const toIdea = (i) => ({ id: i.id || uid(), category: i.category, title: i.title, status: i.status, description: i.description, sort: i.order ?? 0 })

const mapSubmission = (r) => ({
  id: r.id, category: r.category, priority: r.priority, status: r.status,
  published: r.published, title: r.title, description: r.description,
  gr: r.gr_number || '', name: r.submitter_name || '', year: r.year_group || '',
  ref: r.ref, notes: r.notes || '', date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  createdAt: r.created_at,
  file: r.file_url ? { url: r.file_url, name: r.file_name || 'attachment' } : null,
})
const toSubmission = (s) => ({
  id: s.id || uid(), category: s.category, priority: s.priority, status: s.status,
  published: !!s.published, title: s.title, description: s.description,
  gr_number: s.gr || '', submitter_name: s.name || '', year_group: s.year || '',
  notes: s.notes || '', ref: s.ref,
  file_url: s.file?.url || s.fileUrl || '',
  file_name: s.file?.name || s.fileName || '',
})

const mapSettings = (r) => ({
  year: r.year, schoolName: r.school_name, councilEmail: r.council_email,
  heroEyebrow: r.hero_eyebrow, heroTitleTop: r.hero_title_top, heroTitleMid: r.hero_title_mid,
  heroTitleGold: r.hero_title_gold, heroSub: r.hero_sub, heroDesc: r.hero_desc,
  aboutTitle: r.about_title, aboutText: r.about_text, homeQuote: r.home_quote, philosophy: r.philosophy,
})
const toSettings = (s) => ({
  year: s.year, school_name: s.schoolName, council_email: s.councilEmail,
  hero_eyebrow: s.heroEyebrow, hero_title_top: s.heroTitleTop, hero_title_mid: s.heroTitleMid,
  hero_title_gold: s.heroTitleGold, hero_sub: s.heroSub, hero_desc: s.heroDesc,
  about_title: s.aboutTitle, about_text: s.aboutText, home_quote: s.homeQuote, philosophy: s.philosophy,
})

// ── Public data fetch (cached in memory per page load) ──
export async function fetchSiteData() {
  const [settings, stats, pillars, quotes, members, initiatives, events, clubs, news, documents, messages, ideas] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).single(),
    supabase.from('stats').select('*').order('sort'),
    supabase.from('pillars').select('*').order('sort'),
    supabase.from('circle_quotes').select('*'),
    supabase.from('members').select('*').order('sort'),
    supabase.from('initiatives').select('*').order('sort'),
    supabase.from('events').select('*').order('sort'),
    supabase.from('clubs').select('*').order('sort'),
    supabase.from('news').select('*').order('sort'),
    supabase.from('documents').select('*').order('sort'),
    supabase.from('leadership_messages').select('*').order('sort'),
    supabase.from('ideas_board').select('*').order('sort'),
  ])
  const first = (r) => { if (r.error) throw r.error; return r }
  first(settings); first(stats); first(pillars); first(quotes); first(members)
  first(initiatives); first(events); first(clubs); first(news); first(documents); first(messages); first(ideas)

  return {
    settings: mapSettings(settings.data),
    stats: stats.data.map(mapStat),
    pillars: pillars.data.map(mapPillar),
    circleQuotes: quotes.data.map(mapQuote),
    members: members.data.map(mapMember),
    initiatives: initiatives.data.map(mapInitiative),
    events: events.data.map(mapEvent),
    clubs: clubs.data.map(mapClub),
    news: news.data.map(mapNews),
    documents: documents.data.map(mapDocument),
    leadershipMessages: messages.data.map(mapMessage),
    ideasBoard: ideas.data.map(mapIdea),
  }
}

// Admin-only read: submissions have no public SELECT policy, so we must go
// through a session-gated RPC. Without a valid token this returns [] (public).
export async function fetchSubmissions(token) {
  if (!token) return []
  const { data, error } = await supabase.rpc('admin_list_submissions', { p_token: token })
  if (error) throw new Error(error.message)
  const rows = Array.isArray(data) ? data : []
  return rows.map(mapSubmission)
}

// Same pattern for contact messages (public INSERT only, admin read via RPC).
export async function fetchContactMessages(token) {
  if (!token) return []
  const { data, error } = await supabase.rpc('admin_list_contact_messages', { p_token: token })
  if (error) throw new Error(error.message)
  const rows = Array.isArray(data) ? data : []
  return rows.map(mapContact)
}

// Public contact form — validated server-side; emails the council via edge function.
export async function submitContactMessage(form) {
  const { data, error } = await supabase.rpc('submit_contact_message', {
    p_name: form.name,
    p_email: form.email,
    p_subject: form.subject || '',
    p_message: form.message,
    p_year_group: form.year || '',
    p_gr: form.gr || '',
  })
  if (error) throw new Error(error.message)
  // Best-effort email notification (never blocks the message being stored)
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/contact-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({ record: { id: data?.id, name: form.name, email: form.email, subject: form.subject || '', message: form.message, year_group: form.year || '', gr: form.gr || '' } }),
    })
  } catch { /* email is best-effort */ }
}

// Public voice submission — inserts with default status/published via RLS check
export async function submitVoice(form) {
  const ref = `DSV-${uid().slice(0, 6).toUpperCase()}`
  const { error } = await supabase.from('submissions').insert({
    id: uid(),
    category: form.category || 'Other',
    priority: form.priority || 'Medium',
    status: 'Received',
    published: false,
    title: form.title,
    description: form.description || '',
    gr_number: form.gr || '',
    submitter_name: form.name || '',
    year_group: form.year || '',
    ref,
    file_name: form.fileName || '',
    file_url: form.fileUrl || '',
  })
  if (error) throw error
  return ref
}

// ── Optional evidence upload (public-read bucket; paths are random UUIDs) ──
export const VOICE_BUCKET = 'voice-uploads'
export const MAX_UPLOAD_MB = 5

export async function uploadVoiceFile(file) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const path = `${uid()}.${ext}`
  const { error } = await supabase.storage.from(VOICE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw new Error(error.message)
  return {
    path,
    name: file.name,
    size: file.size,
    type: file.type || '',
    url: `${SUPABASE_URL}/storage/v1/object/public/${VOICE_BUCKET}/${path}`,
  }
}

// ── Admin auth ──
export async function adminLogin(username, password) {
  const { data, error } = await supabase.rpc('admin_login', { p_username: username, p_password: password })
  if (error) throw new Error(error.message)
  const row = Array.isArray(data) ? data[0] : data
  return {
    token: row.token,
    name: row.display_name || username,
    username,
    // 'viewer' accounts can read the dashboard but every write is rejected
    // server-side by admin_require_editor(); this only drives the UI.
    role: row.role || 'editor',
  }
}

export async function adminValidate(token) {
  try {
    const { data, error } = await supabase.rpc('admin_session_role', { p_token: token })
    if (error || !data) return null
    return { role: typeof data === 'string' ? data : data.role || 'editor' }
  } catch {
    return null
  }
}

export async function adminLogout(token) {
  // best-effort: delete server-side session via validate (token check) — actual deletion RPC below
  try { await supabase.rpc('admin_logout', { p_token: token }) } catch { /* expired already */ }
}

// ── Admin writes ──
export async function adminWrite(token, table, op, id, data) {
  const { data: result, error } = await supabase.rpc('admin_write', {
    p_token: token, p_table: table, p_op: op, p_id: id || null, p_data: data || null,
  })
  if (error) throw new Error(error.message)
  return result
}

// Table name + mapper for each collection
export const COLLECTIONS = {
  members: { table: 'members', to: toMember, map: mapMember },
  initiatives: { table: 'initiatives', to: toInitiative, map: mapInitiative },
  events: { table: 'events', to: toEvent, map: mapEvent },
  clubs: { table: 'clubs', to: toClub, map: mapClub },
  news: { table: 'news', to: toNews, map: mapNews },
  documents: { table: 'documents', to: toDocument, map: mapDocument },
  leadershipMessages: { table: 'leadership_messages', to: toMessage, map: mapMessage },
  circleQuotes: { table: 'circle_quotes', to: toQuote, map: mapQuote },
  submissions: { table: 'submissions', to: toSubmission, map: mapSubmission },
  contactMessages: { table: 'contact_messages', to: toContact, map: mapContact },
}

export function toDbRow(collection, item) {
  const c = COLLECTIONS[collection]
  if (!c) throw new Error('Unknown collection: ' + collection)
  if (collection === 'submissions') {
    const row = c.to(item)
    delete row.created_at
    return row
  }
  return c.to(item)
}

export function fromDbRow(collection, row) {
  const c = COLLECTIONS[collection]
  if (!c) throw new Error('Unknown collection: ' + collection)
  return c.map(row)
}

export async function adminListAccounts(token) {
  if (!token) return []
  const { data, error } = await supabase.rpc('admin_list_accounts', { p_token: token })
  if (error) throw new Error(error.message)
  return Array.isArray(data) ? data : []
}

export async function adminManageAccount(token, action, username, { password, displayName, role } = {}) {
  const { data, error } = await supabase.rpc('admin_manage_account', {
    p_token: token, p_action: action, p_username: username,
    p_new_password: password || null, p_display_name: displayName || null,
    p_role: role || null,
  })
  if (error) throw new Error(error.message)
  return data
}

export async function adminResetContent(token, payload) {
  const { data, error } = await supabase.rpc('admin_reset_content', { p_token: token, p_payload: payload })
  if (error) throw new Error(error.message)
  return data
}
