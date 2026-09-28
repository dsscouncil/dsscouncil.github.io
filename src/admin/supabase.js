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

const mapClub = (r) => ({ id: r.id, name: r.name, description: r.description, category: r.category, schedule: r.schedule, location: r.location, leads: r.leads, join: r.join_info, order: r.sort ?? 0 })
const toClub = (c) => ({ id: c.id || uid(), name: c.name, description: c.description, category: c.category, schedule: c.schedule, location: c.location, leads: c.leads, join_info: c.join, sort: c.order ?? 0 })

const mapNews = (r) => ({ id: r.id, title: r.title, excerpt: r.excerpt, body: (r.body || '').split('\n'), category: r.category, date: r.date_label || '', author: r.author || '', featured: r.featured, order: r.sort ?? 0 })
const toNews = (n) => ({ id: n.id || uid(), title: n.title, excerpt: n.excerpt, body: Array.isArray(n.body) ? n.body.join('\n') : (n.body || ''), category: n.category, date_label: n.date || '', author: n.author || '', featured: !!n.featured, sort: n.order ?? 0 })

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

const mapIdea = (r) => ({ id: r.id, category: r.category, title: r.title, status: r.status, description: r.description, order: r.sort ?? 0 })
const toIdea = (i) => ({ id: i.id || uid(), category: i.category, title: i.title, status: i.status, description: i.description, sort: i.order ?? 0 })

const mapSubmission = (r) => ({
  id: r.id, category: r.category, priority: r.priority, status: r.status,
  published: r.published, title: r.title, description: r.description,
  gr: r.gr_number || '', name: r.submitter_name || '', year: r.year_group || '',
  ref: r.ref, notes: r.notes || '', date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  createdAt: r.created_at,
})
const toSubmission = (s) => ({
  id: s.id || uid(), category: s.category, priority: s.priority, status: s.status,
  published: !!s.published, title: s.title, description: s.description,
  gr_number: s.gr || '', submitter_name: s.name || '', year_group: s.year || '',
  notes: s.notes || '', ref: s.ref,
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

export async function fetchSubmissions() {
  const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapSubmission)
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
  })
  if (error) throw error
  return ref
}

// ── Admin auth ──
export async function adminLogin(username, password) {
  const { data, error } = await supabase.rpc('admin_login', { p_username: username, p_password: password })
  if (error) throw new Error(error.message)
  const row = Array.isArray(data) ? data[0] : data
  return { token: row.token, name: row.display_name || username, username }
}

export async function adminValidate(token) {
  try {
    const { data, error } = await supabase.rpc('admin_validate_session', { p_token: token })
    if (error) return null
    return data || null
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

export async function adminManageAccount(token, action, username, password, displayName) {
  const { data, error } = await supabase.rpc('admin_manage_account', {
    p_token: token, p_action: action, p_username: username,
    p_new_password: password || null, p_display_name: displayName || null,
  })
  if (error) throw new Error(error.message)
  return data
}

export async function adminResetContent(token, payload) {
  const { data, error } = await supabase.rpc('admin_reset_content', { p_token: token, p_payload: payload })
  if (error) throw new Error(error.message)
  return data
}
