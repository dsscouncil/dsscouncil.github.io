// Generates SQL to seed the Supabase database from the current content files.
// Run from dsscouncil/: bun scripts/gen-seed.mjs > /tmp/seed-content.sql
import { members } from '../src/data/council.js'
import {
  initiatives, upcomingEvents, clubs, newsArticles,
  leadershipMessages, ideasBoard,
} from '../src/data/content.js'

const esc = (s) => String(s ?? '').replace(/'/g, "''")
const q = (s) => `'${esc(s)}'`
const uuid = () => `'${crypto.randomUUID()}'`

const out = []
out.push('-- Auto-generated seed from current site content')
out.push('begin;')

out.push('\n-- Members')
const memberRows = members.map((m, i) =>
  `(${uuid()}, ${q(m.name)}, ${q(m.role)}, ${q(m.cat)}, ${q(m.year)}, ${q(m.house || '')}, ${q(m.note || '')}, ${q('')}, ${q(m.img || '')}, ${m.tier ?? 'null'}, ${i})`,
)
out.push(`insert into members (id, name, role, category, year_group, house, note, description, image_url, tier, sort) values\n${memberRows.join(',\n')};`)

out.push('\n-- Initiatives')
const iniRows = initiatives.map((i, idx) =>
  `(${uuid()}, ${q(i.title)}, ${q(i.desc)}, ${q(i.cat)}, ${q(i.status)}, ${q(i.date || '')}, ${q(i.lead || '')}, true, ${idx})`,
)
out.push(`insert into initiatives (id, title, description, category, status, date_label, lead, featured, sort) values\n${iniRows.join(',\n')};`)

out.push('\n-- Events')
const evRows = upcomingEvents.map((e, idx) =>
  `(${uuid()}, ${q(e.title)}, ${q(e.day)}, ${q(e.month)}, ${q(e.type)}, ${q(e.location || '')}, ${q(e.org || '')}, ${q(e.desc || '')}, ${idx})`,
)
out.push(`insert into events (id, title, day, month, type, location, org, description, sort) values\n${evRows.join(',\n')};`)

out.push('\n-- Clubs')
const clubRows = clubs.map((c, idx) =>
  `(${uuid()}, ${q(c.name)}, ${q(c.desc)}, ${q(c.cat)}, ${q(c.schedule)}, ${q(c.location)}, ${q(c.leads)}, ${q(c.join)}, ${idx})`,
)
out.push(`insert into clubs (id, name, description, category, schedule, location, leads, join_info, sort) values\n${clubRows.join(',\n')};`)

out.push('\n-- News')
const newsRows = newsArticles.map((n, idx) =>
  `(${uuid()}, ${q(n.title)}, ${q(n.excerpt)}, ${q(n.body.join('\n'))}, ${q(n.cat)}, ${q(n.date)}, ${q(n.author)}, ${!!n.featured}, ${idx})`,
)
out.push(`insert into news (id, title, excerpt, body, category, date_label, author, featured, sort) values\n${newsRows.join(',\n')};`)

out.push('\n-- Leadership messages')
const lmRows = leadershipMessages.map((m, idx) =>
  `(${uuid()}, ${q(m.name)}, ${q(m.role)}, ${q(m.quote)}, ${q('')}, ${idx})`,
)
out.push(`insert into leadership_messages (id, name, role_title, quote, image_url, sort) values\n${lmRows.join(',\n')};`)

out.push('\n-- Seed submissions from the demo period')
out.push(`insert into submissions (id, category, priority, status, published, title, description, gr_number, submitter_name, year_group, ref, created_at) values
  (${uuid()}, 'Student Life', 'Medium', 'Received', false, 'Break Busters', 'Inter Class Sports Competition during break', '12345', 'test', 'Year 11', 'DSV-5GMBF0', now() - interval '11 days'),
  (${uuid()}, 'Student Life', 'High', 'Completed', false, 'Add more lunchtime activities', 'Students have asked for more structured activities during lunch breaks to make the most of free periods.', '', '', '', 'DSV-SAMP1', now() - interval '21 days');`)

out.push('\ncommit;')
console.log(out.join('\n'))
