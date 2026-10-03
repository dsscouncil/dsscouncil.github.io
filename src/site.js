// Single source of truth for the public routes.
//
// Two consumers, one list:
//   - scripts/prerender.mjs bakes these titles into dist/<route>/index.html,
//     which is what a crawler reads.
//   - <PageTitle/> applies the same title on client-side navigation, so a tab
//     opened on /council and then navigated to /clubs is labelled correctly.
//
// Titles name the school so each page is relevant to the queries it should
// surface for. The meta description is deliberately NOT here: one shared
// sentence lives in index.html and `bun run check:meta` guards it.

export const ROUTES = [
  { path: '/', title: 'DS Secondary Student Council | DS Pulse', priority: '1.0', changefreq: 'daily' },
  { path: '/council', title: 'Meet the Council | Dubai Scholars Student Council', priority: '0.9', changefreq: 'weekly' },
  { path: '/clubs', title: 'Clubs & Activities | Dubai Scholars Student Council', priority: '0.9', changefreq: 'weekly' },
  { path: '/events', title: 'Events | Dubai Scholars Secondary Student Council', priority: '0.9', changefreq: 'weekly' },
  { path: '/news', title: 'News & Announcements | DS Pulse', priority: '0.9', changefreq: 'weekly' },
  { path: '/initiatives', title: 'Initiatives | DS Pulse Student Council', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', title: 'About the Council | DS Pulse', priority: '0.8', changefreq: 'monthly' },
  { path: '/documents', title: 'Documents | DS Pulse Student Council', priority: '0.7', changefreq: 'monthly' },
  { path: '/student-voice', title: 'Share Your Voice | DS Pulse', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', title: 'Contact | Dubai Scholars Secondary Student Council', priority: '0.8', changefreq: 'monthly' },
]

export const ADMIN_TITLE = 'Council Admin | DS Pulse'

const TITLES = new Map(ROUTES.map((r) => [r.path, r.title]))

/** Title for a pathname, falling back to the homepage for unknown paths. */
export function titleFor(pathname) {
  if (!pathname) return TITLES.get('/')
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return TITLES.get(clean) || TITLES.get('/')
}
