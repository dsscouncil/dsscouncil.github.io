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
  { path: '/', label: 'DS Pulse', title: 'DS Secondary Student Council | DS Pulse', priority: '1.0', changefreq: 'daily', related: ['/council', '/clubs', '/news'] },
  { path: '/council', label: 'Meet the Council', title: 'Meet the Council | Dubai Scholars Student Council', priority: '0.9', changefreq: 'weekly', related: ['/clubs', '/events', '/initiatives'] },
  { path: '/clubs', label: 'Clubs & Activities', title: 'Clubs & Activities | Dubai Scholars Student Council', priority: '0.9', changefreq: 'weekly', related: ['/council', '/events', '/documents'] },
  { path: '/events', label: 'Events', title: 'Events | Dubai Scholars Secondary Student Council', priority: '0.9', changefreq: 'weekly', related: ['/news', '/initiatives', '/council'] },
  { path: '/news', label: 'News & Announcements', title: 'News & Announcements | DS Pulse', priority: '0.9', changefreq: 'weekly', related: ['/events', '/council', '/initiatives'] },
  { path: '/initiatives', label: 'Initiatives', title: 'Initiatives | DS Pulse Student Council', priority: '0.8', changefreq: 'monthly', related: ['/news', '/events', '/clubs'] },
  { path: '/about', label: 'About the Council', title: 'About the Council | DS Pulse', priority: '0.8', changefreq: 'monthly', related: ['/council', '/initiatives', '/contact'] },
  { path: '/documents', label: 'Documents', title: 'Documents | DS Pulse Student Council', priority: '0.7', changefreq: 'monthly', related: ['/clubs', '/events', '/about'] },
  { path: '/student-voice', label: 'Share Your Voice', title: 'Share Your Voice | DS Pulse', priority: '0.8', changefreq: 'monthly', related: ['/contact', '/initiatives', '/council'] },
  { path: '/contact', label: 'Contact', title: 'Contact | Dubai Scholars Secondary Student Council', priority: '0.8', changefreq: 'monthly', related: ['/about', '/student-voice', '/events'] },
]

export const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]))

/** The URL GitHub Pages actually serves for a route: directories get a slash. */
export const servedPath = (path) => (path === '/' ? '/' : path + '/')

export const ADMIN_TITLE = 'Council Admin | DS Pulse'

const TITLES = new Map(ROUTES.map((r) => [r.path, r.title]))

/** Title for a pathname, falling back to the homepage for unknown paths. */
export function titleFor(pathname) {
  if (!pathname) return TITLES.get('/')
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return TITLES.get(clean) || TITLES.get('/')
}
